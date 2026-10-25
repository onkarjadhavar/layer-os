# LayerOS - Production Audit Report (Phase 0)

**Date**: 2026-10-16  
**Auditor**: Senior Full-Stack Engineer, Security Auditor & Product Architect  
**Repository**: [https://github.com/onkarjadhavar/layer-os](https://github.com/onkarjadhavar/layer-os)  
**Methodology**: Pure read-only inspection, command execution, and test suite execution. Every finding is labeled as **VERIFIED** (confirmed via code inspection, AST, grep, or command execution) or **ASSUMPTION**.

---

## Executive Summary

LayerOS currently presents an impressive, high-fidelity UI and a mathematically verified poultry calculation engine (`lib/calc/index.ts`). However, **underneath the surface, the application is currently a client-side prototype operating entirely on React state and `localStorage` seed data.**

- **Supabase**: Neither `@supabase/supabase-js` nor `@supabase/ssr` is installed. There is zero database connectivity in the runtime application code.
- **Migration 001**: Defines 20 tables (not 32 as claimed in README). **Row Level Security (RLS) is completely absent** (0 `ENABLE ROW LEVEL SECURITY` statements, 0 policies).
- **Authentication & Multi-Tenancy**: The current login is a client-side mock (`otp.length === 6` in `lib/store/index.tsx:255`). There are no user accounts, no session tokens, no cookies, no tenant isolation, and no server-side role enforcement.
- **AI Engine**: There are zero API calls to Google Gemini or any LLM. The AI advisor and chat assistant are pure client-side deterministic rule-based algorithms with hardcoded pattern matching.
- **PWA & Offline**: There is no Service Worker, no IndexedDB, and no offline sync queue. The manifest references non-existent PNG icons.
- **Calculations**: `lib/calc/index.ts` is fully implemented and passes all unit tests for the BV-300 Reference Day (HD% 91.02%, Operating Profit ₹19,920, True Cost ₹5.21). This is the strongest existing asset to preserve and build upon.

---

## Section A: Architecture Map

### 1. Routes and Pages
- **`app/page.tsx`** [VERIFIED - `app/page.tsx:1-290`]: The entire application is mounted on a single route: `/`. It is a client component (`'use client'`) that switches views via an in-memory state variable `currentTab: NavTab` ('home' | 'quick-log' | 'flocks' | 'sales' | 'expenses' | 'health' | 'market-rates' | 'forecast' | 'reports' | 'public-tools' | 'settings').
- **`app/layout.tsx`** [VERIFIED - `app/layout.tsx:1-68`]: Root layout importing Google Fonts (`Inter`, `Noto Sans Devanagari`), setting theme inline script, and wrapping `{children}` with `ThemeProvider`, `I18nProvider`, and `LayerOSProvider`.
- **API Routes**: **Zero** API routes exist in `app/api/` [VERIFIED - directory `app/api` does not exist].
- **Server Actions**: **Zero** server actions exist in the repository [VERIFIED - grep for `'use server'` yields 0 matches].

### 2. Data-Access Layer
- **Current Data Access**: Does not exist. All data mutations are handled by React state dispatchers in `lib/store/index.tsx` [VERIFIED - `lib/store/index.tsx:112-200`].
- **Database Client**: Neither `@supabase/supabase-js` nor any database driver is listed in `package.json` [VERIFIED - `package.json:12-34`].

### 3. State Storage
- **Primary Storage**: React Context (`LayerOSProvider`) in `lib/store/index.tsx`.
- **Persistence Mechanism**: Browser `localStorage` under key `layeros_app_state_v1` [VERIFIED - `lib/store/index.tsx:109`].
- **IndexedDB**: **Zero** usage in the entire codebase [VERIFIED - grep for `indexedDB` yields 0 matches].
- **Supabase Cloud / Postgres**: **Zero** connections made from code [VERIFIED - grep for `createClient` yields 0 matches].

### 4. Environment Variables
- **`.env.example`** [VERIFIED - `.env.example:1-23`]: Lists `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `GEMINI_API_KEY`, `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `AI_PROVIDER`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MSG91_AUTH_KEY`, `WHATSAPP_BUSINESS_API_TOKEN`.
- **Actual Code Usage**: `process.env` is **never referenced anywhere in application code** [VERIFIED - grep for `process.env` yields 0 matches].
- **Live Environment File**: No `.env` or `.env.local` exists in the repository.

---

## Section B: Frontend-to-Backend Wiring Audit

| Feature / UI Component | UI Present | Backend Connected | Data Persisted | Evidence & Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Phone Login / OTP** (`AuthModal.tsx`) | YES | NO (Mock) | NO | [VERIFIED - `AuthModal.tsx:35-47`, `lib/store/index.tsx:253-268`]: Any 6-digit OTP logs in as hardcoded user `usr-live-01`. No SMS gateway, no session token. |
| **Sandbox Demo Mode** (`AuthModal.tsx`) | YES | NO (Local) | Local Only | [VERIFIED - `lib/store/index.tsx:241-251`]: Sets state to `usr-owner-01` and `farm-sahyadri-01`. |
| **Role Switcher** (`TopBar.tsx`) | YES | NO (Client-side) | `localStorage` | [VERIFIED - `TopBar.tsx:104-121`, `lib/store/index.tsx:275-290`]: Client-side role toggle between owner, manager, supervisor, accountant, viewer. No server authorization. |
| **Onboarding Wizard** (`OnboardingModal.tsx`) | YES | NO (Mock) | Partial (`localStorage`) | [VERIFIED - `OnboardingModal.tsx:36-47`]: Farm name, district, capacity, flock details are local component state; only the final quick-log is sent to `addQuickLog`. |
| **30s Quick Entry** (`QuickEntryCard.tsx`) | YES | NO | `localStorage` | [VERIFIED - `QuickEntryCard.tsx:71-97`, `lib/store/index.tsx:313-383`]: Updates React state and serializes entire app state to `localStorage`. |
| **Full Daily Entry** (`FullEntryModal.tsx`) | YES | NO | `localStorage` | [VERIFIED - `FullEntryModal.tsx:101-125`]: Saves eggs, feed, mortality to `localStorage`. Medicine, vaccine, and climate inputs are discarded on save. |
| **12-Card KPI Grid** (`KPIGrid.tsx`) | YES | NO | N/A (Derived) | [VERIFIED - `KPIGrid.tsx:28-91`]: Computes live metrics from `todayRecord` and `customers` in memory. |
| **30-Day Trend Charts** (`TrendCharts.tsx`) | YES | NO | N/A (Derived) | [VERIFIED - `TrendCharts.tsx:25-39`]: Slices last 30 daily records from React state. |
| **Flock Details** (`FlocksModule.tsx`) | YES | NO | Read-only Seed | [VERIFIED - `FlocksModule.tsx:20-47`]: Displays `SEED_FLOCK`. No UI or mutation to create, edit, or close batches. |
| **Sales Invoicing** (`SalesModule.tsx`) | YES | NO | `localStorage` | [VERIFIED - `SalesModule.tsx:71-99`, `lib/store/index.tsx:399-420`]: Appends to `sales` array in memory and `localStorage`. No PDF generation library (print CSS only). |
| **Customer Credit / Udhari** (`SalesModule.tsx`) | YES | NO | `localStorage` | [VERIFIED - `SalesModule.tsx:40-42`, `lib/store/index.tsx:422-432`]: Updates customer outstanding in `localStorage`. |
| **Expenses & Overheads** (`ExpensesModule.tsx`) | YES | NO | Component State Only | [VERIFIED - `ExpensesModule.tsx:26-34`]: `expenses` list is component-local `useState`. Disappears on tab switch or page refresh. |
| **Loan & Overheads** (`ExpensesModule.tsx`) | YES | NO | Read-only Seed | [VERIFIED - `ExpensesModule.tsx:20`, `lib/store/index.tsx:188`]: Fixed seed loan (`SEED_LOAN`). |
| **Vaccination Schedule** (`HealthModule.tsx`) | YES | NO | `localStorage` | [VERIFIED - `HealthModule.tsx:19`, `lib/store/index.tsx:441-445`]: `toggleVaccinationStatus` toggles done/pending in `localStorage`. |
| **Medicine Inventory** (`HealthModule.tsx`) | YES (Static) | NO | Hardcoded UI | [VERIFIED - `HealthModule.tsx:24-29`]: Array of 4 hardcoded medicines in component file. |
| **Mandi Market Rates** (`MarketRatesModule.tsx`) | YES | NO | `localStorage` | [VERIFIED - `MarketRatesModule.tsx:79-89`, `lib/store/index.tsx:434-439`]: User can append manual rate; historical trend is a hardcoded array (`MarketRatesModule.tsx:68-77`). |
| **AI Daily Advisor** (`DailyAdvisorModal.tsx`) | YES | NO (Rule-based) | In-memory | [VERIFIED - `DailyAdvisorModal.tsx:30-37`, `lib/ai/index.ts:51-160`]: Client-side pure function math. No API call. |
| **Ask LayerOS Assistant** (`AskLayerOSModal.tsx`) | YES | NO (Pattern Match) | Component State | [VERIFIED - `AskLayerOSModal.tsx:53`, `lib/ai/index.ts:336-357`]: Substring matching on query keywords in browser. |
| **30-Day Forecast Engine** (`ForecastModule.tsx`) | YES | NO (Formula loop) | In-memory | [VERIFIED - `ForecastModule.tsx:54-59`, `lib/ai/index.ts:213-331`]: 30-day projection calculation running purely in browser JavaScript. |
| **Unit Settings** (`SettingsModule.tsx`) | YES | NO | `localStorage` | [VERIFIED - `SettingsModule.tsx:29-40`, `lib/store/index.tsx:292-307`]: Tray/gatta custom units saved to `localStorage`. |
| **Reports & CSV Export** (`ReportsModule.tsx`) | YES | NO | Client Blob | [VERIFIED - `ReportsModule.tsx:53-66`]: CSV generated as browser data blob. WhatsApp link uses `encodeURIComponent`. |
| **Climate & Automation** (`EnvironmentTile.tsx`) | YES | NO (Mock) | Component State | [VERIFIED - `EnvironmentTile.tsx:85-102`, `lib/store/index.tsx:193-200`]: Toggle buttons flip boolean in React state. |

---

## Section C: Database Architecture & Migration 001 Inspection

### 1. Supabase Connection Status
- **Connection Test**: The app does **not** connect to Supabase. There is no client initialization, no connection string, and no `@supabase/supabase-js` package installed.

### 2. Migration 001 (`supabase/migrations/001_init_schema.sql`) Validity
- **Table Count**: README claims 32 tables. Actual count in `001_init_schema.sql` is **20 tables** [VERIFIED - counted lines 1-323]:
  1. `farms`
  2. `users`
  3. `unit_settings`
  4. `sheds`
  5. `flocks`
  6. `breed_standards`
  7. `daily_records`
  8. `egg_stock_ledger`
  9. `feed_types`
  10. `customers`
  11. `sales`
  12. `payments`
  13. `market_rates`
  14. `expense_categories`
  15. `expenses`
  16. `loans`
  17. `employees`
  18. `vaccination_tasks`
  19. `ai_runs`
  20. `alerts`

### 3. Missing Elements, Integrity & Constraints
- **Row Level Security (RLS)**: Completely missing. Not a single `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` or `CREATE POLICY` exists in `001_init_schema.sql`.
- **Auth Linking**: The `users` table (`001_init_schema.sql:27-37`) defines `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`. It does **not** reference Supabase's `auth.users(id)`.
- **Multi-Tenancy Modeling**: `phone` is globally UNIQUE on `users` (`001_init_schema.sql:30`), preventing a user/employee from ever being invited to or working on a second farm.
- **Constraints**:
  - `daily_records`: Has `CONSTRAINT unique_flock_date UNIQUE (flock_id, record_date)` [VERIFIED - line 129]. However, there are **no check constraints** ensuring `opening_birds >= 0`, `mortality >= 0`, `feed_issued_kg >= 0`, `total_eggs_collected >= 0`.
  - `sales`: No constraint preventing negative quantity or negative price.
  - `flocks`: No check constraint ensuring `initial_chick_count > 0` or `placement_date <= CURRENT_DATE`.
- **Soft-Delete**: Zero tables implement soft deletion (`deleted_at TIMESTAMPTZ`).
- **Audit Columns**: `created_at` exists on most tables, but `updated_at` is missing on `customers`, `sales`, `payments`, `expenses`, `loans`, `employees`, `alerts`, `egg_stock_ledger`.
- **Updated_at Trigger**: No trigger or function (`moddatetime` or custom PL/pgSQL) is defined to automatically refresh `updated_at` on row updates.
- **Audit Log Table**: No audit trail table exists to record who modified critical daily records, back-dated figures, or edited sales.

---

## Section D: Multi-Tenancy Architecture

### 1. Tenant Modeling
- Every business table in `001_init_schema.sql` (except shared `breed_standards` and `market_rates`) includes a `farm_id UUID REFERENCES farms(id) ON DELETE CASCADE`.
- **However**, multi-tenancy is entirely unenforced:
  1. Without RLS enabled, any connected client can query any table without tenant isolation.
  2. The application layer currently hardcodes `farm_id: "farm-sahyadri-01"` in `lib/store/index.tsx:118`.
  3. No session-derived tenant context exists.

### 2. RLS Policies
- **Current State**: **0% implemented** [VERIFIED - 0 policies in `001_init_schema.sql`].
- **Security Implications**: If connected to Supabase using the standard anon key, every user would have read and write access to all rows across all farms.
- **Service-Role Key**: Currently listed in `.env.example`, but not used in client or server code.

### 3. Tenant Creation on Signup
- **Current State**: Non-existent. `OnboardingModal.tsx` collects farm information but discards it on completion [VERIFIED - `OnboardingModal.tsx:36-47`].
- **Atomic Signup**: There is no PostgreSQL stored procedure / RPC to create an organization, farm, owner user, default shed, initial flock, and default unit settings in a single transaction.

---

## Section E: Authentication & Authorization

### 1. Registration & Login
- **Current Implementation**: `AuthModal.tsx` simulates phone OTP. Entering any 6-digit number logs in successfully [VERIFIED - `lib/store/index.tsx:253-268`].
- **Password Support**: No email/password registration, password reset, or hashing implemented.
- **Phone Verification**: No SMS OTP provider (MSG91, Twilio, Firebase) is wired up.
- **Session Lifecycle**: No session tokens, no refresh tokens, no cookies (`httpOnly`, `secure`, `sameSite`). State is lost if `localStorage` is cleared.

### 2. Route Protection & Middleware
- **Next.js Middleware**: No `middleware.ts` exists in the repository [VERIFIED - `middleware.ts` does not exist].
- **Route Guarding**: All pages and actions are open. Role checking is purely cosmetic (e.g., hiding or ribboning tabs in `app/page.tsx:117-128`).
- **Employee Invites**: No invitation tokens, invite links, or role assignment workflows exist.

---

## Section F: AI Assistant & Gemini Integration

### 1. Gemini Connectivity
- **API Requests**: Zero HTTP or SDK requests reach `generativelanguage.googleapis.com` [VERIFIED - grep for `googleapis`, `gemini`, `GoogleGenerativeAI` yields 0 matches in `app`, `components`, `lib`].
- **Key Location**: `GEMINI_API_KEY` exists only as an empty string in `.env.example`.

### 2. AI Implementations in `lib/ai/index.ts`
- **`generateDailyAIAnalysis`** [VERIFIED - `lib/ai/index.ts:51-160`]: A deterministic function calculating a score out of 100 based on `today.hdPct`, `today.feedPerBirdG`, `today.mortality`, and `margin`. Returns static Marathi and English advice.
- **`generate30DaysForecast`** [VERIFIED - `lib/ai/index.ts:213-331`]: An iterative arithmetic loop projecting eggs, feed, revenue, and cash balance over 30 days based on delta modifiers.
- **`answerLayerOsQuery`** [VERIFIED - `lib/ai/index.ts:336-357`]: A simple JavaScript `String.prototype.includes` router looking for keywords (`अंडे`, `खर्च`, `उधारी`, `नफा`, `खुराक`) and returning canned strings with interpolated record values.

### 3. Privacy, Safety & Disclaimers
- No PII stripping pipeline exists because no external requests are dispatched.
- The UI contains veterinary and financial disclaimers (`DailyAdvisorModal.tsx:159`, `HealthModule.tsx:55`).
- The rule-based fallback is **not** currently flagged to the user as a fallback; it is presented as "AI".

---

## Section G: Poultry Features & Mathematical Validation

### 1. Validation of `lib/calc/index.ts` against Reference Day
We executed the Vitest test suite (`npm run test`) [VERIFIED - exit code 0]:
- **Input Parameters**:
  - Opening Birds: 30,000 | Mortality: 15 | Closing Birds: 29,985
  - Eggs Collected: 27,300 | Feed: 3,300 kg @ ₹35.00/kg
  - Egg Selling Price: ₹5.40/egg | Other Cash Expenses: ₹12,000
  - Daily Overheads: Labour ₹3,500, Power ₹1,200, Meds ₹1,500, Pullet Amortization ₹4,500, Shed Depreciation ₹1,500, EMI Interest ₹1,800, Mortality Loss ₹600. Total Overheads = ₹14,600.
- **Verified Outputs**:
  - Hen-Day % (HD%): **91.02%** (`calculateHDPercent`, line 40)
  - Feed per Bird: **110.05 g** (`calculateFeedPerBirdGrams`, line 54)
  - Egg Revenue: **₹1,47,420.00**
  - Feed Cost: **₹1,15,500.00**
  - Total Cash Expenses: **₹1,27,500.00**
  - Simple Operating Profit: **₹19,920.00**
  - Total True Cost: **₹1,42,100.00**
  - True Cost per Egg (Break-Even): **₹5.21**
  - True Profit: **₹5,320.00**
- **Conclusion**: The poultry mathematical formulas in `lib/calc/index.ts` are exact, robust, and correctly tested.

### 2. Feature Implementation Status Matrix
- **Daily Entry (Quick)**: Implemented on UI & `localStorage`. Needs DB wiring.
- **Daily Entry (Full)**: Implemented on UI; drops medicine, vaccination, and climate data on save. Needs schema and DB wiring.
- **Grading & Breakage**: Tracked in Full Entry UI (cracked, soft-shell, reject).
- **Flocks & Sheds**: UI displays single seed flock. Creating, editing, closing batches is missing.
- **Sales & Customer Udhari**: Comprehensive UI with aging buckets (0-7, 8-15, 16-30, 30+ days). Backed only by `localStorage`.
- **Expenses & Overheads**: UI tab exists, but items are stored in component-local state and lost on navigation.
- **Loans & EMI**: UI displays fixed loan details. No mutation or DB persistence.
- **Employees & Payroll**: UI displays seed employees. No attendance or salary disbursement tracking.
- **Vaccinations**: Tasks toggle in `localStorage`. No reminder notifications.
- **Mandi Rates**: Allows manual entry in `localStorage`. No scraping or automated API integration (which aligns with ground rules: manual-first per farm).
- **Reports**: Exports CSV via client blob; print preview for PDF. Real PDF generation is missing.

---

## Section H: Security Audit

### 1. Database & Multi-Tenancy Vulnerabilities
- **Missing RLS**: Complete lack of Row Level Security allows unauthorized data access once connected to Supabase.
- **IDOR**: All IDs (`customerId`, `saleId`, `farmId`) can be spoofed if passed in client requests without server-side ownership validation.

### 2. Input Validation
- **Current State**: Zero Zod or schema validation in the application [VERIFIED - grep for `zod` yields 0 matches]. All user input from textboxes is cast via `Number()` or accepted directly.

### 3. Application Security & Headers
- **CSRF**: Next.js Server Actions have built-in CSRF, but none are currently used.
- **Security Headers**: No custom headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`) configured in `next.config.ts`.
- **Secrets in Repository**: Verified that `.env` is in `.gitignore` [VERIFIED - `.gitignore:24`]. No live API keys or database connection strings are committed in git history.
- **CORS**: Not applicable yet as no API routes exist.

