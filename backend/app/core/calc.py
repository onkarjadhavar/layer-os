"""
LayerOS Poultry Calculation Engine (Python Parity)
Mathematically identical to lib/calc/index.ts
Verified against the BV-300 Reference Day standard.
"""

from typing import Dict, Literal, Optional
from pydantic import BaseModel, Field

EggUnit = Literal["per_egg", "per_100", "tray", "gatta", "carton"]


class UnitSettings(BaseModel):
    tray_size_eggs: int = 30
    gatta_size_trays: int = 7  # 7 * 30 = 210 eggs (Western Maharashtra standard)
    carton_size_trays: int = 12  # 12 * 30 = 360 eggs
    feed_bag_weight_kg: float = 50.0
    default_rate_unit: str = "per_100"


DEFAULT_UNIT_SETTINGS = UnitSettings()


class AllocatedOverheads(BaseModel):
    labour_daily: float = 0.0
    electricity_daily: float = 0.0
    medicine_daily: float = 0.0
    pullet_amortization_daily: float = 0.0
    shed_depreciation_daily: float = 0.0
    loan_interest_daily: float = 0.0
    mortality_loss_daily: float = 0.0


class DailyCalculationInput(BaseModel):
    opening_birds: int
    mortality: int
    culls: int = 0
    eggs_collected: int
    feed_kg: float
    feed_price_per_kg: float
    selling_price_per_egg: float
    other_cash_expenses: float = 0.0
    other_income: float = 0.0
    allocated_overheads: Optional[AllocatedOverheads] = None


class DailyCalculationResult(BaseModel):
    closing_birds: int
    production_pct: float
    hd_pct: float
    feed_per_bird_g: float
    mortality_pct: float
    egg_sales_revenue: float
    other_income: float
    total_revenue: float
    feed_cost: float
    other_cash_expenses: float
    total_cash_expenses: float
    simple_operating_profit: float
    operating_cost_per_egg: float
    margin_per_egg_operating: float
    allocated_overheads_total: float
    true_cost_total: float
    true_cost_per_egg: float
    true_profit: float
    margin_per_egg_true: float
    break_even_egg_price: float
    break_even_egg_price_per_100: float
    break_even_egg_price_per_gatta: float
    break_even_status: Literal["safe", "warning", "loss"]
    fcr_dozen: float


def calculate_closing_birds(
    opening: int,
    mortality: int = 0,
    culls: int = 0,
    transfers_in: int = 0,
    transfers_out: int = 0
) -> int:
    return opening - mortality - culls + transfers_in - transfers_out


def calculate_hd_percent(
    eggs: int,
    opening_birds: int,
    closing_birds: Optional[int] = None
) -> float:
    closing = closing_birds if closing_birds is not None else opening_birds
    avg_birds = (opening_birds + closing) / 2.0
    if avg_birds <= 0:
        return 0.0
    return round((eggs / avg_birds) * 100.0, 2)


def calculate_feed_per_bird_grams(feed_kg: float, closing_birds: int) -> float:
    if closing_birds <= 0:
        return 0.0
    return round((feed_kg * 1000.0) / closing_birds, 1)


def calculate_mortality_percent(mortality: int, opening_birds: int) -> float:
    if opening_birds <= 0:
        return 0.0
    return round((mortality / opening_birds) * 100.0, 3)


def get_eggs_per_unit(unit: str, settings: UnitSettings = DEFAULT_UNIT_SETTINGS) -> int:
    if unit == "per_egg":
        return 1
    elif unit == "per_100":
        return 100
    elif unit == "tray":
        return settings.tray_size_eggs
    elif unit == "gatta":
        return settings.gatta_size_trays * settings.tray_size_eggs
    elif unit == "carton":
        return settings.carton_size_trays * settings.tray_size_eggs
    return 1


def convert_egg_units(
    quantity: float,
    from_unit: str,
    to_unit: str,
    settings: UnitSettings = DEFAULT_UNIT_SETTINGS
) -> float:
    total_eggs = quantity * get_eggs_per_unit(from_unit, settings)
    target_per_unit = get_eggs_per_unit(to_unit, settings)
    return round(total_eggs / target_per_unit, 2)


def convert_egg_rate(
    rate: float,
    from_unit: str,
    to_unit: str,
    settings: UnitSettings = DEFAULT_UNIT_SETTINGS
) -> float:
    rate_per_single_egg = rate / get_eggs_per_unit(from_unit, settings)
    target_multiplier = get_eggs_per_unit(to_unit, settings)
    return round(rate_per_single_egg * target_multiplier, 2)


