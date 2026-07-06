# Complete Wound Section Flow — Implementation Plan

## Overview

This plan covers the full redesign of the wound detail page and ecosystem in Setu. It extends the shared mock data layer with new types (verification events, corroborations, funding, timeline), creates reusable components, and reworks `wound/[id]/page.tsx` into a comprehensive, information-rich page.

**Total new/modified files**: 20
**Difficulty**: Medium-High (lots of UI composition, minimal new logic)

---

## Phase 1 — Extend Mock Data Layer

### File: `lib/mock-data.ts`

#### 1.1 — New Type Definitions (add after existing `Wound` interface)

```typescript
// ─── Verification Events ───
export interface VerificationEvent {
  id: string;
  woundId: string;
  verifierName: string;
  verifierRole: string;        // "Independent Verifier" | "Community Verifier" | "NGO"
  date: string;
  notes: string;
  outcome: "pass" | "fail" | "partial";
  evidenceUrls: string[];      // 1–4 photo URLs
}

// ─── Corroboration Entries ───
export interface CorroborationEntry {
  id: string;
  woundId: string;
  name: string;
  role: string;                // "Citizen" | "Teacher" | "Shopkeeper" | etc.
  time: string;                // relative time e.g. "2h ago"
  statement: string;           // short quote
  verified: boolean;           // whether this person has been independently verified
}

// ─── Funding / CSR Entry ───
export interface FundingEntry {
  source: string;              // e.g. "Aditya Infra Ltd · CSR"
  sourceType: "corporate" | "government" | "ngo" | "community";
  amount: string;              // e.g. "₹7.4L"
  currency: string;            // "INR"
  milestones: FundingMilestone[];
}

export interface FundingMilestone {
  label: string;               // e.g. "Site survey complete"
  status: "completed" | "in-progress" | "pending";
  date: string;
  amount: string;              // e.g. "₹2.0L"
}

// ─── Timeline Event ───
export interface TimelineEvent {
  id: string;
  woundId: string;
  type: "status-change" | "verification" | "corroboration" | "funding" | "note";
  date: string;
  title: string;
  description: string;
  actorName?: string;
  actorRole?: string;
  iconType?: string;           // 'status-change' | 'verification' | 'corroboration' | 'funding' | 'note'
}

// ─── Authority ───
export interface AuthorityInfo {
  department: string;          // e.g. "Jalgaon Zilla Parishad"
  departmentId: string;        // links to government actor
  sla: string;                 // e.g. "30 days"
  slaRemaining: number | null; // days remaining, null = not computed
  contactName: string;
  contactDesignation: string;
  status: "within-sla" | "overdue" | "no-response" | "resolved";
}
```

#### 1.2 — Extended Wound Interface (add fields to existing `Wound`)

```typescript
export interface Wound {
  // existing fields remain unchanged
  id: string;
  title: string;
  status: StatusKey;
  category: CategoryKey;
  corroborations: number;
  lng: number;
  lat: number;
  place: string;
  placeId: string;
  date: string;
  body: string;
  reportedBy?: string;
  healedBy?: string;
  fundedBy?: string;
  routedTo?: string;
  outcome?: [string, string][];

  // NEW FIELDS (all optional)
  proofUrls?: string[];           // before/after photo URLs
  verifications?: string[];       // IDs referencing VerificationEvent[]
  corroboratorEntries?: string[]; // IDs referencing CorroborationEntry[]
  funding?: FundingEntry[];
  timelineEvents?: string[];      // IDs referencing TimelineEvent[]
  authority?: AuthorityInfo;
  relatedWoundIds?: string[];     // IDs of wounds in the same area
}
```

#### 1.3 — Mock Data Population

Add ~15 `VerificationEvent` entries across different wounds. Example:

```typescript
export const VERIFICATION_EVENTS: VerificationEvent[] = [
  {
    id: "ver-001",
    woundId: "SETU-MH-0001",
    verifierName: "Sunil Pawar",
    verifierRole: "Independent Verifier",
    date: "02 Jun 2026",
    notes: "Pump structure intact. Water flow measured at 18L/min. Community confirms 9 days of continuous supply.",
    outcome: "pass",
    evidenceUrls: ["/evidence/mh0001-before.jpg", "/evidence/mh0001-after1.jpg", "/evidence/mh0001-after2.jpg"],
  },
  // ... 14 more across different wound states
];
```

Add ~12 `CorroborationEntry` entries — real-feeling quotes from different roles.

Add `FundingEntry` arrays for wounds that have `fundedBy` set (SETU-MH-0001, SETU-MH-0008, SETU-MH-0009, SETU-MH-0010). Each with 2–4 milestones.

Add `TimelineEvent` arrays for 6–8 wounds with 4–8 events each covering the wound's full lifecycle.

Add `AuthorityInfo` objects for wounds with status `routed` or `in-progress`.

Add `relatedWoundIds` to cluster wounds by placeId (e.g. all Jalgaon wounds reference each other).

#### 1.4 — New Accessors

```typescript
export function getVerificationEvents(woundId: string): VerificationEvent[] { ... }
export function getCorroborationEntries(woundId: string): CorroborationEntry[] { ... }
export function getFunding(woundId: string): FundingEntry[] | undefined { ... }
export function getTimelineEvents(woundId: string): TimelineEvent[] { ... }
export function getRelatedWounds(woundId: string): Wound[] { ... }
export function getAuthority(woundId: string): AuthorityInfo | undefined { ... }
```

---

## Phase 2 — Supporting Components

### File: `app/components/ProofGallery.tsx`

A horizontal photo carousel for before/after evidence.

**Props**: `{ images?: string[], woundTitle?: string }`

**Structure**:
- If no images, show a "hatch" placeholder with camera icon + "Photo evidence not yet available"
- If images exist, render a horizontal scroll container (`overflow-x: auto`) with snap-scroll
- Each image card: 280px wide, 200px tall, rounded card with subtle border, aspect-ratio crop
- Label overlay for "Before" / "After" / "Evidence" based on index hint (optional)
- Click to "enlarge" — could be a simple lightbox state (full-screen overlay)
- Use `aspectRatio: "4/3"`, `objectFit: "cover"`, `borderRadius: "var(--radius-card)"`

**Styling tokens**: `--bg-raised`, `--border`, `--radius-card`, `--text-3`, `.card`

### File: `app/components/VerificationEventCard.tsx`

A single verification event display.

**Props**: `{ event: VerificationEvent }`

**Structure**:
- Card container (`.card` class)
- Row: Verifier avatar (initials circle, 32px) + name + role + date
- Pass/Fail badge (`.pill--healed` for pass, `.pill--failed` for fail, custom for partial)
- Notes paragraph (`.text-body text-2`)
- If `evidenceUrls` exist, render small gallery thumbnails (3–4 thumbnails, 72×72, click to enlarge)
- Use `framer-motion` fade-in

### File: `app/components/CorroborationList.tsx`

Shows corroborators and the "Add your witness" flow.

**Props**: `{ entries: CorroborationEntry[], woundId: string, count: number }`

**Structure**:
- Header: count (large number) + label "corroborations" + "Add your witness" button
- List of corroborator cards: name (or "Anonymous"), role pill, relative time, statement quote in italics
- Verified checkmark icon for verified corroborators (green, using status-healed color)
- "Add your witness" button opens an inline form (useState toggle)
  - Name input (optional — "Anonymous" default)
  - Role dropdown
  - Statement textarea
  - Submit button (for now just adds to local state)
- List uses `.stagger` animation class for staggered fade-in

### File: `app/components/FundingSection.tsx`

CSR funding details with milestone tracker.

**Props**: `{ funding?: FundingEntry[], woundStatus?: StatusKey }`

