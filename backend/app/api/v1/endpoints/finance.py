import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.api.deps import get_current_user_optional, check_farm_access
from app.models.user import User
from app.models.finance import ExpenseCategory, Expense, Loan, Employee
from app.schemas.finance import (
    ExpenseCategoryCreate,
    ExpenseCategoryResponse,
    ExpenseCreate,
    ExpenseResponse,
    LoanCreate,
    LoanResponse,
    EmployeeCreate,
    EmployeeResponse,
)

router = APIRouter()

DEFAULT_CATEGORIES = [
    {"code": "feed", "name_mr": "खुराक खरेदी (Feed Purchase)", "name_en": "Feed Purchase", "is_cash_expense": True},
    {"code": "labour", "name_mr": "कामगार मजुरी (Labour Wages)", "name_en": "Labour Wages", "is_cash_expense": True},
    {"code": "medicine", "name_mr": "औषध व लसी (Medicines & Vaccines)", "name_en": "Medicines & Vaccines", "is_cash_expense": True},
    {"code": "power", "name_mr": "वीज व डिझेल (Power & Fuel)", "name_en": "Electricity & Fuel", "is_cash_expense": True},
    {"code": "transport", "name_mr": "वाहतूक खर्च (Transport)", "name_en": "Transport", "is_cash_expense": True},
    {"code": "maintenance", "name_mr": "किरकोळ दुरुस्ती (Maintenance)", "name_en": "Maintenance & Repairs", "is_cash_expense": True},
    {"code": "other", "name_mr": "इतर खर्च (Miscellaneous)", "name_en": "Miscellaneous", "is_cash_expense": True},
]


@router.get("/categories", response_model=List[ExpenseCategoryResponse])
def list_categories(
    farm_id: uuid.UUID = Query(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(farm_id, current_user, db)

    categories = db.query(ExpenseCategory).filter(ExpenseCategory.farm_id == farm_id).all()
    if not categories:
        # Seed standard categories for this farm
        for cat_data in DEFAULT_CATEGORIES:
            new_cat = ExpenseCategory(
                farm_id=farm_id,
                code=cat_data["code"],
                name_mr=cat_data["name_mr"],
                name_en=cat_data["name_en"],
                is_cash_expense=cat_data["is_cash_expense"],
            )
            db.add(new_cat)
        db.commit()
        categories = db.query(ExpenseCategory).filter(ExpenseCategory.farm_id == farm_id).all()

    return [ExpenseCategoryResponse.model_validate(c) for c in categories]


@router.post("/categories", response_model=ExpenseCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: ExpenseCategoryCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(category_in.farm_id, current_user, db)

    cat = ExpenseCategory(
        farm_id=category_in.farm_id,
        code=category_in.code,
        name_mr=category_in.name_mr,
        name_en=category_in.name_en,
        is_cash_expense=category_in.is_cash_expense,
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return ExpenseCategoryResponse.model_validate(cat)


@router.get("/expenses", response_model=List[ExpenseResponse])
def list_expenses(
    farm_id: uuid.UUID = Query(...),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(farm_id, current_user, db)

    query = db.query(Expense).filter(Expense.farm_id == farm_id)
    if start_date:
        query = query.filter(Expense.expense_date >= start_date)
    if end_date:
        query = query.filter(Expense.expense_date <= end_date)

    expenses = query.order_by(desc(Expense.expense_date), desc(Expense.created_at)).all()
    return [ExpenseResponse.model_validate(e) for e in expenses]


@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: ExpenseCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(expense_in.farm_id, current_user, db)

    expense = Expense(
        farm_id=expense_in.farm_id,
        flock_id=expense_in.flock_id,
        category_id=expense_in.category_id,
        expense_date=expense_in.expense_date,
        amount=expense_in.amount,
        payment_mode=expense_in.payment_mode,
        vendor_name=expense_in.vendor_name,
        description=expense_in.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return ExpenseResponse.model_validate(expense)


@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: uuid.UUID,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if current_user:
        check_farm_access(expense.farm_id, current_user, db)

    db.delete(expense)
    db.commit()
    return {"status": "deleted", "id": str(expense_id)}


@router.get("/loan", response_model=Optional[LoanResponse])
def get_farm_loan(
    farm_id: uuid.UUID = Query(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(farm_id, current_user, db)

    loan = db.query(Loan).filter(Loan.farm_id == farm_id).order_by(desc(Loan.created_at)).first()
    if not loan:
        return None
    return LoanResponse.model_validate(loan)


@router.post("/loan", response_model=LoanResponse)
def save_farm_loan(
    loan_in: LoanCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(loan_in.farm_id, current_user, db)

    existing = db.query(Loan).filter(Loan.farm_id == loan_in.farm_id).first()
    if existing:
        existing.bank_name = loan_in.bank_name
        existing.principal_amount = loan_in.principal_amount
        existing.annual_interest_rate = loan_in.annual_interest_rate
        existing.monthly_emi = loan_in.monthly_emi
        existing.emi_due_day = loan_in.emi_due_day
        existing.tenure_months = loan_in.tenure_months
        existing.start_date = loan_in.start_date
        existing.outstanding_principal = loan_in.outstanding_principal
        db.commit()
        db.refresh(existing)
        return LoanResponse.model_validate(existing)
    else:
        new_loan = Loan(
            farm_id=loan_in.farm_id,
            bank_name=loan_in.bank_name,
            principal_amount=loan_in.principal_amount,
            annual_interest_rate=loan_in.annual_interest_rate,
            monthly_emi=loan_in.monthly_emi,
            emi_due_day=loan_in.emi_due_day,
            tenure_months=loan_in.tenure_months,
            start_date=loan_in.start_date,
            outstanding_principal=loan_in.outstanding_principal,
        )
        db.add(new_loan)
        db.commit()
        db.refresh(new_loan)
        return LoanResponse.model_validate(new_loan)


@router.get("/employees", response_model=List[EmployeeResponse])
def list_employees(
    farm_id: uuid.UUID = Query(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(farm_id, current_user, db)

    employees = db.query(Employee).filter(
        Employee.farm_id == farm_id,
        Employee.is_active == True
    ).order_by(Employee.name).all()
    return [EmployeeResponse.model_validate(emp) for emp in employees]


@router.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    emp_in: EmployeeCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if current_user:
        check_farm_access(emp_in.farm_id, current_user, db)

    employee = Employee(
        farm_id=emp_in.farm_id,
        name=emp_in.name,
        role=emp_in.role,
        monthly_salary=emp_in.monthly_salary,
        phone=emp_in.phone,
        joining_date=emp_in.joining_date,
        is_active=emp_in.is_active,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return EmployeeResponse.model_validate(employee)

