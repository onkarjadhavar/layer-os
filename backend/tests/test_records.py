from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_quick_daily_record_flow():
    # 1. Login to get farm & flock
    login_res = client.post(
        "/api/v1/auth/login",
        json={"phone": "9822012345", "otp": "123456"}
    )
    user_data = login_res.json()["user"]
    farm_id = user_data["farm_id"]
    token = login_res.json()["access_token"]

    # 2. Get flocks
    flocks_res = client.get(
        f"/api/v1/farms/{farm_id}/flocks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert flocks_res.status_code == 200
    flocks = flocks_res.json()
    assert len(flocks) > 0
    flock_id = flocks[0]["id"]

    # 3. Post Quick Record for reference day
    record_payload = {
        "farm_id": farm_id,
        "flock_id": flock_id,
        "record_date": str(date.today()),
        "eggs_collected": 27300,
        "feed_kg": 3300.0,
        "mortality": 15,
        "selling_rate": 5.40
    }
    rec_res = client.post(
        "/api/v1/records/quick",
        json=record_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["total_eggs_collected"] == 27300
    assert rec_data["mortality"] == 15
    assert rec_data["closing_birds"] == rec_data["opening_birds"] - rec_data["mortality"]
    assert rec_data["hd_pct"] > 0
    assert rec_data["feed_per_bird_g"] > 0

    # 4. Fetch records list
    list_res = client.get(f"/api/v1/records/?farm_id={farm_id}&flock_id={flock_id}")
    assert list_res.status_code == 200
    records = list_res.json()
    assert len(records) > 0
    assert any(r["total_eggs_collected"] == 27300 for r in records)


def test_cross_tenant_record_isolation():
    # User A
    login_a = client.post("/api/v1/auth/login", json={"phone": "9822012345", "otp": "123456"})
    farm_a_id = login_a.json()["user"]["farm_id"]
    token_a = login_a.json()["access_token"]

    # Try to write record to another fake farm ID with User A token
    import uuid
    foreign_farm_id = str(uuid.uuid4())
    foreign_flock_id = str(uuid.uuid4())

    bad_payload = {
        "farm_id": foreign_farm_id,
        "flock_id": foreign_flock_id,
        "record_date": str(date.today()),
        "eggs_collected": 1000,
        "feed_kg": 100.0,
        "mortality": 1,
        "selling_rate": 5.40
    }
    forbidden_res = client.post(
        "/api/v1/records/quick",
        json=bad_payload,
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert forbidden_res.status_code == 403

