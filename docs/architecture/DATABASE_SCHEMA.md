# LayerOS PostgreSQL Database Schema Specification

This document details the exact PostgreSQL schema ported from the existing Supabase migrations (001 through 006) to native PostgreSQL with SQLAlchemy 2.x and Alembic.

## 1. Table Definitions

### 1.1 `farms`
- `id` (UUID, PK, default uuid4)
- `name` (VARCHAR(255), NOT NULL)
- `owner_name` (VARCHAR(255), NOT NULL)
- `phone` (VARCHAR(20), NOT NULL)
- `email` (VARCHAR(255), nullable)
- `address` (TEXT, nullable)
- `district` (VARCHAR(100), default 'Pune')
- `state` (VARCHAR(100), default 'Maharashtra')
- `pincode` (VARCHAR(10), nullable)
- `gstin` (VARCHAR(20), nullable)
- `total_capacity` (INTEGER, default 35000)
- `status` (VARCHAR(50), default 'active') -- 'pending_approval', 'active', 'suspended', 'rejected'
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### 1.2 `users`
- `id` (UUID, PK, default uuid4)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE, nullable for standalone admins)
- `phone` (VARCHAR(20), NOT NULL, UNIQUE)
- `email` (VARCHAR(255), nullable, UNIQUE)
- `hashed_password` (VARCHAR(255), nullable)
- `full_name` (VARCHAR(255), NOT NULL)
- `role` (VARCHAR(50), default 'supervisor') -- 'owner', 'manager', 'supervisor', 'accountant', 'viewer', 'platform_admin'
- `preferred_language` (VARCHAR(5), default 'mr') -- 'mr', 'en', 'hi'
- `is_active` (BOOLEAN, default True)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### 1.3 `unit_settings`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, UNIQUE, ON DELETE CASCADE)
- `tray_size_eggs` (INTEGER, default 30)
- `gatta_size_trays` (INTEGER, default 7) -- 7 trays = 210 eggs (Western Maharashtra standard)
- `carton_size_trays` (INTEGER, default 12) -- 12 trays = 360 eggs
- `feed_bag_weight_kg` (NUMERIC(6,2), default 50.00)
- `default_egg_rate_unit` (VARCHAR(20), default 'per_100')
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### 1.4 `sheds`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `shed_number` (VARCHAR(50), NOT NULL)
- `name` (VARCHAR(100), nullable)
- `capacity` (INTEGER, NOT NULL)
- `shed_type` (VARCHAR(50), default 'elevated_cage')
- `has_climate_sensors` (BOOLEAN, default False)
- `is_active` (BOOLEAN, default True)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### 1.5 `flocks`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `shed_id` (UUID, FK -> sheds.id, ON DELETE SET NULL, nullable)
- `batch_code` (VARCHAR(100), NOT NULL)
- `breed` (VARCHAR(100), default 'BV300')
- `hatchery_source` (VARCHAR(255), nullable)
- `placement_date` (DATE, NOT NULL)
- `initial_chick_count` (INTEGER, NOT NULL)
- `chick_cost_per_bird` (NUMERIC(8,2), default 42.00)
- `current_bird_count` (INTEGER, NOT NULL)
- `current_phase` (VARCHAR(50), default 'laying') -- 'brooding', 'growing', 'pre_lay', 'laying', 'post_peak', 'cull_ready'
- `cumulative_rearing_cost` (NUMERIC(12,2), default 0.00)
- `amortization_months` (INTEGER, default 14)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())

### 1.6 `daily_records`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `flock_id` (UUID, FK -> flocks.id, ON DELETE CASCADE)
- `record_date` (DATE, NOT NULL)
- `opening_birds` (INTEGER, NOT NULL)
- `mortality` (INTEGER, default 0)
- `culls` (INTEGER, default 0)
- `closing_birds` (INTEGER, NOT NULL)
- `total_eggs_collected` (INTEGER, default 0)
- `broken_cracked_eggs` (INTEGER, default 0)
- `soft_shell_eggs` (INTEGER, default 0)
- `reject_eggs` (INTEGER, default 0)
- `good_eggs` (INTEGER, default 0)
- `morning_collection` (INTEGER, default 0)
- `evening_collection` (INTEGER, default 0)
- `hd_pct` (NUMERIC(5,2), NOT NULL)
- `feed_issued_kg` (NUMERIC(8,2), default 0)
- `feed_per_bird_g` (NUMERIC(6,1), default 0)
- `water_consumption_litres` (NUMERIC(8,1), nullable)
- `avg_egg_weight_g` (NUMERIC(5,2), nullable)
- `is_closed` (BOOLEAN, default False)
- `notes` (TEXT, nullable)
- `created_by` (UUID, FK -> users.id, nullable)
- `created_at` (TIMESTAMPTZ, default now())
- `updated_at` (TIMESTAMPTZ, default now())
- *Constraint*: UNIQUE (`flock_id`, `record_date`)

