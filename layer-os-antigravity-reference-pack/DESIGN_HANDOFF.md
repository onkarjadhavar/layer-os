# Layer OS — Design Handoff

## Exact visual source
`layer-os-exact-ui-reference.png` is the exact reference image supplied by the product owner. Attach it to Antigravity and tell it this is the source of truth.

## Build only the app screens inside the device mockups
Do not implement the laptop/phone frames or the marketing strip beneath the devices.

## Desktop
Forest-green left sidebar; cream workspace; greeting/date/profile header; poultry farm hero banner; 3×3 feature-card grid; bottom landscape strip.

## Android
Compact brand header; greeting; compact poultry hero; date row; two-column cards; Settings & Team full-width at bottom; bottom landscape strip.

## Card order
1 Farm Entry
2 Sales Management
3 Reports
4 Expense & Accounts
5 Vaccine & Health
6 AI 30-Day Forecast
7 Feed Management
8 Calculator & Tools
9 Settings & Team

Only one Farm Entry card. Quick and detailed entry remain within the same existing workspace. Hide Mandi Rates from dashboard presentation without deleting backend data or logic.

## Engineering boundary
Frontend presentation only. Do not modify backend, database, API contracts, authentication, storage, business logic, or existing real data.
