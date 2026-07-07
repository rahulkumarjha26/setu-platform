# Phase 5 Execution Plan — Setu Platform

**Date:** July 8, 2026
**Model:** deepseek-v4-flash (via Herdr agents)
**Each workstream:** ~30 minutes of agent time

---

## Workstream A: Analytics Dashboard

**Estimated complexity: High** (3 new pages, ~5 new components, SVG charts, dock integration)

### Overview
A new `/analytics` page showing platform-wide metrics using only inline SVG (no third-party chart libs), existing design tokens, lucide-react icons, and motion.div stagger entrance. A new dock lens "Analytics" must be added.

### 1. File Paths Involved

| File | Action |
|---|---|
| `app/analytics/page.tsx` | **CREATE** — main analytics dashboard page |
| `app/analytics/components/RingChart.tsx` | **CREATE** — inline SVG donut/ring chart for wounds-by-status |
| `app/analytics/components/BarChart.tsx` | **CREATE** — inline SVG bar chart for CSR spend trends |
| `app/analytics/components/WoundMap.tsx` | **CREATE** — simple geo-dot map (inline SVG circles on India outline) |
| `app/analytics/components/TopNGOs.tsx` | **CREATE** — top NGOs by verification score card |
| `app/analytics/components/ActivityFeed.tsx` | **CREATE** — recent platform activity feed |
| `lib/mock-data.ts` | **PATCH** — add `ANALYTICS_DATA`, `CSR_SPEND_TRENDS`, `ACTIVE_WOUND_GEO`, `NGO_VERIFICATION_SCORES` |
| `app/components/DockShell.tsx` | **PATCH** — add "Analytics" lens (`BarChart3` icon) to the `ROLE_LENSES` arrays |
| `app/globals.css` | **OPTIONAL** — add `.ring-chart` and `.bar-chart` animation classes if needed |

### 2. Key Components to Build

#### `app/analytics/page.tsx`
- Page-level wrapper with `motion.div initial={{opacity:0}} animate={{opacity:1}}`
- Header: "Analytics" title + "Platform-wide metrics" subtitle
- 6-section layout:
  1. **Metric strip** — 4 `card-metric` cards (total wounds, healed %, CSR deployed, NGOs active) in `.grid-4`
  2. **Wounds by status** — RingChart inline SVG (left) + legend list (right), side-by-side in a `.card`
  3. **CSR spend trends** — BarChart inline SVG (6-month bars) in a `.card`
  4. **Top NGOs** — TopNGOs component (verification score ranking list)
  5. **Active wound geography** — WoundMap component (India outline with position dots)
  6. **Recent activity** — ActivityFeed component (latest platform events)
- Each section uses `motion.div` with stagger entrance: `delay: i * 0.08`
- All colors from `var(--st-*)` and `var(--c-p-*)` ramp

#### `RingChart.tsx`
```tsx
function RingChart({ segments, size = 180, stroke = 24 }) {
  // Inline SVG donut: one <circle> per segment, stroke-dasharray/dashoffset
  // Segments: [{ value, color, label }]
  // Total = sum of values
  // Each ring arc via: circumference = 2 * PI * radius
  // strokeDasharray = (value/total) * circumference
  // strokeDashoffset = cumulative from previous segments
  // Center text: total count
}
```
- Use `var(--ghost)` for background track ring
- Use status colors for segments (`--st-open-mark`, `--st-assess-mark`, `--st-gov-mark`, `--st-active-mark`, `--st-healed-mark`, `--st-failed-mark`)
- Animate on mount with `motion.circle`

#### `BarChart.tsx`
```tsx
function BarChart({ data, height = 160, barWidth = 32 }) {
  // Inline SVG: vertical bars
  // data: [{ label, value, color }]
  // Y-axis: grid lines (2-3 subtle horizontal lines)
  // X-axis: month labels below bars
  // Each bar is a <rect> with height proportional to value/max
  // Animate via motion.rect with staggered delay
}
```
- Bar fill: `var(--action)` for CSR deployed, `var(--st-healed-mark)` for funds matched
- Grid lines: `var(--border)` opacity 0.5
- Y-axis labels: text-mono, text-3 color

#### `WoundMap.tsx`
```tsx
function WoundMap() {
  // Inline SVG: simplified India outline (path data)
  // Circles at approximate lat/lng positions for active wounds
  // Circle fill: radial gradient or opacity to show density
  // Tooltips on hover via title tags
}
```
- India outline path: static SVG `<path>` with `var(--nodata-hatch)` fill, `var(--border)` stroke
- Dots at wound lat/lng positions, colored by status (`--st-*` mark colors)
- Size 4-6px circles, slightly transparent (opacity 0.7)

