from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_sales_and_customers_flow():
    # Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"phone": "9822012345", "otp": "123456"}
    )
    farm_id = login_res.json()["user"]["farm_id"]
    token = login_res.json()["access_token"]

    # 1. Create customer
    cust_res = client.post(
        "/api/v1/sales/customers",
        json={
            "farm_id": farm_id,
            "name": "गणेश एग ट्रेडर्स (पुणे)",
            "phone": "9822011111",
            "area": "हडपसर, पुणे",
            "customer_type": "wholesaler",
            "credit_limit": 500000.0,
            "credit_days": 14,
            "default_price_unit": "per_100",
            "preferred_discount_per_100": 5.0
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert cust_res.status_code == 200
    cust_data = cust_res.json()
    customer_id = cust_data["id"]
    assert cust_data["name"] == "गणेश एग ट्रेडर्स (पुणे)"
    assert cust_data["current_outstanding"] == 0.0

    # 2. Record sale: 27,300 eggs @ ₹5.40/egg = ₹1,47,420
    sale_res = client.post(
        "/api/v1/sales/",
        json={
            "farm_id": farm_id,
            "customer_id": customer_id,
            "sale_date": str(date.today()),
            "sale_type": "eggs",
            "quantity_units": 27300,
            "unit_name": "eggs",
            "total_eggs_equivalent": 27300,
            "rate_per_unit": 5.40,
            "gross_amount": 147420.0,
            "discount": 0.0,
            "net_amount": 147420.0,
            "paid_amount": 50000.0,  # Partial payment
            "vehicle_number": "MH 12 AB 1234",
            "delivery_person": "विकास"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert sale_res.status_code == 200
    sale_data = sale_res.json()
    assert sale_data["payment_status"] == "partial"
    assert sale_data["net_amount"] == 147420.0

    # Check updated customer balance (147420 - 50000 = 97420)
    customers_res = client.get(f"/api/v1/sales/customers?farm_id={farm_id}")
    assert customers_res.status_code == 200
    updated_cust = next(c for c in customers_res.json() if c["id"] == customer_id)
    assert updated_cust["current_outstanding"] == 97420.0
