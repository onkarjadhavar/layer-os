import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.farm import Farm, UnitSettings, Shed, Flock, FarmMember
from app.models.record import DailyRecord
from app.models.sale import Sale
from app.schemas.farm import (
    FarmCreate,
    FarmResponse,
    UnitSettingsUpdate,
    UnitSettingsResponse,
    ShedCreate,
    ShedResponse,
    FlockCreate,
    FlockResponse,
    FlockPhaseUpdate,
    FarmEnrollmentRequest,
    FarmEnrollmentResponse,
    FarmDashboardResponse,
    FarmDashboardSummary,
    SalesEnrollSchema,
    FeedEnrollSchema,
)

router = APIRouter()


@router.post("/enroll", response_model=FarmEnrollmentResponse, status_code=status.HTTP_201_CREATED)
def enroll_farm(
    payload: FarmEnrollmentRequest,
    db: Session = Depends(get_db)
):
    """
    Creates a new poultry farm, associated sheds, flocks, unit settings,
    and owner account atomically in PostgreSQL.
    Returns the real assigned farm ID and JWT authentication token.
    """
    if payload.honeypot and len(payload.honeypot) > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Registration rejected (Bot detected).")

    owner_data = payload.owner
    farm_data = payload.farm
    sheds_flocks = payload.shedsFlocks
    sales_data = payload.sales or SalesEnrollSchema()
    feed_data = payload.feed or FeedEnrollSchema()

    # Calculate total capacity
    flock_total = sum(f.birdsPlaced for f in sheds_flocks.flocks) if sheds_flocks.flocks else 30000
    total_capacity = max(flock_total, 1000)

    # 1. Check existing user
    phone = owner_data.mobileNumber.strip()
    existing_user = db.query(User).filter(User.phone == phone).first()

    # 2. Create Farm in PostgreSQL
    farm = Farm(
        name=farm_data.farmName.strip(),
        owner_name=farm_data.ownerName.strip(),
        phone=phone,
        email=owner_data.email.strip() if owner_data.email else None,
        address=f"{farm_data.villageTown or ''}, {farm_data.taluka or ''}".strip(", "),
        district=farm_data.district or "Pune",
        state=farm_data.state or "Maharashtra",
        pincode=farm_data.pincode or "412219",
        total_capacity=total_capacity,
        status="active"
    )
    db.add(farm)
    db.flush()

    # 3. Create Unit Settings
    unit_settings = UnitSettings(
        farm_id=farm.id,
        tray_size_eggs=sales_data.traySize or 30,
        gatta_size_trays=sales_data.traysPerGatta or 7,
        feed_bag_weight_kg=feed_data.bagSizeKg or 50.0,
        default_egg_rate_unit="per_100"
    )
    db.add(unit_settings)

    # 4. Create Sheds
    num_sheds = max(sheds_flocks.numberOfSheds, 1)
    shed_capacity = max(total_capacity // num_sheds, 100)
    created_sheds = []
    for i in range(1, num_sheds + 1):
        housing_type = sheds_flocks.flocks[0].housingType if sheds_flocks.flocks else "elevated_cage"
        shed = Shed(
            farm_id=farm.id,
            shed_number=f"Shed-0{i}",
            name=f"शेड {i}",
            capacity=shed_capacity,
            shed_type=housing_type,
            has_climate_sensors=False,
            is_active=True
        )
        db.add(shed)
        created_sheds.append(shed)
    db.flush()

    # 5. Create Flocks
    created_flocks = []
    if sheds_flocks.flocks:
        for idx, fl in enumerate(sheds_flocks.flocks):
            assigned_shed = created_sheds[idx % len(created_sheds)]
            flock_obj = Flock(
                farm_id=farm.id,
                shed_id=assigned_shed.id,
                batch_code=fl.batchCode or f"Batch-{idx+1}",
                breed=fl.breed or "BV300",
                hatchery_source="Direct Placement",
                placement_date=datetime.now(timezone.utc).date() - timedelta(weeks=fl.ageWeeks),
                initial_chick_count=fl.birdsPlaced,
                chick_cost_per_bird=42.0,
                current_bird_count=fl.currentLiveBirds,
                current_phase="laying" if fl.ageWeeks >= 18 else "growing",
                cumulative_rearing_cost=0.0,
                amortization_months=14
            )
            db.add(flock_obj)
            created_flocks.append(flock_obj)
    else:
        flock_obj = Flock(
            farm_id=farm.id,
            shed_id=created_sheds[0].id,
            batch_code="BV300-B1",
            breed="BV300",
            hatchery_source="Direct Placement",
            placement_date=datetime.now(timezone.utc).date() - timedelta(weeks=24),
            initial_chick_count=total_capacity,
            chick_cost_per_bird=42.0,
            current_bird_count=total_capacity,
            current_phase="laying",
            amortization_months=14
        )
        db.add(flock_obj)
        created_flocks.append(flock_obj)
    db.flush()

    # 6. Create or Link User
    if existing_user:
        user = existing_user
        if not user.farm_id:
            user.farm_id = farm.id
        if owner_data.password:
            user.hashed_password = get_password_hash(owner_data.password)
    else:
        hashed_pwd = get_password_hash(owner_data.password) if owner_data.password else None
        user = User(
            farm_id=farm.id,
            phone=phone,
            email=owner_data.email.strip() if owner_data.email else None,
            full_name=owner_data.fullName.strip(),
            hashed_password=hashed_pwd,
            role="owner",
            preferred_language=farm_data.preferredLanguage or "mr",
            is_active=True
        )
        db.add(user)
        db.flush()

    # 7. Add Farm Membership
    membership = FarmMember(
        farm_id=farm.id,
        user_id=user.id,
        role="owner",
        is_active=True
    )
    db.add(membership)
    db.commit()
    db.refresh(farm)

    token = create_access_token(
        subject=str(user.id),
        extra_claims={"farm_id": str(farm.id), "role": "owner"}
    )

    return FarmEnrollmentResponse(
        id=farm.id,
        name=farm.name,
        owner_name=farm.owner_name,
        phone=farm.phone,
        district=farm.district,
        total_capacity=farm.total_capacity,
        status=farm.status,
        user_id=user.id,
        access_token=token,
        token_type="bearer",
        sheds_count=len(created_sheds),
        flocks_count=len(created_flocks),
        redirect_url=f"/dashboard/farms/{farm.id}"
    )


@router.get("/my", response_model=List[FarmResponse])
def get_my_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memberships = db.query(FarmMember).filter(
        FarmMember.user_id == current_user.id,
        FarmMember.is_active == True
    ).all()
    farm_ids = [m.farm_id for m in memberships]
    if current_user.farm_id and current_user.farm_id not in farm_ids:
        farm_ids.append(current_user.farm_id)

    farms = db.query(Farm).filter(Farm.id.in_(farm_ids)).all()
    return [FarmResponse.model_validate(f) for f in farms]


@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(
    farm_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found.")
    return FarmResponse.model_validate(farm)


@router.get("/{farm_id}/dashboard", response_model=FarmDashboardResponse)
def get_farm_dashboard(
    farm_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    Retrieves the complete dashboard dataset for a specific farm from PostgreSQL.
    Returns real farm details, sheds, flocks, unit settings, and real records.
    """
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found.")

    sheds = db.query(Shed).filter(Shed.farm_id == farm_id, Shed.is_active == True).all()
    flocks = db.query(Flock).filter(Flock.farm_id == farm_id).all()
    unit_settings = db.query(UnitSettings).filter(UnitSettings.farm_id == farm_id).first()

    # Daily records
    records = db.query(DailyRecord).filter(
        DailyRecord.farm_id == farm_id
    ).order_by(DailyRecord.record_date.desc()).limit(90).all()

    # Sales
    sales_records = db.query(Sale).filter(
        Sale.farm_id == farm_id
    ).order_by(Sale.sale_date.desc()).limit(50).all()

    # Live statistics summary
    total_live_birds = sum(f.current_bird_count for f in flocks) if flocks else farm.total_capacity
    latest_record = records[0] if records else None

    if latest_record:
        eggs_today = latest_record.total_eggs_collected
        feed_today = float(latest_record.feed_consumed_kg or 0.0)
        mortality_today = latest_record.mortality_count or 0
        hd_pct = float(latest_record.hd_pct or 0.0)
        feed_per_bird = float(latest_record.feed_per_bird_g or 0.0)
        operating_profit = float(latest_record.simple_operating_profit or 0.0)
        break_even = float(latest_record.break_even_egg_price or 5.21)
        selling_price = float(latest_record.selling_price_per_egg or 5.40)
        today_rev = float(latest_record.egg_sales_revenue or (eggs_today * selling_price))
        today_cost = float(latest_record.feed_cost or (feed_today * 35.0))
    else:
        # Newly enrolled farm: clean 0 states
        eggs_today = 0
        feed_today = 0.0
        mortality_today = 0
        hd_pct = 0.0
        feed_per_bird = 0.0
        operating_profit = 0.0
        break_even = 5.21
        selling_price = 5.40
        today_rev = 0.0
        today_cost = 0.0

    summary = FarmDashboardSummary(
        total_birds=total_live_birds,
        eggs_collected_today=eggs_today,
        feed_used_today_kg=feed_today,
        mortality_today=mortality_today,
        hd_pct=hd_pct,
        feed_per_bird_g=feed_per_bird,
        today_revenue=today_rev,
        today_cost=today_cost,
        today_operating_profit=operating_profit,
        break_even_price=break_even,
        selling_price_per_egg=selling_price
    )

    records_list = [
        {
            "id": str(r.id),
            "recordDate": r.record_date.isoformat(),
            "totalEggsCollected": r.total_eggs_collected,
            "feedIssuedKg": float(r.feed_consumed_kg or 0),
            "mortality": r.mortality_count or 0,
            "hdPct": float(r.hd_pct or 0),
            "openingBirds": r.opening_birds,
            "closingBirds": r.closing_birds,
            "simpleOperatingProfit": float(r.simple_operating_profit or 0),
            "breakEvenEggPrice": float(r.break_even_egg_price or 5.21),
            "sellingPricePerEgg": float(r.selling_price_per_egg or 5.4),
        }
        for r in records
    ]

    sales_list = [
        {
            "id": str(s.id),
            "saleDate": s.sale_date.isoformat(),
            "customerName": s.customer.name if s.customer else "Walk-in Trader",
            "quantityUnits": s.quantity,
            "unitName": s.unit,
            "ratePerUnit": float(s.rate_per_unit),
            "grossAmount": float(s.total_amount),
            "netAmount": float(s.total_amount),
            "paidAmount": float(s.amount_paid),
            "paymentStatus": s.payment_status,
        }
        for s in sales_records
    ]

    return FarmDashboardResponse(
        farm=FarmResponse.model_validate(farm),
        sheds=[ShedResponse.model_validate(s) for s in sheds],
        flocks=[FlockResponse.model_validate(f) for f in flocks],
        unit_settings=UnitSettingsResponse.model_validate(unit_settings) if unit_settings else None,
        daily_records=records_list,
        sales=sales_list,
        summary=summary
    )


@router.put("/{farm_id}/unit-settings", response_model=UnitSettingsResponse)
def update_unit_settings(
    farm_id: uuid.UUID,
    settings_in: UnitSettingsUpdate,
    db: Session = Depends(get_db)
):
    settings_obj = db.query(UnitSettings).filter(UnitSettings.farm_id == farm_id).first()
    if not settings_obj:
        settings_obj = UnitSettings(farm_id=farm_id)
        db.add(settings_obj)

    update_data = settings_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(settings_obj, field, val)

    db.commit()
    db.refresh(settings_obj)
    return UnitSettingsResponse.model_validate(settings_obj)


@router.get("/{farm_id}/sheds", response_model=List[ShedResponse])
def list_sheds(farm_id: uuid.UUID, db: Session = Depends(get_db)):
    sheds = db.query(Shed).filter(Shed.farm_id == farm_id, Shed.is_active == True).all()
    return [ShedResponse.model_validate(s) for s in sheds]


@router.post("/{farm_id}/sheds", response_model=ShedResponse)
def create_shed(
    farm_id: uuid.UUID,
    shed_in: ShedCreate,
    db: Session = Depends(get_db)
):
    shed = Shed(
        farm_id=farm_id,
        shed_number=shed_in.shed_number,
        name=shed_in.name,
        capacity=shed_in.capacity,
        shed_type=shed_in.shed_type,
        has_climate_sensors=shed_in.has_climate_sensors,
        is_active=True,
    )
    db.add(shed)
    db.commit()
    db.refresh(shed)
    return ShedResponse.model_validate(shed)


@router.get("/{farm_id}/flocks", response_model=List[FlockResponse])
def list_flocks(farm_id: uuid.UUID, db: Session = Depends(get_db)):
    flocks = db.query(Flock).filter(Flock.farm_id == farm_id).all()
    return [FlockResponse.model_validate(f) for f in flocks]


@router.post("/{farm_id}/flocks", response_model=FlockResponse)
def create_flock(
    farm_id: uuid.UUID,
    flock_in: FlockCreate,
    db: Session = Depends(get_db)
):
    flock = Flock(
        farm_id=farm_id,
        shed_id=flock_in.shed_id,
        batch_code=flock_in.batch_code,
        breed=flock_in.breed,
        hatchery_source=flock_in.hatchery_source,
        placement_date=flock_in.placement_date,
        initial_chick_count=flock_in.initial_chick_count,
        chick_cost_per_bird=flock_in.chick_cost_per_bird,
        current_bird_count=flock_in.current_bird_count,
        current_phase=flock_in.current_phase,
        cumulative_rearing_cost=flock_in.cumulative_rearing_cost,
        amortization_months=flock_in.amortization_months,
    )
    db.add(flock)
    db.commit()
    db.refresh(flock)
    return FlockResponse.model_validate(flock)


@router.patch("/flocks/{flock_id}/phase", response_model=FlockResponse)
def update_flock_phase(
    flock_id: uuid.UUID,
    phase_in: FlockPhaseUpdate,
    db: Session = Depends(get_db)
):
    flock = db.query(Flock).filter(Flock.id == flock_id).first()
    if not flock:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flock not found.")

    flock.current_phase = phase_in.phase
    db.commit()
    db.refresh(flock)
    return FlockResponse.model_validate(flock)
