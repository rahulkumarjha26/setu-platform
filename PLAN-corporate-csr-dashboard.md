# Corporate → CSR Compliance Dashboard — Implementation Plan

**Book reference:** *सेतु — THE BRIDGE* (Part III — CSR Law, Part VIII — Money)
**Status:** Plan v1
**Target file:** `app/corporate/page.tsx` → full rewrite (~500–700 lines)

---

## 1. New Data Types (`lib/mock-data.ts` additions)

### `CSRObligation`
```typescript
export interface CSRObligation {
  financialYear: string;          // "2025-26"
  totalObligation: string;        // "₹9,40,00,000"
  amountSpent: string;            // "₹3,20,00,000"
  amountUnspent: string;          // "₹6,20,00,000"
  deadline: string;               // "31 Mar 2026"
  spentPct: number;               // 34
  complianceScore: number;        // 78 (out of 100)
  lastAuditDate: string;          // "15 Jan 2026"
  nextAuditDate: string;          // "31 Mar 2026"
  status: "on-track" | "at-risk" | "overdue";
}
```

### `CSRProject` (extends project concept for CSR compliance)
```typescript
export interface CSRProject {
  id: string;                     // "PRJ-001"
  name: string;
  district: string;
  category: CategoryKey;
  budget: string;                 // "₹22,00,000"
  disbursed: string;              // "₹9,90,000"
  held: string;                   // "₹7,70,000"
  pending: string;                // "₹4,40,000"
  disbursedPct: number;           // 45
  heldPct: number;                // 35
  pendingPct: number;             // 20
  milestoneStatus: "completed" | "in-progress" | "pending";
  status: StatusKey;
  verified: boolean;
  verificationCount: number;      // 3
  livesImpacted: number;          // 3400
  woundsHealed: number;           // 7
  startDate: string;
  expectedEndDate: string;
  ngos: string[];                 // ["Jeevan Setu Foundation"]
  escrowId: string;              // "ESC-001"
  proofLayers: ProofLayer[];
}
```

### `EscrowAccount`
```typescript
export interface EscrowAccount {
  id: string;                     // "ESC-001"
  projectId: string;
  totalDeposited: string;         // "₹22,00,000"
  totalReleased: string;          // "₹9,90,000"
  balance: string;                // "₹12,10,000"
  scheduledReleases: EscrowRelease[];
  lastUpdated: string;
  status: "active" | "completed" | "frozen";
}

export interface EscrowRelease {
  id: string;                     // "REL-001"
  milestone: string;
  amount: string;                 // "₹8,00,000"
  scheduledDate: string;
  status: "scheduled" | "released" | "pending-approval" | "held";
  verifiedBy: string;             // verifier name or "-"
  releasedOn?: string;
}
```

### `ComplianceReport`
```typescript
export interface ComplianceReport {
  id: string;
  financialYear: string;
  generatedOn: string;
  obligationsMet: string;         // "₹3,20,00,000 / ₹9,40,00,000"
  status: "draft" | "submitted" | "approved";
  downloadUrl: string;
}
```

---

## 2. Mock Data (`lib/mock-data.ts` additions)

Add these objects, then export them:

### Corporate Entity
```typescript
export const CSR_ENTITY = {
  name: "Tata CSR Foundation",
  pan: "AAACT1234F",
  cin: "U12345MH2020NPL345678",
  registrationNo: "CSR00001234",
  financialYear: "2025-26",
  sectorFocus: ["water", "sanitation", "education"] as CategoryKey[],
  geographyFocus: ["Bihar", "Maharashtra", "Karnataka"],
};
```

### CSR Obligation
```typescript
export const CSR_OBLIGATION: CSRObligation = {
  financialYear: "2025-26",
  totalObligation: "₹9,40,00,000",
  amountSpent: "₹3,20,00,000",
  amountUnspent: "₹6,20,00,000",
  deadline: "31 Mar 2026",
  spentPct: 34,
  complianceScore: 78,
  lastAuditDate: "15 Jan 2026",
  nextAuditDate: "31 Mar 2026",
  status: "on-track",
};
```