#### `TopNGOs.tsx`
- List of NGOs sorted by verification score (descending)
- Each row: rank number, initials avatar, NGO name, score ProgressRing, delta indicator
- Uses existing `.card` styling with divider lines

#### `ActivityFeed.tsx`
- Feed of recent platform events (new wounds, verifications, funding matches, healings)
- Each item: icon in colored circle, text description, relative timestamp
- Matches the Pulse page activity feed pattern exactly (reuse structure from `app/pulse/page.tsx`)
- Reuse `typeStyles` pattern from pulse page

### 3. Data Model (Mock Data Additions)

Add to `lib/mock-data.ts`:

```ts
// ─── Analytics Dashboard Data ───
export interface CSRS spendTrend {
  month: string;       // "Jan", "Feb", ...
  deployed: number;    // INR Cr
  matched: number;     // INR Cr
}

export interface NGOscore {
  id: string;
  name: string;
  initials: string;
  logoBg: string;
  verificationScore: number; // 0-100
  projectsCompleted: number;
  trend: "up" | "down" | "flat";
}

export const CSR_SPEND_TRENDS: CSRS spendTrend[] = [
  { month: "Feb", deployed: 1.2, matched: 0.8 },
  { month: "Mar", deployed: 2.1, matched: 1.5 },
  { month: "Apr", deployed: 1.8, matched: 1.2 },
  { month: "May", deployed: 2.4, matched: 1.9 },
  { month: "Jun", deployed: 3.1, matched: 2.5 },
  { month: "Jul", deployed: 2.8, matched: 2.2 },
];

export const NGO_VERIFICATION_SCORES: NGOscore[] = [
  { id: "ngo-jsf", name: "Jeevan Setu Foundation", initials: "JS", logoBg: "var(--c-p-600)", verificationScore: 91, projectsCompleted: 28, trend: "up" },
  { id: "ngo-wwf", name: "Water Wells Foundation", initials: "WW", logoBg: "#2A6DB0", verificationScore: 88, projectsCompleted: 22, trend: "up" },
  { id: "ngo-svs", name: "Sahyog Vikas Sanstha", initials: "SV", logoBg: "#2F9E5E", verificationScore: 85, projectsCompleted: 19, trend: "flat" },
  { id: "ngo-gf", name: "Gramin Foundation", initials: "GF", logoBg: "#A9750C", verificationScore: 82, projectsCompleted: 16, trend: "up" },
  { id: "ngo-tf", name: "Tarun Foundation", initials: "TF", logoBg: "#C25A1E", verificationScore: 76, projectsCompleted: 14, trend: "down" },
];

export const ACTIVE_WOUND_REGIONS = [
  { region: "Maharashtra", count: 24, lat: 19.5, lng: 76.5 },
  { region: "Uttar Pradesh", count: 18, lat: 27.0, lng: 80.5 },
  { region: "Bihar", count: 15, lat: 25.5, lng: 85.5 },
  { region: "Karnataka", count: 12, lat: 15.0, lng: 76.0 },
  { region: "Rajasthan", count: 10, lat: 26.5, lng: 74.0 },
  { region: "Delhi", count: 8, lat: 28.6, lng: 77.2 },
  { region: "Tamil Nadu", count: 7, lat: 11.0, lng: 78.5 },
  { region: "West Bengal", count: 6, lat: 22.5, lng: 88.0 },
  { region: "Gujarat", count: 5, lat: 23.0, lng: 72.0 },
  { region: "Assam", count: 4, lat: 26.2, lng: 92.5 },
  { region: "Kerala", count: 3, lat: 10.5, lng: 76.5 },
];

export const ANALYTICS_DATA = {
  totalWounds: PLATFORM_STATS.totalWounds,
  healedPct: Math.round((PLATFORM_STATS.healed / WOUNDS.length) * 100),
  csrDeployed: "₹8.2 Cr",
  ngosActive: NGO_VERIFICATION_SCORES.length,
  csrCompaniesEngaged: CSR_COMPANIES.length,
  statesWithWounds: new Set(WOUNDS.map(w => w.placeId)).size,
};
```

### 4. Herdr Dispatch Prompt

