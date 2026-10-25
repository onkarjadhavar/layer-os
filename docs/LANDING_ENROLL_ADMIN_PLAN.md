# LayerOS Stage 0: Architecture, Data Model & Implementation Plan
**Document:** `docs/LANDING_ENROLL_ADMIN_PLAN.md`  
**Status:** STAGE 0 VERIFIED & COMPLETE  
**Target:** Additive Landing Page (`/`), Enrollment Flow (`/enroll`), Android-First Standards, Platform Admin Console (`/admin`), and Homepage Access Button without touching existing core poultry calculation or billing logic.

---

## 1. Inspection Findings (Evidence over Assumptions)

All findings below have been directly verified by reading repository code, schema definitions, and runtime routes.

| Component / Subsystem | Current State in Repository | Classification | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Root Route (`/`)** | Handled in `app/page.tsx` with visitor toggle | **VERIFIED** | Human visitors see `LandingPage`; returning sessions or query `?demo=true` view dashboard. |
| **Login / Auth Route** | `app/login/page.tsx` + `components/auth/LoginPageComponent.tsx` | **VERIFIED** | Supports OTP + Email/Password authentication with Supabase auth fallback. |
| **Farm & Owner Creation** | `enroll_farm_atomic` RPC in `005_farm_enrollment_and_onboarding.sql` | **VERIFIED** | Creates farm, user, farm_members, sheds, flocks, unit_settings, feed_types, and starter subscription in one atomic PostgreSQL transaction. |
| **Onboarding & Units** | `unit_settings` table in `001_init_schema.sql` | **VERIFIED** | Tracks `tray_size_eggs` (30), `gatta_size_trays` (7), `carton_size_trays` (12), `feed_bag_weight_kg` (50kg), `default_egg_rate_unit`. |
| **Plans & Subscriptions** | `lib/billing/plans.ts` and `004_subscriptions_and_billing.sql` | **VERIFIED** | Plans: Starter (free), Grower Pro (₹999/mo), Enterprise (₹2,499/mo). DB stores `subscriptions` and `billing_invoices`. |
| **Existing Roles & RLS** | `user_role` enum: `owner`, `manager`, `supervisor`, `accountant`, `viewer` | **VERIFIED** | Multi-tenant isolation enforced via `farm_members` and RLS `is_farm_member(farm_id)` / `has_farm_role(farm_id, role)`. |
| **Platform Admin Code** | Zero existing platform admin tables or roles | **VERIFIED** | No `platform_admins`, `admin_audit_log`, or super-admin role currently exists in schema or code. Farm owners have zero platform control. |
| **Middleware & Router** | `proxy.ts` calls `updateSession` in `lib/supabase/middleware.ts` | **VERIFIED** | Intercepts all non-static requests; refreshes auth session. Ideal central hook for farm status and `/admin` access. |
| **Offline Sync Queue** | `lib/offline/sync-queue.ts` via IndexedDB | **VERIFIED** | Manages offline mutations; queued writes can be checked for farm suspension status during sync flush. |

---

## 2. Enrollment Form Field-to-Database Mapping

Every field collected in `/enroll` maps strictly to active schema columns in `farms`, `users`, `sheds`, `flocks`, `unit_settings`, `feed_types`, and `subscriptions`.

