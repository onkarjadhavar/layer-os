import uuid
from datetime import date
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.farm import Farm, Shed, Flock
from app.models.sale import Customer, Sale, Payment
from app.models.user import User
from app.core.security import create_access_token

client = TestClient(app)


def test_sales_and_customers_flow():
    db = SessionLocal()
    farm = None
    user = None
    try:
        # Create dedicated test farm and user
        farm = Farm(name="Test Sales Farm", owner_name="Sales Owner", phone="9988776655", total_capacity=10000)
        db.add(farm)
        db.commit()
        db.refresh(farm)

        user = User(phone="9988776655", full_name="Sales User", role="owner", farm_id=farm.id)
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(subject=str(user.id))
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Create customer
        cust_res = client.post(
            "/api/v1/sales/customers",
            json={
                "farm_id": str(farm.id),
                "name": "टेस्ट ग्राहक (पुणे)",
                "phone": "9822011111",
                "area": "हडपसर, पुणे",
                "customer_type": "wholesaler",
                "credit_limit": 500000.0,
                "credit_days": 14,
                "default_price_unit": "per_100",
                "preferred_discount_per_100": 5.0
            },
            headers=headers
        )
        assert cust_res.status_code == 200
        cust_data = cust_res.json()
        customer_id = cust_data["id"]
        assert cust_data["name"] == "टेस्ट ग्राहक (पुणे)"
        assert cust_data["current_outstanding"] == 0.0

        # 2. Record sale: 27,300 eggs @ ₹5.40/egg = ₹1,47,420
        sale_res = client.post(
            "/api/v1/sales/",
            json={
                "farm_id": str(farm.id),
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
            headers=headers
        )
        assert sale_res.status_code == 200
        sale_data = sale_res.json()
        assert sale_data["payment_status"] == "partial"
        assert sale_data["net_amount"] == 147420.0

        # 3. Check customer outstanding balance updated: 1,47,420 - 50,000 = 97,420
        cust_check = client.get(
            f"/api/v1/sales/customers?farm_id={farm.id}",
            headers=headers
        )
        assert cust_check.status_code == 200
        cust_list = cust_check.json()
        assert len(cust_list) == 1
        assert cust_list[0]["current_outstanding"] == 97420.0

        # 4. Record Payment: customer pays ₹97,420 full remaining
        pay_res = client.post(
            "/api/v1/sales/payments",
            json={
                "farm_id": str(farm.id),
                "customer_id": customer_id,
                "sale_id": sale_data["id"],
                "payment_date": str(date.today()),
                "amount": 97420.0,
                "payment_mode": "upi",
                "reference_number": "UPI/998822",
                "notes": "Full outstanding settlement"
            },
            headers=headers
        )
        assert pay_res.status_code == 200

        # 5. Customer outstanding balance should now be 0
        cust_final = client.get(
            f"/api/v1/sales/customers?farm_id={farm.id}",
            headers=headers
        )
        assert cust_final.json()[0]["current_outstanding"] == 0.0

    finally:
        if farm:
            db.query(Payment).filter(Payment.farm_id == farm.id).delete()
            db.query(Sale).filter(Sale.farm_id == farm.id).delete()
            db.query(Customer).filter(Customer.farm_id == farm.id).delete()
        if user:
            db.delete(user)
        if farm:
            db.delete(farm)
        db.commit()
        db.close()
