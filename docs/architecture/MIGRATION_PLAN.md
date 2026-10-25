# LayerOS Step-by-Step Migration Plan

## 1. Migration Strategy: Parallel Isolation & Zero-Downtime

To guarantee no loss of functionality or visual regression, the refactoring follows an incremental parallel-path strategy:
1. **Preserve Legacy Source**: The existing codebase remains untouched and fully testable (`npm test` passes 79 tests).
2. **Build Backend First**: Establish the Python FastAPI application, SQLAlchemy models, Alembic migrations, and verify against a live PostgreSQL 17 database (`layer_os`).
3. **Build Frontend**: Construct the standalone Vite + React application in `frontend/`, porting over all UI components, hooks, styles, assets, and i18n dictionaries.
4. **Wire Centralized API**: Connect frontend services to FastAPI endpoints using OpenAPI contracts and JWT Bearer authentication.
5. **End-to-End Verification**: Verify both unit test suites (Vitest frontend + Pytest backend) and manual end-to-end user journeys (Quick Log, Onboarding, Admin Console, AI Advisor).

## 2. Detailed Task Breakdown

### Phase 1: Database & Backend Architecture
- **Task 1.1**: Set up Python virtual environment (`backend/.venv`), dependencies (`fastapi`, `uvicorn`, `sqlalchemy>=2.0`, `alembic`, `psycopg[binary]`, `pydantic>=2.0`, `python-jose`, `passlib`, `pytest`, `httpx`).
- **Task 1.2**: Initialize Alembic migration environment and configure SQLAlchemy engine with connection pool settings.
- **Task 1.3**: Map all 24 database entities from `supabase/migrations/` to clean SQLAlchemy declarative models.
- **Task 1.4**: Generate initial Alembic migration version and apply to local PostgreSQL 17 (`localhost:5432/layer_os`).
- **Task 1.5**: Implement Pydantic validation schemas matching the frontend DAL schemas.
- **Task 1.6**: Implement FastAPI routers and services for Auth, Farms, Flocks, Daily Records, Sales, Market Rates, AI Advisor, Platform Admin, and Billing.
- **Task 1.7**: Write comprehensive backend tests with Pytest verifying reference poultry math, authentication, and CRUD endpoints.

### Phase 2: Frontend Migration (React + Vite + TypeScript)
- **Task 2.1**: Initialize `frontend/` package structure with Vite, React 19, TypeScript, Tailwind CSS v4, Lucide icons, and Recharts.
- **Task 2.2**: Copy public assets (`manifest.json`, `sw.js`, icons, robots.txt) and styles (`index.css` with CSS tokens and Google Fonts).
- **Task 2.3**: Set up React Router for client-side navigation (`/`, `/login`, `/enroll`, `/admin`, `/admin/login`).
- **Task 2.4**: Migrate all domain modules (`components/dashboard/`, `entry/`, `sales/`, `flocks/`, `expenses/`, `health/`, `market/`, `reports/`, `settings/`, `tools/`, `landing/`, `enroll/`, `admin/`, `ai/`).
- **Task 2.5**: Replace Next.js server actions and Supabase client calls with centralized API service calls (`frontend/src/services/`).
- **Task 2.6**: Verify Demo Sandbox mode and offline sync queue continue to function smoothly without database dependency.
- **Task 2.7**: Run Vitest in `frontend/` and verify production build.

### Phase 3: Integration, Docker & Verification
- **Task 3.1**: Create `docker-compose.yml` for PostgreSQL 17 containerized execution.
- **Task 3.2**: Provide independent start scripts for frontend (`npm run dev`) and backend (`uvicorn app.main:app`).
- **Task 3.3**: Validate full request cycle: UI -> API Client -> FastAPI -> PostgreSQL -> Response.
