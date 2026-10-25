-- LayerOS Migration 004: SaaS Subscriptions, Billing Tiers, and Razorpay Invoices
-- Adds subscription lifecycle management, plan tier limits, and transaction history

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL DEFAULT 'starter', -- 'starter', 'grower', 'enterprise'
    status VARCHAR(50) NOT NULL DEFAULT 'trialing', -- 'trialing', 'active', 'past_due', 'canceled', 'unpaid'
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    razorpay_customer_id VARCHAR(100),
    razorpay_subscription_id VARCHAR(100) UNIQUE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_farm_subscription UNIQUE (farm_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_farm ON subscriptions(farm_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay ON subscriptions(razorpay_subscription_id);

-- Attach updated_at trigger
DROP TRIGGER IF EXISTS trg_set_updated_at_subscriptions ON subscriptions;
CREATE TRIGGER trg_set_updated_at_subscriptions 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 2. BILLING INVOICES & PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount_paise BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'paid', -- 'paid', 'failed', 'pending', 'refunded'
    invoice_number VARCHAR(100),
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_farm ON billing_invoices(farm_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_sub ON billing_invoices(subscription_id);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;

-- Select policies: Farm members can read their farm's subscription & invoice status
DROP POLICY IF EXISTS "farm_members_select_subscription" ON subscriptions;
CREATE POLICY "farm_members_select_subscription" ON subscriptions
    FOR SELECT USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "farm_members_select_invoices" ON billing_invoices;
CREATE POLICY "farm_members_select_invoices" ON billing_invoices
    FOR SELECT USING (is_farm_member(farm_id));

-- Modification policies: Only farm owner or service role can update subscription details
DROP POLICY IF EXISTS "farm_owners_update_subscription" ON subscriptions;
CREATE POLICY "farm_owners_update_subscription" ON subscriptions
    FOR ALL USING (has_farm_role(farm_id, 'owner'));

-- 4. ATOMIC HELPER FUNCTIONS
-- Ensures every farm always has at least a Starter subscription
CREATE OR REPLACE FUNCTION get_or_create_farm_subscription(p_farm_id UUID)
RETURNS subscriptions AS $$
DECLARE
    sub subscriptions;
BEGIN
    SELECT * INTO sub FROM subscriptions WHERE farm_id = p_farm_id LIMIT 1;
    IF sub.id IS NULL THEN
        INSERT INTO subscriptions (farm_id, plan_id, status, billing_cycle)
        VALUES (p_farm_id, 'starter', 'active', 'monthly')
        RETURNING * INTO sub;
    END IF;
    RETURN sub;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updates or activates subscription post-payment
CREATE OR REPLACE FUNCTION update_farm_subscription(
    p_farm_id UUID,
    p_plan_id TEXT,
    p_status TEXT,
    p_billing_cycle TEXT,
    p_period_end TIMESTAMPTZ,
    p_razorpay_sub_id TEXT DEFAULT NULL,
    p_razorpay_cust_id TEXT DEFAULT NULL
)
RETURNS subscriptions AS $$
DECLARE
    sub subscriptions;
BEGIN
    INSERT INTO subscriptions (
        farm_id, plan_id, status, billing_cycle, current_period_end,
        razorpay_subscription_id, razorpay_customer_id, updated_at
    )
    VALUES (
        p_farm_id, p_plan_id, p_status, p_billing_cycle, p_period_end,
        p_razorpay_sub_id, p_razorpay_cust_id, NOW()
    )
    ON CONFLICT (farm_id) DO UPDATE SET
        plan_id = EXCLUDED.plan_id,
        status = EXCLUDED.status,
        billing_cycle = EXCLUDED.billing_cycle,
        current_period_end = EXCLUDED.current_period_end,
        razorpay_subscription_id = COALESCE(EXCLUDED.razorpay_subscription_id, subscriptions.razorpay_subscription_id),
        razorpay_customer_id = COALESCE(EXCLUDED.razorpay_customer_id, subscriptions.razorpay_customer_id),
        updated_at = NOW()
    RETURNING * INTO sub;

    RETURN sub;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing farms with Starter subscription
INSERT INTO subscriptions (farm_id, plan_id, status, billing_cycle)
SELECT id, 'starter', 'active', 'monthly'
FROM farms
ON CONFLICT (farm_id) DO NOTHING;
