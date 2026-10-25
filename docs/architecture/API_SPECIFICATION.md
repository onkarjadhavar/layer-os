# LayerOS REST API Specification (FastAPI v1)

All endpoints are prefixed with `/api/v1/`. OpenAPI documentation is generated automatically at `/docs` and `/openapi.json`.

## 1. System & Health Endpoints
- `GET /api/v1/health`
  - Response: `{ status: "ok", service: "LayerOS Poultry ERP", version: "1.0.0", database: "postgresql_live", checks: { ... } }`
- `GET /api/v1/ready`
  - Response: `{ ready: true }`

## 2. Authentication & Memberships (`/api/v1/auth`)
- `POST /api/v1/auth/login`
  - Body: `{ phone: string, password?: string, otp?: string }`
  - Response: `{ access_token: string, token_type: "bearer", user: UserResponse }`
- `POST /api/v1/auth/register-owner`
  - Body: `{ farm_name, owner_name, phone, password, district, capacity, breed, initial_birds, age_weeks }`
  - Response: `{ farm_id: string, user_id: string, access_token: string }`
- `GET /api/v1/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: `UserResponse` with active farm and permissions.
- `POST /api/v1/auth/invites`
  - Body: `{ farm_id: string, phone: string, role: string, email?: string }`
- `POST /api/v1/auth/accept-invite`
  - Body: `{ token: string }`

## 3. Farm & Flock Management (`/api/v1/farms`, `/api/v1/flocks`)
- `GET /api/v1/farms/my` - List all farms for authenticated user
- `POST /api/v1/farms/enroll` - Full 8-step farm enrollment wizard submission
- `GET /api/v1/farms/{farm_id}` - Get farm profile and unit settings
- `PUT /api/v1/farms/{farm_id}/unit-settings` - Update regional unit conversions
- `GET /api/v1/farms/{farm_id}/sheds` - List sheds
- `POST /api/v1/farms/{farm_id}/sheds` - Create shed
- `GET /api/v1/farms/{farm_id}/flocks` - List active flocks
- `POST /api/v1/farms/{farm_id}/flocks` - Add new flock batch
- `PATCH /api/v1/flocks/{flock_id}/phase` - Update flock phase

## 4. Daily Poultry Records & Calculations (`/api/v1/records`)
- `POST /api/v1/records/quick`
  - Body: `{ farm_id, flock_id, record_date, eggs_collected, feed_kg, mortality, selling_rate? }`
  - Computes: HD%, feed_per_bird_g, simple_operating_profit, true_profit, break_even_price.
  - Response: Created/Updated `DailyRecordResponse`
- `POST /api/v1/records/full`
  - Body: Full daily log including morning/evening collection, broken/cracked, rejects, water intake.
- `GET /api/v1/records?farm_id=...&flock_id=...&days=90`
  - Returns historical daily records for 30-day/90-day trend charts.

## 5. Sales & Customers (`/api/v1/sales`, `/api/v1/customers`)
- `GET /api/v1/customers?farm_id=...` - List customers with balances & credit limits
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/sales?farm_id=...` - List sales challans
- `POST /api/v1/sales` - Record egg or byproduct sale
- `POST /api/v1/payments` - Record customer payment received

## 6. Mandi Market Rates (`/api/v1/market-rates`)
- `GET /api/v1/market-rates/latest` - Latest rates across Pune, Mumbai, Nashik, Nagpur, Namakkal
- `POST /api/v1/market-rates` - Record daily mandi rate

## 7. AI Advisory & Chat (`/api/v1/ai`)
- `POST /api/v1/ai/advisor`
  - Body: `{ farm_id, flock_id, query, language: 'mr'|'en'|'hi' }`
  - Evaluates current flock metrics against BV-300 standard and delivers top 3 actions, feed requirements, and risks.
  - Uses Google Gemini API when configured, with FreeLLMAPI / rule-based fallback.

## 8. Platform Admin Console (`/api/v1/admin`)
- `POST /api/v1/admin/login` - Authenticate platform supervisor
- `GET /api/v1/admin/kpis` - Platform wide metrics (total farms, active birds, ARR)
- `GET /api/v1/admin/farms` - List all farms across Maharashtra with status filters
- `PATCH /api/v1/admin/farms/{farm_id}/status` - Approve, suspend, or reject farm
- `GET /api/v1/admin/audit-logs` - View immutable audit trail
- `GET /api/v1/admin/settings` & `PUT /api/v1/admin/settings` - Platform settings

## 9. Billing & Webhooks (`/api/v1/billing`)
- `POST /api/v1/billing/create-order` - Create Razorpay order
- `POST /api/v1/billing/verify-payment` - Verify payment signature
- `POST /api/v1/webhooks/razorpay` - Handle Razorpay subscription & payment events