```
DISPATCH TO: OpenCode with deepseek-v4-flash
TASK: Create Analytics Dashboard page for Setu platform

CONTEXT:
- Next.js 15 app at ~/Desktop/SETU project/platform/setu-app
- Uses custom CSS design tokens (var(--c-p-*), var(--st-*), var(--bg-*), var(--text-*)) in globals.css
- Uses lucide-react for icons, framer-motion for animations
- Has DockShell at app/components/DockShell.tsx with role-based lens arrays
- Has PLATFORM_STATS, WOUNDS, CSR_COMPANIES in lib/mock-data.ts
- New analytics types already added to lib/mock-data.ts: CSR_SPEND_TRENDS, NGO_VERIFICATION_SCORES, ACTIVE_WOUND_REGIONS, ANALYTICS_DATA
- No Tailwind utility classes for layout — use inline style objects
- No third-party chart libraries — use inline SVG only

REQUIRED FILES TO CREATE:

1. CREATE app/analytics/page.tsx:
   - "use client", motion.div page wrapper
   - Header: "Analytics" (text-h1) + subtitle "Platform-wide metrics"
   - 4 metric cards in grid-responsive (total wounds, healed %, CSR deployed, NGOs active)
   - Section 2: RingChart + legend (wounds by status, side-by-side in card)
   - Section 3: BarChart (CSR spend trends, last 6 months)
   - Section 4: TopNGOs component (verification score ranking)
   - Section 5: WoundMap (India outline SVG with dots for regions)
   - Section 6: ActivityFeed (recent platform events)
   - Each section wrapped in motion.div with delay: i * 0.08 stagger
   - Page bottom padding 120px for dock clearance
   - Use container class for max-width, mob-px-16 for mobile

2. CREATE app/analytics/components/RingChart.tsx:
   - Export function RingChart({ segments, size=180, stroke=24 })
   - Inline SVG donut with motion.circle animated segments
   - Background ghost ring, colored segments with stroke-dasharray
   - Center text showing total count
   - Segments: {value, color, label}

3. CREATE app/analytics/components/BarChart.tsx:
   - Export function BarChart({ data, height=160 })
   - Inline SVG with rect elements for each bar
   - Horizontal grid lines (2-3)
   - Month labels on x-axis
   - Two series: deployed (action color) and matched (st-healed-mark)
   - Legend at bottom

4. CREATE app/analytics/components/WoundMap.tsx:
   - Simplified India SVG outline as path
   - Circles for ACTIVE_WOUND_REGIONS at approximate positions
   - Circle radius proportional to count (min 4, max 12)
   - Fill with status colors, opacity animation on mount

5. CREATE app/analytics/components/TopNGOs.tsx:
   - Card with list of NGOs from NGO_VERIFICATION_SCORES
   - Each row: rank, initials avatar (44px, rounded, logoBg), name, score (ProgressRing), trend delta
   - Sort by verificationScore descending

6. CREATE app/analytics/components/ActivityFeed.tsx:
   - Pull from PULSE_DATA.activity pattern or create inline mock
   - 8-10 recent events with icon, text, timestamp
   - Same visual pattern as pulse page activity feed

7. PATCH app/components/DockShell.tsx:
   - Import BarChart3 from lucide-react
   - Add { id: "analytics", href: "/analytics", Icon: BarChart3, label: "Analytics" } to ALL role lenses in ROLE_LENSES object
   - Insert before "search" or after "atlas" (logical placement)

CODE REQUIREMENTS:
- All colors from CSS variables (var(--st-*), var(--c-p-*), var(--text-*)), never hardcoded hex
- Use existing card, card-compact, card-metric, text-h1, text-body, text-label-up, text-number, text-mono, text-2, text-caption classes
- motion.div stagger: initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:i*0.08,ease:[0.16,1,0.3,1]}}
- Mobile: use mob-px-16, mob-col-1, mob-gap-12 classes where needed
- No shadcn, no tailwind utility classes for visual properties — only inline styles with CSS vars
- Each file should be self-contained; reuse components via imports

VERIFY:
- npm run build passes with no errors
- All 21+1 = 22 static pages compile
```

### 5. Data Dependencies
- WOUNDS data (existing) → wound counts by status for ring chart
- PLATFORM_STATS (existing) → total wounds, healed count
- **NEW:** CSR_SPEND_TRENDS → bar chart data
- **NEW:** NGO_VERIFICATION_SCORES → top NGOs list
- **NEW:** ACTIVE_WOUND_REGIONS → map positions

---

## Workstream B: Funder Matching View

**Estimated complexity: Medium** (1 new page, ~3 components, mock data additions)

