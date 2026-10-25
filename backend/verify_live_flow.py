import httpx as requests
import json
import time

base_url = "http://localhost:8000"
ts = int(time.time())

enroll_payload = {
    "owner": {
        "fullName": "सतीश कदम (Satish Kadam)",
        "mobileNumber": "9890123456",
        "email": f"satish_{ts}@kadamagro.in",
        "password": "Password@123",
        "acceptTermsAndPrivacy": True
    },
    "farm": {
        "farmName": f"कदम हायटेक पोल्ट्री #{ts % 1000}",
        "ownerName": "सतीश कदम",
        "villageTown": "बारामती",
        "taluka": "बारामती",
        "district": "Pune",
        "state": "Maharashtra",
        "pincode": "413102",
        "preferredLanguage": "mr"
    },
    "shedsFlocks": {
        "numberOfSheds": 2,
        "flocks": [
            {
                "batchCode": "Batch-2026-KD",
                "breed": "BV300",
                "birdsPlaced": 25000,
                "currentLiveBirds": 24800,
                "ageWeeks": 28,
                "housingType": "elevated_cage"
            }
        ]
    },
    "feed": {
        "feedBagsPerDay": 55,
        "bagSizeKg": 50,
        "feedPricePerKg": 36.5,
        "feedSupplier": "गोदरेज ॲग्रो"
    },
    "sales": {
        "traySize": 30,
        "traysPerGatta": 7,
        "currentSellingPricePerEgg": 5.55
    },
    "finance": {
        "monthlyLabour": 35000,
        "monthlyElectricity": 12000,
        "monthlyMedicine": 15000,
        "monthlyOther": 8000,
        "monthlyLoanEmi": 45000
    }
}

# 1. Enroll Farm
res = requests.post(f"{base_url}/api/v1/farms/enroll", json=enroll_payload)
print("Enroll Status:", res.status_code)
assert res.status_code == 201, f"Failed: {res.text}"
enroll_data = res.json()
farm_id = enroll_data["id"]
token = enroll_data["access_token"]
print("Enrolled Farm ID:", farm_id)
print("Enrolled Farm Name:", repr(enroll_data["name"]))

# 2. Get Dashboard
res2 = requests.get(f"{base_url}/api/v1/farms/{farm_id}/dashboard")
print("Dashboard Status:", res2.status_code)
assert res2.status_code == 200, f"Dashboard failed: {res2.text}"
dash_data = res2.json()

print("Dashboard Farm Name:", repr(dash_data["farm"]["name"]))
print("Dashboard Owner Name:", repr(dash_data["farm"]["owner_name"]))
print("Dashboard Total Birds:", dash_data["summary"]["total_birds"])
print("Dashboard Sheds count:", len(dash_data["sheds"]))
print("Dashboard Flocks count:", len(dash_data["flocks"]))
print("Dashboard Eggs Today (Clean 0):", dash_data["summary"]["eggs_collected_today"])

assert dash_data["farm"]["id"] == farm_id
assert dash_data["farm"]["name"] == enroll_payload["farm"]["farmName"]
assert dash_data["farm"]["owner_name"] == enroll_payload["farm"]["ownerName"]
assert dash_data["summary"]["total_birds"] == 24800
assert len(dash_data["sheds"]) == 2

# 3. Test Invalid Farm ID returns 404
import uuid
random_id = str(uuid.uuid4())
res404 = requests.get(f"{base_url}/api/v1/farms/{random_id}/dashboard")
print("Non-existent Farm Status:", res404.status_code)
assert res404.status_code == 404

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