**Structure**:
- If no funding data, return null
- For each funding source:
  - Source name with icon (role-based dot color: --role-corp, --role-gov, --role-ngo)
  - Total amount displayed prominently (`.text-number`)
  - Milestone progress bar: completed / total milestones
  - Timeline of milestones, each with:
    - Left dot (green=completed, amber=in-progress, gray=pending)
    - Label + amount + date
    - Uses `.spine` pattern but horizontal/compact

### File: `app/components/AuthoritySection.tsx`

Responsible government body, SLA status, contact.

**Props**: `{ authority: AuthorityInfo }`

**Structure**:
- Card with department name as header
- SLA timer: "within SLA" (green) or "OVERDUE by X days" (red/orange)
  - Use `.feedback--positive` or `.feedback--negative` classes
- Contact info: name, designation
- "View department profile" link → `/profile` (or `/government` eventually)
- Jurisdiction details (state, district)

### File: `app/components/ExpandedJourneyTimeline.tsx`

A timeline with rich event markers between status transitions.

**Props**: `{ events: TimelineEvent[], woundStatus: StatusKey, woundDate: string }`

**Structure**:
- Replaces the simple `buildJourney()` spine in the current page
- Mix of "milestone" nodes (status changes) and "event" nodes (verifications, corroborations, funding)
- Status milestones use existing `.spine-dot--done` / `.spine-dot--active` / `.spine-dot--origin` classes
- Event nodes use `.spine-dot--event` with inner colored dot based on event type:
  - Verification: `--st-healed-mark`
  - Corroboration: `--st-open-mark`
  - Funding: `--st-gov-mark`
  - Note: `--text-3`
- Each node has:
  - Icon/badge (colored dot or icon)
  - Title (bold)
  - Description (caption, text-2 color)
  - Date (monospace, small)
  - Actor name if available (linked to profile)
- Uses `.spine-wrapper`, `.spine-rail`, `.spine-node` CSS classes
- Uses `framer-motion` staggered entrance

### File: `app/components/RelatedWounds.tsx`

A sidebar/list of wounds in the same area.

**Props**: `{ wounds: Wound[], currentId: string }`

**Structure**:
- Compact cards (`.card-compact`)
- Each card: title (`.text-label`), status pill, place, date
- Link to `/wound/{id}`
- If empty, show "No related wounds found"
- Max 5 items, sorted by date descending

### File: `app/components/WoundActionBar.tsx`

Share and export actions for the wound.

**Props**: `{ woundId: string, woundTitle: string }`

**Structure**:
- Horizontal row of icon buttons:
  - Share (link copy) — uses `navigator.clipboard.writeText()`
  - Export PDF placeholder — button with "Coming soon" tooltip
  - Print — `window.print()`
- Style: transparent/ghost buttons, small, right-aligned
- Uses `.btn-icon` class pattern

### File: `app/components/CorroborationForm.tsx`

The inline form for adding a witness statement.

**Structure**:
- Name field (`.input`, optional, default "Anonymous")
- Role field (dropdown/select styled as `.input`)
- Statement textarea (`.input`-like styling, 4 rows)
- Submit + Cancel buttons (`.btn-primary btn-sm`, `.btn-ghost btn-sm`)
- Form validation: statement required, min 10 chars
- On submit: add to local state, show success feedback (`.feedback--positive`)

---

## Phase 3 — Enhanced Wound Detail Page

### File: `app/wound/[id]/page.tsx` (rewrite)

#### 3.1 — Page Structure

The page splits into a **two-column layout** on desktop (`grid-template-columns: 1.3fr 1fr` → mobile: `1fr`).