### 1.7 `customers`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `name` (VARCHAR(255), NOT NULL)
- `phone` (VARCHAR(20), NOT NULL)
- `area` (VARCHAR(100), nullable)
- `customer_type` (VARCHAR(50), default 'wholesaler')
- `credit_limit` (NUMERIC(12,2), default 200000.00)
- `credit_days` (INTEGER, default 7)
- `current_outstanding` (NUMERIC(12,2), default 0.00)
- `default_price_unit` (VARCHAR(20), default 'per_100')
- `preferred_discount_per_100` (NUMERIC(6,2), default 0.00)
- `is_active` (BOOLEAN, default True)
- `created_at` (TIMESTAMPTZ, default now())

### 1.8 `sales`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `customer_id` (UUID, FK -> customers.id, ON DELETE SET NULL, nullable)
- `invoice_number` (VARCHAR(50), NOT NULL)
- `sale_date` (DATE, NOT NULL)
- `sale_type` (VARCHAR(50), default 'eggs')
- `quantity_units` (NUMERIC(10,2), NOT NULL)
- `unit_name` (VARCHAR(50), NOT NULL)
- `total_eggs_equivalent` (INTEGER, default 0)
- `rate_per_unit` (NUMERIC(10,2), NOT NULL)
- `gross_amount` (NUMERIC(12,2), NOT NULL)
- `discount` (NUMERIC(10,2), default 0)
- `net_amount` (NUMERIC(12,2), NOT NULL)
- `paid_amount` (NUMERIC(12,2), default 0)
- `payment_status` (VARCHAR(20), default 'pending')
- `vehicle_number` (VARCHAR(50), nullable)
- `delivery_person` (VARCHAR(100), nullable)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, default now())

### 1.9 `payments`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `customer_id` (UUID, FK -> customers.id, ON DELETE CASCADE)
- `sale_id` (UUID, FK -> sales.id, ON DELETE SET NULL, nullable)
- `payment_date` (DATE, NOT NULL)
- `amount` (NUMERIC(12,2), NOT NULL)
- `payment_mode` (VARCHAR(50), NOT NULL)
- `reference_number` (VARCHAR(100), nullable)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, default now())

### 1.10 `market_rates`
- `id` (UUID, PK)
- `mandi_name` (VARCHAR(100), NOT NULL) -- Pune, Mumbai, Nashik, Nagpur, Namakkal
- `rate_date` (DATE, NOT NULL)
- `rate_per_100` (NUMERIC(8,2), NOT NULL)
- `rate_per_egg` (NUMERIC(6,2), NOT NULL)
- `trend` (VARCHAR(20), default 'steady')
- `source` (VARCHAR(100), default 'NECC / Direct Mandi Quotation')
- `created_at` (TIMESTAMPTZ, default now())
- *Constraint*: UNIQUE (`mandi_name`, `rate_date`)

### 1.11 `expense_categories` & `expenses`
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> farms.id, ON DELETE CASCADE)
- `flock_id` (UUID, FK -> flocks.id, ON DELETE SET NULL, nullable)
- `expense_date` (DATE, NOT NULL)
- `category_name` (VARCHAR(100), NOT NULL)
- `amount` (NUMERIC(12,2), NOT NULL)
- `payment_mode` (VARCHAR(50), default 'upi')
- `vendor_name` (VARCHAR(255), nullable)
- `description` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, default now())

### 1.12 `subscriptions` & `billing_invoices`
- `subscriptions`: `farm_id` (PK, FK), `plan_id` ('starter', 'grower', 'commercial'), `status` ('active', 'trial', 'past_due', 'canceled'), `billing_cycle`, `current_period_end`, `razorpay_subscription_id`
- `billing_invoices`: `id`, `farm_id`, `razorpay_payment_id`, `razorpay_order_id`, `amount_paise`, `currency`, `status`, `invoice_number`, `created_at`

### 1.13 `farm_members` & `farm_invitations`
- Multi-farm access control and employee invitation tokens.

### 1.14 `platform_admin_users`, `admin_audit_logs`, `platform_settings`
- Super-admin operations, immutable audit logs, platform configs.

### 1.15 `vaccination_tasks`, `alerts`, `ai_runs`
- Operational tasks, health notifications, and AI analysis run history.