### 4. Dependency Vulnerabilities (`npm audit`)
- `npm audit` was executed [VERIFIED - exit code 1, 5 high-severity vulnerabilities]:
  - `braces` vulnerable to stack-exhaustion denial of service (`micromatch` -> `fast-glob` -> `@next/eslint-plugin-next` -> `eslint-config-next`).
  - This is in devDependencies and does not affect the production runtime bundle, but should be resolved.

---

## Section I: Offline & PWA

### 1. Service Worker & Manifest
- **Manifest** (`public/manifest.json`): Valid JSON, but specifies `/icon.png` (192x192) and `/icon-512.png` (512x512) which **do not exist** in `public/` [VERIFIED - only `icon.svg` exists].
- **Service Worker**: **Zero** service worker registration in `app/layout.tsx` or anywhere in the repo [VERIFIED - grep for `serviceWorker` yields 0 matches].
- **Offline Sync Queue**: No queue exists. If connectivity is lost, the app continues reading/writing to `localStorage` because it never communicates with a server in the first place.

---

## Section J: Internationalization (i18n)

### 1. Translation Architecture
- **Implementation**: Custom React context (`I18nProvider` in `lib/i18n/context.tsx`) reading from a typed dictionary (`lib/i18n/translations.ts`).
- **Languages**: Marathi (`mr`), English (`en`), Hindi (`hi`).
- **Devanagari Font**: Loaded in `app/layout.tsx:51-54` from Google Fonts (`Noto Sans Devanagari` and `Inter`).

