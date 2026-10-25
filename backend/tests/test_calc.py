from app.core.calc import (
    calculate_closing_birds,
    calculate_hd_percent,
    calculate_feed_per_bird_grams,
    calculate_mortality_percent,
    calculate_daily_metrics,
    convert_egg_units,
    convert_egg_rate,
    DailyCalculationInput,
    AllocatedOverheads,
    UnitSettings,
    DEFAULT_UNIT_SETTINGS,
)


def test_reference_day_operational_numbers():
    # Reference day: Birds 30,000 | Eggs 27,300 | Feed 3,300 kg | Mortality 15
    opening_birds = 30000
    mortality = 15
    eggs_collected = 27300
    feed_kg = 3300.0
    feed_price_per_kg = 35.0
    selling_price_per_egg = 5.40
    other_expenses = 12000.0

    closing_birds = calculate_closing_birds(opening_birds, mortality)
    assert closing_birds == 29985

    production_pct = round((eggs_collected / closing_birds) * 100)
    assert production_pct == 91

    hd_pct = calculate_hd_percent(eggs_collected, opening_birds, closing_birds)
    assert hd_pct == 91.02

    feed_per_bird_g = calculate_feed_per_bird_grams(feed_kg, closing_birds)
    assert round(feed_per_bird_g) == 110

    mort_pct = calculate_mortality_percent(mortality, opening_birds)
    assert mort_pct == 0.05

    inp = DailyCalculationInput(
        opening_birds=opening_birds,
        mortality=mortality,
        eggs_collected=eggs_collected,
        feed_kg=feed_kg,
        feed_price_per_kg=feed_price_per_kg,
        selling_price_per_egg=selling_price_per_egg,
        other_cash_expenses=other_expenses,
        allocated_overheads=AllocatedOverheads(
            labour_daily=3500,
            electricity_daily=1200,
            medicine_daily=1500,
            pullet_amortization_daily=4500,
            shed_depreciation_daily=1500,
            loan_interest_daily=1800,
            mortality_loss_daily=600,
        ),
    )

    metrics = calculate_daily_metrics(inp)

    assert metrics.egg_sales_revenue == 147420.0
    assert metrics.feed_cost == 115500.0
    assert metrics.total_cash_expenses == 127500.0
    assert metrics.simple_operating_profit == 19920.0
    assert metrics.operating_cost_per_egg == 4.67
    assert metrics.margin_per_egg_operating == 0.73
    assert metrics.allocated_overheads_total == 14600.0
    assert metrics.true_cost_total == 142100.0
    assert metrics.true_cost_per_egg == 5.21
    assert metrics.true_profit == 5320.0
    assert metrics.break_even_egg_price == 5.21
    assert metrics.break_even_egg_price_per_100 == 521.0
    assert metrics.break_even_status == "warning"


def test_egg_unit_conversions():
    assert convert_egg_units(10, "gatta", "per_egg") == 2100.0
    assert convert_egg_units(2100, "per_egg", "gatta") == 10.0
    assert convert_egg_units(2100, "per_egg", "tray") == 70.0
    assert convert_egg_units(70, "tray", "gatta") == 10.0

    assert convert_egg_rate(5.40, "per_egg", "per_100") == 540.0
    assert convert_egg_rate(5.40, "per_egg", "tray") == 162.0
    assert convert_egg_rate(5.40, "per_egg", "gatta") == 1134.0

    ahmednagar_settings = UnitSettings(gatta_size_trays=6)
    assert convert_egg_units(1, "gatta", "per_egg", ahmednagar_settings) == 180.0
    assert convert_egg_rate(5.40, "per_egg", "gatta", ahmednagar_settings) == 972.0