| Wizard Step | User Input Field | Target Database Table & Column | Type & Constraints | Default / Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1: Owner** | Full Name | `users.full_name`, `farms.owner_name` | `VARCHAR(255) NOT NULL` | Required |
| | Mobile Number | `users.phone`, `farms.phone` | `VARCHAR(20) NOT NULL` | `+91` 10-digit validation |
| | Email Address | `users.email`, `farms.email` | `VARCHAR(255)` | Required for Admin/Owner |
| | Password | `auth.users.encrypted_password` | Supabase Auth | Min 8 chars, 1 digit, 1 special |
| | DPDP & Terms Consent | `users.terms_accepted_at`, `users.privacy_accepted_at` | `TIMESTAMPTZ NOT NULL` | `NOW()` on explicit checkbox |
| **Step 2: Farm** | Farm Name | `farms.name` | `VARCHAR(255) NOT NULL` | Required |
| | Village / Town | `farms.village_town` | `VARCHAR(100)` | Optional |
| | Taluka | `farms.taluka` | `VARCHAR(100)` | Optional |
| | District | `farms.district` | `VARCHAR(100)` | Default `'Pune'` (Maharashtra list) |
| | State | `farms.state` | `VARCHAR(100)` | Default `'Maharashtra'` |
| | PIN Code | `farms.pincode` | `VARCHAR(10)` | 6-digit Indian PIN |
| | Preferred Language | `users.preferred_language` | `VARCHAR(5)` | Default `'mr'` (`'mr' \| 'hi' \| 'en'`) |
| **Step 3: Flocks** | Number of Sheds | `sheds` (record count) | `INTEGER` | Default 1 |
| | Shed Number & Name | `sheds.shed_number`, `sheds.name` | `VARCHAR(50)`, `VARCHAR(100)` | `'Shed-01'`, `'मुख्य शेड'` |
| | Shed Capacity & Type | `sheds.capacity`, `sheds.shed_type` | `INTEGER`, `VARCHAR(50)` | Elevated cage / deep litter |
| | Flock Batch Code | `flocks.batch_code` | `VARCHAR(100)` | `'Batch-2026-A'` |
| | Breed | `flocks.breed` | `VARCHAR(100)` | BV300, Hy-Line, Lohmann, Bovans |
| | Birds Placed | `flocks.initial_chick_count` | `INTEGER NOT NULL` | Default 30,000 |
| | Current Live Birds | `flocks.current_bird_count` | `INTEGER NOT NULL` | Default 30,000 |
| | Current Age (Weeks) | `flocks.placement_date` | `DATE` | `CURRENT_DATE - (weeks * 7)` |
| **Step 4: Feed** | Feed Bags / Day | Calculated daily usage | `NUMERIC(8,2)` | 50 kg bags |
| | Feed Bag Size | `unit_settings.feed_bag_weight_kg` | `NUMERIC(6,2)` | 50.00 kg |
| | Feed Price / kg | `feed_types.cost_per_kg` | `NUMERIC(8,2)` | Default ₹35.00/kg |
| | Feed Stock on Hand | `feed_types.current_stock_kg` | `NUMERIC(10,2)` | Default 5,000 kg |
| | Planning Horizon | `farms.planning_horizon_days` | `INTEGER` | 30 / 60 / 90 days |
| **Step 5: Units** | Tray Size | `unit_settings.tray_size_eggs` | `INTEGER` | Default 30 eggs |
| | Trays per Gatta/Peti | `unit_settings.gatta_size_trays` | `INTEGER` | Default 7 trays (210 eggs) |
| | Default Egg Price | `farms.default_egg_price` | `NUMERIC(6,2)` | Default ₹5.40/egg |
| | Rate Unit | `unit_settings.default_egg_rate_unit`| `VARCHAR(20)` | `'per_100'` \| `'per_egg'` \| `'per_tray'` |
| | Nearest Mandi | `farms.nearest_mandi` | `VARCHAR(100)` | Default `'Pune'` |
| **Step 6: Finance** | Monthly Labour | `farms.monthly_labour_budget` | `NUMERIC(12,2)` | Optional |
| | Monthly Electricity | `farms.monthly_electricity_budget` | `NUMERIC(12,2)` | Optional |
| | Monthly Medicine | `farms.monthly_medicine_budget` | `NUMERIC(12,2)` | Optional |
| | Monthly Other | `farms.monthly_other_budget` | `NUMERIC(12,2)` | Optional |
| | Loan EMI | `loans.monthly_emi` | `NUMERIC(12,2)` | If > 0, records development loan |
| **Step 7: Status** | Status & Trial | `farms.status`, `subscriptions` | Enum & Dates | Depends on `platform_settings` |

---

## 3. Gaps Requiring Additive Migration (`006_platform_admin_and_farm_status.sql`)