### Overview
A new page at `/funder-matching` showing NGOs seeking funding matched against CSR mandates. Wound categories aligned with Schedule VII categories, match scores, amount needed vs available. Could also be a new tab within the existing `/corporate` page (Discovery tab).

### 1. File Paths Involved

| File | Action |
|---|---|
| `app/funder-matching/page.tsx` | **CREATE** — main funder matching view |
| `app/funder-matching/components/MatchCard.tsx` | **CREATE** — individual funder-ngo match card |
| `app/funder-matching/components/ScheduleVIIGrid.tsx` | **CREATE** — Schedule VII category alignment grid |
| `app/funder-matching/components/MatchSummaryBar.tsx` | **CREATE** — summary stats bar at top |
| `lib/mock-data.ts` | **PATCH** — add `FUNDER_MATCHES`, `SCHEDULE_VII_CATEGORIES`, `FUNDING_REQUESTS` |
| `app/components/DockShell.tsx` | **PATCH** — add "Funder Matching" lens (`Handshake` icon) to corporate role only |

### 2. Key Components to Build

#### `app/funder-matching/page.tsx`
- Page wrapper with motion.div entrance animation
- **Header section**: title "Funder Matching", subtitle, last-matched timestamp
- **Summary bar** (MatchSummaryBar): 3 metric cards showing:
  - Total matchable NGOs
  - Total CSR funds available (Cr)
  - Total funding needed (Cr)
- **Schedule VII Alignment Grid**: shows 6 Schedule VII categories (water, sanitation, roads, education, health, elder) — each shows NGO count seeking funding + CSR mandate alignment %
- **Match list**: sortable cards for each potential match, default sorted by match score descending
- Filters at top: category chips, amount range, match score range

#### `MatchCard.tsx`
```tsx
function MatchCard({ match }: { match: FundMatch }) {
  // Card layout:
  // Left: NGO avatar (initials, 48px) + NGO name + category pills
  // Center: Wound title + amount needed vs available progress bar
  // Right: Match score (large ProgressRing, 60px)
  // Bottom: Action buttons — "Propose match" (primary), "View NGO" (ghost)
  // Border-left: 3px colored by match score tier (green >80%, amber 60-80%, grey <60%)
}
```
- Reuse `.card-compact` or `.card` styling
- Match score uses `ProgressRing` pattern from existing codebase
- Amount bar: shows `₹X of ₹Y committed` with animated progress bar

#### `ScheduleVIIGrid.tsx`
```tsx
function ScheduleVIIGrid() {
  // Grid of 6 cards in grid-2 (3x2 on desktop, 1-col on mobile)
  // Each card:
  // - Category icon (from lucide) + category name (text-h3)
  // - "N NGOs seeking funding" count
  // - "X CSR mandates aligned" count
  // - Mini progress bar showing alignment %
  // - Bottom: "View matches →" link
}
```
- Categories aligned with `CATEGORY_META` but mapped to Schedule VII headings
- Water → "Drinking Water & Sanitation"
- Sanitation → "Drinking Water & Sanitation"
- Roads → "Rural Infrastructure"
- Education → "Education & Livelihood"
- Health → "Healthcare"
- Elder → "Senior Care & Welfare"

#### `MatchSummaryBar.tsx`
- 3 `card-metric` in `.grid-3`
- Cards: "NGOs seeking funding", "CSR funds available", "Funding gap"
- Use text-number for values, text-caption for labels

### 3. Data Model (Mock Data Additions)

Add to `lib/mock-data.ts`:

