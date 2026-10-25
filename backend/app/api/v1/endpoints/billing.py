import uuid
import hmac
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.models.billing import Subscription, BillingInvoice

router = APIRouter()


class CreateOrderInput(BaseModel):
    farm_id: uuid.UUID
    plan_id: str
    billing_cycle: str = "monthly"
    user_email: Optional[str] = None
    user_phone: Optional[str] = None


class VerifyPaymentInput(BaseModel):
    farm_id: uuid.UUID
    plan_id: str
    billing_cycle: str = "monthly"
    payment_id: str
    order_id: str
    signature: str


@router.get("/subscription/{farm_id}")
def get_farm_subscription(farm_id: uuid.UUID, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.farm_id == farm_id).first()
    if not sub:
        # Default starter trial
        period_end = datetime.now(timezone.utc) + timedelta(days=30)
        sub = Subscription(
            farm_id=farm_id,
            plan_id="starter",
            status="active",
            billing_cycle="monthly",
            current_period_end=period_end
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)

    return {
        "farm_id": str(sub.farm_id),
        "plan_id": sub.plan_id,
        "status": sub.status,
        "billing_cycle": sub.billing_cycle,
        "current_period_end": sub.current_period_end.isoformat(),
    }


@router.post("/create-order")
def create_checkout_order(data: CreateOrderInput, db: Session = Depends(get_db)):
    amount_map = {
        "starter": {"monthly": 0, "yearly": 0},
        "grower": {"monthly": 149900, "yearly": 1499000},
        "commercial": {"monthly": 299900, "yearly": 2999000},
    }
    amount = amount_map.get(data.plan_id, {}).get(data.billing_cycle, 149900)
    mock_order_id = f"order_{uuid.uuid4().hex[:14]}"

    return {
        "success": True,
        "data": {
            "order_id": mock_order_id,
            "amount_paise": amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID or "rzp_test_mock_layeros"
        }
    }


@router.post("/verify-payment")
def verify_payment_and_upgrade(data: VerifyPaymentInput, db: Session = Depends(get_db)):
    days_to_add = 365 if data.billing_cycle == "yearly" else 30
    period_end = datetime.now(timezone.utc) + timedelta(days=days_to_add)

    sub = db.query(Subscription).filter(Subscription.farm_id == data.farm_id).first()
    if not sub:
        sub = Subscription(
            farm_id=data.farm_id,
            plan_id=data.plan_id,
            status="active",
            billing_cycle=data.billing_cycle,
            current_period_end=period_end
        )
        db.add(sub)
    else:
        sub.plan_id = data.plan_id
        sub.status = "active"
        sub.billing_cycle = data.billing_cycle
        sub.current_period_end = period_end

    # Record invoice
    amount_map = {"grower": 149900, "commercial": 299900}
    inv = BillingInvoice(
        farm_id=data.farm_id,
        razorpay_payment_id=data.payment_id,
        razorpay_order_id=data.order_id,
        razorpay_signature=data.signature,
        amount_paise=amount_map.get(data.plan_id, 149900),
        currency="INR",
        status="paid",
        invoice_number=f"INV-{uuid.uuid4().hex[:6].upper()}"
    )
    db.add(inv)
    db.commit()

    return {
        "success": True,
        "data": {
            "farm_id": str(sub.farm_id),
            "plan_id": sub.plan_id,
            "status": sub.status,
            "billing_cycle": sub.billing_cycle,
            "current_period_end": sub.current_period_end.isoformat(),
        }
    }


@router.post("/webhooks/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    body_bytes = await request.body()
    if settings.RAZORPAY_WEBHOOK_SECRET and x_razorpay_signature:
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body_bytes,
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, x_razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    return {"status": "success"}
