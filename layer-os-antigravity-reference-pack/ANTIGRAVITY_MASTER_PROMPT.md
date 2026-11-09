# LAYER OS — EXACT REFERENCE-MATCH FRONTEND REDESIGN
For Antigravity | Existing project | FRONTEND ONLY

LIVE APP: https://layer-os-orcin.vercel.app/

MANDATORY REFERENCE:
Use the attached file `layer-os-exact-ui-reference.png` as the visual source of truth. Reproduce the actual app screens shown inside the laptop and phone as closely as possible. Do not substitute another dashboard concept or generic admin template.

## CRITICAL SCOPE: DO NOT TOUCH BACKEND
This is strictly a frontend UI/UX redesign. Do not modify backend services, business logic, database schemas/collections/records/migrations, MongoDB connections, API endpoints/contracts/integrations, authentication, authorization, registration, farm enrollment, storage, calculations, AI integrations, permissions, or real farm data.

Do not rebuild the app from scratch. Do not replace working functionality with dummy implementations. Preserve existing routes, handlers, API calls, state, validation, data bindings, and module workflows. Change only frontend layout, styling, component composition, and responsive presentation. If a visual request would require backend/API/database changes, do not make those changes; report the limitation.

Before editing, inspect the existing repository, identify frontend components/routes and make a safe backup or Git checkpoint if available.

## EXACT VISUAL TARGET

### Desktop screen
- Full-height deep forest-green left sidebar.
- Layer OS logo/wordmark at sidebar top.
- Sidebar links: Dashboard (active), Farm Info, Help & Support, About.
- Small farm landscape illustration and short tagline near sidebar bottom.
- Main workspace in warm ivory/cream.
- Header: “Hello, Farm Owner!”, subtitle “Let’s manage your poultry farm efficiently.”, date control, profile avatar/menu.
- Wide hero banner beneath header with green poultry farm landscape, farm building, white hen and eggs. Headline: “Healthy Flock. Higher Profit.”
- Nine functional cards in a 3-column × 3-row grid.
- Slim agricultural landscape illustration strip along the bottom of the main workspace.
- Cards: rounded corners, subtle shadows, clear icon, title, subtitle, small right-side arrow affordance.

### Android screen
- Compact top bar with Layer OS brand, notification icon, profile avatar.
- Greeting and subtitle.
- Compact, art-directed crop/adaptation of the same poultry hero image.
- Date row.
- Nine cards in a two-column grid, same order as desktop.
- Settings & Team spans both columns at the bottom.
- Slim bottom landscape illustration.
- No horizontal scrolling, clipping, or tiny touch targets.

Do NOT build the laptop/phone device frames or the marketing feature strip below the devices; those are presentation framing, not app UI. Recreate only the screens inside the devices.

## EXACT NINE MODULES AND ORDER
1. Farm Entry — Add daily farm data
2. Sales Management — Eggs, Manure & Sales
3. Reports — View Farm Reports
4. Expense & Accounts — Track Expenses
5. Vaccine & Health — Keep Flock Healthy
6. AI 30-Day Forecast — Predict & Plan
7. Feed Management — Feed Records
8. Calculator & Tools — Useful Tools
9. Settings & Team — Manage Farm

Mandi Rates must not appear as a dashboard card or primary navigation destination. Do not delete backend records or code just to hide it.

There must be ONLY ONE Farm Entry card. Quick daily entry and detailed entry must remain inside the existing Farm Entry workspace. Never create separate “30-Second Entry” and “Detailed Entry” dashboard cards.

Every card must open its corresponding existing module and preserve its current functionality.

## COLOR TOKENS
Use these as starting values and visually tune them against the screenshot:

```css
:root {
  --layer-forest: #173F20;
  --layer-forest-deep: #12351B;
  --layer-forest-light: #28572B;
  --layer-olive: #718B35;
  --layer-cream: #FFF9ED;
  --layer-cream-deep: #F7EEDB;
  --layer-text: #211F18;
  --layer-text-muted: #625D50;
  --layer-sage-card: #E8F1C9;
  --layer-peach-card: #FBE5C2;
  --layer-lavender-card: #EADCF5;
  --layer-blue-card: #DCEBF2;
  --layer-border: rgba(71, 83, 43, 0.12);
  --layer-shadow: 0 3px 12px rgba(54, 55, 31, 0.10);
  --layer-radius-card: 20px;
}
```

Card color mapping:
- Farm Entry: pale sage green.
- Sales Management: warm peach.
- Reports: pale sage green.
- Expense & Accounts: warm peach.
- Vaccine & Health: pale sage green.
- AI 30-Day Forecast: soft lavender.
- Feed Management: pale blue.
- Calculator & Tools: warm peach.
- Settings & Team: pale sage green.

Use meaningful consistent icons (clipboard/check, cart, analytics chart, wallet, health/heart, AI/brain, feed bowl/grain, calculator, settings). Prefer the project's existing icon library; do not use emoji as production icons.

## RESPONSIVE REQUIREMENTS
Desktop: stable sidebar, fluid centered workspace, hero and grid aligned, three columns at wide sizes. Tablet: adapt to two columns and compact/collapsible navigation if needed.

Android: do not merely shrink desktop. Use a compact mobile header, two-column module grid, comfortable touch areas, readable wrapping labels, properly cropped hero art, Settings & Team full-width, and no horizontal overflow at widths 320, 360, 375, 390, 412, and 430 px. Test internal forms, tables, reports, and module screens on mobile too.

## INTERNAL MODULE SCREENS
Bring existing module pages into the same visual system: cream workspace, forest-green primary actions, readable headings, well-spaced form controls, mobile-friendly buttons/fields, clear hierarchy, accessible contrast and focus states. Do not remove existing fields, actions, calculations, tables, or workflows. Keep all handlers and API/data bindings.

## IMPLEMENTATION WORKFLOW
1. Inspect project framework, routes, components, and existing functionality.
2. Map each dashboard card to its current route/handler.
3. Identify files that control dashboard, sidebar, cards, hero, and module layouts.
4. Implement the new visual system in the existing architecture.
5. Reuse current brand assets where possible. If hero art is missing, add an optimized local, license-safe poultry-farm illustration matching the reference; do not rely on fragile remote image URLs.
6. Run build/lint/tests where available.
7. Test desktop and Android viewports.
8. Verify login, enrollment, navigation, forms, submissions, database reads/writes, reports, AI, and settings still work.

## ACCEPTANCE CHECKLIST
- Dashboard closely matches the supplied screenshot.
- Desktop: green sidebar, cream workspace, greeting/header, poultry hero, 3×3 cards.
- Android: compact header, greeting, adapted hero, date, 2-column cards, full-width Settings & Team, bottom landscape.
- Nine modules appear in the exact order and names above.
- Only one Farm Entry card.
- Mandi Rates absent from dashboard presentation.
- Existing module functionality and navigation still work.
- Backend, database, APIs, authentication, storage, and business logic untouched.
- No dummy data introduced.
- No horizontal overflow or clipped controls on Android.
- Existing build succeeds.

At completion, report the frontend files changed, confirm backend/database/API files were not changed, list tested features, and disclose any remaining visual differences.

FINAL DIRECTION: Match `layer-os-exact-ui-reference.png` as closely as possible. This is a frontend-only visual transformation of the existing working Layer OS product. Preserve everything behind the interface.