```ts
// ─── Schedule VII Categories ───
export interface ScheduleVIICategory {
  key: string;
  scheduleLabel: string;
  description: string;
  ngoCount: number;
  csrAligned: number;
  totalFundingNeeded: number; // INR Cr
  totalFundingAvailable: number; // INR Cr
}

export const SCHEDULE_VII_CATEGORIES: ScheduleVIICategory[] = [
  { key: "water", scheduleLabel: "Drinking Water & Sanitation", description: "Water supply, sanitation, waste management", ngoCount: 8, csrAligned: 6, totalFundingNeeded: 4.2, totalFundingAvailable: 6.8 },
  { key: "education", scheduleLabel: "Education & Livelihood", description: "School infrastructure, skill development", ngoCount: 6, csrAligned: 5, totalFundingNeeded: 3.1, totalFundingAvailable: 4.5 },
  { key: "health", scheduleLabel: "Healthcare", description: "Public health, medical facilities", ngoCount: 5, csrAligned: 4, totalFundingNeeded: 2.8, totalFundingAvailable: 3.2 },
  { key: "roads", scheduleLabel: "Rural Infrastructure", description: "Roads, bridges, community infrastructure", ngoCount: 4, csrAligned: 3, totalFundingNeeded: 5.1, totalFundingAvailable: 4.0 },
  { key: "sanitation", scheduleLabel: "Drinking Water & Sanitation", description: "Sanitation facilities, waste treatment", ngoCount: 5, csrAligned: 4, totalFundingNeeded: 2.4, totalFundingAvailable: 3.6 },
  { key: "elder", scheduleLabel: "Senior Care & Welfare", description: "Elder care, disability support", ngoCount: 3, csrAligned: 2, totalFundingNeeded: 1.6, totalFundingAvailable: 1.2 },
];

// ─── Match Records ───
export interface FundMatch {
  id: string;
  ngoName: string;
  ngoInitials: string;
  ngoLogoBg: string;
  woundId: string;
  woundTitle: string;
  category: CategoryKey;
  scheduleCategory: string;
  amountNeeded: number;       // INR Lakhs
  amountAvailable: number;    // INR Lakhs
  matchScore: number;         // 0-100
  matchFactors: string[];     // ["Geography match", "Category match", "Track record", ...]
  csrCompanyName: string;
  csrCompanyId: string;
  status: "new" | "proposed" | "in-discussion" | "committed";
}

export const FUNDER_MATCHES: FundMatch[] = [
  { id: "FM-001", ngoName: "Jeevan Setu Foundation", ngoInitials: "JS", ngoLogoBg: "var(--c-p-600)", woundId: "SETU-MH-0010", woundTitle: "Lake desilting & bund repair — Nashik Road", category: "water", scheduleCategory: "Drinking Water & Sanitation", amountNeeded: 22, amountAvailable: 28, matchScore: 94, matchFactors: ["Geography match: Nashik", "Category match: Water", "Track record: 91/100 verification", "Previous partnership"], csrCompanyName: "Aditya Infra Ltd", csrCompanyId: "CSR-AIL", status: "committed" },
  { id: "FM-002", ngoName: "Water Wells Foundation", ngoInitials: "WW", ngoLogoBg: "#2A6DB0", woundId: "SETU-UP-0002", woundTitle: "Arsenic in the hand-pump water", category: "water", scheduleCategory: "Drinking Water & Sanitation", amountNeeded: 15, amountAvailable: 20, matchScore: 87, matchFactors: ["Category match: Water", "Geography match: UP", "Track record: 88/100 verification"], csrCompanyName: "Infosys Foundation", csrCompanyId: "CSR-INFY", status: "new" },
  { id: "FM-003", ngoName: "Sahyog Vikas Sanstha", ngoInitials: "SV", ngoLogoBg: "#2F9E5E", woundId: "SETU-BR-0001", woundTitle: "Nine deaths, one poisoned well — Buxar", category: "water", scheduleCategory: "Drinking Water & Sanitation", amountNeeded: 18, amountAvailable: 22, matchScore: 82, matchFactors: ["Category match: Water", "Urgency: High (9 deaths)", "Geography match: Bihar"], csrCompanyName: "Infosys Foundation", csrCompanyId: "CSR-INFY", status: "new" },
  { id: "FM-004", ngoName: "Gramin Foundation", ngoInitials: "GF", ngoLogoBg: "#A9750C", woundId: "SETU-RJ-0001", woundTitle: "Water tanker arrives once a week", category: "water", scheduleCategory: "Drinking Water & Sanitation", amountNeeded: 8, amountAvailable: 12, matchScore: 78, matchFactors: ["Category match: Water", "Geography match: Rajasthan", "Track record: 82/100 verification"], csrCompanyName: "Tata CSR Foundation", csrCompanyId: "CSR-TATA", status: "proposed" },
  { id: "FM-005", ngoName: "Tarun Foundation", ngoInitials: "TF", ngoLogoBg: "#C25A1E", woundId: "SETU-DL-0002", woundTitle: "Night shelter over capacity", category: "elder", scheduleCategory: "Senior Care & Welfare", amountNeeded: 6, amountAvailable: 8, matchScore: 72, matchFactors: ["Category match: Elder care", "Geography match: Delhi", "Need: Urgent"], csrCompanyName: "Reliance Foundation", csrCompanyId: "CSR-RIL", status: "in-discussion" },
];

export const FUNDING_REQUESTS_SUMMARY = {
  totalNGOs: 12,
  totalFundsNeeded: 18.4,    // INR Cr
  totalFundsAvailable: 22.6, // INR Cr
  matchesLive: FUNDER_MATCHES.length,
  avgMatchScore: Math.round(FUNDER_MATCHES.reduce((s, m) => s + m.matchScore, 0) / FUNDER_MATCHES.length),
};
```

