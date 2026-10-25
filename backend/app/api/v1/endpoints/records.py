import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.models.farm import Flock, UnitSettings
from app.models.record import DailyRecord
from app.core.calc import (
    calculate_daily_metrics,
    DailyCalculationInput,
    AllocatedOverheads,
    UnitSettings as CalcUnitSettings,
)
from app.schemas.record import (
    QuickDailyRecordInput,
    FullDailyRecordInput,
    DailyRecordResponse,
)

router = APIRouter()


@router.post("/quick", response_model=DailyRecordResponse)
def save_quick_daily_record(
    input_data: QuickDailyRecordInput,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    flock = db.query(Flock).filter(Flock.id == input_data.flock_id).first()
    if not flock:
        raise HTTPException(status_code=404, detail="Flock not found.")

    unit_settings_obj = db.query(UnitSettings).filter(UnitSettings.farm_id == input_data.farm_id).first()
    calc_settings = CalcUnitSettings()
    if unit_settings_obj:
        calc_settings.tray_size_eggs = unit_settings_obj.tray_size_eggs
        calc_settings.gatta_size_trays = unit_settings_obj.gatta_size_trays
        calc_settings.carton_size_trays = unit_settings_obj.carton_size_trays

    # Check for existing record on this flock & date to maintain idempotency
    existing_record = db.query(DailyRecord).filter(
        DailyRecord.flock_id == input_data.flock_id,
        DailyRecord.record_date == input_data.record_date
    ).first()

    opening_birds = existing_record.opening_birds if existing_record else flock.current_bird_count
    feed_price = 35.0  # ₹35/kg standard

    calc_input = DailyCalculationInput(
        opening_birds=opening_birds,
        mortality=input_data.mortality,
        eggs_collected=input_data.eggs_collected,
        feed_kg=input_data.feed_kg,
        feed_price_per_kg=feed_price,
        selling_price_per_egg=input_data.selling_rate,
        other_cash_expenses=12000.0,
        allocated_overheads=AllocatedOverheads(
            labour_daily=3500,
            electricity_daily=1200,
            medicine_daily=1500,
            pullet_amortization_daily=4500,
            shed_depreciation_daily=1500,
            loan_interest_daily=1800,
            mortality_loss_daily=input_data.mortality * 40,
        )
    )
    metrics = calculate_daily_metrics(calc_input, calc_settings)

    good_eggs = input_data.eggs_collected - round(input_data.eggs_collected * 0.008)
    broken_eggs = round(input_data.eggs_collected * 0.005)
    soft_shell = round(input_data.eggs_collected * 0.002)
    reject_eggs = round(input_data.eggs_collected * 0.001)

    if not existing_record:
        record = DailyRecord(
            farm_id=input_data.farm_id,
            flock_id=input_data.flock_id,
            record_date=input_data.record_date,
            opening_birds=opening_birds,
            mortality=input_data.mortality,
            culls=0,
            closing_birds=metrics.closing_birds,
            total_eggs_collected=input_data.eggs_collected,
            broken_cracked_eggs=broken_eggs,
            soft_shell_eggs=soft_shell,
            reject_eggs=reject_eggs,
            good_eggs=good_eggs,
            morning_collection=round(input_data.eggs_collected * 0.65),
            evening_collection=round(input_data.eggs_collected * 0.35),
            hd_pct=metrics.hd_pct,
            feed_issued_kg=input_data.feed_kg,
            feed_per_bird_g=metrics.feed_per_bird_g,
            water_consumption_litres=round(input_data.feed_kg * 2.0, 1),
            avg_egg_weight_g=58.5,
            is_closed=True,
            notes="Quick Log द्वारे नोंदवलेला दिवस.",
            created_by=current_user.id if current_user else None
        )
        db.add(record)
    else:
        record = existing_record
        record.mortality = input_data.mortality
        record.closing_birds = metrics.closing_birds
        record.total_eggs_collected = input_data.eggs_collected
        record.good_eggs = good_eggs
        record.hd_pct = metrics.hd_pct
        record.feed_issued_kg = input_data.feed_kg
        record.feed_per_bird_g = metrics.feed_per_bird_g

    # Update flock current live birds
    flock.current_bird_count = metrics.closing_birds

    db.commit()
    db.refresh(record)
    return DailyRecordResponse.model_validate(record)


@router.post("/full", response_model=DailyRecordResponse)
def save_full_daily_record(
    input_data: FullDailyRecordInput,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    flock = db.query(Flock).filter(Flock.id == input_data.flock_id).first()
    if not flock:
        raise HTTPException(status_code=404, detail="Flock not found.")

    closing_birds = input_data.opening_birds - input_data.mortality - input_data.culls
    avg_birds = (input_data.opening_birds + closing_birds) / 2.0
    hd_pct = round((input_data.total_eggs_collected / avg_birds) * 100.0, 2) if avg_birds > 0 else 0.0
    feed_per_bird = round((input_data.feed_issued_kg * 1000.0) / closing_birds, 1) if closing_birds > 0 else 0.0

    record = db.query(DailyRecord).filter(
        DailyRecord.flock_id == input_data.flock_id,
        DailyRecord.record_date == input_data.record_date
    ).first()

    if not record:
        record = DailyRecord(
            farm_id=input_data.farm_id,
            flock_id=input_data.flock_id,
            record_date=input_data.record_date,
            opening_birds=input_data.opening_birds,
            mortality=input_data.mortality,
            culls=input_data.culls,
            closing_birds=closing_birds,
            total_eggs_collected=input_data.total_eggs_collected,
            broken_cracked_eggs=input_data.broken_cracked_eggs,
            soft_shell_eggs=input_data.soft_shell_eggs,
            reject_eggs=input_data.reject_eggs,
            good_eggs=input_data.good_eggs or (input_data.total_eggs_collected - input_data.broken_cracked_eggs),
            morning_collection=input_data.morning_collection,
            evening_collection=input_data.evening_collection,
            hd_pct=hd_pct,
            feed_issued_kg=input_data.feed_issued_kg,
            feed_per_bird_g=feed_per_bird,
            water_consumption_litres=input_data.water_consumption_litres,
            avg_egg_weight_g=input_data.avg_egg_weight_g,
            is_closed=True,
            notes=input_data.notes or "Full Daily Entry नोंदवलेला दिवस.",
            created_by=current_user.id if current_user else None
        )
        db.add(record)
    else:
        record.mortality = input_data.mortality
        record.culls = input_data.culls
        record.closing_birds = closing_birds
        record.total_eggs_collected = input_data.total_eggs_collected
        record.hd_pct = hd_pct
        record.feed_issued_kg = input_data.feed_issued_kg
        record.feed_per_bird_g = feed_per_bird
        record.notes = input_data.notes

    flock.current_bird_count = closing_birds
    db.commit()
    db.refresh(record)
    return DailyRecordResponse.model_validate(record)


@router.get("/", response_model=List[DailyRecordResponse])
def get_daily_records(
    farm_id: Optional[uuid.UUID] = Query(None),
    flock_id: Optional[uuid.UUID] = Query(None),
    limit: int = Query(90, ge=1, le=365),
    db: Session = Depends(get_db)
):
    query = db.query(DailyRecord)
    if farm_id:
        query = query.filter(DailyRecord.farm_id == farm_id)
    if flock_id:
        query = query.filter(DailyRecord.flock_id == flock_id)

    records = query.order_by(desc(DailyRecord.record_date)).limit(limit).all()
    return [DailyRecordResponse.model_validate(r) for r in records]