### 2. Hardcoded Strings Audit
Despite having a 456-line dictionary, numerous UI strings are hardcoded in Marathi or English:
- `app/page.tsx:120`: `"👷 सुपरवायझर मोड: केवळ दैनंदिन नोंदी व कामकाजाचा ॲक्सेस उपलब्ध आहे."`
- `app/page.tsx:208`: `"LayerOS ला विचारा"`
- `app/page.tsx:216`: `"AI सल्लागार"`
- `components/layout/TopBar.tsx:66`: `• ०७ ऑक्टोबर २०२६` (hardcoded date!)
- `components/layout/TopBar.tsx:102`: `"भूमिका बदला (Switch Role)"`
- `components/dashboard/KPIGrid.tsx:63`: `"आजचा आर्थिक निर्णय (Daily Financial Status)"`
- `components/dashboard/KPIGrid.tsx:67`: `"तुम्ही आज सुरक्षित नफ्यात आहात!"`
- `components/dashboard/EnvironmentTile.tsx:16`: `"शेडचे वातावरण व ऑटोमेशन (Climate & Sensors)"`
- `components/reports/ReportsModule.tsx:29-46`: WhatsApp export message template is hardcoded Marathi.
- `components/auth/OnboardingModal.tsx`: Almost all step titles and labels are hardcoded Marathi.