### CSR Projects (expanded from existing PROJECTS)
```typescript
export const CSR_PROJECTS: CSRProject[] = [
  {
    id: "PRJ-001",
    name: "Lake restoration Phase I",
    district: "Muzaffarpur, Bihar",
    category: "water",
    budget: "₹22,00,000",
    disbursed: "₹9,90,000",
    held: "₹7,70,000",
    pending: "₹4,40,000",
    disbursedPct: 45, heldPct: 35, pendingPct: 20,
    milestoneStatus: "in-progress",
    status: "in-progress",
    verified: true,
    verificationCount: 2,
    livesImpacted: 3400,
    woundsHealed: 1,
    startDate: "01 Mar 2026",
    expectedEndDate: "15 Sep 2026",
    ngos: ["Jeevan Setu Foundation"],
    escrowId: "ESC-001",
    proofLayers: [
      { label: "Geo-tagged photo", done: true },
      { label: "Independent verifier", done: true },
      { label: "Community validation", done: false },
      { label: "Outcome measured", done: false },
    ],
  },
  {
    id: "PRJ-002",
    name: "School sanitation — 8 units",
    district: "Arrah, Bihar",
    category: "sanitation",
    budget: "₹8,50,000",
    disbursed: "₹8,50,000",
    held: "₹0",
    pending: "₹0",
    disbursedPct: 100, heldPct: 0, pendingPct: 0,
    milestoneStatus: "completed",
    status: "healed",
    verified: true,
    verificationCount: 3,
    livesImpacted: 1200,
    woundsHealed: 1,
    startDate: "01 Dec 2025",
    expectedEndDate: "15 Mar 2026",
    ngos: ["Jal Seva Foundation"],
    escrowId: "ESC-002",
    proofLayers: [
      { label: "Geo-tagged photo", done: true },
      { label: "Independent verifier", done: true },
      { label: "Community validation", done: true },
      { label: "Outcome measured", done: true },
    ],
  },
  {
    id: "PRJ-003",
    name: "Migrant health camp Q3",
    district: "Buxar, Bihar",
    category: "health",
    budget: "₹6,80,000",
    disbursed: "₹2,04,000",
    held: "₹3,40,000",
    pending: "₹1,36,000",
    disbursedPct: 30, heldPct: 50, pendingPct: 20,
    milestoneStatus: "in-progress",
    status: "assessing",
    verified: false,
    verificationCount: 0,
    livesImpacted: 0,
    woundsHealed: 0,
    startDate: "01 Jun 2026",
    expectedEndDate: "31 Dec 2026",
    ngos: ["Health Access Initiative"],
    escrowId: "ESC-003",
    proofLayers: [
      { label: "Geo-tagged photo", done: false },
      { label: "Independent verifier", done: false },
      { label: "Community validation", done: false },
      { label: "Outcome measured", done: false },
    ],
  },
  {
    id: "PRJ-004",
    name: "Anganwadi repair — 12 centres",
    district: "Darbhanga, Bihar",
    category: "education",
    budget: "₹5,40,000",
    disbursed: "₹3,78,000",
    held: "₹1,08,000",
    pending: "₹54,000",
    disbursedPct: 70, heldPct: 20, pendingPct: 10,
    milestoneStatus: "in-progress",
    status: "in-progress",
    verified: true,
    verificationCount: 1,
    livesImpacted: 2400,
    woundsHealed: 1,
    startDate: "15 Feb 2026",
    expectedEndDate: "30 Aug 2026",
    ngos: ["Siksha Sahayog"],
    escrowId: "ESC-004",
    proofLayers: [
      { label: "Geo-tagged photo", done: true },
      { label: "Independent verifier", done: false },
      { label: "Community validation", done: false },
      { label: "Outcome measured", done: false },
    ],
  },
  {
    id: "PRJ-005",
    name: "Waste segregation — 40 wards",
    district: "Sasaram, Bihar",
    category: "sanitation",
    budget: "₹18,00,000",
    disbursed: "₹2,70,000",
    held: "₹10,80,000",
    pending: "₹4,50,000",
    disbursedPct: 15, heldPct: 60, pendingPct: 25,
    milestoneStatus: "in-progress",
    status: "in-progress",
    verified: false,
    verificationCount: 0,
    livesImpacted: 0,
    woundsHealed: 0,
    startDate: "01 Apr 2026",
    expectedEndDate: "30 Jun 2027",
    ngos: ["Green Earth Foundation"],
    escrowId: "ESC-005",
    proofLayers: [
      { label: "Geo-tagged photo", done: false },
      { label: "Independent verifier", done: false },
      { label: "Community validation", done: false },
      { label: "Outcome measured", done: false },
    ],
  },
  {
    id: "PRJ-006",
    name: "Sewage connection — 60 HH",
    district: "Samastipur, Bihar",
    category: "sanitation",
    budget: "₹8,80,000",
    disbursed: "₹4,84,000",
    held: "₹2,20,000",
    pending: "₹1,76,000",
    disbursedPct: 55, heldPct: 25, pendingPct: 20,
    milestoneStatus: "in-progress",
    status: "in-progress",
    verified: true,
    verificationCount: 1,
    livesImpacted: 600,
    woundsHealed: 1,
    startDate: "01 Jan 2026",
    expectedEndDate: "31 Oct 2026",
    ngos: ["Sanitation First"],
    escrowId: "ESC-006",
    proofLayers: [
      { label: "Geo-tagged photo", done: true },
      { label: "Independent verifier", done: false },
      { label: "Community validation", done: true },
      { label: "Outcome measured", done: false },
    ],
  },
  {
    id: "PRJ-007",
    name: "Rooftop rainwater harvesting — 12 schools",
    district: "Jalgaon, Maharashtra",
    category: "water",
    budget: "₹31,00,000",
    disbursed: "₹14,00,000",
    held: "₹12,00,000",
    pending: "₹5,00,000",
    disbursedPct: 45, heldPct: 39, pendingPct: 16,
    milestoneStatus: "in-progress",
    status: "in-progress",
    verified: true,
    verificationCount: 2,
    livesImpacted: 3400,
    woundsHealed: 1,
    startDate: "01 Mar 2026",
    expectedEndDate: "30 Sep 2026",
    ngos: ["Jeevan Setu Foundation"],
    escrowId: "ESC-007",
    proofLayers: [
      { label: "Geo-tagged photo", done: true },
      { label: "Independent verifier", done: true },
      { label: "Community validation", done: false },
      { label: "Outcome measured", done: false },
    ],
  },
];
```

