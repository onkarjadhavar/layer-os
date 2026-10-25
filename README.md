# LayerOS 🥚
### AI-Powered Layer Poultry & Egg Business Management System (Maharashtra, India)

[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vite.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?style=flat)](https://www.sqlalchemy.org/)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-red?style=flat)](https://alembic.sqlalchemy.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-Passing-brightgreen?style=flat&logo=pytest)](https://docs.pytest.org/)
[![Language](https://img.shields.io/badge/Language-Marathi%20%7C%20English%20%7C%20Hindi-gold)](#)

> **"Every egg counted. Profit maximised."**  
> LayerOS is an enterprise-grade, mobile-first layer poultry ERP designed specifically for commercial layer farm owners (~30,000+ birds) in Maharashtra, India. It enables farm supervisors to log daily production in **30 seconds** (Quick Mode) or **2 minutes** (Full Mode), and delivers AI-driven daily advice, multi-unit egg trade conversion, and 30-day profit/loss forecasting.

---

## 1. System Architecture

LayerOS is decoupled into an independent frontend, an independent backend, and a PostgreSQL database:

```text
layer-os/
├── frontend/                 # Standalone React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── app/              # Core app bootstrapping
│   │   ├── components/       # Preserved Marathi-first UI components
│   │   ├── lib/              # Calculation engine, i18n, store, themes
│   │   ├── pages/            # Home, Login, Enroll, Admin, AdminLogin
│   │   ├── routes/           # React Router 7 client routing
│   │   └── services/         # Centralized API clients (/api/v1)
│   ├── public/               # Manifest, PWA icons, assets
│   ├── vite.config.ts        # Vite build configuration
│   └── package.json
│
├── backend/                  # Standalone Python + FastAPI application
│   ├── app/
│   │   ├── api/v1/           # REST endpoints (/auth, /farms, /records, /sales, /market-rates, /ai, /admin, /billing)
│   │   ├── core/             # Config, JWT auth, BV-300 calculation engine
│   │   ├── db/               # PostgreSQL engine & session manager
│   │   ├── models/           # 24 SQLAlchemy 2.x relational models
│   │   └── schemas/          # Pydantic v2 validation models
│   ├── migrations/           # Alembic database migrations
│   ├── tests/                # Pytest unit & integration test suite
│   ├── requirements.txt      # Python dependencies
│   └── pyproject.toml
│
├── docs/architecture/        # Architecture & migration documentation
│   ├── ARCHITECTURE.md
│   ├── MIGRATION_PLAN.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_SPECIFICATION.md
│   └── MIGRATION_RISKS.md
│
├── docker-compose.yml        # PostgreSQL 17 + Backend + Frontend orchestration
└── README.md
```

---

## 2. Reference Day Benchmark (Unit-Tested Fixture)

Both the Python backend engine (`backend/app/core/calc.py`) and TypeScript frontend engine (`frontend/src/lib/calc`) are strictly verified against the standard BV-300 reference day benchmark:

| Metric | Reference Value | Mathematical Formula |
| :--- | :--- | :--- |
| **Active Live Birds** | **30,000 birds** | Opening (30,000) − Mortality (15) = 29,985 |
| **Eggs Collected** | **27,300 eggs** | Morning (17,200) + Evening (10,100) |
| **Hen-Day (HD%)** | **91.0%** | $\frac{\text{Eggs Collected}}{\text{Average Live Birds}} \times 100 = 91.02\%$ |
| **Feed Used** | **3,300 kg** | 66 bags × 50 kg |
| **Feed Intake** | **110 g / bird** | $\frac{3,300\text{ kg} \times 1000}{29,985\text{ birds}} = 110.05\text{ g}$ |
| **Mortality** | **15 birds (0.05%)** | $\frac{15}{30,000} \times 100 = 0.05\%$ |
| **Egg Sales** | **₹1,47,420** | 27,300 eggs × ₹5.40/egg (= ₹540/100 eggs) |
| **Feed Cost** | **₹1,15,500** | 3,300 kg × ₹35.00/kg |
| **Other Cash Expenses** | **₹12,000** | Labour, medicine, diesel, electricity |
| **Simple Operating Profit** | **₹19,920** | ₹1,47,420 − ₹1,15,500 − ₹12,000 |
| **Operating Cost per Egg** | **₹4.67** | $\frac{₹1,15,500 + ₹12,000}{27,300\text{ eggs}} \approx ₹4.67$ |
| **Allocated Overheads** | **₹14,600** | Pullet amortisation, shed depreciation, loan EMI interest, salaries |
| **True Profit (After Overheads)** | **₹5,320** | Simple Profit (₹19,920) − Overheads (₹14,600) |
| **Break-Even Egg Price** | **₹5.21 / egg** | ₹521 per 100 eggs |

---

## 3. Getting Started

### Prerequisites

- **Node.js**: v20 or v22
- **Python**: v3.11+
- **PostgreSQL**: v17 (local service or Docker)

---

### Option A: Local Development (Fastest)

#### 1. Start PostgreSQL
Ensure PostgreSQL is running locally on port `5432` with a database named `layer_os`:
```bash
# If using psql
psql -U postgres -c "CREATE DATABASE layer_os;"
```

#### 2. Setup & Run Python FastAPI Backend
```bash
cd backend
python -m venv .venv

# Windows Powershell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

#### 3. Setup & Run React Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will be available at: [http://localhost:5173](http://localhost:5173).

---

### Option B: Docker Compose (Full Stack)

To run the complete system in isolated containers:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 4. Running Automated Tests

### Frontend Vitest Suite (76 Unit Tests)
```bash
npm run test:frontend
# or
cd frontend && npm test
```

### Backend Pytest Suite (10 Integration & Unit Tests)
```bash
npm run test:backend
# or
cd backend && .\.venv\Scripts\pytest
```

### Run All Tests Across Entire Project
```bash
npm run test:all
```

---

## 5. Security & Multi-Tenancy

- **Password Hashing**: Native `bcrypt` with salt rounds = 12.
- **Tokens**: Stateless JWT Bearer tokens with configurable expiration.
- **Tenant Isolation**: Every database table enforces `farm_id` scoping; access to another tenant's records is strictly rejected with HTTP 403 / 404.
- **Audit Logging**: Platform administrative actions (approvals, suspensions, plan extensions, DPDP support views) are written to an append-only audit trail with IP address and user-agent metadata.
- **No Client Secrets**: Database credentials and JWT signing keys are stored exclusively in backend `.env` and are never exposed to browser bundles.
