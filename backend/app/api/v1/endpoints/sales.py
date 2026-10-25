import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.models.sale import Customer, Sale, Payment
from app.schemas.sale import (
    CustomerCreate,
    CustomerResponse,
    SaleCreate,
    SaleResponse,
    PaymentCreate,
    PaymentResponse,
)

router = APIRouter()


@router.get("/customers", response_model=List[CustomerResponse])
def list_customers(
    farm_id: uuid.UUID = Query(...),
    db: Session = Depends(get_db)
):
    customers = db.query(Customer).filter(
        Customer.farm_id == farm_id,
        Customer.is_active == True
    ).all()
    return [CustomerResponse.model_validate(c) for c in customers]


@router.post("/customers", response_model=CustomerResponse)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db)
):
    customer = Customer(
        farm_id=customer_in.farm_id,
        name=customer_in.name,
        phone=customer_in.phone,
        area=customer_in.area,
        customer_type=customer_in.customer_type,
        credit_limit=customer_in.credit_limit,
        credit_days=customer_in.credit_days,
        default_price_unit=customer_in.default_price_unit,
        preferred_discount_per_100=customer_in.preferred_discount_per_100,
        current_outstanding=0.0,
        is_active=True,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return CustomerResponse.model_validate(customer)


@router.get("/", response_model=List[SaleResponse])
def list_sales(
    farm_id: uuid.UUID = Query(...),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    sales = db.query(Sale).filter(Sale.farm_id == farm_id).order_by(desc(Sale.sale_date)).limit(limit).all()
    return [SaleResponse.model_validate(s) for s in sales]


@router.post("/", response_model=SaleResponse)
def create_sale(
    sale_in: SaleCreate,
    db: Session = Depends(get_db)
):
    invoice_number = sale_in.invoice_number or f"INV-{int(datetime.now().timestamp())}"
    gross_amount = sale_in.gross_amount or round(sale_in.quantity_units * sale_in.rate_per_unit, 2)
    net_amount = sale_in.net_amount or round(gross_amount - sale_in.discount, 2)
    paid_amount = sale_in.paid_amount or 0.0

    payment_status = "paid" if paid_amount >= net_amount else ("partial" if paid_amount > 0 else "pending")

    sale = Sale(
        farm_id=sale_in.farm_id,
        customer_id=sale_in.customer_id,
        invoice_number=invoice_number,
        sale_date=sale_in.sale_date,
        sale_type=sale_in.sale_type,
        quantity_units=sale_in.quantity_units,
        unit_name=sale_in.unit_name,
        total_eggs_equivalent=sale_in.total_eggs_equivalent,
        rate_per_unit=sale_in.rate_per_unit,
        gross_amount=gross_amount,
        discount=sale_in.discount,
        net_amount=net_amount,
        paid_amount=paid_amount,
        payment_status=payment_status,
        vehicle_number=sale_in.vehicle_number,
        delivery_person=sale_in.delivery_person,
        notes=sale_in.notes,
    )
    db.add(sale)

    # Update customer outstanding balance if credit sale
    if sale_in.customer_id:
        customer = db.query(Customer).filter(Customer.id == sale_in.customer_id).first()
        if customer:
            unpaid_balance = net_amount - paid_amount
            customer.current_outstanding = float(customer.current_outstanding) + unpaid_balance

    db.commit()
    db.refresh(sale)
    return SaleResponse.model_validate(sale)


@router.post("/payments", response_model=PaymentResponse)
def record_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db)
):
    payment = Payment(
        farm_id=payment_in.farm_id,
        customer_id=payment_in.customer_id,
        sale_id=payment_in.sale_id,
        payment_date=payment_in.payment_date,
        amount=payment_in.amount,
        payment_mode=payment_in.payment_mode,
        reference_number=payment_in.reference_number,
        notes=payment_in.notes,
    )
    db.add(payment)

    customer = db.query(Customer).filter(Customer.id == payment_in.customer_id).first()
    if customer:
        customer.current_outstanding = max(0.0, float(customer.current_outstanding) - payment_in.amount)

    db.commit()
    db.refresh(payment)
    return PaymentResponse.model_validate(payment)