### Escrow Accounts
```typescript
export const ESCROW_ACCOUNTS: EscrowAccount[] = [
  {
    id: "ESC-001",
    projectId: "PRJ-001",
    totalDeposited: "₹22,00,000",
    totalReleased: "₹9,90,000",
    balance: "₹12,10,000",
    lastUpdated: "15 Jun 2026",
    status: "active",
    scheduledReleases: [
      { id: "REL-001", milestone: "Lake desilting — Phase 1", amount: "₹8,00,000", scheduledDate: "10 May 2026", status: "released", verifiedBy: "Dr. Kiran Joshi", releasedOn: "12 May 2026" },
      { id: "REL-002", milestone: "Bund wall reconstruction", amount: "₹7,00,000", scheduledDate: "15 Jun 2026", status: "released", verifiedBy: "Dr. Kiran Joshi", releasedOn: "18 Jun 2026" },
      { id: "REL-003", milestone: "Inlet channel restoration", amount: "₹5,00,000", scheduledDate: "20 Jul 2026", status: "pending-approval", verifiedBy: "-" },
      { id: "REL-004", milestone: "Community handover", amount: "₹2,00,000", scheduledDate: "01 Sep 2026", status: "scheduled", verifiedBy: "-" },
    ],
  },
  {
    id: "ESC-002",
    projectId: "PRJ-002",
    totalDeposited: "₹8,50,000",
    totalReleased: "₹8,50,000",
    balance: "₹0",
    lastUpdated: "20 Mar 2026",
    status: "completed",
    scheduledReleases: [
      { id: "REL-010", milestone: "Construction — 8 units", amount: "₹5,00,000", scheduledDate: "15 Jan 2026", status: "released", verifiedBy: "Meera Nair", releasedOn: "18 Jan 2026" },
      { id: "REL-011", milestone: "Plumbing & fixtures", amount: "₹2,00,000", scheduledDate: "20 Feb 2026", status: "released", verifiedBy: "Meera Nair", releasedOn: "22 Feb 2026" },
      { id: "REL-012", milestone: "Final verification", amount: "₹1,50,000", scheduledDate: "15 Mar 2026", status: "released", verifiedBy: "Meera Nair", releasedOn: "18 Mar 2026" },
    ],
  },
  {
    id: "ESC-003",
    projectId: "PRJ-003",
    totalDeposited: "₹6,80,000",
    totalReleased: "₹2,04,000",
    balance: "₹4,76,000",
    lastUpdated: "10 Jun 2026",
    status: "active",
    scheduledReleases: [
      { id: "REL-020", milestone: "Planning & registration", amount: "₹2,04,000", scheduledDate: "10 Jun 2026", status: "released", verifiedBy: "System", releasedOn: "10 Jun 2026" },
      { id: "REL-021", milestone: "Camp setup & supplies", amount: "₹3,40,000", scheduledDate: "15 Aug 2026", status: "scheduled", verifiedBy: "-" },
      { id: "REL-022", milestone: "Reporting & outcomes", amount: "₹1,36,000", scheduledDate: "15 Oct 2026", status: "scheduled", verifiedBy: "-" },
    ],
  },
];
```