**Left Column** (main narrative):
1. Breadcrumb: Back to [Place]
2. Status pill + Category chip
3. Title (`.text-h1`, serif)
4. Meta row: place, date, wound ID (monospace)
5. **Proof Gallery** (new component)
6. Body text (`.text-body text-2`)
7. Outcome metrics (existing card, enhanced)
8. **Corroboration Section** (new, with inline form)
9. **Funding Section** (new)
10. **Authority Section** (new)
11. Legality & Jurisdiction (existing accordion, enhanced with department details)
12. **Related Wounds** (new)

**Right Column** (meta & journey):
1. **Action Bar** (share/export)
2. **Wound ID + Timestamps** (reported/updated dates, monospace)
3. **Expanded Journey Timeline** (new — replaces old simple spine)
4. **Verification Timeline** (new — verification event cards)
5. "View on the Atlas" link

#### 3.2 — Responsive Behavior

- Desktop (≥900px): Two-column grid, right column sticky (`position: sticky; top: 24px`)
- Mobile (<900px): Single column, all sections stacked
  - Corroboration form goes full-width
  - Action bar collapses to icon row
  - Timeline shifts from right rail into main flow after body text

#### 3.3 — Animation Pattern

Follow the existing pattern from `/home/page.tsx` and the current wound page:
- `motion.div` with `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`
- Spring easing: `[0.16, 1, 0.3, 1]` (aka `var(--ease)`)
- Column-level delays: left column at 0s, right column at 0.15s
- Internal sections within each column use the `.stagger` CSS class or individual motion divs with 0.05s delay increments

#### 3.4 — Data Flow

```typescript
const wound = getWound(woundId);
const place = wound ? getPlace(wound.placeId) : undefined;
const verifications = wound ? getVerificationEvents(woundId) : [];
const corroborations = wound ? getCorroborationEntries(woundId) : [];
const funding = wound ? getFunding(woundId) : undefined;
const timelineEvents = wound ? getTimelineEvents(woundId) : [];
const related = wound ? getRelatedWounds(woundId) : [];
const authority = wound ? getAuthority(woundId) : undefined;
```

#### 3.5 — Page Sections Detail

**Breadcrumb**: Link to `/place/${wound.placeId}`, text "Back to {place.name}", same pattern as current page.

**Meta Row**: `{place} · {date} · ID: {wound.id}` in monospace text, `.text-2` color.

**Proof Gallery**: Full component as described above.

**Outcome Metrics**: Enhanced from current — if funding exists, show the most relevant metric alongside outcome (e.g. "₹7.4L delivered" next to "340 families served").

**Corroboration Section**: List + form, as described.

**Funding Section**: Show only if funding data exists. Milestone progress with visual bar.

**Authority Section**: Show only for `routed` or `in-progress` wounds with authority data. SLA timer with urgency color.

**Legality & Jurisdiction**: Enhanced from current accordion — includes the actual department name, contact info, and a link to the relevant legal framework.

**Expanded Journey Timeline**: The full spine as described, replacing the simple `buildJourney()`.

**Verification Timeline**: If verification events exist, show them in reverse chronological order below the journey spine.

**Action Bar**: At the top of the right column, for share/export.

---

## Phase 4 — CSS Additions

### File: `app/globals.css` (small additions)

Add these CSS classes to support new components. All following existing patterns:

```css
/* Enhanced spine event dot */
.spine-dot--event { ... } /* already exists at line 363 */

/* Corroboration quote style */
.corroboration-quote {
  font-style: italic;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.55;
  padding-left: 12px;
  border-left: 2px solid var(--border);
}

/* Photo gallery snap container */
.gallery-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}
.gallery-scroll > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* Milestone progress bar */
.milestone-track {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
}
.milestone-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  transition: background 0.3s;
}
.milestone-segment.filled { background: var(--st-healed-mark); }
.milestone-segment.active { background: var(--action); }
.milestone-segment.empty { background: var(--bg-muted); }

/* Wound detail meta row */
.wound-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-3);
}

/* Lightbox overlay */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.lightbox-overlay img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--radius-card);
  object-fit: contain;
}
```

---

## Phase 5 — Implementation Order

