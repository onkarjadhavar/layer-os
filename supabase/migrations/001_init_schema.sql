-- LayerOS PostgreSQL Database Schema
-- Multi-tenant schema with Row Level Security (RLS) for Maharashtra Layer Poultry Farms

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FARMS
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    district VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(10),
    gstin VARCHAR(20),
    total_capacity INTEGER DEFAULT 35000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & ROLES
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'supervisor', 'accountant', 'viewer');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'supervisor',
    preferred_language VARCHAR(5) DEFAULT 'mr', -- 'mr', 'en', 'hi'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UNIT SETTINGS (Configurable per farm: gatta/peti/carton conversion)
CREATE TABLE IF NOT EXISTS unit_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tray_size_eggs INTEGER DEFAULT 30,
    gatta_size_trays INTEGER DEFAULT 7, -- 7 trays = 210 eggs (popular in Western Maharashtra/Pune)
    carton_size_trays INTEGER DEFAULT 12, -- 12 trays = 360 eggs
    feed_bag_weight_kg NUMERIC(6,2) DEFAULT 50.00,
    default_egg_rate_unit VARCHAR(20) DEFAULT 'per_100', -- 'per_egg', 'per_100', 'per_tray', 'per_gatta'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_farm_unit_settings UNIQUE (farm_id)
);

-- 4. SHEDS
CREATE TABLE IF NOT EXISTS sheds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    shed_number VARCHAR(50) NOT NULL,
    name VARCHAR(100),
    capacity INTEGER NOT NULL,
    shed_type VARCHAR(50) DEFAULT 'elevated_cage', -- 'deep_litter', 'cage', 'ec_shed'
    has_climate_sensors BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FLOCKS / BATCHES
CREATE TYPE flock_phase AS ENUM ('brooding', 'growing', 'pre_lay', 'laying', 'post_peak', 'cull_ready');

CREATE TABLE IF NOT EXISTS flocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    shed_id UUID REFERENCES sheds(id) ON DELETE SET NULL,
    batch_code VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL DEFAULT 'BV300', -- 'BV300', 'Hy-Line Brown', 'Lohmann LSL', 'Bovans White'
    hatchery_source VARCHAR(255),
    placement_date DATE NOT NULL,
    initial_chick_count INTEGER NOT NULL,
    chick_cost_per_bird NUMERIC(8,2) NOT NULL DEFAULT 42.00,
    current_bird_count INTEGER NOT NULL,
    current_phase flock_phase DEFAULT 'laying',
    cumulative_rearing_cost NUMERIC(12,2) DEFAULT 0.00,
    amortization_months INTEGER DEFAULT 14,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BREED STANDARDS
CREATE TABLE IF NOT EXISTS breed_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    breed VARCHAR(100) NOT NULL,
    age_in_weeks INTEGER NOT NULL,
    target_hd_pct NUMERIC(5,2) NOT NULL,
    target_feed_g_per_bird NUMERIC(5,1) NOT NULL,
    target_egg_weight_g NUMERIC(5,1) NOT NULL,
    expected_livability_pct NUMERIC(5,2) NOT NULL,
    note VARCHAR(255) DEFAULT 'Verify against official breeder management manual',
    CONSTRAINT unique_breed_week UNIQUE (breed, age_in_weeks)
);

-- 7. DAILY FLOCK RECORDS (Core daily ledger)
CREATE TABLE IF NOT EXISTS daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    opening_birds INTEGER NOT NULL,
    mortality INTEGER NOT NULL DEFAULT 0,
    culls INTEGER NOT NULL DEFAULT 0,
    closing_birds INTEGER NOT NULL,
    total_eggs_collected INTEGER NOT NULL DEFAULT 0,
    broken_cracked_eggs INTEGER NOT NULL DEFAULT 0,
    soft_shell_eggs INTEGER NOT NULL DEFAULT 0,
    reject_eggs INTEGER NOT NULL DEFAULT 0,
    good_eggs INTEGER NOT NULL DEFAULT 0,
    morning_collection INTEGER DEFAULT 0,
    evening_collection INTEGER DEFAULT 0,
    hd_pct NUMERIC(5,2) NOT NULL,
    feed_issued_kg NUMERIC(8,2) NOT NULL DEFAULT 0,
    feed_per_bird_g NUMERIC(6,1) NOT NULL DEFAULT 0,
    water_consumption_litres NUMERIC(8,1),
    avg_egg_weight_g NUMERIC(5,2),
    is_closed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    voice_note_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_flock_date UNIQUE (flock_id, record_date)
);

-- 8. EGG STOCK LEDGER
CREATE TABLE IF NOT EXISTS egg_stock_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    opening_stock_eggs INTEGER NOT NULL DEFAULT 0,
    produced_today INTEGER NOT NULL DEFAULT 0,
    breakage_today INTEGER NOT NULL DEFAULT 0,
    sold_today INTEGER NOT NULL DEFAULT 0,
    closing_stock_eggs INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FEED STOCK & INVENTORY