### Impact Metrics (computed data)
```typescript
export const IMPACT_METRICS = {
  totalLivesImpacted: 11000,
  totalWoundsHealed: 5,
  totalVerificationPassed: 8,
  totalVerificationFailed: 1,
  totalVerificationPartial: 1,
  districtsCovered: 5,
  activeNgoPartners: 4,
};
```

### Compliance Reports List
```typescript
export const COMPLIANCE_REPORTS: ComplianceReport[] = [
  { id: "CR-2025-Q1", financialYear: "2025-26", generatedOn: "15 Jul 2025", obligationsMet: "₹1,20,00,000 / ₹9,40,00,000", status: "approved" },
  { id: "CR-2025-Q2", financialYear: "2025-26", generatedOn: "15 Oct 2025", obligationsMet: "₹2,40,00,000 / ₹9,40,00,000", status: "approved" },
  { id: "CR-2025-Q3", financialYear: "2025-26", generatedOn: "15 Jan 2026", obligationsMet: "₹3,20,00,000 / ₹9,40,00,000", status: "submitted" },
  { id: "CR-2025-Q4", financialYear: "2025-26", generatedOn: "—", obligationsMet: "—", status: "draft" },
];
```

---

## 3. Dashboard Tabs (Navigation)

Replace the old 6-tab nav with a dashboard-oriented 6-tab nav:

| Tab ID | Label | Icon | Focus |
|--------|-------|------|-------|
| `overview` | Overview | `LayoutDashboard` | CSR mandate KPIs, compliance score ring, annual target gauge |
| `projects` | Projects | `Briefcase` | Full project portfolio with sort/filter, milestone bars |
| `escrow` | Escrow | `Banknote` / `Landmark` | Escrow accounts, scheduled releases, approval queue |
| `proof` | Proof | `ShieldCheck` | Verification evidence for projects, proof layer matrix |
| `compliance` | Compliance | `FileCheck` | CSR deadlines, annual report gen, compliance calendar |
| `impact` | Impact | `TrendingUp` | Impact metrics, lives reached, wounds healed, charts |