This ordering minimizes merge conflicts and allows testing as you go:

| Step | File(s) | What |
|------|---------|------|
| 1 | `lib/mock-data.ts` | Add type definitions (interfaces) |
| 2 | `lib/mock-data.ts` | Add mock data arrays + accessors |
| 3 | `app/globals.css` | Add new CSS utility classes |
| 4 | `app/components/ProofGallery.tsx` | Photo carousel component |
| 5 | `app/components/VerificationEventCard.tsx` | Verification card component |
| 6 | `app/components/WoundActionBar.tsx` | Share/Export bar |
| 7 | `app/components/CorroborationForm.tsx` | Inline witness form |
| 8 | `app/components/CorroborationList.tsx` | List (imports form) |
| 9 | `app/components/FundingSection.tsx` | Funding + milestones |
| 10 | `app/components/AuthoritySection.tsx` | Authority info |
| 11 | `app/components/ExpandedJourneyTimeline.tsx` | Rich timeline |
| 12 | `app/components/RelatedWounds.tsx` | Related wounds list |
| 13 | `app/wound/[id]/page.tsx` | Rewrite detail page compositing all components |

Each component should be independently navigable via Next.js if imported as a page sub-component. The order ensures each component is created before it's needed by the main page.

---

## Design Consistency Checklist

Every component must follow these exact rules:

✅ **Colors**: Use CSS var tokens (`--action`, `--text`, `--text-2`, `--text-3`, `--border`, `--bg-raised`, `--bg-muted`, `--bg-alt`, `--st-*` status colors, `--role-*` role colors). Never use hardcoded hex values except for very specific cases (and even then prefer the `--c-*` palette vars).

✅ **Typography**: Use `.text-h1`, `.text-body`, `.text-caption`, `.text-label`, `.text-label-up`, `.text-number`, `.text-mono` classes. The serif font is for headings in stream-like cards; the main page headings can use `.text-serif` where dramatic.

✅ **Spacing**: Use the prescribed gap classes (`gap-8`, `gap-12`, `gap-16`, `gap-20`, `gap-24`, `gap-32`). Card padding = 24px (`.card`), compact = 16px (`.card-compact`).

✅ **Radii**: `var(--radius-card)` = 18px for cards, `var(--radius-pill)` = 9999px for pills/buttons, `var(--radius-input)` = 10px for inputs.

✅ **Buttons**: Use `.btn` + variant (`.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-icon`) + size (`.btn-sm`).

✅ **Cards**: Use `.card` class as base. Hover effect uses `var(--shadow-panel)`.

✅ **Animation**: framer-motion with `[0.16, 1, 0.3, 1]` cubic-bezier. Staggered entrance via `.stagger` class or explicit motion delays in 0.05s increments.

✅ **Responsive**: Use `mob-px-16`, `mob-col-1`, `mob-flex-col` utility classes. Breakpoint at 640px for mobile overrides, 900px for layout change.

✅ **Empty states**: Every section must handle the case where its data is empty/null — show a meaningful placeholder (hatch pattern, ghost text, or "No data" message), never crash or render nothing silently.

✅ **No synthetic data in components**: Components receive data via props. Mock data lives only in `lib/mock-data.ts`. This keeps components clean for future API integration.

---

## Future Considerations (not in scope for this plan)

1. **Image hosting**: `proofUrls` currently use `/evidence/` path references; replace with actual S3/Cloudinary URLs in production.
2. **Real-time**: Corroboration entries and timeline events will come from WebSocket/SSE in production; the static mock is fine for now.
3. **Verification flow**: The verifier page at `/verifier` already exists as a separate mobile-like flow. The verification timeline on the wound page just *displays* verification events — creating/filing verifications lives on the verifier page.
4. **API integration**: Replace `getWound()`, `getPlace()`, etc. with `fetch()` calls to the Setu API; the interfaces from Phase 1 remain the contract.
