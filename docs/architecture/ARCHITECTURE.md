# LayerOS Target System Architecture

## 1. Overview & High-Level Topology

LayerOS is an AI-powered Layer Poultry & Egg Business Management Web Application designed for commercial layer farm owners in Maharashtra, India.
The refactored architecture decouples the presentation tier from the business and data tier into two independently deployable services:

```text
┌────────────────────────────────────────────────────────┐
│               Frontend: React.js + TypeScript          │
│        (Vite 8, Tailwind CSS v4, Lucide Icons, Recharts)│
│                                                        │
│  - Routes: / (Home/Dashboard/Landing), /login, /enroll,│
│            /admin (Platform Supervision Console)       │
│  - Regional i18n: Marathi (mr), English (en), Hindi   │
│  - Client State: LayerOSProvider + LocalStorage Sandbox │
│  - API Client: Centralized Axios/Fetch with JWT Bearer │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON)
                            │ Bearer Authorization
                            ▼
┌────────────────────────────────────────────────────────┐
│             Backend: Python 3.11+ / FastAPI            │
│         (Uvicorn ASGI, Pydantic v2, CORS Middleware)   │
│                                                        │
│  - /api/v1/health       - Health check & readiness     │
│  - /api/v1/auth         - JWT login, registration, me  │
│  - /api/v1/farms        - Farm onboarding & membership │
│  - /api/v1/flocks       - Flocks, sheds & life phases  │
│  - /api/v1/records      - 30s Quick log, full ledger   │
│  - /api/v1/sales        - Egg sales, customers, challan│
│  - /api/v1/market-rates - 5 Maharashtra mandis rates   │
│  - /api/v1/ai           - Daily advisory (Gemini/Free) │
│  - /api/v1/admin        - Platform supervision & audits│
│  - /api/v1/billing      - Razorpay webhook & plans     │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy 2.x ORM
                            │ Psycopg 3 Driver
                            ▼
┌────────────────────────────────────────────────────────┐
│               Database: PostgreSQL 17                  │
│               (Alembic Migrations)                     │
│                                                        │
│  - 24 Relational Tables: farms, users, unit_settings,  │
│    sheds, flocks, daily_records, customers, sales,     │
│    payments, market_rates, expenses, loans, alerts,    │
│    subscriptions, billing_invoices, audit_logs, etc.   │
└────────────────────────────────────────────────────────┘
```

## 2. Component Responsibilities

### 2.1 React Frontend
- **Rendering & Presentation**: Mobile-first responsive UI with minimum 48px touch targets for farm workers.
- **Client-Side Routing**: Handled via React Router (`/`, `/login`, `/enroll`, `/admin`, `/admin/login`).
- **State Management**: React Context (`LayerOSProvider`) with dual-mode operation:
  - **Demo Sandbox Mode**: Zero-network offline mode with 90-day simulated history for *Sahyadri Layer Farm*.
  - **Live Database Mode**: Communicates with the FastAPI backend via centralized `api-client.ts`.
- **i18n & Localization**: Marathi-first interface with full English and Hindi coverage.
- **Security Boundary**: Zero database URLs or server secrets exposed; standard JWT access token stored securely.

### 2.2 FastAPI Backend
- **Input Validation**: Pydantic v2 models validating all incoming payloads (e.g., negative eggs, excessive mortality, rate bounds).
- **Core Business Logic**: 
  - Standard poultry calculations (Hen-Day HD%, Feed per bird g, True Profit with pullet amortisation & depreciation, Break-Even egg price).
  - Multi-tenant tenant boundary checks and role-based access control (RBAC).
  - Platform administrator lifecycle state management (`pending_approval`, `active`, `suspended`, `rejected`).
- **Data Persistence**: SQLAlchemy 2.x ORM with connection pooling, automatic session lifecycle management, and clean transaction rollbacks.
- **AI Service Gateway**: Provider-agnostic advisory engine with Gemini API support, FreeLLMAPI failover, and rule-based poultry expert heuristics fallback.

### 2.3 PostgreSQL Database
- **Relational Integrity**: Strict foreign keys, compound unique constraints (`(flock_id, record_date)`, `(mandi_name, rate_date)`), and optimized B-tree indexes.
- **Migrations**: Fully versioned schema migrations managed via Alembic.