(Remove: Discovery, Bundles, NGO Scoring — these are not dashboard views.)

---

## 4. Component Structure

### Tab View Components (new files in `app/corporate/`)

Each tab view gets its own component file for clean separation:

```
app/corporate/
  page.tsx             ← Shell with header + metric strip + tab navigation + dynamic tab content
  OverviewTab.tsx       ← CSR Mandate Overview
  ProjectsTab.tsx       ← Project Portfolio with table
  EscrowTab.tsx         ← Escrow Dashboard
  ProofTab.tsx          ← Proof Layer & Verification Evidence
  ComplianceTab.tsx     ← Compliance Status & Reports
  ImpactTab.tsx         ← Impact Metrics & Visualizations
```

### Alternative: Single-file approach (simpler, fewer imports)

Because each tab is relatively compact (~80–120 lines each), a **single-file rewrite** of `page.tsx` is viable. Each tab content renders inline inside a `switch`/conditional inside the main component. This matches the existing pattern used in `ngo/page.tsx` and the current `corporate/page.tsx`.

**Recommendation: Single file for the first pass** — keeps everything in one place, easier to iterate, matches existing project patterns. Can extract later if needed.

---

## 5. Page Layout (rough wireframe)

```
┌──────────────────────────────────────────────────────┐
│  Corporate Console  ● Corporate                       │
│  Tata CSR Foundation — FY 2025-26                     │
├──────────────────────────────────────────────────────┤
│  [Obligation ₹9.40 Cr] [Spent ₹3.20 Cr] [Score 78%]  │
│  [Lives: 11K] [Projects: 7] [Escrow: ₹17.7 Cr]       │
├──────────────────────────────────────────────────────┤
│  [Overview] [Projects] [Escrow] [Proof] [Compliance] [Impact]  │
├──────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────┐  ┌──────────────────┐       │
│  │   Main Content        │  │   Right Rail      │       │
│  │   (varies by tab)     │  │   (contextual)    │       │
│  │                        │  │                   │       │
│  │   e.g. Projects table  │  │   Escrow summary  │       │
│  │   with milestone bars  │  │   or Compliance   │       │
│  │                        │  │   calendar or     │       │
│  │                        │  │   Quick actions   │       │
│  └──────────────────────┘  └──────────────────┘       │
│                                                        │
└──────────────────────────────────────────────────────┘
```

---

## 6. Tab-by-Tab Content Plan

### 6.1 Overview Tab (`activeNav === "overview"`)

**Main content:**
1. **Obligation gauge card** — Large ring/donut showing `spentPct` (34%). Center: "₹3.20 Cr / ₹9.40 Cr". Sub: "Unspent: ₹6.20 Cr · Deadline: 31 Mar 2026"
2. **Compliance score card** — Score ring (78/100) with mini bar showing score breakdown by category
3. **Quick stats grid** — 2×2 or 3×2: Projects funded, NGO partners, Districts covered, Lives impacted, Wounds healed, Verifications passed

**Right rail:**
- Upcoming deadlines (next audit, quarterly report due)
- Recent activity feed (latest verification events)
- Export board report button

### 6.2 Projects Tab (`activeNav === "projects"`)

**Main content:**
- **Filter bar** — Search, status filter (all/healed/in-progress/assessing), category filter, sort by budget/date
- **Data table** — Columns: Project, District, Budget ₹, Disbursed/Held/Pending (bar), Milestone, Status, Verification, Escrow ID
  - Each row is clickable → selects project and updates right rail
  - Milestone column uses existing 3-segment bar pattern (disbursed=action, held=border, pending=bg-muted)

**Right rail** (when project selected):
- **Project detail card** — Name, budget, timeframe, NGO partners
- **Milestone progress** — Full milestone track with labels/dates
- **Proof layer progress** — 4-layer checklist (same pattern as current Proof ledger)
- **Verification summary** — Verification count, last verified date
- **Lives impacted counter**

### 6.3 Escrow Tab (`activeNav === "escrow"`)