### 3. Number, Date & Currency Formatting
- Currency is formatted with Indian grouping (`formatIndianCurrency` in `lib/calc/index.ts:284` correctly handles Lakh/Crore notation: `₹1,47,420`).
- Date formatting: Dates are currently hardcoded or using standard ISO strings (`YYYY-MM-DD`). Indian standard date formatting (`DD/MM/YYYY`) is not universally applied.
- Marathi/Devanagari digits option: Not yet implemented.

---

## Section K: Deployment Readiness & Code Quality

### 1. Build & Lint Execution
- **`npm run build`**: **PASSED** [VERIFIED - Next.js 16.4.0 Turbopack compiles successfully; generated static routes `/` and `/_not-found`].
- **`npm run lint`**: **FAILED** with 156 problems (25 errors, 131 warnings) [VERIFIED - exit code 1].
  - 25 React 19 errors: `react-hooks/set-state-in-effect` in `lib/store/index.tsx:209` and `lib/theme/context.tsx:24`.
  - Unused variables across multiple components.

### 2. Operational Infrastructure
- **Env Validation**: None. App starts without checking any environment variables.
- **Error Boundaries**: No `error.tsx` or `global-error.tsx` in `app/`.
- **Health Check**: No `/api/health` endpoint exists.
- **Monitoring / Sentry**: No logging or APM configured.