### 4. Herdr Dispatch Prompt

```
DISPATCH TO: OpenCode with deepseek-v4-flash
TASK: Create Funder Matching view page for Setu platform

CONTEXT:
- Next.js 15 app at ~/Desktop/SETU project/platform/setu-app
- Uses custom CSS design tokens (var(--c-p-*), var(--st-*), var(--bg-*), var(--text-*))
- Uses lucide-react for icons, framer-motion for animations
- DockShell at app/components/DockShell.tsx with role-based lenses
- New funder matching types already added to lib/mock-data.ts: SCHEDULE_VII_CATEGORIES, FUNDER_MATCHES, FUNDING_REQUESTS_SUMMARY, FundMatch, ScheduleVIICategory
- The corporate role is the primary user for this feature

REQUIRED FILES TO CREATE:

1. CREATE app/funder-matching/page.tsx:
   - "use client" page with motion.div entrance
   - Header: "Funder Matching" (text-h1) + "Match CSR mandates with verified NGO projects" subtitle
   - Summary bar: 3 metric cards (NGOs seeking funding, CSR funds available, avg match score)
   - Schedule VII category grid: 6 cards in grid-2 showing categories with NGO counts and alignment
   - Match list: section title "Active Matches" with filter chips (All, New, Proposed, Committed)
   - Each match rendered as MatchCard
   - Stagger entrance for all cards
   - Bottom padding 120px

2. CREATE app/funder-matching/components/MatchCard.tsx:
   - Card with 3px left border colored by match score tier
   - Score >= 80: green (--st-healed-mark), 60-79: amber (--st-assess-mark), <60: grey (--text-3)
   - Left: NGO initials avatar (48px), name, wound title
   - Center: Amount needed vs available progress bar
         - Track width: amountNeeded/amountAvailable * 100
         - Color: var(--action) if within budget, var(--report) if over
   - Right: ProgressRing with match score number
   - Match factors as small pills below
   - Bottom action bar: "Propose match" btn-primary, "View NGO" btn-ghost
   - Status pill using existing pill classes (map status to appropriate pill--* class)

3. CREATE app/funder-matching/components/ScheduleVIIGrid.tsx:
   - Grid-2 layout for 6 category cards
   - Each card: category icon (lucide), name (text-h3), description (text-caption)
   - Mini stats row: "X NGOs · Y mandates aligned"
   - Mini progress bar showing alignment %
   - onClick: could filter matches by category (optional)

4. CREATE app/funder-matching/components/MatchSummaryBar.tsx:
   - 3 card-metric in a flex row with gap
   - Use FUNDING_REQUESTS_SUMMARY values
   - Format numbers with toLocaleString("en-IN")

5. PATCH app/components/DockShell.tsx:
   - Import Handshake from lucide-react
   - Add { id: "funder-matching", href: "/funder-matching", Icon: Handshake, label: "Matching" } to the corporate role lenses array only
   - Insert as the second lens (after "console") for corporate role
   - DO NOT add to citizen, ngo, or government roles (this is corporate-only)

CODE REQUIREMENTS:
- All colors from CSS variables, never hardcoded hex
- Use existing card, card-compact, card-metric, pill, chip classes
- Motion.div stagger: delay: i * 0.06 with ease
- Mobile responsive with mob-* classes
- No third-party libraries beyond framer-motion and lucide-react
- Build must pass (npm run build)

VERIFY:
- npm run build passes with no errors
- Page accessible at /funder-matching
```

### 5. Data Dependencies
- CATEGORY_META (existing) → category icons/labels
- CSR_COMPANIES (existing) → company data for match display
- WOUNDS (existing) → wound titles linked in matches
- **NEW:** SCHEDULE_VII_CATEGORIES → category alignment grid
- **NEW:** FUNDER_MATCHES → individual match records
- **NEW:** FUNDING_REQUESTS_SUMMARY → summary metrics

---

## Workstream C: Bundle Performance Audit

**Estimated complexity: Low** (analysis + report, no code changes to pages)

### Overview
Measure current bundle size, identify largest chunks consuming the most bytes, and create a prescriptive plan to reduce them via dynamic imports and lazy loading. This is a diagnostic + planning workstream, not a build workstream.