**Main content:**
- **Escrow summary strip** — Total in escrow, total released, pending approvals count
- **Escrow accounts table** — Columns: Account ID, Project, Deposited, Released, Balance, Status (active/completed/frozen)
- **Each account expandable** — On click, shows release schedule:
  - Release ID, Milestone, Amount, Scheduled date, Status (scheduled/released/pending-approval/held), Verifier

**Right rail:**
- **Pending approvals queue** — List of releases needing approval
  - Each item: Project name, milestone, amount, scheduled date
  - Approve / Hold buttons
- **Escrow balance chart** — Simple stacked mini bar showing deposited vs released vs balance

### 6.4 Proof Tab (`activeNav === "proof"`)

**Main content:**
- **Proof matrix** — Table/grid with Projects as rows, Proof layers as columns:
  - Layers: Geo-tagged photo, Independent verifier, Community validation, Outcome measured
  - Cell: ✓ (done) / — (not done) / ◐ (partial)
- **Verification evidence list** — Below the matrix, a list of recent verification events:
  - Verifier name, role, project, date, outcome (pass/fail/partial)
  - Click to see evidence URLs and notes

**Right rail:**
- **Verification stats** — Passed (8), Failed (1), Partial (1), Pending (5)
- **Download all evidence** button
- **Generate board report** button

### 6.5 Compliance Tab (`activeNav === "compliance"`)

**Main content:**
- **Compliance calendar** — Timeline of CSR deadlines for the year:
  - FY start → Q1 report → Q2 report → Q3 report → FY end → Deadline → Audit
  - Each item: date, label, status (completed/in-progress/pending)
- **Annual reports table** — Quarterly CSR reports:
  - Report, FY, Generated, Obligations met, Status
  - Actions: View / Download / Submit

**Right rail:**
- **Compliance checklist** — Items: CSR-1 filing, 80G renewal, Annual Report, Board sign-off
- **Status badge** — "All funds compliant" / "Action needed"
- **Next audit** date with countdown
- **CSR calendar link** (reuse current pattern)

### 6.6 Impact Tab (`activeNav === "impact"`)

**Main content:**
- **Hero impact stat** — Lives impacted (11,000) with odometer animation
- **Metric cards grid** — 3×2 grid:
  - Lives impacted (11K), Wounds healed (5), Verifications pass (8)
  - Districts covered (5), NGO partners (4), Avg project budget (₹14.3L)
- **Impact by category chart** — Simple bar chart (CSS-based, no charting library):
  - Water: 3 projects, Sanitation: 2, Education: 1, Health: 1
- **Impact by district list** — Table: District, Projects, Lives impacted, Wounds healed

**Right rail:**
- **Verification rate ring** — Pass rate of verifications (80% pass rate)
- **Key quote** from a community member
- **Share impact** button / Export infographic

---

## 7. Data Flow

All mock data lives in `lib/mock-data.ts` (new exports). The page imports:

```typescript
import {
  CSR_ENTITY,
  CSR_OBLIGATION,
  CSR_PROJECTS,
  ESCROW_ACCOUNTS,
  IMPACT_METRICS,
  COMPLIANCE_REPORTS,
  VERIFICATION_EVENTS,
  FUNDING,
  type CSRProject,
  type EscrowAccount,
  type CSRObligation,
  // ...
} from "@/lib/mock-data";
```

State management stays simple (local `useState`), matching existing patterns:
- `activeNav` — controls which tab is shown
- `selectedProject` — controls right-rail project detail in Projects/Proof tabs
- `selectedEscrow` — controls which escrow account is expanded
- No global state, no React Context here (consistent with other role pages)

---

## 8. Design System Usage

