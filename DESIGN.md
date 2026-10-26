# LayerOS Design System Specification (`DESIGN.md`)

## 1. Visual Theme & Atmosphere
- **Philosophy**: Premium Indian agricultural SaaS combining modern enterprise precision with subtle natural warmth.
- **Identity**: Built for commercial poultry farm owners, supervisors, and accountants across Maharashtra (Pune, Sangli, Satara, Solapur, Nashik).
- **Tone**: Trustworthy, operationally sharp, financially transparent, authentic, and calm.
- **Atmosphere Keywords**: Earthy forest greens, serene sage fields, warm cream surfaces, walnut wood anchors, restrained amber highlights.
- **Visual Ratio**: 60% neutral surfaces (warm cream & pure white), 30% brand structure (forest green & sage), 10% purposeful accents (amber glow & walnut brown).

---

## 2. Color Palette & Roles (`:root`)

```css
:root {
  /* Anchor Brand Colors */
  --color-forest: #194B38;          /* Primary brand color, primary actions */
  --color-forest-rgb: 25, 75, 56;
  --color-forest-deep: #103528;     /* Dark navigation, deep brand surfaces */
  --color-forest-deep-rgb: 16, 53, 40;
  --color-sage: #87A96B;            /* Secondary accent, selected states, badges */
  --color-sage-rgb: 135, 169, 107;
  --color-sage-pale: #E8EFE2;       /* Soft green tint surfaces, tags */
  --color-sage-pale-rgb: 232, 239, 226;

  /* Earth & Accent Anchors */
  --color-walnut: #5A3E2B;          /* Earthy secondary typography, borders, subtle accents */
  --color-walnut-rgb: 90, 62, 43;
  --color-amber: #D5811F;           /* High-priority actions, focus rings, key highlights */
  --color-amber-rgb: 213, 129, 31;
  --color-amber-soft: #F6E5C9;      /* Warm highlight containers */
  --color-amber-soft-rgb: 246, 229, 201;

  /* Neutral Surfaces & Canvas */
  --color-background: #F8F6F0;      /* Primary warm cream application background */
  --color-background-rgb: 248, 246, 240;
  --color-surface: #FFFFFF;         /* Cards, forms, sheets, elevated content */
  --color-surface-rgb: 255, 255, 255;
  --color-surface-subtle: #F3EFE6;  /* Secondary card backings, table headers */
  --color-surface-subtle-rgb: 243, 239, 230;

  /* Typography Colors */
  --color-text-main: #17251D;       /* Dark ink - high contrast text */
  --color-text-main-rgb: 23, 37, 29;
  --color-text-muted: #657269;      /* Secondary text, metadata, hints */
  --color-text-muted-rgb: 101, 114, 105;
  --color-text-on-dark: #FFFFFF;

  /* Borders & Dividers */
  --color-border: #E5E0D5;          /* Subtle warm borders */
  --color-border-rgb: 229, 224, 213;
  --color-border-strong: #CFC7B7;

  /* Semantic Feedback */
  --color-success: #287A52;         /* Healthy production, positive margins */
  --color-success-bg: #EAF4EE;
  --color-warning: #A86412;         /* Feed intake warnings, tight margins */
  --color-warning-bg: #FDF4E7;
  --color-error: #B42318;           /* High mortality, losses, critical alerts */
  --color-error-bg: #FDF1F0;
  --color-info: #2865A6;            /* Informational states, tips */
  --color-info-bg: #EFF5FB;

  /* Shadows & Depth */
  --shadow-sm: 0 1px 2px 0 rgba(23, 37, 29, 0.04);
  --shadow-md: 0 4px 16px -2px rgba(23, 37, 29, 0.06);
  --shadow-lg: 0 12px 32px -4px rgba(23, 37, 29, 0.08);
  --shadow-modal: 0 20px 48px -8px rgba(16, 53, 40, 0.22);
}

.dark {
  --color-forest: #2A6E53;
  --color-forest-deep: #0B1610;
  --color-sage: #93B880;
  --color-sage-pale: #1A3024;

  --color-walnut: #A68065;
  --color-amber: #F0A83B;
  --color-amber-soft: #2A1E0D;

  --color-background: #0B130E;
  --color-surface: #132219;
  --color-surface-subtle: #0E1A13;

  --color-text-main: #F2F7F4;
  --color-text-muted: #9EB3A6;
  --color-text-on-dark: #FFFFFF;

  --color-border: #223B2C;
  --color-border-strong: #2E503C;

  --color-success: #38B27A;
  --color-success-bg: #102B1D;
  --color-warning: #E69936;
  --color-warning-bg: #2B1D0B;
  --color-error: #EF5350;
  --color-error-bg: #2E1413;
  --color-info: #4DA2E0;
  --color-info-bg: #122838;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.45);
  --shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.7);
  --shadow-modal: 0 20px 48px -8px rgba(0, 0, 0, 0.85);
}
```