---

## Section L: Existing Test Suite Inventory

- **Total Test Files**: 1 (`lib/calc/calc.test.ts`) [VERIFIED]
- **Total Tests**: 3 tests (all passing):
  1. `accurately reproduces the Reference Day operational numbers` (verifies closing birds, HD%, feed/bird, mortality, revenues, costs, operating profit, true cost, true profit, break-even).
  2. `correctly handles egg unit conversions with custom farm settings` (verifies gatta, tray, carton conversions and rate conversions).
  3. `formats Indian currency and numbers with Lakh/Crore notation` (verifies positive, negative, and large amounts).
- **Missing Test Coverage**:
  - Zero component tests.
  - Zero store / state tests.
  - Zero integration tests.
  - Zero security / multi-tenant tests.
  - Zero API / auth tests.

---

## Status Checklist

| Area / Feature | Status | Evidence |
| :--- | :--- | :--- |
| **Poultry Calc Engine** | **DONE** | `lib/calc/index.ts`, `calc.test.ts` passes 3/3 tests covering all reference day formulas. |
| **UI Components & Aesthetics** | **DONE** | 25+ rich components across dashboard, entry, sales, expenses, health, reports, and settings. |
| **Database Schema (DDL)** | **PARTIALLY DONE** | `001_init_schema.sql` has 20 well-structured tables, but lacks RLS, constraints, triggers, and auth links. |
| **i18n Translation System** | **PARTIALLY DONE** | Context and 3-language dictionaries exist, but ~40% of UI strings are hardcoded in components. |
| **Database Connectivity** | **MISSING** | No `@supabase/supabase-js`, no data client, 0 queries to any database. |
| **Multi-Tenancy & Tenant Isolation** | **MISSING** | No RLS policies, hardcoded single farm ID in state, no tenant-scoped server actions. |
| **User Authentication & Auth Flow** | **MISSING** | Mock OTP (`123456`), no session management, no cookies, no password/phone verification. |
| **Gemini AI Integration** | **MISSING** | Zero external AI requests; uses client-side math and substring keyword matching. |
| **Offline Service Worker & Sync** | **MISSING** | No Service Worker, no IndexedDB, manifest missing actual icon files. |
| **SaaS Billing & Subscriptions** | **MISSING** | No Razorpay integration, no plan limits, no super-admin dashboard. |
| **Lint & Code Hygiene** | **BROKEN** | `npm run lint` fails with 25 errors and 131 warnings (`react-hooks/set-state-in-effect`). |
| **Multi-Tenant Security** | **NEEDS SECURITY AUDIT** | Complete lack of RLS, missing input validation (Zod), no server-side role enforcement. |

