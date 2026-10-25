# LayerOS Design System Specification (`DESIGN.md`)

## 1. Visual Identity & Art Direction

LayerOS is designed specifically for commercial layer poultry farm owners, managers, and supervisors across Western Maharashtra (Pune, Sangli, Satara, Solapur, Nashik).
The aesthetic reflects agricultural enterprise credibility: sturdy, utilitarian, high-contrast, and deeply authentic to regional Marathi egg trading.

### 1.1 Anti-Slop Hard Floor Enforcements
- **No generic AI tells**:
  - No centered 3-line headline with an eyebrow badge.
  - No random purple-to-blue gradients.
  - No cards nested inside cards without clear functional hierarchy.
  - No emoji as functional status icons; only curated Lucide icons.
  - No useless decorative status dots without explicit semantic labels.
- **Substance-First Layout**:
  - Real numbers: 30,000 birds, 27,300 eggs, 91.02% HD, ₹1,47,420 egg sales, ₹5.21 break-even price.
  - Tabular numerals (`font-variant-numeric: tabular-nums`) for all monetary values, percentages, and bird tallies.
  - Authentic Marathi terminology: मृत्यू (Mortality), अंडी उत्पादन (Egg Production), खुराक (Feed Intake), विक्री (Sales Challan), उधारी (Outstandings), नफा/तोटा (P&L), बंद दिवस (Daily Closing).

## 2. Design Tokens & Palette (`:root`)

```css
:root {
  /* Brand Core */
  --primary: #1F4D3A;        /* Deep Forest Green (Agricultural authority) */
  --primary-hover: #173A2C;
  --primary-light: #2D6B52;
  --primary-faint: #EAF3EF;

  /* Accent */
  --accent: #D9A441;         /* Egg-Yolk Gold (Commerce & Prosperity) */
  --accent-hover: #C69234;
  --accent-faint: #FCF6E9;

  /* Surfaces & Canvas */
  --bg-main: #FAF8F3;        /* Warm Ivory (anti-glare for outdoor sunlight) */
  --surface: #FFFFFF;
  --surface-card: #FFFFFF;
  --border: #E7E2D6;
  --border-light: #F0EDE5;

  /* Typography Colors */
  --text-ink: #0B1E15;       /* High-contrast ink green-black */
  --text-muted: #2D4538;     /* Secondary metadata */
  --text-subtle: #4D6558;

  /* Semantic Statuses */
  --success: #2E7D5B;        /* High Laying HD% / Healthy */
  --success-bg: #E8F5EE;
  --warning: #D98E04;        /* Feed intake deviation / Credit warning */
  --warning-bg: #FEF7E8;
  --danger: #B3382C;         /* Spiking mortality / Negative cashflow */
  --danger-bg: #FBEBEA;
  --info: #2F6F9F;
  --info-bg: #EBF4FA;

  /* Elevation Shadows */
  --shadow-soft: 0 4px 20px -2px rgba(27, 42, 36, 0.06);
  --shadow-card: 0 8px 30px -4px rgba(27, 42, 36, 0.08);
}

.dark {
  --primary: #2D6B52;
  --primary-hover: #3B8668;
  --primary-light: #4A9C7B;
  --primary-faint: #182B22;

  --accent: #E5B252;
  --accent-hover: #D9A441;
  --accent-faint: #2E2413;

  --bg-main: #0F1A15;
  --surface: #16241D;
  --surface-card: #1B2D24;
  --border: #263B30;
  --border-light: #1F3027;

  --text-ink: #FFFFFF;
  --text-muted: #CBDCD4;
  --text-subtle: #95ACA0;

  --success: #3BA378;
  --success-bg: #142D21;
  --warning: #E8A11C;
  --warning-bg: #302307;
  --danger: #D2473B;
  --danger-bg: #311311;
  --info: #468CBF;
  --info-bg: #122838;

  --shadow-soft: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
  --shadow-card: 0 8px 30px -4px rgba(0, 0, 0, 0.5);
}
```

## 3. Typography Hierarchy

- **Primary Western**: Inter (Clean, geometric, highly legible in compact tables).
- **Regional Devanagari**: Noto Sans Devanagari (Native Marathi rendering with full conjuncts and diacritics).
- **Scale**:
  - `Display / KPI Number`: 32px - 40px, bold (700/800), tabular numerals.
  - `H1 Page Title`: 24px - 28px, bold (700).
  - `H2 Section Header`: 18px - 20px, semibold (600).
  - `Body / Form Label`: 14px - 15px, medium (500).
  - `Helper / Microcopy`: 12px - 13px, regular (400).

## 4. Mobile Ergonomics & Responsive Breakpoints

1. **Mobile Viewport (< 600px)**:
   - Primary operational environment for shed supervisors.
   - Fixed bottom navigation bar (`MobileTabBar`) with safe-area padding (`pb-safe`).
   - Touch targets strictly enforced at **>= 48px** for easy tapping with wet/gloved hands.
   - Prominent Floating Action Button (FAB) for "30s Quick Log" (`QuickLogFAB`).
2. **Tablet Viewport (600px - 1024px)**:
   - 2-column KPI grid and dual-pane modal views.
3. **Desktop Viewport (1024px - 1440px+)**:
   - Collapsible left sidebar navigation (`Sidebar`).
   - Multi-column dashboard with live Recharts trend analytics, mandi comparison tables, and customer credit ledger.

## 5. Micro-Interactions & Accessibility
- **`:focus-visible`**: High-contrast outline `2px solid var(--accent)` with `2px` offset on all interactive buttons and inputs.
- **Instant Feedbacks**: Haptic/confetti burst on successful daily closing (`canvas-confetti`).
- **Zero-Layout Shift**: Skeleton loaders on initial data queries.
