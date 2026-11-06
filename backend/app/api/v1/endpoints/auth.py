import uuid
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.models.farm import Farm, UnitSettings, Shed, Flock, FarmMember, FarmInvitation
from app.schemas.auth import (
    LoginInput,
    TokenResponse,
    UserResponse,
    RegisterOwnerInput,
    StaffInviteInput,
    StaffInviteResponse,
    AcceptInviteInput,
)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(input_data: LoginInput, db: Session = Depends(get_db)):
    user = None
    if input_data.email:
        email = input_data.email.strip().lower()
        user = db.query(User).filter(User.email == email).first()

    if not user and input_data.phone:
        phone = input_data.phone.strip()
        user = db.query(User).filter(User.phone == phone).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="खाते सापडले नाही. कृपया ईमेल किंवा मोबाईल नंबर तपासा. (User not found with these credentials.)"
        )

    # Password validation if password provided and set
    if input_data.password:
        if user.hashed_password:
            if not verify_password(input_data.password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="पासवर्ड चुकीचा आहे. कृपया पुन्हा प्रयत्न करा. (Invalid password credentials.)"
                )
        else:
            if not (input_data.otp and len(input_data.otp) == 6):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="या खात्यावर पासवर्ड सेट केलेला नाही. कृपया ओटीपी द्वारे लॉगिन करा."
                )

    token = create_access_token(
        subject=str(user.id),
        extra_claims={"farm_id": str(user.farm_id) if user.farm_id else None, "role": user.role}
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post("/register-owner")
def register_owner(data: RegisterOwnerInput, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == data.phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this phone number already exists."
        )

    # 1. Create farm
    farm = Farm(
        name=data.farm_name,
        owner_name=data.owner_name,
        phone=data.phone,
        district=data.district,
        total_capacity=data.capacity,
        status="active"
    )
    db.add(farm)
    db.flush()

    # 2. Create unit settings
    unit_settings = UnitSettings(farm_id=farm.id)
    db.add(unit_settings)

    # 3. Create initial shed
    shed = Shed(
        farm_id=farm.id,
        shed_number="शेड क्र. १",
        capacity=data.capacity,
    )
    db.add(shed)
    db.flush()

    # 4. Create initial flock
    placement_date = datetime.now(timezone.utc).date() - timedelta(weeks=data.age_weeks)
    flock = Flock(
        farm_id=farm.id,
        shed_id=shed.id,
        batch_code=f"{data.breed}-{datetime.now().year}-B1",
        breed=data.breed,
        placement_date=placement_date,
        initial_chick_count=data.initial_birds,
        current_bird_count=data.initial_birds,
        current_phase="laying" if data.age_weeks >= 18 else "growing",
    )
    db.add(flock)

    # 5. Create user
    hashed_pwd = get_password_hash(data.password) if data.password else None
    user = User(
        farm_id=farm.id,
        phone=data.phone,
        full_name=data.owner_name,
        hashed_password=hashed_pwd,
        role="owner",
        preferred_language="mr",
        is_active=True
    )
    db.add(user)
    db.flush()

    # 6. Add membership
    member = FarmMember(farm_id=farm.id, user_id=user.id, role="owner", is_active=True)
    db.add(member)
    db.commit()

    token = create_access_token(
        subject=str(user.id),
        extra_claims={"farm_id": str(farm.id), "role": "owner"}
    )

    return {
        "success": True,
        "farm_id": str(farm.id),
        "user_id": str(user.id),
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/invites", response_model=StaffInviteResponse)
def create_invite(
    data: StaffInviteInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invite_token = f"inv_{uuid.uuid4().hex[:16]}"
    invitation = FarmInvitation(
        farm_id=data.farm_id,
        phone=data.phone,
        role=data.role,
        email=data.email,
        invite_token=invite_token,
        is_accepted=False,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    db.add(invitation)
    db.commit()

    return StaffInviteResponse(
        invite_token=invite_token,
        invite_url=f"http://localhost:5173?invite={invite_token}"
    )


@router.post("/accept-invite")
def accept_invite(
    data: AcceptInviteInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invite = db.query(FarmInvitation).filter(
        FarmInvitation.invite_token == data.invite_token,
        FarmInvitation.is_accepted == False,
        FarmInvitation.expires_at > datetime.now(timezone.utc)
    ).first()

    if not invite:
        raise HTTPException(status_code=400, detail="Invalid or expired invitation token.")

    invite.is_accepted = True
    member = FarmMember(
        farm_id=invite.farm_id,
        user_id=current_user.id,
        role=invite.role,
        is_active=True
    )
    db.add(member)
    db.commit()

    return {"success": True, "farm_id": str(invite.farm_id), "role": invite.role}
