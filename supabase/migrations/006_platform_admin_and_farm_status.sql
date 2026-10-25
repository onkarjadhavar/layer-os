-- LayerOS Migration 006: Platform Admin, Farm Status Model, Immutable Audit Log & Platform Settings
-- Purely additive migration: introduces multi-farm supervision, status enforcement, and DPDP-compliant platform audit trails.

-- 1. FARM STATUS ENUM & FARMS TABLE EXTENSIONS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'farm_status') THEN
        CREATE TYPE farm_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected', 'cancelled');
    END IF;
END $$;

ALTER TABLE farms ADD COLUMN IF NOT EXISTS status farm_status DEFAULT 'pending_approval';
ALTER TABLE farms ADD COLUMN IF NOT EXISTS status_reason TEXT;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS status_changed_by UUID;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE farms ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS plan_id VARCHAR(50) DEFAULT 'starter';
ALTER TABLE farms ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE farms ADD COLUMN IF NOT EXISTS plan_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');
ALTER TABLE farms ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill existing farms to 'active' status
UPDATE farms 
SET status = 'active', 
    approved_at = COALESCE(created_at, NOW()),
    enrolled_at = COALESCE(created_at, NOW())
WHERE status IS NULL OR status = 'pending_approval';

CREATE INDEX IF NOT EXISTS idx_farms_status ON farms(status);
CREATE INDEX IF NOT EXISTS idx_farms_enrolled_at ON farms(enrolled_at);

-- 2. PLATFORM ADMIN ROLES & TABLE
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_admin_role') THEN
        CREATE TYPE platform_admin_role AS ENUM ('super_admin', 'operator');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role platform_admin_role NOT NULL DEFAULT 'operator',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    totp_secret TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_platform_admins_user ON platform_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_admins_email ON platform_admins(email);

-- 3. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_mode VARCHAR(20) NOT NULL DEFAULT 'auto_approve', -- 'auto_approve' | 'manual_approval'
    default_trial_days INTEGER NOT NULL DEFAULT 30,
    support_phone VARCHAR(20) NOT NULL DEFAULT '+91 98220 12345',
    support_whatsapp VARCHAR(20) NOT NULL DEFAULT '+91 98220 12345',
    support_email VARCHAR(255) NOT NULL DEFAULT 'support@layeros.in',
    maintenance_banner TEXT,
    is_maintenance_active BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default platform settings if not present
INSERT INTO platform_settings (id, enrollment_mode, default_trial_days, support_phone, support_whatsapp, support_email)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'auto_approve',
    30,
    '+91 98220 12345',
    '+91 98220 12345',
    'support@layeros.in'
)
ON CONFLICT (id) DO NOTHING;

