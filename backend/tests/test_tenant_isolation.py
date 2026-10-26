import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_cross_tenant_isolation_and_admin_security():
    # 1. Enroll Farm A with User A
    phone_a = f"98{uuid.uuid4().int % 100000000:08d}"
    res_a = client.post("/api/v1/farms/enroll", json={
        "owner": {
            "fullName": "रामकृष्ण पाटील (Owner A)",
            "mobileNumber": phone_a,
            "email": f"owner_a_{phone_a}@test.com",
            "password": "PasswordA123!",
            "acceptTermsAndPrivacy": True
        },
        "farm": {
            "farmName": "पाटील लेयर फार्म A",
            "ownerName": "रामकृष्ण पाटील",
            "district": "Pune",
            "state": "Maharashtra"
        },
        "shedsFlocks": {
            "numberOfSheds": 1,
            "flocks": [{"batchCode": "Batch-A", "breed": "BV300", "birdsPlaced": 15000, "currentLiveBirds": 14900, "ageWeeks": 25}]
        }
    })
    assert res_a.status_code == 201
    data_a = res_a.json()
    farm_a_id = data_a["id"]
    token_a = data_a["access_token"]

    # 2. Enroll Farm B with User B
    phone_b = f"98{uuid.uuid4().int % 100000000:08d}"
    res_b = client.post("/api/v1/farms/enroll", json={
        "owner": {
            "fullName": "तानाजी शिंदे (Owner B)",
            "mobileNumber": phone_b,
            "email": f"owner_b_{phone_b}@test.com",
            "password": "PasswordB123!",
            "acceptTermsAndPrivacy": True
        },
        "farm": {
            "farmName": "शिंदे लेयर फार्म B",
            "ownerName": "तानाजी शिंदे",
            "district": "Satara",
            "state": "Maharashtra"
        },
        "shedsFlocks": {
            "numberOfSheds": 1,
            "flocks": [{"batchCode": "Batch-B", "breed": "BV300", "birdsPlaced": 20000, "currentLiveBirds": 19900, "ageWeeks": 30}]
        }
    })
    assert res_b.status_code == 201
    data_b = res_b.json()
    farm_b_id = data_b["id"]
    token_b = data_b["access_token"]

    # 3. User A can view their own Farm A
    view_a_own = client.get(
        f"/api/v1/farms/{farm_a_id}/dashboard",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert view_a_own.status_code == 200
    assert view_a_own.json()["farm"]["name"] == "पाटील लेयर फार्म A"

    # 4. User B can view their own Farm B
    view_b_own = client.get(
        f"/api/v1/farms/{farm_b_id}/dashboard",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert view_b_own.status_code == 200
    assert view_b_own.json()["farm"]["name"] == "शिंदे लेयर फार्म B"

    # 5. SECURITY: User A CANNOT view Farm B (Must return 403 Forbidden)
    view_b_by_a = client.get(
        f"/api/v1/farms/{farm_b_id}/dashboard",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert view_b_by_a.status_code == 403, f"Expected 403 Forbidden, got {view_b_by_a.status_code}"

    # 6. SECURITY: User B CANNOT view Farm A (Must return 403 Forbidden)
    view_a_by_b = client.get(
        f"/api/v1/farms/{farm_a_id}/dashboard",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert view_a_by_b.status_code == 403, f"Expected 403 Forbidden, got {view_a_by_b.status_code}"

    # 7. SECURITY: Normal users CANNOT access superadmin endpoints
    admin_farms_by_a = client.get(
        "/api/v1/admin/farms",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert admin_farms_by_a.status_code == 401

    admin_kpis_by_b = client.get(
        "/api/v1/admin/kpis",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert admin_kpis_by_b.status_code == 401

    # 8. SUPERADMIN can view all farms
    admin_login = client.post("/api/v1/admin/login", json={
        "email": "admin@layeros.in",
        "password": "SuperAdmin@LayerOS2026!"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["token"]

    admin_farms_ok = client.get(
        "/api/v1/admin/farms",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert admin_farms_ok.status_code == 200
    all_farms = admin_farms_ok.json()
    farm_names = [f["name"] for f in all_farms]
    assert "पाटील लेयर फार्म A" in farm_names
    assert "शिंदे लेयर फार्म B" in farm_names
