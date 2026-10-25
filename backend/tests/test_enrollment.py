import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_enroll_farm_and_retrieve_dashboard():
    unique_phone = f"98{uuid.uuid4().int % 100000000:08d}"
    farm_name = f"आनंद लेयर पोल्ट्री फार्म {unique_phone[-4:]}"
    owner_name = "सचिन आनंद गायकवाड"

    enrollment_payload = {
        "owner": {
            "fullName": owner_name,
            "mobileNumber": unique_phone,
            "email": f"owner_{unique_phone}@layeros.test",
            "password": "SecurePassword123",
            "acceptTermsAndPrivacy": True
        },
        "farm": {
            "farmName": farm_name,
            "ownerName": owner_name,
            "villageTown": "तळेगाव ढमढेरे",
            "taluka": "शिरूर",
            "district": "Pune",
            "state": "Maharashtra",
            "pincode": "412208",
            "preferredLanguage": "mr"
        },
        "shedsFlocks": {
            "numberOfSheds": 2,
            "flocks": [
                {
                    "batchCode": "Batch-A1",
                    "breed": "BV300",
                    "birdsPlaced": 20000,
                    "currentLiveBirds": 19950,
                    "ageWeeks": 26,
                    "housingType": "elevated_cage"
                }
            ]
        },
        "feed": {
            "feedBagsPerDay": 22.0,
            "bagSizeKg": 50.0,
            "feedPricePerKg": 36.0,
            "planningHorizonDays": 30,
            "expectedFeedStockKg": 3000.0
        },
        "sales": {
            "traySize": 30,
            "traysPerGatta": 7,
            "currentSellingPricePerEgg": 5.45,
            "mainBuyerType": "trader",
            "nearestMandi": "Pune"
        },
        "finance": {
            "monthlyLabour": 30000.0,
            "monthlyMedicine": 12000.0,
            "monthlyElectricity": 9000.0,
            "monthlyOther": 6000.0,
            "monthlyLoanEmi": 0.0,
            "numberOfEmployees": 3
        }
    }

    # 1. Post Enrollment
    response = client.post("/api/v1/farms/enroll", json=enrollment_payload)
    assert response.status_code == 201, f"Enrollment failed: {response.text}"

    data = response.json()
    assert "id" in data
    assert data["name"] == farm_name
    assert data["owner_name"] == owner_name
    assert data["phone"] == unique_phone
    assert data["status"] == "active"
    assert "access_token" in data
    assert data["redirect_url"] == f"/dashboard/farms/{data['id']}"

    farm_id = data["id"]

    # 2. Retrieve Specific Dashboard
    dash_response = client.get(f"/api/v1/farms/{farm_id}/dashboard")
    assert dash_response.status_code == 200, f"Dashboard retrieval failed: {dash_response.text}"

    dash_data = dash_response.json()
    assert dash_data["farm"]["id"] == farm_id
    assert dash_data["farm"]["name"] == farm_name
    assert dash_data["farm"]["owner_name"] == owner_name
    assert len(dash_data["sheds"]) == 2
    assert len(dash_data["flocks"]) == 1
    assert dash_data["flocks"][0]["batch_code"] == "Batch-A1"
    assert dash_data["flocks"][0]["breed"] == "BV300"
    assert dash_data["summary"]["total_birds"] == 19950


def test_dashboard_not_found_for_invalid_id():
    fake_id = str(uuid.uuid4())
    dash_response = client.get(f"/api/v1/farms/{fake_id}/dashboard")
    assert dash_response.status_code == 404