| Element | CSS class / pattern |
|---------|---------------------|
| Page header | `text-h1` + `role-badge` + `role-dot` |
| Metric cards | `card card-metric` with `text-number` |
| Tab navigation | `chip` / `chip selected` (mobile) or `tab-item` (desktop sidebar) |
| Data tables | `table-container` + `data-table` with `cell-right` |
| Status indicators | `StatusPill` component + existing `pill--*` classes |
| Verdicts | `feedback feedback--positive/negative/neutral` |
| Buttons | `btn btn-primary`, `btn btn-outline`, `btn-sm`, `btn-report` |
| Cards | `card`, `card-compact` |
| Dividers | `divider`, `divider-spaced` |
| Progress bars | Inline `milestone-track` + `milestone-segment` (from existing) |
| Milestone dots | Inline style (from FundingSection.tsx pattern) |
| Score rings | Inline SVG with `strokeDasharray` (reuse existing pattern) |
| Number counters | `text-number` + `text-mono` |
| Typography | `text-h2`/`text-h3` for section headings, `text-label-up` for meta |
| Delta indicators | `delta delta-up/down/flat` |
| Layout | `layout-split`, `split-main-rail`, responsive with `.desktop-only`/`.mobile-only` |
| Animations | `motion.div` with `framer-motion` (fade-in-up), `.stagger` children |

---

## 9. Existing Resources to Reuse

| Resource | Location | How to reuse |
|----------|----------|--------------|
| `StatusPill` | `app/components/StatusPill.tsx` | Already imported — reuse as-is |
| `FundingSection` | `app/components/FundingSection.tsx` | Can be reused in Escrow tab for milestone detail views |
| `VerificationEventCard` | `app/components/VerificationEventCard.tsx` | Reuse in Proof tab for verification event display |
| `VerificationEvent` type | `lib/mock-data.ts` | Already defined — use in Proof tab |
| `FundingEntry` type | `lib/mock-data.ts` | Already defined — extend or reuse |
| `FUNDING` data | `lib/mock-data.ts` | Reference data for escrow/project amounts |
| `VERIFICATION_EVENTS` | `lib/mock-data.ts` | Reuse in Proof tab |
| `CATEGORY_META` | `lib/mock-data.ts` | For project category icons/labels |
| Icon patterns | `lucide-react` | Already in dependencies — use `Banknote`, `TrendingUp`, `LayoutDashboard`, `CheckCircle`, `Clock`, `FileText`, `Download`, `Calendar`, `Users`, `HeartPulse` etc. |

---

## 10. No-External-Dependency Rule

DO NOT add new npm packages (no recharts, nivo, chart.js, victory). Use:
- Inline SVG for score rings / donut charts (already proven pattern)
- CSS + Tailwind for bar charts (already proven pattern)
- `framer-motion` for all animations (already in deps)
- Native CSS grid/flexbox for layout
- `lucide-react` for all icons

---

## 11. Implementation Order

| Step | Task | Est. lines |
|------|------|-----------|
| 1 | Add new data types + mock data to `lib/mock-data.ts` | ~250 |
| 2 | Rewrite `app/corporate/page.tsx`: header, metric strip, tabs | ~120 |
| 3 | Implement OverviewTab content (obligation gauge, compliance score, quick stats) | ~80 |
| 4 | Implement ProjectsTab (filter bar, data table, right-rail detail) | ~120 |
| 5 | Implement EscrowTab (summary strip, accounts table, release schedules) | ~100 |
| 6 | Implement ProofTab (proof matrix, verification evidence list) | ~100 |
| 7 | Implement ComplianceTab (deadline calendar, annual reports table) | ~80 |
| 8 | Implement ImpactTab (hero stat, metric grid, category charts) | ~100 |
| **Total** | | **~950** |

---

## 12. Exports

After implementation, the following new symbols will be exported from `lib/mock-data.ts`:

```typescript
// Types
export type { CSRObligation, CSRProject, EscrowAccount, EscrowRelease, ComplianceReport, ProofLayer };
// Data
export { CSR_ENTITY, CSR_OBLIGATION, CSR_PROJECTS, ESCROW_ACCOUNTS, IMPACT_METRICS, COMPLIANCE_REPORTS };
```

No existing exports or types are modified (only appended to).
