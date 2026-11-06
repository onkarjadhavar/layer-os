import pytest
from datetime import date
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.farm import Farm
from app.models.finance import Expense, ExpenseCategory, Loan, Employee
from app.core.security import create_access_token
from app.models.user import User

client = TestClient(app)


def test_finance_lifecycle_and_isolation():
    db = SessionLocal()
    farm_a = None
    farm_b = None
    user_a = None
    user_b = None
    try:
        # Create test farms
        farm_a = Farm(name="Finance Test Farm Alpha", owner_name="Alpha Owner", phone="9999900001", total_capacity=5000)
        farm_b = Farm(name="Finance Test Farm Beta", owner_name="Beta Owner", phone="9999900002", total_capacity=5000)
        db.add_all([farm_a, farm_b])
        db.commit()
        db.refresh(farm_a)
        db.refresh(farm_b)

        # Create users
        user_a = User(phone="9999900001", full_name="Alpha User", role="owner", farm_id=farm_a.id)
        user_b = User(phone="9999900002", full_name="Beta User", role="owner", farm_id=farm_b.id)
        db.add_all([user_a, user_b])
        db.commit()
        db.refresh(user_a)
        db.refresh(user_b)

        token_a = create_access_token(subject=str(user_a.id))
        token_b = create_access_token(subject=str(user_b.id))
        headers_a = {"Authorization": f"Bearer {token_a}"}
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # 1. Categories endpoint auto-seeds defaults for Farm A
        resp = client.get(f"/api/v1/finance/categories?farm_id={farm_a.id}", headers=headers_a)
        assert resp.status_code == 200
        cats = resp.json()
        assert len(cats) >= 5
        cat_id = cats[0]["id"]

        # 2. Cross-farm check: User B cannot fetch categories of Farm A
        resp_b_cross = client.get(f"/api/v1/finance/categories?farm_id={farm_a.id}", headers=headers_b)
        assert resp_b_cross.status_code == 403

        # 3. Create Expense for Farm A
        expense_payload = {
            "farm_id": str(farm_a.id),
            "category_id": cat_id,
            "expense_date": str(date.today()),
            "amount": 12500.0,
            "payment_mode": "upi",
            "vendor_name": "Agrovet Feed Co",
            "description": "50 bags layer mash"
        }
        resp = client.post("/api/v1/finance/expenses", json=expense_payload, headers=headers_a)
        assert resp.status_code == 201
        exp_data = resp.json()
        assert exp_data["amount"] == 12500.0
        exp_id = exp_data["id"]

        # 4. User B cannot create expense for Farm A
        resp_b_create = client.post("/api/v1/finance/expenses", json=expense_payload, headers=headers_b)
        assert resp_b_create.status_code == 403

        # 5. List expenses for Farm A
        resp = client.get(f"/api/v1/finance/expenses?farm_id={farm_a.id}", headers=headers_a)
        assert resp.status_code == 200
        assert len(resp.json()) == 1

        # 6. Loan endpoints
        loan_payload = {
            "farm_id": str(farm_a.id),
            "bank_name": "SBI Agri Branch",
            "principal_amount": 1500000.0,
            "annual_interest_rate": 8.75,
            "monthly_emi": 24000.0,
            "emi_due_day": 5,
            "tenure_months": 84,
            "start_date": "2025-01-01",
            "outstanding_principal": 1350000.0
        }
        resp = client.post("/api/v1/finance/loan", json=loan_payload, headers=headers_a)
        assert resp.status_code == 200
        assert resp.json()["bank_name"] == "SBI Agri Branch"

        resp = client.get(f"/api/v1/finance/loan?farm_id={farm_a.id}", headers=headers_a)
        assert resp.status_code == 200
        assert resp.json()["monthly_emi"] == 24000.0

        # 7. Employee endpoints
        emp_payload = {
            "farm_id": str(farm_a.id),
            "name": "Ramesh Patil",
            "role": "Shed Supervisor",
            "monthly_salary": 18000.0,
            "phone": "9876543210",
            "joining_date": "2025-06-01",
            "is_active": True
        }
        resp = client.post("/api/v1/finance/employees", json=emp_payload, headers=headers_a)
        assert resp.status_code == 201
        assert resp.json()["name"] == "Ramesh Patil"

        resp = client.get(f"/api/v1/finance/employees?farm_id={farm_a.id}", headers=headers_a)
        assert resp.status_code == 200
        assert len(resp.json()) == 1

        # 8. Delete Expense
        resp = client.delete(f"/api/v1/finance/expenses/{exp_id}", headers=headers_a)
        assert resp.status_code == 200

        resp = client.get(f"/api/v1/finance/expenses?farm_id={farm_a.id}", headers=headers_a)
        assert resp.status_code == 200
        assert len(resp.json()) == 0

    finally:
        # Strict teardown to keep database pristine
        if farm_a:
            db.query(Expense).filter(Expense.farm_id == farm_a.id).delete()
            db.query(ExpenseCategory).filter(ExpenseCategory.farm_id == farm_a.id).delete()
            db.query(Loan).filter(Loan.farm_id == farm_a.id).delete()
            db.query(Employee).filter(Employee.farm_id == farm_a.id).delete()
        if farm_b:
            db.query(Expense).filter(Expense.farm_id == farm_b.id).delete()
            db.query(ExpenseCategory).filter(ExpenseCategory.farm_id == farm_b.id).delete()
            db.query(Loan).filter(Loan.farm_id == farm_b.id).delete()
            db.query(Employee).filter(Employee.farm_id == farm_b.id).delete()
        if user_a:
            db.delete(user_a)
        if user_b:
            db.delete(user_b)
        if farm_a:
            db.delete(farm_a)
        if farm_b:
            db.delete(farm_b)
        db.commit()
        db.close()
