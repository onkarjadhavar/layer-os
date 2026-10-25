import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_demo_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone": "9822012345", "otp": "123456"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == "9822012345"
    assert data["user"]["role"] == "owner"


def test_register_owner_and_me():
    phone = f"98{uuid.uuid4().hex[:8]}"
    reg_response = client.post(
        "/api/v1/auth/register-owner",
        json={
            "farm_name": "आनंद पोल्ट्री फार्म",
            "owner_name": "आनंद पाटील",
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
    assert me_data["full_name"] == "आनंद पाटील"
