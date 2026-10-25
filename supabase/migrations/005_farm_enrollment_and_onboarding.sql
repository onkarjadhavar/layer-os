-- LayerOS Migration 005: Farm Enrollment, DPDP Consent & Onboarding Fields
-- Purely additive: provides columns and atomic RPC for the public enrollment flow

-- 1. ADD COLUMNS TO FARMS
ALTER TABLE farms ADD COLUMN IF NOT EXISTS taluka VARCHAR(100);
ALTER TABLE farms ADD COLUMN IF NOT EXISTS village_town VARCHAR(100);
ALTER TABLE farms ADD COLUMN IF NOT EXISTS nearest_mandi VARCHAR(100) DEFAULT 'Pune';
ALTER TABLE farms ADD COLUMN IF NOT EXISTS planning_horizon_days INTEGER DEFAULT 30;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS default_egg_price NUMERIC(6,2) DEFAULT 5.40;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS monthly_labour_budget NUMERIC(12,2) DEFAULT 0;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS monthly_electricity_budget NUMERIC(12,2) DEFAULT 0;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS monthly_medicine_budget NUMERIC(12,2) DEFAULT 0;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS monthly_other_budget NUMERIC(12,2) DEFAULT 0;

-- 2. ADD COLUMNS TO USERS FOR DPDP CONSENT & TIMESTAMPS
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- 3. ATOMIC ENROLLMENT RPC
-- Creates user, farm, membership, sheds, flocks, unit settings, feed types, and starter subscription
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
    p_sheds_data JSONB, -- array of { shedNumber, name, capacity, shedType }
    p_flocks_data JSONB, -- array of { batchCode, breed, initialBirds, currentBirds, ageWeeks }
    p_unit_settings JSONB, -- { traySizeEggs, gattaSizeTrays, cartonSizeTrays, feedBagWeightKg, defaultEggRateUnit }
    p_feed_cost_per_kg NUMERIC(8,2),
    p_expected_feed_stock_kg NUMERIC(10,2),
    p_default_egg_price NUMERIC(6,2),
    p_nearest_mandi VARCHAR(100),
    p_planning_horizon_days INTEGER,
    p_monthly_expenses JSONB, -- { labour, electricity, medicine, other }
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
    v_res JSONB;
BEGIN
    -- 1. Create Farm
    INSERT INTO farms (
        name, owner_name, phone, email, address, village_town, taluka, district,
        state, pincode, total_capacity, nearest_mandi, planning_horizon_days,
        default_egg_price, monthly_labour_budget, monthly_electricity_budget,
        monthly_medicine_budget, monthly_other_budget
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
        COALESCE((p_monthly_expenses->>'other')::NUMERIC, 0)
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
            INSERT INTO sheds (
                farm_id, shed_number, name, capacity, shed_type
            )
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
        INSERT INTO sheds (
            farm_id, shed_number, name, capacity, shed_type
        )
        VALUES (
            v_farm_id, 'Shed-01', 'मुख्य शेड (Main Shed)', p_capacity, 'elevated_cage'
        )
        RETURNING id INTO v_shed_id;
    END IF;

    -- Flocks
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

    -- 6. Create Initial Feed Type
    INSERT INTO feed_types (
        farm_id, name, current_stock_kg, cost_per_kg, reorder_level_kg
    )
    VALUES (
        v_farm_id, 'लेयर खाद्य (Layer Feed)',
        COALESCE(p_expected_feed_stock_kg, 5000),
        COALESCE(p_feed_cost_per_kg, 35.00),
        3000
    );

    -- 7. Assign Free Starter Plan (or Trial)
    INSERT INTO subscriptions (
        farm_id, plan_id, status, billing_cycle, current_period_end
    )
    VALUES (
        v_farm_id, 'starter', 'active', 'monthly', NOW() + INTERVAL '30 days'
    )
    ON CONFLICT (farm_id) DO NOTHING;

    -- 8. Add Loan if EMI specified
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
            'phone', p_phone
        )
    );

    v_res := jsonb_build_object(
        'farm_id', v_farm_id,
        'user_id', v_user_id,
        'farm_name', p_farm_name,
        'owner_name', p_full_name,
        'phone', p_phone
    );

    RETURN v_res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
