import uuid
from datetime import date
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.farm import Farm, Shed, Flock
from app.models.record import DailyRecord
from app.models.user import User
from app.core.security import create_access_token

client = TestClient(app)


def test_quick_daily_record_flow():
    db = SessionLocal()
    farm = None
    shed = None
    flock = None
    user = None
    try:
        # 1. Create dedicated test farm, shed, flock and user
        farm = Farm(name="Test Records Farm", owner_name="Records Owner", phone="9988771122", total_capacity=10000)
        db.add(farm)
        db.commit()
        db.refresh(farm)

        shed = Shed(farm_id=farm.id, shed_number="Shed-01", capacity=10000)
        db.add(shed)
        db.commit()
        db.refresh(shed)

        flock = Flock(
            farm_id=farm.id,
            shed_id=shed.id,
            batch_code="Test-Batch-01",
            breed="BV300",
            placement_date=date.today(),
            initial_chick_count=10000,
            current_bird_count=10000,
            current_phase="laying"
        )
        db.add(flock)
        db.commit()
        db.refresh(flock)

        user = User(phone="9988771122", full_name="Records User", role="owner", farm_id=farm.id)
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(subject=str(user.id))
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Post Quick Record for reference day
        record_payload = {
            "farm_id": str(farm.id),
            "flock_id": str(flock.id),
            "record_date": str(date.today()),
            "eggs_collected": 9200,
            "feed_kg": 1100.0,
            "mortality": 5,
            "selling_rate": 5.40
        }
        rec_res = client.post(
            "/api/v1/records/quick",
            json=record_payload,
            headers=headers
        )
        assert rec_res.status_code == 200
        rec_data = rec_res.json()
        assert rec_data["total_eggs_collected"] == 9200
        assert rec_data["mortality"] == 5
        assert rec_data["closing_birds"] == 9995
        assert rec_data["hd_pct"] > 0
        assert rec_data["feed_per_bird_g"] > 0

        # 3. Fetch records list
        list_res = client.get(f"/api/v1/records/?farm_id={farm.id}&flock_id={flock.id}", headers=headers)
        assert list_res.status_code == 200
        records = list_res.json()
        assert len(records) == 1
        assert records[0]["total_eggs_collected"] == 9200

    finally:
        if farm:
            db.query(DailyRecord).filter(DailyRecord.farm_id == farm.id).delete()
            db.query(Flock).filter(Flock.farm_id == farm.id).delete()
            db.query(Shed).filter(Shed.farm_id == farm.id).delete()
        if user:
            db.delete(user)
        if farm:
            db.delete(farm)
        db.commit()
        db.close()