To satisfy Stage 1 without editing existing migrations 001–005, a single new numbered migration is created:

### A. Additions to `farms` Table
- `status`: ENUM `farm_status ('pending_approval', 'active', 'suspended', 'rejected', 'cancelled')` DEFAULT `'pending_approval'`.
  - *Backfill:* All existing farms are backfilled to `'active'`.
- `status_reason`: `TEXT` (mandatory for suspension or rejection).
- `status_changed_at`: `TIMESTAMPTZ`.
- `status_changed_by`: `UUID` (references `platform_admins.id`).
- `enrolled_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
- `approved_at`: `TIMESTAMPTZ`.
- `plan_id`: `VARCHAR(50) NOT NULL DEFAULT 'starter'`.
- `plan_started_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
- `plan_ends_at`: `TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')`.
- `last_active_at`: `TIMESTAMPTZ DEFAULT NOW()`.

### B. New Table: `platform_admins`
Separate from `farm_members` so a farm Owner has **ZERO platform administrative power**.
- `id`: `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- `user_id`: `UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE`
- `email`: `VARCHAR(255) NOT NULL UNIQUE`
- `role`: `platform_admin_role ('super_admin', 'operator') NOT NULL DEFAULT 'operator'`
- `is_active`: `BOOLEAN NOT NULL DEFAULT TRUE`
- `totp_secret`: `TEXT` (for mandatory 2FA)
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- `last_login_at`: `TIMESTAMPTZ`

### C. New Table: `admin_audit_log` (Append-Only & Immutable)
- `id`: `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- `admin_id`: `UUID NOT NULL REFERENCES platform_admins(id) ON DELETE RESTRICT`
- `action`: `VARCHAR(100) NOT NULL` (e.g. `'approve_farm'`, `'suspend_farm'`, `'reactivate_farm'`, `'support_view_accessed'`)
- `farm_id`: `UUID REFERENCES farms(id) ON DELETE SET NULL`
- `previous_status`: `VARCHAR(50)`
- `new_status`: `VARCHAR(50)`
- `reason`: `TEXT NOT NULL`
- `ip`: `VARCHAR(45)`
- `user_agent`: `TEXT`
- `metadata`: `JSONB`
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **Immutability Protection:** Explicit PostgreSQL rule and RLS policy revoking `UPDATE` and `DELETE` on `admin_audit_log` from all database roles.

### D. New Table: `platform_settings`
- `id`: `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- `enrollment_mode`: `VARCHAR(20) NOT NULL DEFAULT 'auto_approve'` (`'auto_approve'` \| `'manual_approval'`)
- `default_trial_days`: `INTEGER NOT NULL DEFAULT 30`
- `support_phone`: `VARCHAR(20) NOT NULL DEFAULT '+91 98220 12345'`
- `support_whatsapp`: `VARCHAR(20) NOT NULL DEFAULT '+91 98220 12345'`
- `maintenance_banner`: `TEXT`
- `is_maintenance_active`: `BOOLEAN DEFAULT FALSE`
- `updated_at`: `TIMESTAMPTZ DEFAULT NOW()`

### E. Security Definer Helper Functions
- `is_platform_admin()`: Returns `TRUE` if `auth.uid()` exists in `platform_admins` where `is_active = TRUE`.
- `is_super_admin()`: Returns `TRUE` if `auth.uid()` is `super_admin` and `is_active = TRUE`.
- `get_platform_admin_role()`: Returns `'super_admin'`, `'operator'`, or `NULL`.

---

## 4. Proposed Farm Status Lifecycle State Machine

```
                   +----------------------------------+
                   |          Farm Enrollment         |
                   +----------------------------------+
                                     |
           [platform_settings.enrollment_mode == 'manual_approval']
                                     |
                  +------------------+------------------+
                  |                                     |
                  v                                     v
       +-----------------------+              +-------------------+
       |   pending_approval    |              |      active       | <---+
       +-----------------------+              +-------------------+     |
            |              |                            |               |
   [Admin Approve]   [Admin Reject]               [Admin Suspend]  [Admin Reactivate]
            |              |                            |               |
            v              v                            v               |
       +----------+  +------------+           +-------------------+     |
       |  active  |  |  rejected  |           |     suspended     | ----+
       +----------+  +------------+           +-------------------+
                           |                            |
                           +-------------+--------------+
                                         |
                                [DPDP Delete Request]
                                (Super Admin Only)
                                         |
                                         v
                                  +--------------+
                                  | Hard Delete  |
                                  | (Audited)    |
                                  +--------------+
