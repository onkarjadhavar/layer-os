-- LayerOS Migration 002: Multi-Tenancy, Row Level Security (RLS), Audit Logs & Integrity Constraints
-- Extends 001_init_schema.sql with strict tenant isolation and role policies

-- 1. EXTEND TABLES WITH MISSING AUDIT COLUMNS
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE sales ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE loans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE employees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE egg_stock_ledger ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE vaccination_tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Soft-delete support
ALTER TABLE farms ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE flocks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Connect users to auth.users if Supabase Auth is active
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_farm_id ON users(farm_id);

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;', t);
        EXECUTE format('CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();', t);
    END LOOP;
END;
$$;

-- 3. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'ROLE_SWITCH'
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_farm ON audit_logs(farm_id, created_at DESC);

-- 4. NON-NEGATIVE INTEGRITY CONSTRAINTS
ALTER TABLE farms ADD CONSTRAINT chk_farms_capacity CHECK (total_capacity > 0);

ALTER TABLE flocks ADD CONSTRAINT chk_flocks_chick_count CHECK (initial_chick_count > 0);
ALTER TABLE flocks ADD CONSTRAINT chk_flocks_curr_count CHECK (current_bird_count >= 0);

ALTER TABLE daily_records ADD CONSTRAINT chk_daily_opening_birds CHECK (opening_birds >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_closing_birds CHECK (closing_birds >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_mortality CHECK (mortality >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_culls CHECK (culls >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_eggs CHECK (total_eggs_collected >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_feed CHECK (feed_issued_kg >= 0);
ALTER TABLE daily_records ADD CONSTRAINT chk_daily_hd_pct CHECK (hd_pct >= 0 AND hd_pct <= 150);

ALTER TABLE customers ADD CONSTRAINT chk_cust_credit_limit CHECK (credit_limit >= 0);
ALTER TABLE customers ADD CONSTRAINT chk_cust_outstanding CHECK (current_outstanding >= 0);

ALTER TABLE sales ADD CONSTRAINT chk_sales_qty CHECK (quantity_units >= 0);
ALTER TABLE sales ADD CONSTRAINT chk_sales_rate CHECK (rate_per_unit >= 0);
ALTER TABLE sales ADD CONSTRAINT chk_sales_gross CHECK (gross_amount >= 0);
ALTER TABLE sales ADD CONSTRAINT chk_sales_net CHECK (net_amount >= 0);
ALTER TABLE sales ADD CONSTRAINT chk_sales_paid CHECK (paid_amount >= 0);

-- 5. MULTI-TENANCY SECURITY FUNCTIONS
CREATE OR REPLACE FUNCTION get_active_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT id FROM users WHERE auth_user_id = auth.uid() AND is_active = TRUE LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_farm_ids()
RETURNS TABLE (farm_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT u.farm_id FROM users u
    WHERE (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
      AND u.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_farm_member(target_farm_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users u
        WHERE u.farm_id = target_farm_id
          AND (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
          AND u.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_farm_role(target_farm_id UUID, required_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users u
        WHERE u.farm_id = target_farm_id
          AND (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
          AND u.role = ANY(required_roles)
          AND u.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ENABLE ROW LEVEL SECURITY ON ALL TENANT TABLES
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheds ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_stock_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Shared reference tables (Public Read)
ALTER TABLE breed_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_rates ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES

-- Breed standards (Read-only for all authenticated users)
DROP POLICY IF EXISTS "Breed standards public read" ON breed_standards;
CREATE POLICY "Breed standards public read" ON breed_standards
    FOR SELECT TO authenticated USING (true);

-- Market rates (Read-only for all, owner/manager can insert farm-specific rate)
DROP POLICY IF EXISTS "Market rates public read" ON market_rates;
CREATE POLICY "Market rates public read" ON market_rates
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Market rates insert" ON market_rates;
CREATE POLICY "Market rates insert" ON market_rates
    FOR INSERT TO authenticated WITH CHECK (true);

-- Farms
DROP POLICY IF EXISTS "Farms member select" ON farms;
CREATE POLICY "Farms member select" ON farms
    FOR SELECT TO authenticated USING (is_farm_member(id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Farms owner update" ON farms;
CREATE POLICY "Farms owner update" ON farms
    FOR UPDATE TO authenticated USING (has_farm_role(id, ARRAY['owner'::user_role]));

-- Users
DROP POLICY IF EXISTS "Users farm select" ON users;
CREATE POLICY "Users farm select" ON users
    FOR SELECT TO authenticated USING (is_farm_member(farm_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users owner manager manage" ON users;
CREATE POLICY "Users owner manager manage" ON users
    FOR ALL TO authenticated USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- Unit Settings
DROP POLICY IF EXISTS "Unit settings member select" ON unit_settings;
CREATE POLICY "Unit settings member select" ON unit_settings
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "Unit settings owner manager update" ON unit_settings;
CREATE POLICY "Unit settings owner manager update" ON unit_settings
    FOR ALL TO authenticated USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- Sheds & Flocks
DROP POLICY IF EXISTS "Sheds member select" ON sheds;
CREATE POLICY "Sheds member select" ON sheds
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "Sheds owner manager manage" ON sheds;
CREATE POLICY "Sheds owner manager manage" ON sheds
    FOR ALL TO authenticated USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

DROP POLICY IF EXISTS "Flocks member select" ON flocks;
CREATE POLICY "Flocks member select" ON flocks
    FOR SELECT TO authenticated USING (is_farm_member(farm_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Flocks owner manager manage" ON flocks;
CREATE POLICY "Flocks owner manager manage" ON flocks
    FOR ALL TO authenticated USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- Daily Records (Core Ledger)
-- Everyone can read
DROP POLICY IF EXISTS "Daily records select" ON daily_records;
CREATE POLICY "Daily records select" ON daily_records
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

-- Owner, Manager, Supervisor can insert
DROP POLICY IF EXISTS "Daily records insert" ON daily_records;
CREATE POLICY "Daily records insert" ON daily_records
    FOR INSERT TO authenticated
    WITH CHECK (
        is_farm_member(farm_id) AND
        has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'supervisor'::user_role])
    );

-- Owner, Manager can update anytime; Supervisor can update only open records
DROP POLICY IF EXISTS "Daily records update" ON daily_records;
CREATE POLICY "Daily records update" ON daily_records
    FOR UPDATE TO authenticated
    USING (
        is_farm_member(farm_id) AND (
            has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]) OR
            (has_farm_role(farm_id, ARRAY['supervisor'::user_role]) AND is_closed = FALSE)
        )
    );

-- Only Owner can delete daily records
DROP POLICY IF EXISTS "Daily records delete" ON daily_records;
CREATE POLICY "Daily records delete" ON daily_records
    FOR DELETE TO authenticated USING (has_farm_role(farm_id, ARRAY['owner'::user_role]));

-- Customers, Sales, Payments (Commercial)
-- Supervisor CANNOT see finances; Owner, Manager, Accountant, Viewer can view
DROP POLICY IF EXISTS "Commercial select" ON customers;
CREATE POLICY "Commercial select" ON customers
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role, 'viewer'::user_role]));

DROP POLICY IF EXISTS "Sales select" ON sales;
CREATE POLICY "Sales select" ON sales
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role, 'viewer'::user_role]));

DROP POLICY IF EXISTS "Payments select" ON payments;
CREATE POLICY "Payments select" ON payments
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role, 'viewer'::user_role]));

DROP POLICY IF EXISTS "Commercial manage" ON customers;
CREATE POLICY "Commercial manage" ON customers
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

DROP POLICY IF EXISTS "Sales manage" ON sales;
CREATE POLICY "Sales manage" ON sales
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

DROP POLICY IF EXISTS "Payments manage" ON payments;
CREATE POLICY "Payments manage" ON payments
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

-- Expenses & Loans
DROP POLICY IF EXISTS "Expenses select" ON expenses;
CREATE POLICY "Expenses select" ON expenses
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

DROP POLICY IF EXISTS "Expenses manage" ON expenses;
CREATE POLICY "Expenses manage" ON expenses
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

DROP POLICY IF EXISTS "Loans select" ON loans;
CREATE POLICY "Loans select" ON loans
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'accountant'::user_role]));

DROP POLICY IF EXISTS "Loans manage" ON loans;
CREATE POLICY "Loans manage" ON loans
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- Health & Vaccinations
DROP POLICY IF EXISTS "Vaccinations select" ON vaccination_tasks;
CREATE POLICY "Vaccinations select" ON vaccination_tasks
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "Vaccinations update" ON vaccination_tasks;
CREATE POLICY "Vaccinations update" ON vaccination_tasks
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role, 'supervisor'::user_role]));