---

## 3. Typography Rules

- **Latin Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Devanagari Font**: `Noto Sans Devanagari`, `Mukta`, `sans-serif`
- **Font Stack Definition**:
  ```css
  font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ```
- **Type Scale**:
  - `Display / Hero H1`: 36px–48px (desktop), 28px–32px (mobile). Line-height: 1.15. Weight: 800.
  - `Page Title / H1`: 24px–28px. Line-height: 1.25. Weight: 700.
  - `Section Title / H2`: 20px–22px. Line-height: 1.3. Weight: 700.
  - `Card Header / H3`: 16px–18px. Line-height: 1.35. Weight: 600.
  - `Body Text`: 14px–15px. Line-height: 1.55. Weight: 400/500.
  - `Metadata / Label`: 12px–13px. Line-height: 1.4. Weight: 500/600.
  - `KPI Numbers`: 28px–36px. Tabular numerals (`font-variant-numeric: tabular-nums`). Weight: 800.

---

## 4. Component Stylings & Geometry

### 4.1 Buttons
- **Primary Button**: Background `var(--color-forest)`, text `white`, rounded `12px`, padding `10px 20px`. Hover: darken by 8%, active: scale(0.98). Focus ring: `2px solid var(--color-amber)` with `2px offset`.
- **Secondary / Subtle Button**: Background `white`, border `1px solid var(--color-border)`, text `var(--color-text-main)`. Hover: background `var(--color-surface-subtle)`.
- **Accent Button**: Background `var(--color-amber)`, text `white` or `var(--color-forest-deep)`. Used strictly for key calls to action (e.g. "Enroll Farm").
- **Touch Targets**: Minimum 44px × 44px on all viewports, 48px on mobile for gloved/field usage.

### 4.2 Cards
- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)`
- Border Radius: `16px` (no giant pill cards, consistent curvature)
- Shadows: `var(--shadow-sm)` at rest, `var(--shadow-md)` on hover for interactive cards.
- Internal padding: `16px` (mobile), `24px` (desktop).

### 4.3 Navigation & TopBar
- **Desktop Sidebar**: Background `var(--color-forest-deep)`. Distinct sections (Overview, Operations, Commercial, Health, Admin). Active tab background `var(--color-forest)`, accented with `var(--color-sage)` and `var(--color-amber)` highlights.
- **TopBar**: Clean `var(--color-surface)` or `var(--color-background)` with subtle border. Farm dropdown, role badge, language selector (`mr`, `hi`, `en`), notifications, theme toggle.
- **Mobile Tab Bar**: Fixed bottom bar with 5 primary thumb actions (`Quick Log`, `Sales`, `Home`, `Flocks`, `Menu`).

---

## 5. Anti-Slop Hard Floor (Do's and Don'ts)

### ❌ Strict Don'ts
1. **NO generic AI tells**: No centered 3-line headline with an eyebrow pill badge above it.
2. **NO random gradients**: No purple-to-blue, neon green, or arbitrary gradient backgrounds.
3. **NO cards inside cards**: Avoid arbitrary nested card layers that add clutter without semantic purpose.
4. **NO emoji as status icons**: Use curated `lucide-react` icons (Bird, Egg, ShieldCheck, Zap, etc.).
5. **NO decorative vanity numbers**: Never display fake customer counts or fabricated testimonials.
6. **NO neon accents**: All colors must strictly resolve to the defined natural token palette.
7. **NO unreadable Marathi text**: Proper line-height (1.55+), no clipped Devanagari matras, no overlapping text.
8. **NO horizontal overflow**: Screen width <= 600px must have 0 horizontal scroll.

### ✅ Explicit Do's
1. **Substance First**: Real poultry metrics (30,000 birds, 92.4% HD, ₹5.21 break-even, feed g/bird).
2. **Restrained 60/30/10 Balance**: Dominant warm cream/white, grounded forest/sage green, amber/walnut highlights.
3. **Distinct Layouts**: Varied visual composition between landing sections instead of 10 identical 3-card grids.
4. **Authentic Farming Visuals**: Real poultry architecture, egg grading illustrations, real farmer workflows.
5. **Tabular Numerals**: Enforce `font-variant-numeric: tabular-nums` for all financial tables and counters.
6. **Accessible Contrast**: All text must achieve WCAG AA contrast against its respective surface.
7. **Consistent Elevation**: One shadow tier for cards, one for floating modals.
8. **Full Functional Preservation**: Every existing route, farm ID link, enrollment action, and calculator must work cleanly.

---

## 6. Responsive Breakpoints
- **Mobile (< 600px)**: 1-column cards, bottom thumb navigation bar, 48px touch targets, full-width bottom sheets.
- **Tablet (600px - 1024px)**: 2-column KPI grid, compact collapsible drawer.
- **Desktop (1024px+)**: Fixed 260px structured sidebar, multi-column dashboard, spacious layout.