---

## Prioritised Fix List

### Immediate (Phase 1 Prerequisites):
1. **Lint & Code Hygiene Fix**: Fix `react-hooks/set-state-in-effect` in `lib/store/index.tsx` and `lib/theme/context.tsx` and unused variable warnings so `npm run lint` passes cleanly.
2. **Supabase Client & SDK Installation**: Install `@supabase/supabase-js` and `@supabase/ssr`, along with `zod` for mutation validation.
3. **Database Migration Overhaul (Migration 002)**:
   - Link `users.id` to `auth.users(id)`.
   - Enable RLS across all 20 tenant tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
   - Create multi-tenant helper functions: `get_active_farm_id()`, `has_role(farm_id, role)`.
   - Implement restrictive RLS policies for Owner, Manager, Supervisor, Accountant, Viewer.
   - Add CHECK constraints (non-negative counts, valid dates) and auto-updating `updated_at` triggers.
   - Create atomic signup RPC function (`create_farm_with_owner`).
4. **Environment Validation Module**: Implement Zod-based env check ensuring `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are mandatory in non-demo mode.
5. **Real Data Access Layer**: Create typed server actions / repositories replacing `localStorage` in the production path, while preserving a strictly isolated, mock-only demo sandbox.

### Secondary (Phases 2 & 3):
6. **Real Supabase Auth Flow**: Implement phone OTP and email/password authentication with secure session cookies.
7. **Complete Poultry Data Mutations**: Wire full entry (including medicines, vaccination, and environment data), sales, and expense logging directly to database tables.
8. **Real Server-Side AI Pipeline**: Implement a secure server action communicating with Google Gemini API using structured JSON schema output, falling back gracefully to `generateDailyAIAnalysis` with clear user transparency.
