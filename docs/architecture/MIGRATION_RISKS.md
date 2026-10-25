# LayerOS Migration Risk Assessment & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Mathematical Precision Discrepancies** | High | Low | The poultry calculation engine (`lib/calc`) must remain byte-for-byte consistent. We mirror the BV-300 unit tests in both Python Pytest and TypeScript Vitest to verify identical HD%, Feed Intake, and Break-Even calculations. |
| **Data Loss During Migration** | Critical | Negligible | Pure read-only migration from legacy files. Baseline Git commit created. No existing databases are dropped or overwritten. Local PostgreSQL database `layer_os` is created cleanly. |
| **Marathi / Multilingual i18n Regressions** | High | Low | The 109KB translation file (`translations.ts`) is ported directly into the React frontend. Font configurations (`Noto Sans Devanagari` + `Inter`) are preserved. |
| **Secret Exposure in Client Bundles** | High | Low | Vite env variables are strictly audited. Only `VITE_API_BASE_URL` is exposed to the browser. All database URLs, JWT signing secrets, and Razorpay API secrets remain exclusively in `backend/.env`. |
| **CORS / Preflight Issues** | Medium | Medium | FastAPI backend implements `CORSMiddleware` configured to allow `http://localhost:5173`, `http://localhost:3000`, and configurable production domains with credential support. |
| **Offline Sandbox Breakage** | Medium | Low | The React frontend retains `LayerOSProvider`'s local state fallback so demo mode and offline operations function without an active database connection. |