CREATE TABLE IF NOT EXISTS feed_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Layer Phase 1', 'Layer Phase 2', 'Developer'
    current_stock_kg NUMERIC(10,2) DEFAULT 0,
    reorder_level_kg NUMERIC(10,2) DEFAULT 5000,
    cost_per_kg NUMERIC(8,2) DEFAULT 35.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CUSTOMERS & CREDIT
CREATE TYPE customer_type AS ENUM ('trader', 'wholesaler', 'retailer', 'hotel_bakery', 'direct_consumer');

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    area VARCHAR(100),
    customer_type customer_type DEFAULT 'wholesaler',
    credit_limit NUMERIC(12,2) DEFAULT 200000.00,
    credit_days INTEGER DEFAULT 7,
    current_outstanding NUMERIC(12,2) DEFAULT 0.00,
    default_price_unit VARCHAR(20) DEFAULT 'per_100',
    preferred_discount_per_100 NUMERIC(6,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SALES (Eggs, Empty Bags, Spent Birds, Manure, Misc)
CREATE TYPE sale_item_type AS ENUM ('eggs', 'empty_bags', 'spent_birds', 'manure', 'other');

CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) NOT NULL,
    sale_date DATE NOT NULL,
    sale_type sale_item_type NOT NULL DEFAULT 'eggs',
    quantity_units NUMERIC(10,2) NOT NULL,
    unit_name VARCHAR(50) NOT NULL, -- 'eggs', 'gatta', 'trays', 'bags', 'birds', 'tonnes'
    total_eggs_equivalent INTEGER DEFAULT 0,
    rate_per_unit NUMERIC(10,2) NOT NULL,
    gross_amount NUMERIC(12,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'paid', 'partial', 'pending'
    vehicle_number VARCHAR(50),
    delivery_person VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS RECEIVED
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    payment_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL, -- 'upi', 'cash', 'bank_transfer', 'cheque'
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. MARKET RATES (Daily Mandi Rates)
CREATE TABLE IF NOT EXISTS market_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mandi_name VARCHAR(100) NOT NULL, -- 'Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Namakkal', 'Barwala'
    rate_date DATE NOT NULL,
    rate_per_100 NUMERIC(8,2) NOT NULL,
    rate_per_egg NUMERIC(6,2) GENERATED ALWAYS AS (rate_per_100 / 100.0) STORED,
    trend VARCHAR(20) DEFAULT 'steady', -- 'up', 'down', 'steady'
    source VARCHAR(100) DEFAULT 'NECC / Direct Mandi Quotation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_mandi_date UNIQUE (mandi_name, rate_date)
);

-- 14. EXPENSES & ACCOUNTS
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name_mr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    is_cash_expense BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
    category_id UUID REFERENCES expense_categories(id),
    expense_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'upi',
    vendor_name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. LOANS & OVERHEADS (For True Profit calculation)
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    principal_amount NUMERIC(14,2) NOT NULL,
    annual_interest_rate NUMERIC(5,2) NOT NULL,
    monthly_emi NUMERIC(12,2) NOT NULL,
    emi_due_day INTEGER DEFAULT 5,
    tenure_months INTEGER NOT NULL,
    start_date DATE NOT NULL,
    outstanding_principal NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. EMPLOYEES & ATTENDANCE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Shed Attendant',
    monthly_salary NUMERIC(10,2) NOT NULL,
    phone VARCHAR(20),
    joining_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. VACCINATIONS & MEDICINES
CREATE TABLE IF NOT EXISTS vaccination_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(255) NOT NULL,
    disease_targeted VARCHAR(255) NOT NULL,
    due_age_weeks INTEGER NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'done', 'skipped'
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AI RUNS & DAILY ANALYSIS
CREATE TABLE IF NOT EXISTS ai_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    run_date DATE NOT NULL,
    health_score INTEGER NOT NULL,
    summary_mr TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    feed_recommended_kg NUMERIC(8,2) NOT NULL,
    break_even_price NUMERIC(6,2) NOT NULL,
    risks JSONB NOT NULL DEFAULT '[]',
    actions JSONB NOT NULL DEFAULT '[]',
    sales_advice JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL, -- 'critical', 'warning', 'info', 'safe'
    title_mr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    message_mr TEXT NOT NULL,
    message_en TEXT NOT NULL,
    action_url VARCHAR(255),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_daily_records_farm_date ON daily_records(farm_id, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_farm_date ON sales(farm_id, sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_farm_date ON expenses(farm_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_rates_mandi_date ON market_rates(mandi_name, rate_date DESC);
CREATE INDEX IF NOT EXISTS idx_customers_farm ON customers(farm_id);