def calculate_daily_metrics(
    inp: DailyCalculationInput,
    settings: UnitSettings = DEFAULT_UNIT_SETTINGS
) -> DailyCalculationResult:
    closing_birds = calculate_closing_birds(inp.opening_birds, inp.mortality, inp.culls)

    production_pct = (
        round((inp.eggs_collected / closing_birds) * 100.0, 2)
        if closing_birds > 0 else 0.0
    )

    hd_pct = calculate_hd_percent(inp.eggs_collected, inp.opening_birds, closing_birds)
    feed_per_bird_g = calculate_feed_per_bird_grams(inp.feed_kg, closing_birds)
    mortality_pct = calculate_mortality_percent(inp.mortality, inp.opening_birds)

    egg_sales_revenue = round(inp.eggs_collected * inp.selling_price_per_egg, 2)
    other_income = inp.other_income or 0.0
    total_revenue = round(egg_sales_revenue + other_income, 2)

    feed_cost = round(inp.feed_kg * inp.feed_price_per_kg, 2)
    other_cash_expenses = inp.other_cash_expenses or 0.0
    total_cash_expenses = round(feed_cost + other_cash_expenses, 2)

    simple_operating_profit = round(total_revenue - total_cash_expenses, 2)

    operating_cost_per_egg = (
        round(total_cash_expenses / inp.eggs_collected, 2)
        if inp.eggs_collected > 0 else 0.0
    )
    margin_per_egg_operating = round(inp.selling_price_per_egg - operatingCostPerEgg if (operatingCostPerEgg := operating_cost_per_egg) else 0.0, 2)

    o = inp.allocated_overheads or AllocatedOverheads()
    allocated_overheads_total = round(
        o.labour_daily +
        o.electricity_daily +
        o.medicine_daily +
        o.pullet_amortization_daily +
        o.shed_depreciation_daily +
        o.loan_interest_daily +
        o.mortality_loss_daily,
        2
    )

    true_cost_total = round(total_cash_expenses + allocated_overheads_total, 2)
    true_cost_per_egg = (
        round(true_cost_total / inp.eggs_collected, 2)
        if inp.eggs_collected > 0 else 0.0
    )
    true_profit = round(total_revenue - true_cost_total, 2)
    margin_per_egg_true = round(inp.selling_price_per_egg - true_cost_per_egg, 2)

    break_even_egg_price = true_cost_per_egg
    break_even_egg_price_per_100 = convert_egg_rate(break_even_egg_price, "per_egg", "per_100", settings)
    break_even_egg_price_per_gatta = convert_egg_rate(break_even_egg_price, "per_egg", "gatta", settings)

    break_even_status: Literal["safe", "warning", "loss"] = "safe"
    if inp.selling_price_per_egg < break_even_egg_price:
        break_even_status = "loss"
    elif inp.selling_price_per_egg - break_even_egg_price < 0.30:
        break_even_status = "warning"

    fcr_dozen = (
        round(inp.feed_kg / (inp.eggs_collected / 12.0), 3)
        if inp.eggs_collected > 0 else 0.0
    )

    return DailyCalculationResult(
        closing_birds=closing_birds,
        production_pct=production_pct,
        hd_pct=hd_pct,
        feed_per_bird_g=feed_per_bird_g,
        mortality_pct=mortality_pct,
        egg_sales_revenue=egg_sales_revenue,
        other_income=other_income,
        total_revenue=total_revenue,
        feed_cost=feed_cost,
        other_cash_expenses=other_cash_expenses,
        total_cash_expenses=total_cash_expenses,
        simple_operating_profit=simple_operating_profit,
        operating_cost_per_egg=operating_cost_per_egg,
        margin_per_egg_operating=margin_per_egg_operating,
        allocated_overheads_total=allocated_overheads_total,
        true_cost_total=true_cost_total,
        true_cost_per_egg=true_cost_per_egg,
        true_profit=true_profit,
        margin_per_egg_true=margin_per_egg_true,
        break_even_egg_price=break_even_egg_price,
        break_even_egg_price_per_100=break_even_egg_price_per_100,
        break_even_egg_price_per_gatta=break_even_egg_price_per_gatta,
        break_even_status=break_even_status,
        fcr_dozen=fcr_dozen,
    )