-- Alerts & AI Runs
DROP POLICY IF EXISTS "Alerts select" ON alerts;
CREATE POLICY "Alerts select" ON alerts
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "Alerts update" ON alerts;
CREATE POLICY "Alerts update" ON alerts
    FOR UPDATE TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "AI runs select" ON ai_runs;
CREATE POLICY "AI runs select" ON ai_runs
    FOR SELECT TO authenticated USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "AI runs insert" ON ai_runs;
CREATE POLICY "AI runs insert" ON ai_runs
    FOR INSERT TO authenticated WITH CHECK (is_farm_member(farm_id));

-- Audit Logs (Owner and Manager only)
DROP POLICY IF EXISTS "Audit logs select" ON audit_logs;
CREATE POLICY "Audit logs select" ON audit_logs
    FOR SELECT TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- 8. ATOMIC SIGNUP TRANSACTION RPC
CREATE OR REPLACE FUNCTION create_farm_with_owner(
    p_farm_name VARCHAR(255),
    p_owner_name VARCHAR(255),
    p_phone VARCHAR(20),
    p_district VARCHAR(100) DEFAULT 'Pune',
    p_capacity INTEGER DEFAULT 35000,
    p_breed VARCHAR(100) DEFAULT 'BV300',
    p_initial_birds INTEGER DEFAULT 30000,
    p_age_weeks INTEGER DEFAULT 34
)
RETURNS JSONB AS $$
DECLARE
    v_farm_id UUID;
    v_user_id UUID;
    v_shed_id UUID;
    v_flock_id UUID;
    v_result JSONB;
