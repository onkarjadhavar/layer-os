import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_multi_farm_data_isolation_and_authorization():
    # 1. Enroll Farm 1
    phone_1 = f"98{uuid.uuid4().int % 100000000:08d}"
    enroll_payload_1 = {
        "owner": {
            "fullName": "Owner Farm One",
            "mobileNumber": phone_1,
            "email": f"owner_{phone_1}@layeros.test",
            "password": "Password123",
            "acceptTermsAndPrivacy": True,
        },
        "farm": {
            "farmName": f"Farm One {phone_1[-4:]}",
            "ownerName": "Owner Farm One",
            "district": "Pune",
            "state": "Maharashtra",
        },
        "shedsFlocks": {
            "numberOfSheds": 1,
            "flocks": [
                {
                    "batchCode": "Batch-1",
                    "breed": "BV300",
                    "birdsPlaced": 10000,
                    "currentLiveBirds": 10000,
                    "ageWeeks": 24,
                }
            ],
        },
    }

    res1 = client.post("/api/v1/farms/enroll", json=enroll_payload_1)
    assert res1.status_code == 201
    data1 = res1.json()
    farm_id_1 = data1["id"]
    token_1 = data1["access_token"]
    headers_1 = {"Authorization": f"Bearer {token_1}"}

    # 2. Enroll Farm 2
    phone_2 = f"98{uuid.uuid4().int % 100000000:08d}"
    enroll_payload_2 = {
        "owner": {
            "fullName": "Owner Farm Two",
            "mobileNumber": phone_2,
            "email": f"owner_{phone_2}@layeros.test",
            "password": "Password123",
            "acceptTermsAndPrivacy": True,
        },
        "farm": {
            "farmName": f"Farm Two {phone_2[-4:]}",
            "ownerName": "Owner Farm Two",
            "district": "Sangli",
            "state": "Maharashtra",
        },
        "shedsFlocks": {
            "numberOfSheds": 1,
            "flocks": [
                {
                    "batchCode": "Batch-2",
                    "breed": "BV300",
                    "birdsPlaced": 15000,
                    "currentLiveBirds": 15000,
                    "ageWeeks": 28,
                }
            ],
        },
    }

    res2 = client.post("/api/v1/farms/enroll", json=enroll_payload_2)
    assert res2.status_code == 201
    data2 = res2.json()
    farm_id_2 = data2["id"]
    token_2 = data2["access_token"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    try:
        # Unique farm IDs
        assert farm_id_1 != farm_id_2

        # 3. Check Farm Lists: Owner 1 should only see Farm 1 in their authorized list
        my_farms_1 = client.get("/api/v1/farms/my", headers=headers_1)
        assert my_farms_1.status_code == 200
        farms_list_1 = [f["id"] for f in my_farms_1.json()]
        assert farm_id_1 in farms_list_1
        assert farm_id_2 not in farms_list_1

        # 4. Cross-farm unauthorized read: Owner 1 trying to read Farm 2 dashboard
        forbidden_dash = client.get(f"/api/v1/farms/{farm_id_2}/dashboard", headers=headers_1)
        assert forbidden_dash.status_code == 403

        # Authorized read: Owner 1 reading Farm 1 dashboard
        valid_dash = client.get(f"/api/v1/farms/{farm_id_1}/dashboard", headers=headers_1)
        assert valid_dash.status_code == 200
        assert valid_dash.json()["farm"]["id"] == farm_id_1
        flock_id_1 = valid_dash.json()["flocks"][0]["id"]

        # 5. Add Daily Production Record to Farm 1
        record_payload_1 = {
            "farm_id": farm_id_1,
            "flock_id": flock_id_1,
            "record_date": "2026-10-27",
            "eggs_collected": 9200,
            "feed_kg": 1100.0,
            "mortality": 3,
            "selling_rate": 5.40,
            "sold_qty_eggs": 9000,
        }
        rec_res_1 = client.post("/api/v1/records/quick", json=record_payload_1, headers=headers_1)
        assert rec_res_1.status_code == 200
        assert rec_res_1.json()["total_eggs_collected"] == 9200

        # 6. Cross-farm unauthorized write: Owner 1 attempting to write to Farm 2
        dash_2_public = client.get(f"/api/v1/farms/{farm_id_2}/dashboard", headers=headers_2)
        flock_id_2 = dash_2_public.json()["flocks"][0]["id"]
        record_payload_cross = {
            "farm_id": farm_id_2,
            "flock_id": flock_id_2,
            "record_date": "2026-10-27",
            "eggs_collected": 5000,
            "feed_kg": 600.0,
            "mortality": 1,
            "selling_rate": 5.40,
        }
        rec_cross = client.post("/api/v1/records/quick", json=record_payload_cross, headers=headers_1)
        assert rec_cross.status_code == 403

        # 7. Verify Data Isolation: Farm 2 dashboard still has 0 eggs collected
        dash_2_after = client.get(f"/api/v1/farms/{farm_id_2}/dashboard", headers=headers_2)
        assert dash_2_after.json()["summary"]["eggs_collected_today"] == 0
        assert len(dash_2_after.json()["daily_records"]) == 0

        # Farm 1 dashboard has the 9200 eggs collected
        dash_1_after = client.get(f"/api/v1/farms/{farm_id_1}/dashboard", headers=headers_1)
        assert dash_1_after.json()["summary"]["eggs_collected_today"] == 9200
        assert len(dash_1_after.json()["daily_records"]) == 1
    finally:
        from app.db.session import SessionLocal
        from app.models.farm import Farm, Shed, Flock, FarmMember
        from app.models.user import User
        from app.models.record import DailyRecord
        from app.models.sale import Customer, Sale
        db = SessionLocal()
        matching = db.query(Farm).filter(
            Farm.name.in_([enroll_payload_1["farm"]["farmName"], enroll_payload_2["farm"]["farmName"]])
        ).all()
        for f in matching:
            db.query(DailyRecord).filter(DailyRecord.farm_id == f.id).delete()
            db.query(Sale).filter(Sale.farm_id == f.id).delete()
            db.query(Customer).filter(Customer.farm_id == f.id).delete()
            db.query(FarmMember).filter(FarmMember.farm_id == f.id).delete()
            db.query(Flock).filter(Flock.farm_id == f.id).delete()
            db.query(Shed).filter(Shed.farm_id == f.id).delete()
            db.delete(f)
        db.query(User).filter(User.phone.in_([phone_1, phone_2])).delete()
        db.commit()
        db.close()
