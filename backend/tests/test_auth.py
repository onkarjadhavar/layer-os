import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_demo_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone": "7666040924", "otp": "123456"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == "7666040924"
    assert data["user"]["role"] == "owner"


def test_register_owner_and_me():
    phone = f"98{uuid.uuid4().hex[:8]}"
    farm_id = None
    try:
        reg_response = client.post(
            "/api/v1/auth/register-owner",
            json={
                "farm_name": "Test Reg Farm",
                "owner_name": "Test Reg Owner",
                "phone": phone,
                "district": "Sangli",
                "capacity": 25000,
                "breed": "BV300",
                "initial_birds": 20000,
                "age_weeks": 26
            }
        )
        assert reg_response.status_code == 200
        reg_data = reg_response.json()
        assert reg_data["success"] is True
        token = reg_data["access_token"]

        # Test GET /me
        me_response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response.status_code == 200
        me_data = me_response.json()
        assert me_data["phone"] == phone
        assert me_data["full_name"] == "Test Reg Owner"
        farm_id = me_data["farm_id"]
    finally:
        from app.db.session import SessionLocal
        from app.models.farm import Farm, Shed, Flock, FarmMember
        from app.models.user import User
        from app.models.record import DailyRecord
        from app.models.sale import Customer, Sale
        db = SessionLocal()
        if farm_id:
            fid = uuid.UUID(farm_id) if isinstance(farm_id, str) else farm_id
            db.query(DailyRecord).filter(DailyRecord.farm_id == fid).delete()
            db.query(Sale).filter(Sale.farm_id == fid).delete()
            db.query(Customer).filter(Customer.farm_id == fid).delete()
            db.query(FarmMember).filter(FarmMember.farm_id == fid).delete()
            db.query(Flock).filter(Flock.farm_id == fid).delete()
            db.query(Shed).filter(Shed.farm_id == fid).delete()
            db.query(Farm).filter(Farm.id == fid).delete()
        if phone:
            db.query(User).filter(User.phone == phone).delete()
        db.commit()
        db.close()