### 1. File Paths Involved

| File | Action |
|---|---|
| `phase5-bundle-audit.md` | **CREATE** — analysis report with findings, metrics, and reduction plan |
| `next.config.mjs` | **PATCH** (after analysis) — add `@next/next-analyze` or configure `next.config.mjs` with `bundlePagesRouterDependencies: true` |
| No source files changed | The reduction plan is applied in a follow-up Phase 5.5 |

### 2. Key Steps

#### Step 1: Run `next build` with bundle analysis
```bash
# Install @next/bundle-analyzer
npm install --save-dev @next/bundle-analyzer

# Create a next.config.mjs that wraps with bundle analyzer
# Run: ANALYZE=true npm run build
```

If `@next/bundle-analyzer` causes issues, use an alternative approach:
```bash
# Parse the .next/build-manifest.json and .next/server/pages/ directory
ls -la .next/static/chunks/  # Largest .js files
du -sh .next/static/chunks/*.js | sort -rh | head -20
```

#### Step 2: Identify top 10 chunks by size
Read `.next/build-manifest.json` which lists all page bundles and their dependencies.

#### Step 3: Identify opportunities
- Pages using maplibre-gl (very large ~300KB+)
- Pages importing all of lucide-react (tree-shaking may not catch all)
- Shared component bundles (recharts if used anywhere)
- Framermotion bundle size
- Duplicated deps across pages

#### Step 4: Measure per-page JS size
Read `.next/server/pages/` for per-page JS bundle sizes.

### 3. No Mock Data Changes

This workstream is purely analytical — no data model changes.

### 4. Herdr Dispatch Prompt

```
DISPATCH TO: OpenCode with deepseek-v4-flash
TASK: Perform bundle size audit on Setu platform Next.js app

CONTEXT:
- Next.js 15 app at ~/Desktop/SETU project/platform/setu-app
- Currently generates 21 static pages
- Uses framer-motion, maplibre-gl, lucide-react, recharts as large dependencies
- next.config.mjs is minimal (no bundle analysis configured)

STEP-BY-STEP INSTRUCTIONS:

1. INSTALL bundle analyzer:
   cd ~/Desktop/SETU\ project/platform/setu-app
   npm install --save-dev @next/bundle-analyzer

2. CONFIGURE next.config.mjs:
   Read current next.config.mjs
   Update to include:
   ```mjs
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   /** @type {import('next').NextConfig} */
   const nextConfig = {};
   export default withBundleAnalyzer(nextConfig);
   ```

3. RUN ANALYSIS:
   ANALYZE=true npm run build 2>&1 | tail -60
   This will generate bundle report HTML files in .next/analyze/

4. EXAMINE RESULTS:
   - Read `.next/build-manifest.json` — find the `pages` key which maps each route to JS chunks
   - Read `.next/server/pages/` — get size of each page HTML + JS
   - ls -la .next/static/chunks/*.js | sort -rh | head -20 — largest shared chunks
   - Extract per-page JS payload sizes from the build output (look for "✓" lines with size info)
   - Check for maplibre-gl inclusion in chunks

5. COMPOSE REPORT in phase5-bundle-audit.md:
   Format:
   ```md
   # Phase 5 Bundle Audit
   **Date:** July 8, 2026
   
   ## Build Summary
   - Total pages: 21 (static)
   - Total build time: Xs
   - Total JS output: X MB
   
   ## Largest Shared Chunks
   | Chunk | Size | Contents |
   |-------|------|----------|
   | framework-xxx.js | XXX KB | Next.js runtime |
   | _buildManifest.js | XXX KB | Routing manifest |
   | chunk-xxx.js | XXX KB | Shared components/deps |
   
   ## Largest Page-Specific Chunks
   | Page | Size | Key dependencies |
   |------|------|------------------|
   | /atlas | XXX KB | maplibre-gl, map CSS |
   | /corporate | XXX KB | recharts? |
   | ... | ... | ... |
   
   ## Big Dependency Analysis
   1. maplibre-gl (~350 KB gzipped) — ONLY needed on /atlas page
   2. framer-motion (~150 KB) — used on every page, consolidated
   3. lucide-react (~variable, tree-shakeable)
   4. recharts (~250 KB) — check if actually used anywhere
   
   ## Reduction Plan (Phase 5.5+)
   ### Priority 1: Dynamic import maplibre-gl (High impact)
   - In /atlas/page.tsx, replace `import maplibregl from 'maplibre-gl'` with:
     ```tsx
     const maplibregl = await import('maplibre-gl');
     ```
   - Wrapped in useEffect + useState for SSR safety
   - Estimated savings: ~350 KB on every page except atlas
   
   ### Priority 2: Lazy load heavy sections (Medium impact)
   - On /corporate page, dynamically import the "bundles" and "scoring" tab content
   - On /home page, dynamically import the hero section gradient animation
   
   ### Priority 3: Reduce lucide-react imports (Low impact)
   - Audit each page for unused lucide imports
   - DeepScan the 5 largest pages: corporate, government, ngo, home, wound/[id]
   - Estimated savings: 20-50 KB per page
   
   ### Priority 4: Code-split motion/page transitions (Low impact)
   - Wrap page-level motion.div in a shared wrapper component
   
   ## Appendix: Build Output
   ```
   [Full build output pasted here]
   ```
   ```

6. REVERT next.config.mjs changes after analysis (restore to original minimal config)
   - The bundle analyzer config should NOT be committed to the project
   - Keep the analysis report and reduction plan as deliverables

VERIFY:
- Report file exists at phase5-bundle-audit.md with real numbers
- next.config.mjs is reverted to original state
```

