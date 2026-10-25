-- LayerOS Migration 003: Multi-Farm Memberships, Employee Invites & Multi-Tenancy Expansion
-- Allows users to belong to multiple farms (with farm switcher) and enables employee invitation flow

-- 1. FARM MEMBERS TABLE (Many-to-Many: User <-> Farm with Role)
CREATE TABLE IF NOT EXISTS farm_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'supervisor',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_farm_user_membership UNIQUE (farm_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_farm_members_farm ON farm_members(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_members_user ON farm_members(user_id);

-- Backfill existing users into farm_members
INSERT INTO farm_members (farm_id, user_id, role, is_active)
SELECT farm_id, id, role, is_active
FROM users
ON CONFLICT (farm_id, user_id) DO NOTHING;

-- 2. FARM INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS farm_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    role user_role NOT NULL DEFAULT 'supervisor',
    invite_token VARCHAR(100) UNIQUE NOT NULL,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'revoked'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farm_invitations_token ON farm_invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_farm_invitations_farm ON farm_invitations(farm_id);

-- Attach updated_at trigger
DROP TRIGGER IF EXISTS trg_set_updated_at_members ON farm_members;
CREATE TRIGGER trg_set_updated_at_members BEFORE UPDATE ON farm_members FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_invitations ON farm_invitations;
CREATE TRIGGER trg_set_updated_at_invitations BEFORE UPDATE ON farm_invitations FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 3. UPDATED SECURITY HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION is_farm_member(target_farm_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM farm_members fm
        JOIN users u ON u.id = fm.user_id
        WHERE fm.farm_id = target_farm_id
          AND fm.is_active = TRUE
          AND u.is_active = TRUE
          AND (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_farm_role(target_farm_id UUID, required_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM farm_members fm
        JOIN users u ON u.id = fm.user_id
        WHERE fm.farm_id = target_farm_id
          AND fm.is_active = TRUE
          AND u.is_active = TRUE
          AND fm.role = ANY(required_roles)
          AND (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ENABLE RLS ON MEMBERS AND INVITATIONS
ALTER TABLE farm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_invitations ENABLE ROW LEVEL SECURITY;

-- farm_members policies
DROP POLICY IF EXISTS "Farm members viewable by farm members" ON farm_members;
CREATE POLICY "Farm members viewable by farm members" ON farm_members
    FOR SELECT TO authenticated
    USING (is_farm_member(farm_id));

DROP POLICY IF EXISTS "Farm members manageable by owner and manager" ON farm_members;
CREATE POLICY "Farm members manageable by owner and manager" ON farm_members
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- farm_invitations policies
DROP POLICY IF EXISTS "Invitations viewable by owner, manager, or token holder" ON farm_invitations;
CREATE POLICY "Invitations viewable by owner, manager, or token holder" ON farm_invitations
    FOR SELECT TO authenticated
    USING (
        has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]) OR
        status = 'pending'
    );

DROP POLICY IF EXISTS "Invitations manageable by owner and manager" ON farm_invitations;
CREATE POLICY "Invitations manageable by owner and manager" ON farm_invitations
    FOR ALL TO authenticated
    USING (has_farm_role(farm_id, ARRAY['owner'::user_role, 'manager'::user_role]));

-- 5. FUNCTION: CREATE INVITATION
CREATE OR REPLACE FUNCTION create_farm_invitation(
    p_farm_id UUID,
    p_phone VARCHAR(20),
    p_role user_role,
    p_email VARCHAR(255) DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
    v_token VARCHAR(100);
    v_inviter_id UUID;
BEGIN
    -- Check caller has owner or manager role on the farm
    IF NOT has_farm_role(p_farm_id, ARRAY['owner'::user_role, 'manager'::user_role]) THEN
        RAISE EXCEPTION 'Access denied: Only Owner or Manager can invite staff members.';
    END IF;

    v_token := encode(gen_random_bytes(32), 'hex');
    v_inviter_id := (SELECT id FROM users WHERE auth_user_id = auth.uid() LIMIT 1);

    INSERT INTO farm_invitations (farm_id, phone, email, role, invite_token, invited_by)
    VALUES (p_farm_id, p_phone, p_email, p_role, v_token, v_inviter_id);

    -- Log audit entry
    INSERT INTO audit_logs (farm_id, user_id, action, table_name, record_id, new_data)
    VALUES (
        p_farm_id, v_inviter_id, 'INSERT', 'farm_invitations', v_token,
        jsonb_build_object('phone', p_phone, 'role', p_role, 'email', p_email)
    );

    RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNCTION: ACCEPT INVITATION
CREATE OR REPLACE FUNCTION accept_farm_invitation(p_invite_token VARCHAR)
RETURNS JSONB AS $$
DECLARE
    v_invitation RECORD;
    v_user_id UUID;
BEGIN
    -- 1. Find valid pending invitation
    SELECT * INTO v_invitation
    FROM farm_invitations
    WHERE invite_token = p_invite_token
      AND status = 'pending'
      AND expires_at > NOW();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired invitation token.';
    END IF;

    -- 2. Find current authenticated user
    SELECT id INTO v_user_id
    FROM users
    WHERE auth_user_id = auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User profile not found. Please complete basic signup first.';
    END IF;

    -- 3. Add to farm_members
    INSERT INTO farm_members (farm_id, user_id, role, is_active)
    VALUES (v_invitation.farm_id, v_user_id, v_invitation.role, TRUE)
    ON CONFLICT (farm_id, user_id) DO UPDATE
    SET role = v_invitation.role, is_active = TRUE, updated_at = NOW();

    -- 4. Mark invitation accepted
    UPDATE farm_invitations
    SET status = 'accepted', updated_at = NOW()
    WHERE id = v_invitation.id;

    -- 5. Log audit entry
    INSERT INTO audit_logs (farm_id, user_id, action, table_name, record_id, new_data)
    VALUES (
        v_invitation.farm_id, v_user_id, 'UPDATE', 'farm_invitations', v_invitation.id::text,
        jsonb_build_object('status', 'accepted', 'role', v_invitation.role)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'farm_id', v_invitation.farm_id,
        'role', v_invitation.role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. FUNCTION: GET MY FARMS
CREATE OR REPLACE FUNCTION get_my_farms()
RETURNS TABLE (
    farm_id UUID,
    farm_name VARCHAR(255),
    role user_role,
    total_capacity INTEGER,
    district VARCHAR(100),
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id AS farm_id,
        f.name AS farm_name,
        fm.role,
        f.total_capacity,
        f.district,
        fm.is_active
    FROM farm_members fm
    JOIN farms f ON f.id = fm.farm_id
    JOIN users u ON u.id = fm.user_id
    WHERE (u.auth_user_id = auth.uid() OR u.id::text = auth.jwt() ->> 'sub')
      AND fm.is_active = TRUE
      AND f.deleted_at IS NULL
    ORDER BY fm.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