-- 4. IMMUTABLE ADMIN AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES platform_admins(id) ON DELETE RESTRICT,
    action VARCHAR(100) NOT NULL,
    farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT NOT NULL,
    ip VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_farm ON admin_audit_log(farm_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON admin_audit_log(created_at DESC);

-- Enforce append-only constraint: reject any UPDATE or DELETE on admin_audit_log
CREATE OR REPLACE FUNCTION prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'admin_audit_log is append-only. Modification and deletion are strictly forbidden for DPDP compliance.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_tampering ON admin_audit_log;
CREATE TRIGGER trg_prevent_audit_log_tampering
    BEFORE UPDATE OR DELETE ON admin_audit_log
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_tampering();

REVOKE UPDATE, DELETE ON admin_audit_log FROM PUBLIC, anon, authenticated;

-- 5. SECURITY DEFINER HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM platform_admins 
        WHERE user_id = auth.uid() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM platform_admins 
        WHERE user_id = auth.uid() AND is_active = TRUE AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_platform_admin_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role::TEXT INTO v_role 
    FROM platform_admins 
    WHERE user_id = auth.uid() AND is_active = TRUE;
    RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. ROW LEVEL SECURITY (RLS) FOR PLATFORM ADMIN TABLES
ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- platform_admins RLS:
-- Active platform admins can view operators
CREATE POLICY "platform_admins_read" ON platform_admins
    FOR SELECT USING (is_platform_admin());

-- Only super_admins can insert, update, or remove operators
CREATE POLICY "platform_admins_super_admin_manage" ON platform_admins
    FOR ALL USING (is_super_admin());

-- admin_audit_log RLS:
-- Active platform admins can view the audit trail
CREATE POLICY "admin_audit_log_select" ON admin_audit_log
    FOR SELECT USING (is_platform_admin());

-- Active platform admins can append audit records
CREATE POLICY "admin_audit_log_insert" ON admin_audit_log
    FOR INSERT WITH CHECK (is_platform_admin());

-- platform_settings RLS:
-- Active platform admins can read settings (or public config reader)
CREATE POLICY "platform_settings_read" ON platform_settings
    FOR SELECT USING (TRUE);

-- Only super_admin can update settings
CREATE POLICY "platform_settings_update" ON platform_settings
    FOR UPDATE USING (is_super_admin());

-- 7. AUDITED STATUS CHANGE RPC (Atomic State Transition)
CREATE OR REPLACE FUNCTION admin_change_farm_status(
    p_farm_id UUID,
    p_new_status farm_status,
    p_reason TEXT,
    p_ip VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_admin platform_admins;
    v_old_status farm_status;
    v_farm_name TEXT;
BEGIN
    -- Check admin authorization
    SELECT * INTO v_admin FROM platform_admins WHERE user_id = auth.uid() AND is_active = TRUE;
    IF v_admin.id IS NULL THEN
        RAISE EXCEPTION 'Access denied. Active platform admin required.';
    END IF;

    -- Check operator permissions: operators can only suspend or reactivate
    IF v_admin.role = 'operator' AND p_new_status NOT IN ('suspended', 'active') THEN
        RAISE EXCEPTION 'Operators can only suspend or reactivate farms. Approval and rejection require super_admin.';
    END IF;

    -- Fetch current farm
    SELECT status, name INTO v_old_status, v_farm_name FROM farms WHERE id = p_farm_id;
    IF v_farm_name IS NULL THEN
        RAISE EXCEPTION 'Farm not found.';
    END IF;

    -- State transition validations
    IF v_old_status = p_new_status THEN
        RAISE EXCEPTION 'Farm is already in % status.', p_new_status;
    END IF;

    IF v_old_status = 'rejected' AND p_new_status != 'active' AND v_admin.role != 'super_admin' THEN
        RAISE EXCEPTION 'Only super_admin can reconsider or reactivate a rejected farm.';
    END IF;

    -- Update farm status
    UPDATE farms 
    SET status = p_new_status,
        status_reason = p_reason,
        status_changed_at = NOW(),
        status_changed_by = v_admin.id,
        approved_at = CASE WHEN p_new_status = 'active' AND approved_at IS NULL THEN NOW() ELSE approved_at END,
        updated_at = NOW()
    WHERE id = p_farm_id;

    -- Append audit entry (immutable)
    INSERT INTO admin_audit_log (
        admin_id, action, farm_id, previous_status, new_status, reason, ip, user_agent, metadata
    )
    VALUES (
        v_admin.id,
        'change_farm_status_' || p_new_status::TEXT,
        p_farm_id,
        v_old_status::TEXT,
        p_new_status::TEXT,
        p_reason,
        p_ip,
        p_user_agent,
        jsonb_build_object('farm_name', v_farm_name, 'admin_email', v_admin.email, 'admin_role', v_admin.role)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'farm_id', p_farm_id,
        'previous_status', v_old_status,
        'new_status', p_new_status,
        'reason', p_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. NON-SENSITIVE AGGREGATED FARM SUMMARIES VIEW / RPC
-- Prevents exposure of raw customer ledger, daily financial balances, or private transactions to admin overview
CREATE OR REPLACE FUNCTION admin_get_farm_summaries()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    owner_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    district VARCHAR(100),
    status farm_status,
    status_reason TEXT,
    enrolled_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    plan_id VARCHAR(50),
    plan_started_at TIMESTAMPTZ,
    plan_ends_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,
    total_capacity INTEGER,
    flock_count BIGINT,
    total_live_birds BIGINT,
    shed_count BIGINT,
    last_record_date DATE
) AS $$
BEGIN
    IF NOT is_platform_admin() THEN
        RAISE EXCEPTION 'Unauthorized: platform admin credentials required.';
    END IF;

    RETURN QUERY
    SELECT 
        f.id,
        f.name,
        f.owner_name,
        f.phone,
        f.email,
        f.district,
        f.status,
        f.status_reason,
        f.enrolled_at,
        f.approved_at,
        f.plan_id,
        f.plan_started_at,
        f.plan_ends_at,
        f.last_active_at,
        f.total_capacity,
        COALESCE(fl.flock_count, 0::BIGINT) AS flock_count,
        COALESCE(fl.total_live_birds, 0::BIGINT) AS total_live_birds,
        COALESCE(sh.shed_count, 0::BIGINT) AS shed_count,
        dr.last_record_date
    FROM farms f
    LEFT JOIN (
        SELECT farm_id, COUNT(*) AS flock_count, SUM(current_bird_count) AS total_live_birds 
        FROM flocks GROUP BY farm_id
    ) fl ON fl.farm_id = f.id
    LEFT JOIN (
        SELECT farm_id, COUNT(*) AS shed_count 
        FROM sheds GROUP BY farm_id
    ) sh ON sh.farm_id = f.id
    LEFT JOIN (
        SELECT farm_id, MAX(record_date) AS last_record_date 
        FROM daily_records GROUP BY farm_id
    ) dr ON dr.farm_id = f.id
    ORDER BY f.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. AUDITED SUPPORT VIEW RPC (DPDP COMPLIANT)
-- Explicit access logged when super_admin needs to view a farm's operational details for technical support
CREATE OR REPLACE FUNCTION admin_access_support_view(
    p_farm_id UUID,
    p_reason TEXT,
    p_ip VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_admin platform_admins;
    v_farm_name TEXT;
BEGIN
    SELECT * INTO v_admin FROM platform_admins WHERE user_id = auth.uid() AND is_active = TRUE;
    IF v_admin.id IS NULL OR v_admin.role != 'super_admin' THEN
        RAISE EXCEPTION 'Access denied. Only super_admin may open customer support view under DPDP.';
    END IF;

    SELECT name INTO v_farm_name FROM farms WHERE id = p_farm_id;
    IF v_farm_name IS NULL THEN
        RAISE EXCEPTION 'Farm not found.';
    END IF;

    -- Write support view audit trail entry
    INSERT INTO admin_audit_log (
        admin_id, action, farm_id, reason, ip, user_agent, metadata
    )
    VALUES (
        v_admin.id,
        'support_view_accessed',
        p_farm_id,
        p_reason,
        p_ip,
        p_user_agent,
        jsonb_build_object('farm_name', v_farm_name, 'admin_email', v_admin.email)
    );

    RETURN jsonb_build_object('success', TRUE, 'farm_id', p_farm_id, 'audit_logged', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. ENHANCED ATOMIC ENROLLMENT RPC (Respecting platform_settings.enrollment_mode)
CREATE OR REPLACE FUNCTION enroll_farm_atomic(
    p_full_name VARCHAR(255),
    p_phone VARCHAR(20),
    p_email VARCHAR(255),
    p_farm_name VARCHAR(255),
    p_village_town VARCHAR(100),
    p_taluka VARCHAR(100),
    p_district VARCHAR(100),
    p_state VARCHAR(100),
    p_pincode VARCHAR(10),
    p_preferred_language VARCHAR(5),
    p_capacity INTEGER,
    p_sheds_data JSONB,
    p_flocks_data JSONB,
    p_unit_settings JSONB,
    p_feed_cost_per_kg NUMERIC(8,2),
    p_expected_feed_stock_kg NUMERIC(10,2),
    p_default_egg_price NUMERIC(6,2),
    p_nearest_mandi VARCHAR(100),
    p_planning_horizon_days INTEGER,
    p_monthly_expenses JSONB,
    p_loan_emi NUMERIC(12,2) DEFAULT 0,
    p_auth_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_farm_id UUID;
    v_user_id UUID;
    v_shed_id UUID;
    v_shed_elem JSONB;
    v_flock_elem JSONB;
    v_feed_bag_weight NUMERIC(6,2) := 50.00;
    v_tray_size INTEGER := 30;
    v_gatta_size INTEGER := 7;
    v_carton_size INTEGER := 12;
    v_rate_unit VARCHAR(20) := 'per_100';
    v_enroll_mode VARCHAR(20) := 'auto_approve';
    v_initial_status farm_status := 'active';
    v_approved_at TIMESTAMPTZ := NOW();
    v_trial_days INTEGER := 30;
    v_res JSONB;
BEGIN
    -- Read platform settings
    SELECT enrollment_mode, default_trial_days 
    INTO v_enroll_mode, v_trial_days 
    FROM platform_settings LIMIT 1;

    IF v_enroll_mode = 'manual_approval' THEN
        v_initial_status := 'pending_approval';
        v_approved_at := NULL;
    ELSE
        v_initial_status := 'active';
        v_approved_at := NOW();
    END IF;

    -- 1. Create Farm with status
    INSERT INTO farms (
        name, owner_name, phone, email, address, village_town, taluka, district,
        state, pincode, total_capacity, nearest_mandi, planning_horizon_days,
        default_egg_price, monthly_labour_budget, monthly_electricity_budget,
        monthly_medicine_budget, monthly_other_budget,
        status, enrolled_at, approved_at, plan_id, plan_started_at, plan_ends_at
    )
    VALUES (
        p_farm_name, p_full_name, p_phone, p_email,
        COALESCE(p_village_town, '') || ', ' || COALESCE(p_taluka, '') || ', ' || COALESCE(p_district, ''),
        p_village_town, p_taluka, COALESCE(p_district, 'Pune'),
        COALESCE(p_state, 'Maharashtra'), p_pincode, COALESCE(p_capacity, 30000),
        COALESCE(p_nearest_mandi, 'Pune'), COALESCE(p_planning_horizon_days, 30),
        COALESCE(p_default_egg_price, 5.40),
        COALESCE((p_monthly_expenses->>'labour')::NUMERIC, 0),
        COALESCE((p_monthly_expenses->>'electricity')::NUMERIC, 0),
        COALESCE((p_monthly_expenses->>'medicine')::NUMERIC, 0),
        COALESCE((p_monthly_expenses->>'other')::NUMERIC, 0),
        v_initial_status,
        NOW(),
        v_approved_at,
        'starter',
        NOW(),
        NOW() + (COALESCE(v_trial_days, 30) || ' days')::INTERVAL
    )
    RETURNING id INTO v_farm_id;

    -- 2. Create User
    INSERT INTO users (
        farm_id, phone, full_name, email, role, preferred_language,
        auth_user_id, terms_accepted_at, privacy_accepted_at
    )
    VALUES (
        v_farm_id, p_phone, p_full_name, p_email, 'owner',
        COALESCE(p_preferred_language, 'mr'),
        COALESCE(p_auth_user_id, auth.uid()),
        NOW(), NOW()
    )
    RETURNING id INTO v_user_id;

    -- 3. Add to farm_members as active owner
    INSERT INTO farm_members (farm_id, user_id, role, is_active)
    VALUES (v_farm_id, v_user_id, 'owner', TRUE)
    ON CONFLICT (farm_id, user_id) DO NOTHING;

    -- 4. Create Unit Settings
    IF p_unit_settings IS NOT NULL THEN
        v_tray_size := COALESCE((p_unit_settings->>'traySizeEggs')::INTEGER, 30);
        v_gatta_size := COALESCE((p_unit_settings->>'gattaSizeTrays')::INTEGER, 7);
        v_carton_size := COALESCE((p_unit_settings->>'cartonSizeTrays')::INTEGER, 12);
        v_feed_bag_weight := COALESCE((p_unit_settings->>'feedBagWeightKg')::NUMERIC, 50.00);
        v_rate_unit := COALESCE((p_unit_settings->>'defaultEggRateUnit')::VARCHAR, 'per_100');
    END IF;

    INSERT INTO unit_settings (
        farm_id, tray_size_eggs, gatta_size_trays, carton_size_trays,
        feed_bag_weight_kg, default_egg_rate_unit
    )
    VALUES (
        v_farm_id, v_tray_size, v_gatta_size, v_carton_size,
        v_feed_bag_weight, v_rate_unit
    );

    -- 5. Create Sheds and Flocks
    IF p_sheds_data IS NOT NULL AND jsonb_array_length(p_sheds_data) > 0 THEN
        FOR v_shed_elem IN SELECT * FROM jsonb_array_elements(p_sheds_data)
        LOOP
            INSERT INTO sheds (farm_id, shed_number, name, capacity, shed_type)
            VALUES (
                v_farm_id,
                COALESCE(v_shed_elem->>'shedNumber', 'Shed-01'),
                COALESCE(v_shed_elem->>'name', 'मुख्य शेड'),
                COALESCE((v_shed_elem->>'capacity')::INTEGER, p_capacity),
                COALESCE(v_shed_elem->>'shedType', 'elevated_cage')
            )
            RETURNING id INTO v_shed_id;
        END LOOP;
    ELSE
        INSERT INTO sheds (farm_id, shed_number, name, capacity, shed_type)
        VALUES (v_farm_id, 'Shed-01', 'मुख्य शेड (Main Shed)', p_capacity, 'elevated_cage')
        RETURNING id INTO v_shed_id;
    END IF;

    IF p_flocks_data IS NOT NULL AND jsonb_array_length(p_flocks_data) > 0 THEN
        FOR v_flock_elem IN SELECT * FROM jsonb_array_elements(p_flocks_data)
        LOOP
            INSERT INTO flocks (
                farm_id, shed_id, batch_code, breed, placement_date,
                initial_chick_count, current_bird_count, current_phase
            )
            VALUES (
                v_farm_id, v_shed_id,
                COALESCE(v_flock_elem->>'batchCode', 'Batch-2026-A'),
                COALESCE(v_flock_elem->>'breed', 'BV300'),
                CURRENT_DATE - (COALESCE((v_flock_elem->>'ageWeeks')::INTEGER, 34) * 7),
                COALESCE((v_flock_elem->>'initialBirds')::INTEGER, 30000),
                COALESCE((v_flock_elem->>'currentBirds')::INTEGER, 30000),
                'laying'
            );
        END LOOP;
    ELSE
        INSERT INTO flocks (
            farm_id, shed_id, batch_code, breed, placement_date,
            initial_chick_count, current_bird_count, current_phase
        )
        VALUES (
            v_farm_id, v_shed_id, 'Batch-2026-A', 'BV300',
            CURRENT_DATE - (34 * 7),
            COALESCE(p_capacity, 30000), COALESCE(p_capacity, 30000), 'laying'
        );
    END IF;

    -- 6. Initial Feed Type
    INSERT INTO feed_types (farm_id, name, current_stock_kg, cost_per_kg, reorder_level_kg)
    VALUES (
        v_farm_id, 'लेयर खाद्य (Layer Feed)',
        COALESCE(p_expected_feed_stock_kg, 5000),
        COALESCE(p_feed_cost_per_kg, 35.00),
        3000
    );

    -- 7. Starter Subscription
    INSERT INTO subscriptions (farm_id, plan_id, status, billing_cycle, current_period_end)
    VALUES (
        v_farm_id, 'starter', 'active', 'monthly', NOW() + (COALESCE(v_trial_days, 30) || ' days')::INTERVAL
    )
    ON CONFLICT (farm_id) DO NOTHING;

    -- 8. Loan if specified
    IF p_loan_emi > 0 THEN
        INSERT INTO loans (
            farm_id, bank_name, principal_amount, annual_interest_rate,
            monthly_emi, tenure_months, start_date, outstanding_principal
        )
        VALUES (
            v_farm_id, 'Farm Development Loan', p_loan_emi * 36, 9.5,
            p_loan_emi, 36, CURRENT_DATE, p_loan_emi * 36
        );
    END IF;

    -- 9. Audit Log
    INSERT INTO audit_logs (farm_id, user_id, action, table_name, record_id, new_data)
    VALUES (
        v_farm_id, v_user_id, 'INSERT', 'farms', v_farm_id::text,
        jsonb_build_object(
            'event', 'farm_enrolled',
            'farm_name', p_farm_name,
            'owner_name', p_full_name,
            'phone', p_phone,
            'status', v_initial_status
        )
    );

    v_res := jsonb_build_object(
        'farm_id', v_farm_id,
        'user_id', v_user_id,
        'farm_name', p_farm_name,
        'owner_name', p_full_name,
        'phone', p_phone,
        'status', v_initial_status
    );

    RETURN v_res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