### 5. Expected Findings (pre-analysis hypotheses)
| Dependency | Estimated size | Affected pages | Reduction strategy |
|---|---|---|---|
| maplibre-gl | ~350 KB (gzipped) | Only `/atlas` needs it | Dynamic import on atlas page |
| framer-motion | ~150 KB | All pages (layout) | Already consolidated — accept as baseline |
| recharts | ~250 KB | Potentially unused | Check — remove if no imports exist |
| lucide-react | ~variable | All pages | Tree-shaking may need audit |
| @base-ui/react | ~moderate | Unknown usage | Check actual usage |

---

## Execution Order & Dependencies

```
Phase 5 Execution Flow:
1. Workstream C (Bundle Audit) — 30 min
   ↳ Produces phase5-bundle-audit.md analysis
   
2. Workstream A (Analytics Dashboard) — 35 min
   ↳ Blocks on: nothing (new page, independent)
   ↳ After: dock needs restart to show new lens
   
3. Workstream B (Funder Matching) — 30 min
   ↳ Blocks on: nothing (new page, independent)
   ↳ After: dock updated for corporate role

Optimal parallel execution:
- All 3 workstreams can run in parallel (no file conflicts)
- Exception: DockShell.tsx is patched by both A and B — serialize or reconcile
- Run A then B docking updates (final patch handles both lenses)
```

### DockShell Conflict Resolution
Both Workstream A and B patch `app/components/DockShell.tsx`. To avoid conflicts:
1. Dispatch A first (adds `BarChart3` analytics lens to all roles)
2. After A completes, read the file
3. Dispatch B with the updated file (adds `Handshake` funder-matching lens to corporate only)
4. OR: Dispatch a single combined dock patch that does both

**Recommended:** Single combined dock patch after both workstreams are code-complete.

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| SVG chart rendering looks wrong | Medium | Test with browser after build; verify JSX SVG attrs are lowercase |
| Dock lens not showing post-build | Low | Verify lens in all ROLE_LENSES arrays; app must be re-bundled |
| Bundle analyzer errors with SWC | Low | Fall back to manual `.next/static/chunks/` analysis |
| File conflicts on DockShell.tsx | Medium | Serialize dock patches; single combined dispatch |
| mock-data.ts merge conflict (A+B add different sections) | Low | Both add at end of file; easy to reconcile |
| maplibre-gl not tree-shakeable | Low | Dynamic import with next/dynamic solves this completely |

---

## Post-Phase-5 Verification Checklist

- [ ] `npm run build` passes (22 pages — 21 existing + 1 analytics)
- [ ] `/analytics` renders RingChart, BarChart, WoundMap, TopNGOs, ActivityFeed
- [ ] Dock shows "Analytics" lens in all roles
- [ ] `/funder-matching` renders match cards, Schedule VII grid, summary bar
- [ ] Dock shows "Matching" lens in corporate role only
- [ ] `phase5-bundle-audit.md` contains real build metrics
- [ ] All uses of `var(--xxx)` are defined in globals.css (orphan check)
- [ ] No hardcoded hex colors remain on new pages
- [ ] Mobile responsive: all sections collapse to single column under 640px
- [ ] All lucide-react imports are actually used (no zombie imports)
- [ ] Git commit + push + Vercel deploy