```

### Access Matrix by Farm Status:
- **`active`**: Full application access based on farm member role.
- **`pending_approval`**: Reads/writes blocked in middleware & DAL; renders localized "Awaiting Approval" screen with farm details and WhatsApp/Call contact.
- **`suspended`**: Immediate lock. App navigation blocked; writes rejected; renders localized "Account Suspended" screen with suspension reason. Reactivation restores all state with **zero data loss**.
- **`rejected`**: Blocked permanently unless super_admin explicitly reconsiders. Reason visible.
- **`cancelled`**: Read-only archive mode or blocked per settings.

---

## 5. Explicit List of Existing Files to Touch and Justification

In accordance with **ABSOLUTE RULE 1**, every modification to an existing file is strictly justified:

1. **`app/page.tsx`**:
   - *Justification:* Ensure root `/` handoff directs logged-out visitors to public landing page while preserving returning sessions, automated tests, and handling `?landing=true` and `?demo=true` navigation.
2. **`components/layout/TopBar.tsx`**:
   - *Justification:* User explicitly requested: *"also add one button to get back to homepage button on the layer os interface or start demo interface"*. Add a "Home" button in the top navigation bar linking back to `/?landing=true`.
3. **`lib/i18n/translations.ts`**:
   - *Justification:* Add new trilingual keys (`mr`, `hi`, `en`) for Platform Admin navigation, farm status modals (pending, suspended, rejected), support contact actions, and audit trail notifications.
4. **`proxy.ts` / `lib/supabase/middleware.ts`**:
   - *Justification:* Hook central farm status enforcement to block suspended/pending farms at the HTTP layer and restrict `/admin` routes to verified active platform admins.
5. **`lib/dal/index.ts`**:
   - *Justification:* Add central database mutation guard (`assertFarmActive`) ensuring offline sync, server actions, or API mutations cannot write records for a non-active farm.
6. **`app/api/ai/advisor/route.ts`**:
   - *Justification:* Verify farm status before executing AI queries.
7. **`lib/offline/sync-queue.ts`**:
   - *Justification:* Handle suspended farm responses during queue flush so pending records are preserved locally and not lost.
8. **`supabase/migrations/006_platform_admin_and_farm_status.sql`**:
   - *Justification:* New additive migration file (never modifies 001–005).

---

## 6. Implementation Stages & Verification Checklist

- [x] **Stage 0:** Inspection & Architecture Plan (`docs/LANDING_ENROLL_ADMIN_PLAN.md`).
- [x] **Stage 1:** Farm Status + Admin Data Model (Migration 006, RLS, audit logs, bootstrap script).
- [x] **Stage 2:** Enforcement of Farm Status (Middleware, DAL, API, localized blocked screens).
- [x] **Stage 3:** Public Landing Page Enhancements (Phone mockup preview, trust lines, contact buttons).
- [x] **Stage 4:** Enrollment Flow (`/enroll?step=N` query sync, Android Back, draft autosave).
- [x] **Stage 5:** Platform Admin Console (`/admin` login, KPI cards, farm list, detail, approve/suspend/reactivate actions, audit logs, operator management, DPDP support view).
- [x] **Stage 6:** Android-First Design Standards (360x800 verification, 48px targets, fluid type, Lighthouse budget).
- [x] **Stage 7:** Test Suite & Deliverables (Playwright E2E, Vitest unit tests, admin security suite, screenshots, docs).

---
*All Stages 0 through 7 Verified & Complete.*