BEGIN
    -- 1. Create Farm
    INSERT INTO farms (name, owner_name, phone, district, total_capacity)
    VALUES (p_farm_name, p_owner_name, p_phone, p_district, p_capacity)
    RETURNING id INTO v_farm_id;

    -- 2. Create User as Owner
    INSERT INTO users (farm_id, phone, full_name, role, auth_user_id)
    VALUES (v_farm_id, p_phone, p_owner_name, 'owner', auth.uid())
    RETURNING id INTO v_user_id;

    -- 3. Create Default Unit Settings (Maharashtra Standard: 7 trays = 210 eggs)
    INSERT INTO unit_settings (farm_id, tray_size_eggs, gatta_size_trays, carton_size_trays, default_egg_rate_unit)
    VALUES (v_farm_id, 30, 7, 12, 'per_100');

    -- 4. Create Default Shed
    INSERT INTO sheds (farm_id, shed_number, name, capacity, shed_type)
    VALUES (v_farm_id, 'Shed-01', 'मुख्य शेड (Main Shed)', p_capacity, 'elevated_cage')
    RETURNING id INTO v_shed_id;

    -- 5. Create Initial Flock
    INSERT INTO flocks (
        farm_id, shed_id, batch_code, breed, placement_date,
        initial_chick_count, current_bird_count, current_phase
    )
    VALUES (
        v_farm_id, v_shed_id, 'Batch-2026-A', p_breed,
        CURRENT_DATE - (p_age_weeks * 7),
        p_initial_birds, p_initial_birds, 'laying'
    )
    RETURNING id INTO v_flock_id;

    -- 6. Log Audit Event
    INSERT INTO audit_logs (farm_id, user_id, action, table_name, record_id, new_data)
    VALUES (
        v_farm_id, v_user_id, 'INSERT', 'farms', v_farm_id::text,
        jsonb_build_object('farm_name', p_farm_name, 'owner', p_owner_name, 'phone', p_phone)
    );

    v_result := jsonb_build_object(
        'farm_id', v_farm_id,
        'user_id', v_user_id,
        'shed_id', v_shed_id,
        'flock_id', v_flock_id,
        'farm_name', p_farm_name,
        'owner_name', p_owner_name
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
