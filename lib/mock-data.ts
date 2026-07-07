/* ================================================================
   सेतु · SETU — Shared Mock Data
   One source of truth for wounds, actors, places, and taxonomies.
   ================================================================ */

export type StatusKey = "reported" | "assessing" | "routed" | "in-progress" | "healed" | "not-achieved";
export type CategoryKey = "water" | "sanitation" | "roads" | "education" | "health" | "elder";
export type RoleKey = "citizen" | "ngo" | "corporate" | "government";

export const STATUS_META: Record<StatusKey, { label: string; glyph: string; pillCls: string; mark: string }> = {
  "reported":      { label: "Reported",       glyph: "●", pillCls: "pill--open",     mark: "#5C6B7A" },
  "assessing":     { label: "Assessing",      glyph: "◆", pillCls: "pill--assess",   mark: "#A9750C" },
  "routed":        { label: "Routed · Gov",   glyph: "▏", pillCls: "pill--gov",      mark: "#2A6DB0" },
  "in-progress":   { label: "In Progress",    glyph: "▲", pillCls: "pill--active",   mark: "#12564F" },
  "healed":        { label: "Healed",         glyph: "＋", pillCls: "pill--healed",   mark: "#2F9E5E" },
  "not-achieved":  { label: "Not Achieved",   glyph: "—", pillCls: "pill--failed",   mark: "#C25A1E" },
};

export const CATEGORY_META: Record<CategoryKey, { label: string; icon: string; color: string }> = {
  water:      { label: "Water",      icon: "M12 2s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z", color: "var(--c-p-400)" },
  sanitation: { label: "Sanitation", icon: "M4 10h16M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4M8 10v10M16 10v10", color: "var(--st-gov-mark)" },
  roads:      { label: "Roads",      icon: "M4 22L9 2M20 22l-5-20M12 6v2M12 12v2M12 18v2", color: "var(--st-assess-mark)" },
  education:  { label: "Education",  icon: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5", color: "var(--st-healed-mark)" },
  health:     { label: "Health",     icon: "M3 12h4l2-6 4 12 2-6h6", color: "var(--st-failed-mark)" },
  elder:      { label: "Elder",      icon: "M12 21v-7M9 14h6M9 6a3 3 0 116 0c0 2-3 3-3 5", color: "var(--st-open-mark)" },
};

// ─── Verification Events ───
export interface VerificationEvent {
  id: string;
  woundId: string;
  verifierName: string;
  verifierRole: string;
  date: string;
  notes: string;
  outcome: "pass" | "fail" | "partial";
  evidenceUrls: string[];
}

// ─── Corroboration Entries ───
export interface CorroborationEntry {
  id: string;
  woundId: string;
  name: string;
  role: string;
  time: string;
  statement: string;
  verified: boolean;
}

// ─── Funding / CSR Entry ───
export interface FundingMilestone {
  label: string;
  status: "completed" | "in-progress" | "pending";
  date: string;
  amount: string;
}
export interface FundingEntry {
  source: string;
  sourceType: "corporate" | "government" | "ngo" | "community";
  amount: string;
  milestones: FundingMilestone[];
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
}

// ─── Authority Info ───
export interface AuthorityInfo {
  department: string;
  departmentId: string;
  sla: string;
  slaRemaining: number | null;
  contactName: string;
  contactDesignation: string;
  status: "within-sla" | "overdue" | "no-response" | "resolved";
}

// ─── CSR / Compliance Dashboard Types ───
export interface CSRCompany {
  id: string;
  name: string;
  logoBg: string;
  industry: string;
  financialYear: string;
  csrObligation: number; // in INR Cr
  csrSpent: number;
  csrUnspent: number;
  csrDeadline: string;
  projectsActive: number;
  projectsCompleted: number;
  complianceScore: number; // 0-100
  totalImpact: { lives: number; woundsHealed: number; statesReached: number };
}

export interface CSREscrow {
  id: string;
  companyId: string;
  projectName: string;
  totalAmount: number;
  disbursed: number;
  held: number;
  pending: number;
  nextRelease: string;
  status: "active" | "completed" | "paused";
}

export interface CSRComplianceReport {
  year: string;
  filed: boolean;
  dueDate: string;
  filedDate?: string;
  status: "filed" | "overdue" | "pending";
  accuracyScore: number;
  notes?: string;
}

/* ─── Wounds ─── */
export interface Wound {
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

  // NEW FIELDS
  proofUrls?: string[];
  verifications?: string[];
  corroboratorEntries?: string[];
  funding?: FundingEntry[];
  timelineEvents?: string[];
  authority?: AuthorityInfo;
  relatedWoundIds?: string[];
}

export const WOUNDS: Wound[] = [
  { id: "SETU-UP-0001", title: "No girls' toilet — ZP School, Bhadli", status: "assessing", category: "education", corroborations: 96, lng: 78.04, lat: 27.18, place: "Bhadli, UP", placeId: "bhadli", date: "reported 20 Jun 2026", body: "Older girls stop attending after puberty. Flagged from UDISE data and confirmed by three parents." },
  { id: "SETU-UP-0002", title: "Arsenic in the hand-pump water", status: "in-progress", category: "water", corroborations: 120, lng: 81.83, lat: 25.43, place: "UP", placeId: "prayagraj", date: "reported 15 Jun 2026", body: "Lab tests confirm arsenic beyond safe limits in two of three village handpumps.", corroboratorEntries: ["COR-UP-0002-001"] },
  { id: "SETU-UP-0003", title: "Open drain beside the primary school", status: "reported", category: "sanitation", corroborations: 41, lng: 80.95, lat: 26.85, place: "UP", placeId: "prayagraj", date: "reported 18 Jun 2026", body: "Stagnant sewage beside the school wall. Children walk through it daily." },
  { id: "SETU-UP-0004", title: "Streetlights dark on the highway stretch", status: "routed", category: "roads", corroborations: 33, lng: 79.92, lat: 24.55, place: "UP", placeId: "prayagraj", date: "routed 10 Jun 2026", body: "Three kilometres of dark highway. Routed to the state electricity board with 33 witnesses." },

  { id: "SETU-BR-0001", title: "Nine deaths, one poisoned well — Buxar", status: "in-progress", category: "water", corroborations: 212, lng: 84.08, lat: 25.56, place: "Buxar, Bihar", placeId: "buxar", date: "reported 05 Jun 2026", body: "A contaminated well serving six hamlets. Nine deaths over three months before it was reported here." },
  { id: "SETU-BR-0002", title: "Flooded approach road to the clinic", status: "routed", category: "roads", corroborations: 88, lng: 85.31, lat: 25.09, place: "Bihar", placeId: "patna", date: "routed 12 Jun 2026", body: "The only road to the PHC is underwater for the third monsoon running. Routed to the roads department." },
  { id: "SETU-BR-0003", title: "No ANM centre within 12 km", status: "assessing", category: "health", corroborations: 64, lng: 86.98, lat: 25.59, place: "Bihar", placeId: "patna", date: "reported 01 Jun 2026", body: "Pregnant women travel 12 km for check-ups. Assessing for a mobile ANM solution." },
  { id: "SETU-BR-0004", title: "Girls' hostel toilet block collapsed", status: "reported", category: "education", corroborations: 29, lng: 83.23, lat: 24.74, place: "Bihar", placeId: "buxar", date: "reported 22 Jun 2026", body: "The toilet block of the only girls' hostel collapsed in the last rain. 40 residents share one functional toilet." },

  { id: "SETU-MH-0001", title: "Handpump dry for 400 days — Ward 7", status: "healed", category: "water", corroborations: 247, lng: 75.56, lat: 21.00, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "healed Jun 2026", body: "The only pump serving 340 families had given rust for over a year. Revived through community-led aquifer recharge; water returned within nine days.", reportedBy: "citizen", healedBy: "ngo", fundedBy: "corporate", outcome: [["340", "families served"], ["+62%", "vs untreated wards"]], proofUrls: ["/evidence/photo-001.jpg", "/evidence/photo-002.jpg"], verifications: ["VER-MH-0001-A", "VER-MH-0001-B"], corroboratorEntries: ["COR-MH-0001-001", "COR-MH-0001-002"], relatedWoundIds: ["SETU-MH-0002", "SETU-MH-0005", "SETU-MH-0006", "SETU-MH-0008"] },
  { id: "SETU-MH-0002", title: "Open drain overflowing near the market", status: "in-progress", category: "sanitation", corroborations: 44, lng: 73.78, lat: 19.75, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "in progress", body: "Stagnant water and mosquitoes beside the vegetable market. Scoped and matched to a local implementer.", healedBy: "ngo", relatedWoundIds: ["SETU-MH-0001", "SETU-MH-0005", "SETU-MH-0006", "SETU-MH-0008"] },
  { id: "SETU-MH-0003", title: "Toilet block built — attendance didn't rise", status: "not-achieved", category: "education", corroborations: 34, lng: 76.96, lat: 18.52, place: "Hingoli, Maharashtra", placeId: "hingoli", date: "closed Mar 2026", body: "Built and verified, but attendance did not move. Reported honestly — the lesson reshapes how the next one is scoped.", fundedBy: "corporate", healedBy: "ngo" },
  { id: "SETU-MH-0004", title: "A widower, 79, with nowhere to go", status: "reported", category: "elder", corroborations: 12, lng: 74.50, lat: 20.00, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "reported 3d ago", body: "Reported by a neighbour, not the man himself. Elder day-care is lawful to fund and rarely is. Awaiting classification." },
  { id: "SETU-MH-0005", title: "Cables slung dangerously low — Ward 14", status: "routed", category: "roads", corroborations: 61, lng: 75.58, lat: 21.02, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "routed May 2026", body: "Low-hanging electrical cables across the lane. A government-duty wound — routed to MSEDCL with 61 witnesses attached.", reportedBy: "citizen", routedTo: "government", outcome: [["61", "witnesses"], ["14 days", "pending"]], corroboratorEntries: ["COR-MH-0005-001", "COR-MH-0005-002"], relatedWoundIds: ["SETU-MH-0001", "SETU-MH-0002", "SETU-MH-0006", "SETU-MH-0008"] },
  { id: "SETU-MH-0006", title: "Overflowing septic tank — Ward 9", status: "assessing", category: "sanitation", corroborations: 18, lng: 75.54, lat: 20.98, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "overdue 41 days", body: "Past the 30-day SLA window. Shown openly on the government's record. Escalated internally.", relatedWoundIds: ["SETU-MH-0001", "SETU-MH-0002", "SETU-MH-0005", "SETU-MH-0008"] },
  { id: "SETU-MH-0007", title: "Blocked storm drain — Market Road", status: "healed", category: "sanitation", corroborations: 30, lng: 75.57, lat: 21.01, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "resolved Apr 2026", body: "A clear municipal duty. Resolved by the ZP works department in nine days; confirmed by the residents who reported it.", routedTo: "government" },
  { id: "SETU-MH-0008", title: "Rooftop rainwater harvesting — 12 ZP schools", status: "in-progress", category: "water", corroborations: 52, lng: 75.56, lat: 21.00, place: "Jalgaon, Maharashtra", placeId: "jalgaon", date: "started 2026", body: "A costed, legality-cleared proposal chosen from Setu's pipeline. Funds in escrow, releasing against verified milestones.", fundedBy: "corporate", healedBy: "ngo", outcome: [["12", "schools"], ["3,400", "children"]], proofUrls: ["/evidence/photo-003.jpg", "/evidence/photo-004.jpg"], verifications: ["VER-MH-0008-A", "VER-MH-0008-B"], corroboratorEntries: ["COR-MH-0008-001"], relatedWoundIds: ["SETU-MH-0001", "SETU-MH-0002", "SETU-MH-0005", "SETU-MH-0006"] },
  { id: "SETU-MH-0009", title: "Village RO plant — Parbhani cluster", status: "not-achieved", category: "water", corroborations: 28, lng: 76.46, lat: 19.99, place: "Parbhani, Maharashtra", placeId: "parbhani", date: "closed Mar 2026", body: "Built and verified, but usage stayed low; the village kept to its old source. Reported honestly. The lesson reshaped how we scope community buy-in.", fundedBy: "corporate", healedBy: "ngo" },
  { id: "SETU-MH-0010", title: "Lake desilting & bund repair — Nashik Road", status: "in-progress", category: "water", corroborations: 180, lng: 73.80, lat: 19.99, place: "Nashik, Maharashtra", placeId: "nashik", date: "started Apr 2026", body: "A 35-year-dead lake being brought back. Funds held in escrow, released only against verified milestones.", fundedBy: "corporate", healedBy: "ngo", outcome: [["180", "borewells"], ["2 / 3", "milestones"]], proofUrls: ["/evidence/photo-005.jpg"], verifications: ["VER-MH-0010-A"] },

  { id: "SETU-KA-0001", title: "Lake revived — Kyalasanahalli model", status: "healed", category: "water", corroborations: 180, lng: 77.59, lat: 12.97, place: "Bengaluru, Karnataka", placeId: "bengaluru", date: "healed Feb 2026", body: "A 35-year-dead lake now holds water again. 180 borewells recharged. Verified by the villagers who reported it.", proofUrls: ["/evidence/photo-006.jpg"], verifications: ["VER-KA-0001-A", "VER-KA-0001-B"] },
  { id: "SETU-KA-0002", title: "School library with no roof", status: "in-progress", category: "education", corroborations: 52, lng: 75.71, lat: 15.32, place: "Karnataka", placeId: "bengaluru", date: "reported 10 Jun 2026", body: "Books ruined every monsoon. The library has been closed for six months." },

  { id: "SETU-TN-0001", title: "Fluoride in three village wells", status: "assessing", category: "water", corroborations: 73, lng: 78.66, lat: 11.12, place: "Tamil Nadu", placeId: "madurai", date: "reported 08 Jun 2026", body: "Dental fluorosis in children across three hamlets. Wells tested positive for excess fluoride." },
  { id: "SETU-TN-0002", title: "No ramp at the block hospital", status: "routed", category: "health", corroborations: 28, lng: 80.27, lat: 13.08, place: "Chennai, Tamil Nadu", placeId: "chennai", date: "routed 05 Jun 2026", body: "Wheelchair users cannot enter the hospital. A clear accessibility violation under RPwD Act." },

  { id: "SETU-GJ-0001", title: "Dying stepwell, foul water", status: "in-progress", category: "water", corroborations: 61, lng: 72.57, lat: 23.02, place: "Gujarat", placeId: "ahmedabad", date: "reported 12 Jun 2026", body: "A heritage stepwell that was the village's only water source is now foul and silted." },
  { id: "SETU-GJ-0002", title: "Salt-damaged school building", status: "reported", category: "education", corroborations: 19, lng: 70.20, lat: 22.60, place: "Gujarat", placeId: "bhavnagar", date: "reported 18 Jun 2026", body: "Coastal salt ingress has corroded the school structure. Three classrooms are unusable." },

  { id: "SETU-RJ-0001", title: "Water tanker arrives once a week", status: "routed", category: "water", corroborations: 57, lng: 74.22, lat: 27.02, place: "Rajasthan", placeId: "jodhpur", date: "routed 01 Jun 2026", body: "A village of 800 relies on one weekly tanker. Routed to the PHED with 57 witnesses." },
  { id: "SETU-RJ-0002", title: "Anganwadi with no toilet", status: "assessing", category: "sanitation", corroborations: 31, lng: 75.78, lat: 24.57, place: "Rajasthan", placeId: "jaipur", date: "reported 10 Jun 2026", body: "Children and staff use the open. Assessing for a quick sanitation intervention." },

  { id: "SETU-WB-0001", title: "Embankment breach floods the ward", status: "routed", category: "roads", corroborations: 70, lng: 87.75, lat: 22.99, place: "West Bengal", placeId: "kolkata", date: "routed 15 Jun 2026", body: "The embankment has breached for the third year. Routed to the irrigation department." },
  { id: "SETU-WB-0002", title: "Slum crèche needs clean water", status: "in-progress", category: "water", corroborations: 38, lng: 88.36, lat: 22.57, place: "Kolkata, West Bengal", placeId: "kolkata", date: "reported 20 Jun 2026", body: "A crèche serving 60 children has no safe water source. Scoped and matched to an implementer." },

  { id: "SETU-DL-0001", title: "Sewer worker safety gear absent", status: "assessing", category: "sanitation", corroborations: 143, lng: 77.21, lat: 28.61, place: "Delhi", placeId: "delhi", date: "reported 14 Jun 2026", body: "Manual scavenging without protective gear, in violation of the 2013 Act. 143 witnesses." },
  { id: "SETU-DL-0002", title: "Night shelter over capacity", status: "reported", category: "elder", corroborations: 22, lng: 77.08, lat: 28.80, place: "Delhi", placeId: "delhi", date: "reported 19 Jun 2026", body: "A night shelter built for 40 is housing 90. Elderly residents sleep in the corridor." },

  { id: "SETU-AS-0001", title: "Footbridge washed away, school cut off", status: "routed", category: "roads", corroborations: 40, lng: 91.75, lat: 26.20, place: "Assam", placeId: "guwahati", date: "routed 11 Jun 2026", body: "The only bridge to the village school was washed away. Children cross a stream on a log." },
  { id: "SETU-AS-0002", title: "No safe water in the tea-estate lines", status: "reported", category: "water", corroborations: 26, lng: 95.13, lat: 27.50, place: "Assam", placeId: "dibrugarh", date: "reported 21 Jun 2026", body: "Tea-estate workers' lines have no treated water. Chronic illness from stream water." },

  { id: "SETU-KL-0001", title: "Coastal well turned brackish", status: "in-progress", category: "water", corroborations: 33, lng: 76.27, lat: 10.85, place: "Kerala", placeId: "kochi", date: "reported 16 Jun 2026", body: "Sea ingress has salinated the village's wells. A reverse-osmosis plant is being scoped." },
];

export const WOUND_MAP: Record<string, Wound> = Object.fromEntries(WOUNDS.map(w => [w.id, w]));

export function getWound(id: string): Wound | undefined {
  return WOUND_MAP[id];
}

export function woundsByPlace(placeId: string): Wound[] {
  return WOUNDS.filter(w => w.placeId === placeId);
}

export function woundsByActor(actorId: string): Wound[] {
  return WOUNDS.filter(w => w.reportedBy === actorId || w.healedBy === actorId || w.fundedBy === actorId || w.routedTo === actorId);
}

// ─── Verification Events ───
export const VERIFICATION_EVENTS: VerificationEvent[] = [
  {
    id: "VER-MH-0001-A",
    woundId: "SETU-MH-0001",
    verifierName: "Dr. Suresh Patil",
    verifierRole: "Independent Water Auditor",
    date: "2026-05-10",
    notes: "Water yield measured at 1,200 L/hr — exceeds baseline of 200 L/hr. Community confirmed continuous flow for 14 consecutive days.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-001.jpg", "/evidence/photo-002.jpg", "/evidence/flow-report-mh0001.pdf"],
  },
  {
    id: "VER-MH-0001-B",
    woundId: "SETU-MH-0001",
    verifierName: "Anita Deshmukh",
    verifierRole: "Community Verifier",
    date: "2026-05-14",
    notes: "Interviewed 30 families. 29/30 confirmed water availability since recharge. One household reported intermittent pressure — logged for follow-up.",
    outcome: "pass",
    evidenceUrls: ["/evidence/interview-log-mh0001.pdf"],
  },
  {
    id: "VER-MH-0008-A",
    woundId: "SETU-MH-0008",
    verifierName: "Rajesh Iyer",
    verifierRole: "Civil Engineer",
    date: "2026-06-15",
    notes: "First 6 schools inspected. All tanks properly installed, gutters cleaned, first-flush diverters functional. Storage capacity as specified.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-003.jpg", "/evidence/inspection-report-schools-1-6.pdf"],
  },
  {
    id: "VER-MH-0008-B",
    woundId: "SETU-MH-0008",
    verifierName: "Priya Menon",
    verifierRole: "Education Dept. Auditor",
    date: "2026-07-01",
    notes: "Schools 7-12 installation in progress. Two sites have minor gutter alignment issues. Flagged for correction before next disbursement.",
    outcome: "partial",
    evidenceUrls: ["/evidence/photo-004.jpg", "/evidence/deficiency-note-schools-9-10.pdf"],
  },
  {
    id: "VER-MH-0010-A",
    woundId: "SETU-MH-0010",
    verifierName: "Dr. Kiran Joshi",
    verifierRole: "Hydrologist",
    date: "2026-06-20",
    notes: "Desilting verified at 85% of target depth. Bund wall reconstructed to 3.2m height (spec: 3.0m). Inlet channel clearing still in progress.",
    outcome: "partial",
    evidenceUrls: ["/evidence/photo-005.jpg", "/evidence/depth-survey-nashik.pdf"],
  },
  {
    id: "VER-KA-0001-A",
    woundId: "SETU-KA-0001",
    verifierName: "M. Venkatesh",
    verifierRole: "Independent Ecologist",
    date: "2026-02-20",
    notes: "Lake bed holds water at 2.8m depth (pre-monsoon). Native vegetation returning along banks. 180 borewells surveyed — 167 showed recovery.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-006.jpg", "/evidence/borewell-survey-ka0001.pdf"],
  },
  {
    id: "VER-KA-0001-B",
    woundId: "SETU-KA-0001",
    verifierName: "Lakshmi Devi",
    verifierRole: "Community Representative",
    date: "2026-02-25",
    notes: "Village panchayat resolution confirms water availability. 45 farmers attested to reduced borewell depth. No complaints received.",
    outcome: "pass",
    evidenceUrls: ["/evidence/panchayat-resolution-ka0001.pdf"],
  },
  {
    id: "VER-UP-0002-A",
    woundId: "SETU-UP-0002",
    verifierName: "Dr. Farhan Qureshi",
    verifierRole: "Public Health Officer",
    date: "2026-06-28",
    notes: "Lab re-test confirms arsenic at 0.12 mg/L and 0.09 mg/L in two handpumps (WHO limit: 0.01 mg/L). Third pump at 0.005 mg/L — safe.",
    outcome: "pass",
    evidenceUrls: ["/evidence/lab-report-up0002-a.pdf", "/evidence/lab-report-up0002-b.pdf"],
  },
  {
    id: "VER-BR-0001-A",
    woundId: "SETU-BR-0001",
    verifierName: "Dr. Nandini Singh",
    verifierRole: "District Health Officer",
    date: "2026-06-18",
    notes: "Confirmed 9 deaths linked to waterborne illness. Well water samples show E. coli and coliform contamination. Community instructed to cease use.",
    outcome: "pass",
    evidenceUrls: ["/evidence/health-report-br0001.pdf", "/evidence/water-test-br0001.pdf"],
  },
  {
    id: "VER-BR-0001-B",
    woundId: "SETU-BR-0001",
    verifierName: "Sanjay Tiwari",
    verifierRole: "Civil Society Observer",
    date: "2026-06-22",
    notes: "Six hamlets surveyed. All 212 corroborations verified against voter ID records. 209/212 confirmed personal knowledge of the contamination.",
    outcome: "pass",
    evidenceUrls: ["/evidence/verification-log-br0001.pdf"],
  },
  {
    id: "VER-MH-0005-A",
    woundId: "SETU-MH-0005",
    verifierName: "Vikram More",
    verifierRole: "Electrical Safety Inspector",
    date: "2026-05-25",
    notes: "Cables at 3.8m above road level (minimum: 6.1m). Exposed joints at two locations. Imminent safety hazard confirmed.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-007.jpg", "/evidence/safety-report-mh0005.pdf"],
  },
  {
    id: "VER-UP-0004-A",
    woundId: "SETU-UP-0004",
    verifierName: "Sunil Verma",
    verifierRole: "Road Safety Auditor",
    date: "2026-06-12",
    notes: "3 km stretch surveyed at night. Zero functional streetlights. 2 recent accident skid marks observed. Route serves school bus and auto traffic.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-008.jpg", "/evidence/night-survey-up0004.pdf"],
  },
  {
    id: "VER-MH-0003-A",
    woundId: "SETU-MH-0003",
    verifierName: "Meera Nair",
    verifierRole: "Building Inspector",
    date: "2026-02-28",
    notes: "Toilet block constructed to specification. 8 seats (4+4), separate entry, soak pit functional. Structural quality acceptable.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-009.jpg", "/evidence/inspection-report-mh0003.pdf"],
  },
  {
    id: "VER-MH-0002-A",
    woundId: "SETU-MH-0002",
    verifierName: "Dinesh Padwal",
    verifierRole: "Sanitation Inspector",
    date: "2026-07-05",
    notes: "Drain blocked with solid waste over 40m stretch. Stagnant water with mosquito breeding. Adjacent vegetable market reports odour complaints.",
    outcome: "pass",
    evidenceUrls: ["/evidence/photo-010.jpg", "/evidence/drain-assessment-mh0002.pdf"],
  },
];

// ─── Corroboration Entries ───
export const CORROBORATION_ENTRIES: CorroborationEntry[] = [
  {
    id: "COR-MH-0001-001",
    woundId: "SETU-MH-0001",
    name: "Prakash Girme",
    role: "Shopkeeper",
    time: "2026-05-12",
    statement: "I have been buying bottled water for my shop for 14 months because the handpump only gives rust. My monthly expense went from ₹200 to ₹1,200.",
    verified: true,
  },
  {
    id: "COR-MH-0001-002",
    woundId: "SETU-MH-0001",
    name: "Sunita Aghav",
    role: "Teacher",
    time: "2026-05-12",
    statement: "Half my students come to school late because they walk 2 km to the neighbouring ward for water. The ones who don't go early just go thirsty.",
    verified: true,
  },
  {
    id: "COR-MH-0005-001",
    woundId: "SETU-MH-0005",
    name: "Ravi Bhoir",
    role: "Auto Driver",
    time: "2026-05-20",
    statement: "I drive this lane every day. The cables swing down to head level when the wind blows. I have to stop and push them up with a stick.",
    verified: true,
  },
  {
    id: "COR-MH-0005-002",
    woundId: "SETU-MH-0005",
    name: "Abdul Sheikh",
    role: "Cycle Rickshaw Puller",
    time: "2026-05-20",
    statement: "Last Tuesday a cable caught my neck as I was cycling home. I fell off and sprained my wrist. No one from the board has come.",
    verified: true,
  },
  {
    id: "COR-MH-0008-001",
    woundId: "SETU-MH-0008",
    name: "Savita Nikam",
    role: "ASHA Worker",
    time: "2026-06-10",
    statement: "Every school I visit, the children complain of stomach pain. They drink from open wells when the tanker is late. Clean rainwater would save them.",
    verified: true,
  },
  {
    id: "COR-UP-0002-001",
    woundId: "SETU-UP-0002",
    name: "Md. Irfan",
    role: "Student, Class 10",
    time: "2026-06-16",
    statement: "My mother has had white patches on her skin for two years. The doctor said it is arsenic. We only drink from the handpump — there is no other source.",
    verified: true,
  },
  {
    id: "COR-BR-0001-001",
    woundId: "SETU-BR-0001",
    name: "Ram Prasad",
    role: "Village Elder",
    time: "2026-06-08",
    statement: "Three months, nine deaths. My neighbour's son was the last — strong boy, 24 years old. He collapsed after drinking from the well. I have lived here 60 years and never seen this.",
    verified: true,
  },
  {
    id: "COR-KA-0001-001",
    woundId: "SETU-KA-0001",
    name: "Muniyappa",
    role: "Farmer",
    time: "2026-02-15",
    statement: "My borewell was dry for five years. After the lake revival, water came back at 40 feet. I harvested rabi this year for the first time since 2021.",
    verified: true,
  },
  {
    id: "COR-UP-0004-001",
    woundId: "SETU-UP-0004",
    name: "Shanti Devi",
    role: "Shopkeeper",
    time: "2026-06-10",
    statement: "The highway is pitch dark after 7 PM. My husband was robbed last month. I close my shop at 6 now — I lose ₹800 a day in evening business.",
    verified: false,
  },
  {
    id: "COR-MH-0002-001",
    woundId: "SETU-MH-0002",
    name: "Prakash Patil",
    role: "Vegetable Vendor",
    time: "2026-06-30",
    statement: "The stench from the open drain drives my customers away. And the mosquitoes — my two-year-old had dengue last monsoon. I am terrified of another outbreak.",
    verified: true,
  },
  {
    id: "COR-MH-0003-001",
    woundId: "SETU-MH-0003",
    name: "Geeta Shinde",
    role: "School Principal",
    time: "2026-03-05",
    statement: "They built a beautiful toilet block. But the girls still don't come. The toilet is not the problem — the problem is the road, the distance, the marriage pressure. We told them this.",
    verified: true,
  },
  {
    id: "COR-BR-0002-001",
    woundId: "SETU-BR-0002",
    name: "Kamala Devi",
    role: "ANM Nurse",
    time: "2026-06-14",
    statement: "Last monsoon a pregnant woman went into labour on the boat crossing the flooded road. She lost the baby. If the road is fixed, we can reach the clinic in 20 minutes instead of 3 hours.",
    verified: true,
  },
];

// ─── Funding / CSR Records ───
export const FUNDING: Record<string, FundingEntry[]> = {
  "SETU-MH-0001": [
    {
      source: "Aditya Infra Ltd CSR",
      sourceType: "corporate",
      amount: "₹7,40,000",
      milestones: [
        { label: "Aquifer recharge structure", status: "completed", date: "2026-04-15", amount: "₹4,20,000" },
        { label: "Community training & handover", status: "completed", date: "2026-05-05", amount: "₹1,20,000" },
        { label: "Verification & reporting", status: "completed", date: "2026-05-20", amount: "₹2,00,000" },
      ],
    },
  ],
  "SETU-MH-0008": [
    {
      source: "Aditya Infra Ltd CSR",
      sourceType: "corporate",
      amount: "₹31,00,000",
      milestones: [
        { label: "Site assessment & design", status: "completed", date: "2026-03-01", amount: "₹2,00,000" },
        { label: "Installation — 6 schools (Phase 1)", status: "completed", date: "2026-05-15", amount: "₹12,00,000" },
        { label: "Installation — 6 schools (Phase 2)", status: "in-progress", date: "2026-07-15", amount: "₹12,00,000" },
        { label: "Training & handover", status: "pending", date: "2026-08-30", amount: "₹5,00,000" },
      ],
    },
  ],
  "SETU-MH-0010": [
    {
      source: "Aditya Infra Ltd CSR",
      sourceType: "corporate",
      amount: "₹22,00,000",
      milestones: [
        { label: "Lake desilting — Phase 1", status: "completed", date: "2026-05-10", amount: "₹8,00,000" },
        { label: "Bund wall reconstruction", status: "completed", date: "2026-06-15", amount: "₹7,00,000" },
        { label: "Inlet channel restoration", status: "in-progress", date: "2026-07-20", amount: "₹5,00,000" },
        { label: "Community handover & final verification", status: "pending", date: "2026-09-01", amount: "₹2,00,000" },
      ],
    },
  ],
};

// ─── Timeline Events ───
export const TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  "SETU-MH-0001": [
    { id: "TL-MH-0001-1", woundId: "SETU-MH-0001", type: "note", date: "2026-02-10", title: "Wound reported", description: "Anjali Rao filed the report after the handpump had been dry for over a year. 340 families affected.", actorName: "Anjali Rao", actorRole: "Teacher" },
    { id: "TL-MH-0001-2", woundId: "SETU-MH-0001", type: "corroboration", date: "2026-02-20", title: "247 corroborations gathered", description: "Community rallied — 247 residents signed the corroboration within 10 days." },
    { id: "TL-MH-0001-3", woundId: "SETU-MH-0001", type: "status-change", date: "2026-03-01", title: "Assigned to Jeevan Setu Foundation", description: "Wound matched to NGO for community-led aquifer recharge solution." },
    { id: "TL-MH-0001-4", woundId: "SETU-MH-0001", type: "funding", date: "2026-03-15", title: "Funding approved by Aditya Infra Ltd", description: "CSR budget of ₹7.4 lakh approved and moved to escrow." },
    { id: "TL-MH-0001-5", woundId: "SETU-MH-0001", type: "note", date: "2026-04-20", title: "Aquifer recharge complete", description: "Recharge shafts and check dams constructed. Water table monitoring begun." },
    { id: "TL-MH-0001-6", woundId: "SETU-MH-0001", type: "verification", date: "2026-05-10", title: "Verification — passed", description: "Dr. Suresh Patil confirmed water yield at 1,200 L/hr. Community validated." },
    { id: "TL-MH-0001-7", woundId: "SETU-MH-0001", type: "status-change", date: "2026-06-05", title: "Marked Healed", description: "Water flowing continuously for 30+ days. Wound closed as healed." },
  ],
  "SETU-MH-0005": [
    { id: "TL-MH-0005-1", woundId: "SETU-MH-0005", type: "note", date: "2026-05-15", title: "Wound reported", description: "Anjali Rao reported low-hanging cables. 61 neighbours corroborated within 48 hours.", actorName: "Anjali Rao", actorRole: "Teacher" },
    { id: "TL-MH-0005-2", woundId: "SETU-MH-0005", type: "verification", date: "2026-05-25", title: "Safety hazard confirmed", description: "Electrical Safety Inspector Vikram More confirmed cables at 3.8m height. Imminent hazard." },
    { id: "TL-MH-0005-3", woundId: "SETU-MH-0005", type: "status-change", date: "2026-05-28", title: "Routed to MSEDCL", description: "Wound routed to Maharashtra State Electricity Distribution Co. Ltd with all 61 witness records." },
    { id: "TL-MH-0005-4", woundId: "SETU-MH-0005", type: "note", date: "2026-07-01", title: "SLA clock running — 34 days", description: "14 days past the 30-day SLA. Escalation memo sent to MSEDCL zonal office." },
  ],
  "SETU-BR-0001": [
    { id: "TL-BR-0001-1", woundId: "SETU-BR-0001", type: "note", date: "2026-06-05", title: "Wound reported", description: "Community reported the poisoned well after nine deaths over three months in six hamlets." },
    { id: "TL-BR-0001-2", woundId: "SETU-BR-0001", type: "corroboration", date: "2026-06-10", title: "212 corroborations — highest for any wound", description: "Record corroboration count. Every household in affected hamlets attested." },
    { id: "TL-BR-0001-3", woundId: "SETU-BR-0001", type: "note", date: "2026-06-15", title: "Health department notified", description: "District Health Officer Dr. Nandini Singh notified. Water samples collected for testing." },
    { id: "TL-BR-0001-4", woundId: "SETU-BR-0001", type: "verification", date: "2026-06-18", title: "Contamination confirmed", description: "Lab tests positive for E. coli and coliform. Well declared unfit for use." },
    { id: "TL-BR-0001-5", woundId: "SETU-BR-0001", type: "status-change", date: "2026-07-01", title: "Moved to In Progress", description: "RO plant proposal submitted. Funds being arranged through matched funding." },
  ],
  "SETU-MH-0010": [
    { id: "TL-MH-0010-1", woundId: "SETU-MH-0010", type: "note", date: "2026-01-20", title: "Lake identified as revival candidate", description: "35-year-dead lake in Nashik Road identified from satellite imagery and community reports." },
    { id: "TL-MH-0010-2", woundId: "SETU-MH-0010", type: "note", date: "2026-02-10", title: "Community consultation held", description: "Gram sabha passed resolution supporting desilting. 180 families involved in planning." },
    { id: "TL-MH-0010-3", woundId: "SETU-MH-0010", type: "note", date: "2026-02-28", title: "Feasibility study completed", description: "Hydrological survey confirmed lake can hold 35,000 cubic metres post-desilting." },
    { id: "TL-MH-0010-4", woundId: "SETU-MH-0010", type: "funding", date: "2026-03-20", title: "Funding approved — ₹22 lakh", description: "Aditya Infra Ltd CSR approved full amount. Funds in escrow." },
    { id: "TL-MH-0010-5", woundId: "SETU-MH-0010", type: "status-change", date: "2026-04-01", title: "Desilting began", description: "Phase 1 desilting commenced with community labour and JCB." },
    { id: "TL-MH-0010-6", woundId: "SETU-MH-0010", type: "note", date: "2026-06-15", title: "Bund repair complete", description: "Bund wall reconstructed to 3.2m height. Phase 1 & 2 milestones complete." },
  ],
  "SETU-UP-0002": [
    { id: "TL-UP-0002-1", woundId: "SETU-UP-0002", type: "note", date: "2026-05-20", title: "Lab tests requested", description: "Village reported discoloured water and skin conditions. Samples sent to Prayagraj lab." },
    { id: "TL-UP-0002-2", woundId: "SETU-UP-0002", type: "verification", date: "2026-06-05", title: "Arsenic confirmed", description: "Two of three handpumps tested above safe arsenic limits. Public health alert issued." },
    { id: "TL-UP-0002-3", woundId: "SETU-UP-0002", type: "corroboration", date: "2026-06-16", title: "120 corroborations gathered", description: "Community members, including students and parents, attested to health impacts." },
    { id: "TL-UP-0002-4", woundId: "SETU-UP-0002", type: "status-change", date: "2026-06-25", title: "Moved to In Progress", description: "RO plant design approved by PHED. Installation timeline being finalised." },
  ],
  "SETU-KA-0001": [
    { id: "TL-KA-0001-1", woundId: "SETU-KA-0001", type: "note", date: "2025-11-15", title: "Lake reported as dead", description: "Villagers reported the lake had been dry for 5 years. 180 borewells in the catchment were failing." },
    { id: "TL-KA-0001-2", woundId: "SETU-KA-0001", type: "note", date: "2025-12-10", title: "Borewell survey completed", description: "180 borewells surveyed. 156 were dry or significantly depleted." },
    { id: "TL-KA-0001-3", woundId: "SETU-KA-0001", type: "note", date: "2026-01-05", title: "Desilting began", description: "Community-led desilting with mechanised support. 8,000 cubic metres of silt removed." },
    { id: "TL-KA-0001-4", woundId: "SETU-KA-0001", type: "note", date: "2026-02-10", title: "Monsoon recharge completed", description: "Northeast monsoon filled the lake. Water depth recorded at 2.8m." },
    { id: "TL-KA-0001-5", woundId: "SETU-KA-0001", type: "verification", date: "2026-02-20", title: "Verification — passed", description: "Independent ecologist and community representative both confirmed revival. 167/180 borewells recharged." },
    { id: "TL-KA-0001-6", woundId: "SETU-KA-0001", type: "status-change", date: "2026-02-28", title: "Marked Healed", description: "Lake revived after 5 years. Wound closed as healed." },
  ],
  "SETU-MH-0003": [
    { id: "TL-MH-0003-1", woundId: "SETU-MH-0003", type: "note", date: "2025-12-01", title: "Toilet block construction started", description: "8-seat toilet block at Hingoli ZP school. Funded under CSR." },
    { id: "TL-MH-0003-2", woundId: "SETU-MH-0003", type: "note", date: "2026-02-20", title: "Construction completed", description: "Toilet block built to specification. Handed over to school management." },
    { id: "TL-MH-0003-3", woundId: "SETU-MH-0003", type: "verification", date: "2026-02-28", title: "Verification — built to standard", description: "Building inspector confirmed structural quality and compliance." },
    { id: "TL-MH-0003-4", woundId: "SETU-MH-0003", type: "note", date: "2026-03-10", title: "Attendance data collected", description: "Pre- and post-intervention attendance analysed. No significant change recorded." },
    { id: "TL-MH-0003-5", woundId: "SETU-MH-0003", type: "status-change", date: "2026-03-20", title: "Marked Not Achieved", description: "Outcome: built but attendance didn't rise. Lesson recorded — toilet alone does not solve root causes." },
  ],
};

// ─── Authority Info ───
export const AUTHORITY_INFO: Record<string, AuthorityInfo> = {
  "SETU-MH-0005": {
    department: "Maharashtra State Electricity Distribution Co. Ltd (MSEDCL)",
    departmentId: "MSEDCL-JLG-014",
    sla: "30 days",
    slaRemaining: 16,
    contactName: "S. R. Khairnar",
    contactDesignation: "Executive Engineer, Jalgaon Division",
    status: "within-sla",
  },
  "SETU-UP-0004": {
    department: "Uttar Pradesh State Electricity Board",
    departmentId: "UPSEB-PRY-022",
    sla: "45 days",
    slaRemaining: 28,
    contactName: "Rajesh Gupta",
    contactDesignation: "Superintending Engineer, Prayagraj Circle",
    status: "within-sla",
  },
  "SETU-BR-0002": {
    department: "Bihar Roads Department",
    departmentId: "BR-RD-PAT-109",
    sla: "60 days",
    slaRemaining: null,
    contactName: "R. N. Prasad",
    contactDesignation: "Executive Engineer, Patna Division",
    status: "overdue",
  },
  "SETU-GJ-0001": {
    department: "Gujarat Water Supply & Sewerage Board",
    departmentId: "GWSSB-AHM-037",
    sla: "90 days",
    slaRemaining: null,
    contactName: "Ajay Thakkar",
    contactDesignation: "Deputy Engineer, Ahmedabad Zone",
    status: "no-response",
  },
  "SETU-MH-0002": {
    department: "Jalgaon Municipal Corporation",
    departmentId: "JMC-SAN-008",
    sla: "30 days",
    slaRemaining: 22,
    contactName: "Shobha Dhanwate",
    contactDesignation: "Sanitation Officer, Ward 9",
    status: "within-sla",
  },
};

// ─── CSR Companies ───
export const CSR_COMPANIES: CSRCompany[] = [
  {
    id: "CSR-TATA",
    name: "Tata CSR Foundation",
    logoBg: "#1A237E",
    industry: "Conglomerate",
    financialYear: "2025-26",
    csrObligation: 450,
    csrSpent: 412,
    csrUnspent: 38,
    csrDeadline: "31 Mar 2026",
    projectsActive: 14,
    projectsCompleted: 36,
    complianceScore: 94,
    totalImpact: { lives: 128000, woundsHealed: 42, statesReached: 18 },
  },
  {
    id: "CSR-ABG",
    name: "Aditya Birla Group",
    logoBg: "#B71C1C",
    industry: "Conglomerate",
    financialYear: "2025-26",
    csrObligation: 320,
    csrSpent: 298,
    csrUnspent: 22,
    csrDeadline: "31 Mar 2026",
    projectsActive: 11,
    projectsCompleted: 28,
    complianceScore: 91,
    totalImpact: { lives: 94000, woundsHealed: 31, statesReached: 14 },
  },
  {
    id: "CSR-INFY",
    name: "Infosys Foundation",
    logoBg: "#1B5E20",
    industry: "IT & Technology",
    financialYear: "2025-26",
    csrObligation: 185,
    csrSpent: 172,
    csrUnspent: 13,
    csrDeadline: "31 Mar 2026",
    projectsActive: 8,
    projectsCompleted: 22,
    complianceScore: 97,
    totalImpact: { lives: 76000, woundsHealed: 26, statesReached: 12 },
  },
  {
    id: "CSR-RIL",
    name: "Reliance Foundation",
    logoBg: "#E65100",
    industry: "Energy & Telecom",
    financialYear: "2025-26",
    csrObligation: 680,
    csrSpent: 645,
    csrUnspent: 35,
    csrDeadline: "31 Mar 2026",
    projectsActive: 22,
    projectsCompleted: 48,
    complianceScore: 89,
    totalImpact: { lives: 214000, woundsHealed: 55, statesReached: 24 },
  },
];

// ─── CSR Escrow Records ───
export const CSR_ESCROWS: CSREscrow[] = [
  {
    id: "ESC-TATA-001",
    companyId: "CSR-TATA",
    projectName: "Water Conservation — 50 Lakes Revival, Rajasthan",
    totalAmount: 48000000,
    disbursed: 32000000,
    held: 12000000,
    pending: 4000000,
    nextRelease: "15 Aug 2026",
    status: "active",
  },
  {
    id: "ESC-TATA-002",
    companyId: "CSR-TATA",
    projectName: "Smart Toilets — 200 ZP Schools, Maharashtra",
    totalAmount: 35000000,
    disbursed: 35000000,
    held: 0,
    pending: 0,
    nextRelease: "—",
    status: "completed",
  },
  {
    id: "ESC-TATA-003",
    companyId: "CSR-TATA",
    projectName: "Digital Literacy — Rural Karnataka",
    totalAmount: 12500000,
    disbursed: 5000000,
    held: 5500000,
    pending: 2000000,
    nextRelease: "01 Sep 2026",
    status: "active",
  },
  {
    id: "ESC-ABG-001",
    companyId: "CSR-ABG",
    projectName: "Waste-to-Wealth — Segregation Plants, MP",
    totalAmount: 28000000,
    disbursed: 18000000,
    held: 6000000,
    pending: 4000000,
    nextRelease: "10 Oct 2026",
    status: "active",
  },
  {
    id: "ESC-ABG-002",
    companyId: "CSR-ABG",
    projectName: "Anganwadi Nutrition Kit Distribution, Odisha",
    totalAmount: 8500000,
    disbursed: 3000000,
    held: 3500000,
    pending: 2000000,
    nextRelease: "20 Aug 2026",
    status: "active",
  },
  {
    id: "ESC-INFY-001",
    companyId: "CSR-INFY",
    projectName: "STEM Labs — 150 Government High Schools",
    totalAmount: 22000000,
    disbursed: 16000000,
    held: 4000000,
    pending: 2000000,
    nextRelease: "05 Sep 2026",
    status: "active",
  },
  {
    id: "ESC-INFY-002",
    companyId: "CSR-INFY",
    projectName: "Community RO Plants — Drought-Hit Villages",
    totalAmount: 9500000,
    disbursed: 2000000,
    held: 5500000,
    pending: 2000000,
    nextRelease: "Pending Review",
    status: "paused",
  },
  {
    id: "ESC-RIL-001",
    companyId: "CSR-RIL",
    projectName: "Solar Micro-Grid — 25 Villages, Gujarat",
    totalAmount: 62000000,
    disbursed: 38000000,
    held: 16000000,
    pending: 8000000,
    nextRelease: "01 Dec 2026",
    status: "active",
  },
  {
    id: "ESC-RIL-002",
    companyId: "CSR-RIL",
    projectName: "Health Mobile Vans — Tribal Corridor",
    totalAmount: 18500000,
    disbursed: 12000000,
    held: 4500000,
    pending: 2000000,
    nextRelease: "15 Sep 2026",
    status: "active",
  },
];

// ─── CSR Compliance Reports ───
export const CSR_COMPLIANCE: Record<string, CSRComplianceReport[]> = {
  "CSR-TATA": [
    { year: "2023-24", filed: true, dueDate: "31 Dec 2024", filedDate: "28 Dec 2024", status: "filed", accuracyScore: 96, notes: "Annual Report filed on time. All projects verified." },
    { year: "2024-25", filed: true, dueDate: "31 Dec 2025", filedDate: "22 Dec 2025", status: "filed", accuracyScore: 98, notes: "CSR-1 form submitted. 3 projects audited externally." },
    { year: "2025-26", filed: false, dueDate: "31 Dec 2026", filedDate: undefined, status: "pending", accuracyScore: 0, notes: "In progress — funds still being disbursed." },
  ],
  "CSR-ABG": [
    { year: "2023-24", filed: true, dueDate: "31 Dec 2024", filedDate: "30 Dec 2024", status: "filed", accuracyScore: 92, notes: "Filed with minor compliance notes on documentation." },
    { year: "2024-25", filed: true, dueDate: "31 Dec 2025", filedDate: "15 Jan 2026", status: "filed", accuracyScore: 90, notes: "Filed 15 days late. Accuracy impacted by reporting gaps in 2 projects." },
    { year: "2025-26", filed: false, dueDate: "31 Dec 2026", filedDate: undefined, status: "pending", accuracyScore: 0, notes: "Awaiting final disbursement data." },
  ],
  "CSR-INFY": [
    { year: "2023-24", filed: true, dueDate: "31 Dec 2024", filedDate: "20 Dec 2024", status: "filed", accuracyScore: 99, notes: "All projects verified. Exemplary compliance record." },
    { year: "2024-25", filed: true, dueDate: "31 Dec 2025", filedDate: "18 Dec 2025", status: "filed", accuracyScore: 97, notes: "Audited by KPMG. One minor discrepancy corrected." },
    { year: "2025-26", filed: false, dueDate: "31 Dec 2026", filedDate: undefined, status: "pending", accuracyScore: 0, notes: "On track for early submission." },
  ],
  "CSR-RIL": [
    { year: "2023-24", filed: true, dueDate: "31 Dec 2024", filedDate: "31 Dec 2024", status: "filed", accuracyScore: 88, notes: "Filed on deadline. Accuracy impacted by scale of operations." },
    { year: "2024-25", filed: true, dueDate: "31 Dec 2025", filedDate: "05 Jan 2026", status: "filed", accuracyScore: 85, notes: "Filed 5 days late. 2 projects had incomplete documentation." },
    { year: "2025-26", filed: false, dueDate: "31 Dec 2026", filedDate: undefined, status: "pending", accuracyScore: 0, notes: "Large portfolio — consolidation in progress." },
  ],
};

/* ─── Places ─── */
export interface Place {
  id: string;
  name: string;
  state: string;
  rank?: string;
  focus?: string;
}

export const PLACES: Place[] = [
  { id: "jalgaon", name: "Jalgaon", state: "Maharashtra", rank: "2nd-worst in state", focus: "water" },
  { id: "buxar", name: "Buxar", state: "Bihar" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka" },
  { id: "delhi", name: "Delhi", state: "Delhi" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu" },
  { id: "patna", name: "Patna", state: "Bihar" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan" },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat" },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu" },
  { id: "guwahati", name: "Guwahati", state: "Assam" },
  { id: "kochi", name: "Kochi", state: "Kerala" },
  { id: "nashik", name: "Nashik", state: "Maharashtra" },
  { id: "parbhani", name: "Parbhani", state: "Maharashtra" },
  { id: "hingoli", name: "Hingoli", state: "Maharashtra" },
];

export const PLACE_MAP: Record<string, Place> = Object.fromEntries(PLACES.map(p => [p.id, p]));

export function getPlace(id: string): Place | undefined {
  return PLACE_MAP[id];
}

/* ─── Actors (merged from profile/data.ts) ─── */
export interface ActorTrust { type?: "score"; v: string; sm?: string; l: string }
export interface ActorItem {
  woundId: string;
  s: StatusKey;
  right: string;
  rl: string;
  linked: { bg: string; mono: string; pre: string; name: string; actorId?: string };
}
export interface ActorData {
  id: string;
  role: RoleKey;
  logoBg: string;
  mono: string;
  name: string;
  roleLabel: string;
  verified: boolean;
  tag: string;
  meta: [string, string][];
  score: number | null;
  trust: ActorTrust[];
  creds: [string, string][] | null;
  tabs: string[];
  impact: { h: string; p: string; win: { ih: string; big: string; bigSm?: string; cap: string }; other: { ih: string; big: string; cap: string } };
  itemsTitle: string;
  filters: string[];
  items: ActorItem[];
  about: string[];
  info: [string, string][];
}

export const ACTORS: Record<RoleKey, ActorData> = {
  citizen: {
    id: "citizen", role: "citizen",
    logoBg: "#3D4A44", mono: "AR", name: "Anjali Rao",
    roleLabel: "Citizen · Verified resident", verified: true,
    tag: "A schoolteacher in Ward 7 who refuses to accept a dry tap as normal.",
    meta: [["M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "Jalgaon, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "On Setu since 2024"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "A teacher"]],
    score: null,
    trust: [
      { v: "23", l: "wounds reported" },
      { v: "186", l: "corroborations given" },
      { v: "5", l: "wounds she helped heal" },
    ],
    creds: null,
    tabs: ["Activity", "Reported", "About"],
    impact: {
      h: "One resident, and the wounds she refused to ignore.",
      p: "Every citizen on Setu builds a quiet record of what they noticed and what they helped move — not points, not badges, just the honest weight of showing up.",
      win: { ih: "Wounds she helped heal", big: "5", cap: "Reports she filed or corroborated that reached a verified outcome — including the Ward 7 handpump that now serves 340 families." },
      other: { ih: "Still open", big: "8", cap: "Wounds she reported that are still moving through the system. She watches each one." },
    },
    itemsTitle: "What she reported",
    filters: ["All 23", "Healed 5", "In progress 8", "Routed to gov 10"],
    items: [
      { woundId: "SETU-MH-0001", s: "healed", right: "340", rl: "families", linked: { bg: "var(--c-p-600)", mono: "JS", pre: "Healed by", name: "Jeevan Setu Foundation", actorId: "ngo" } },
      { woundId: "SETU-MH-0005", s: "routed", right: "61", rl: "witnesses", linked: { bg: "#3B6A93", mono: "JZ", pre: "Routed to", name: "Jalgaon Zilla Parishad", actorId: "government" } },
      { woundId: "SETU-MH-0002", s: "in-progress", right: "44", rl: "witnesses", linked: { bg: "var(--c-p-600)", mono: "JS", pre: "Being fixed by", name: "Jeevan Setu Foundation", actorId: "ngo" } },
    ],
    about: [
      "Anjali Rao has taught at the Ward 7 government school for eleven years. She joined Setu in 2024 after watching her students arrive late, tired from fetching water before class.",
      "She is not an activist or an organiser. She is a resident who discovered that describing a problem clearly — and getting her neighbours to stand behind it — could actually move it.",
      "Her profile is simply the record of that: what she saw, and what it became.",
    ],
    info: [["On Setu since", "2024"], ["Reports filed", "23"], ["Corroborations", "186"], ["District", "Jalgaon"]],
  },

  ngo: {
    id: "ngo", role: "ngo",
    logoBg: "var(--c-p-600)", mono: "JS", name: "Jeevan Setu Foundation",
    roleLabel: "NGO · Water & Sanitation", verified: true,
    tag: "Reviving India's dead water bodies — and keeping them alive, because an abandoned filter is worse than none at all.",
    meta: [["M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "Jalgaon, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "Established 2016"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "Team of 18"]],
    score: 91,
    trust: [
      { type: "score", v: "91", l: "Verification score" },
      { v: "28", sm: " / 34", l: "outcomes independently verified" },
      { v: "₹4.6", sm: " Cr", l: "matched & delivered" },
      { v: "8", sm: " yrs", l: "of work on the ground" },
    ],
    creds: [["12A", "2016"], ["80G", "valid"], ["CSR-1", "00012849"], ["Darpan", "MH/2016"]],
    tabs: ["Impact", "Projects", "About"],
    impact: {
      h: "Eight years, thirty-four wells and lakes,<br>and the honest truth about all of them.",
      p: "Every figure here is drawn from independently-verified projects on Setu — not self-reported. It includes the failures, because <b>a record that shows only wins is a record no one should believe.</b>",
      win: { ih: "Verified outcomes", big: "28", bigSm: " of 34", cap: "Independently confirmed and community-corroborated — an 82% verified success rate across eight years of work." },
      other: { ih: "What didn't work", big: "3", cap: "Projects built and verified, but the outcome wasn't met — reported openly, with the lesson each one taught." },
    },
    itemsTitle: "Thirty-four projects, each one accountable",
    filters: ["All 34", "Healed 28", "In progress 3", "Not achieved 3"],
    items: [
      { woundId: "SETU-MH-0001", s: "healed", right: "₹7.4L", rl: "delivered", linked: { bg: "#8A6D4B", mono: "AI", pre: "Funded by", name: "Aditya Infra Ltd", actorId: "corporate" } },
      { woundId: "SETU-MH-0010", s: "in-progress", right: "₹22L", rl: "in escrow", linked: { bg: "#8A6D4B", mono: "AI", pre: "Funded by", name: "Aditya Infra Ltd", actorId: "corporate" } },
      { woundId: "SETU-MH-0009", s: "not-achieved", right: "₹9.2L", rl: "delivered", linked: { bg: "#8A6D4B", mono: "AI", pre: "Funded by", name: "Aditya Infra Ltd", actorId: "corporate" } },
    ],
    about: [
      "Jeevan Setu Foundation was founded in 2016 by hydrologists and community organisers with one conviction: that India's water crisis is not a lack of water, but a lack of maintained, community-owned water systems.",
      "Over eight years we have specialised in reviving dead water bodies — always with maintenance and community-ownership built in from day one, because an abandoned filter is worse than none at all.",
      "Every project passes through Setu's independent verification. That is why this record is the record that actually happened — successes and failures alike.",
    ],
    info: [["Founded", "2016"], ["Team size", "18"], ["Focus area", "Water"], ["Registered in", "Maharashtra"]],
  },

  corporate: {
    id: "corporate", role: "corporate",
    logoBg: "#8A6D4B", mono: "AI", name: "Aditya Infra Ltd",
    roleLabel: "Corporate · Infrastructure", verified: true,
    tag: "Meeting our CSR obligation where the need is greatest — and proving, to the rupee, that it worked.",
    meta: [["M3 21h18M5 21V7l7-4 7 4v14", "Mumbai, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "CSR active since 2019"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "Listed · CIN L45200MH"]],
    score: null,
    trust: [
      { v: "₹8.2", sm: " Cr", l: "CSR delivered via Setu" },
      { v: "19", l: "projects funded" },
      { v: "16", sm: " / 19", l: "independently verified" },
      { v: "0%", l: "taken by the platform" },
    ],
    creds: [["CIN", "L45200MH"], ["CSR obligation", "₹9.4 Cr/yr"], ["Sector", "Infrastructure"], ["Since", "2019"]],
    tabs: ["Portfolio", "Funded", "About"],
    impact: {
      h: "Every rupee of our mandate,<br>routed to a verified outcome.",
      p: "Setu never touches our money — funds move through escrow to the implementer, released only when a verified milestone is met. This is the proof our board and auditor see.",
      win: { ih: "Verified impact of our spend", big: "16", bigSm: " of 19", cap: "Projects where an independent verifier and the community both confirmed the outcome. Audit-ready, board-ready, and public." },
      other: { ih: "Not one rupee through Setu", big: "0%", cap: "The platform takes nothing from the funds. Every rupee of our obligation reaches the ground — and we can prove it." },
    },
    itemsTitle: "Nineteen projects funded, each one verifiable",
    filters: ["All 19", "Verified 16", "In progress 2", "Not achieved 1"],
    items: [
      { woundId: "SETU-MH-0001", s: "healed", right: "₹7.4L", rl: "CSR spent", linked: { bg: "var(--c-p-600)", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation", actorId: "ngo" } },
      { woundId: "SETU-MH-0008", s: "in-progress", right: "₹31L", rl: "committed", linked: { bg: "var(--c-p-600)", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation", actorId: "ngo" } },
      { woundId: "SETU-MH-0009", s: "not-achieved", right: "₹9.2L", rl: "CSR spent", linked: { bg: "var(--c-p-600)", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation", actorId: "ngo" } },
    ],
    about: [
      "Aditya Infra Ltd is a listed infrastructure company with an annual CSR obligation of ₹9.4 crore under Section 135 of the Companies Act.",
      "For years, that obligation was met defensively — money to a few safe, famous names, with little proof it changed anything. Since 2019 we route through Setu: projects sourced from real citizen-reported need, cleared for legality, and verified on delivery.",
      "The result is a CSR record we can defend to our board, our auditor, and the public — including the projects that didn't work.",
    ],
    info: [["CIN", "L45200MH"], ["CSR obligation", "₹9.4 Cr/yr"], ["Sector", "Infrastructure"], ["CSR since", "2019"]],
  },

  government: {
    id: "government", role: "government",
    logoBg: "#3B6A93", mono: "JZ", name: "Jalgaon Zilla Parishad",
    roleLabel: "Government · District administration", verified: true,
    tag: "The duties the law assigns us — tracked in the open, resolved in the open.",
    meta: [["M3 21h18M5 21V7l7-4 7 4v14", "Jalgaon District, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "On Setu since 2025"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "District administration"]],
    score: null,
    trust: [
      { v: "412", l: "wounds in our jurisdiction" },
      { v: "251", l: "resolved by our offices" },
      { v: "61%", l: "resolution rate" },
      { v: "18", sm: " days", l: "median time to resolve" },
    ],
    creds: [["Dept", "Zilla Parishad"], ["Jurisdiction", "Jalgaon"], ["SLA", "30 days"], ["Verified", "MoU 2025"]],
    tabs: ["Jurisdiction", "Resolved", "About"],
    impact: {
      h: "Every statutory duty, visible —<br>and every resolution, on the record.",
      p: "Setu routes government-duty wounds to us with citizen witnesses attached. We resolve them in the open, so residents see movement — and so credit for the work is ours to claim, honestly.",
      win: { ih: "Resolved by our offices", big: "251", bigSm: " of 412", cap: "Wounds that were our statutory duty, closed and confirmed. A 61% resolution rate, improving each quarter as routing sharpens." },
      other: { ih: "Overdue past SLA", big: "34", cap: "Wounds past our 30-day service window. Shown openly — because hiding them helps no resident, and residents are watching." },
    },
    itemsTitle: "Wounds in our jurisdiction",
    filters: ["All 412", "Resolved 251", "In progress 127", "Overdue 34"],
    items: [
      { woundId: "SETU-MH-0005", s: "routed", right: "14", rl: "days", linked: { bg: "#3D4A44", mono: "AR", pre: "Reported by", name: "Anjali Rao & 60 others", actorId: "citizen" } },
      { woundId: "SETU-MH-0007", s: "healed", right: "9", rl: "days", linked: { bg: "#3D4A44", mono: "AR", pre: "Reported by", name: "Anjali Rao & 30 others", actorId: "citizen" } },
      { woundId: "SETU-MH-0006", s: "assessing", right: "41", rl: "days", linked: { bg: "#3D4A44", mono: "PK", pre: "Reported by", name: "Priya Kadam & 18 others" } },
    ],
    about: [
      "Jalgaon Zilla Parishad is the district-level administration responsible for local infrastructure, water, sanitation and rural development across Jalgaon.",
      "We joined Setu in 2025 under an MoU. Rather than treat the platform as an outside critic, we use it as an ally: citizen-reported duties arrive well-structured and witnessed, and our resolutions are recorded where residents can see them.",
      "We show our overdue items openly. An administration that hides its backlog loses trust; one that resolves in the open earns it.",
    ],
    info: [["Body", "Zilla Parishad"], ["Jurisdiction", "Jalgaon"], ["On Setu since", "2025"], ["SLA window", "30 days"]],
  },
};

export function getActor(id: string): ActorData | undefined {
  return Object.values(ACTORS).find(a => a.id === id);
}

/* ─── Notifications ─── */
export interface Notification {
  id: string;
  type: "corroboration" | "status" | "healed" | "failed" | "routed" | "verifier";
  woundId: string;
  text: string;
  time: string;
  group: "today" | "week" | "earlier";
  read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "corroboration", woundId: "SETU-MH-0001", text: "12 more witnesses corroborated the Ward 7 handpump report.", time: "18 min ago", group: "today", read: false },
  { id: "n2", type: "status", woundId: "SETU-MH-0005", text: "Cables slung low — Ward 14 was routed to MSEDCL with 61 witnesses.", time: "2h ago", group: "today", read: false },
  { id: "n3", type: "healed", woundId: "SETU-KA-0001", text: "Lake revived — Kyalasanahalli marked as Healed by the verifier.", time: "5h ago", group: "today", read: false },
  { id: "n4", type: "routed", woundId: "SETU-RJ-0001", text: "Water tanker wound routed to PHED Rajasthan with 57 witnesses.", time: "8h ago", group: "today", read: true },
  { id: "n5", type: "corroboration", woundId: "SETU-BR-0001", text: "Your corroborated wound 'Nine deaths, one poisoned well' reached 212 witnesses.", time: "1d ago", group: "week", read: true },
  { id: "n6", type: "failed", woundId: "SETU-MH-0003", text: "Toilet block project closed as Not Achieved. The lesson has been recorded.", time: "2d ago", group: "week", read: true },
  { id: "n7", type: "verifier", woundId: "SETU-MH-0002", text: "Verifier assigned to the open drain near the market.", time: "3d ago", group: "week", read: true },
  { id: "n8", type: "status", woundId: "SETU-MH-0008", text: "Rooftop rainwater harvesting for 12 schools moved to In Progress.", time: "4d ago", group: "week", read: true },
  { id: "n9", type: "healed", woundId: "SETU-MH-0007", text: "Blocked storm drain on Market Road resolved in 9 days.", time: "1w ago", group: "earlier", read: true },
  { id: "n10", type: "routed", woundId: "SETU-DL-0001", text: "Sewer worker safety wound routed to Delhi Jal Board.", time: "2w ago", group: "earlier", read: true },
];

/* ─── Stream-specific presentation data ─── */
export interface StreamSpineEntry { status: StatusKey; label: string }
export interface StreamComment { n: string; rl: string; c: string }
export interface StreamWound {
  woundId: string;
  ago: string;
  near: boolean;
  rising: boolean;
  spine: StreamSpineEntry[];
  comments: StreamComment[];
}

export const STREAM_DATA: StreamWound[] = [
  { woundId: "SETU-MH-0001", ago: "2h", near: true, rising: true, spine: [{status:"healed",label:"—"},{status:"in-progress",label:"now"},{status:"routed",label:"22 May"},{status:"reported",label:"15 May"}], comments: [{n:"Anjali",rl:"Teacher",c:"My students come to class late every morning because of this."},{n:"Anonymous",rl:"Citizen",c:"Confirmed — it has been dry since last monsoon."}] },
  { woundId: "SETU-UP-0001", ago: "5h", near: true, rising: true, spine: [{status:"in-progress",label:"—"},{status:"assessing",label:"now"},{status:"reported",label:"2d ago"}], comments: [{n:"Anonymous",rl:"Citizen",c:"This is why my niece dropped out last year."}] },
  { woundId: "SETU-MH-0005", ago: "8h", near: false, rising: true, spine: [{status:"routed",label:"routed"},{status:"reported",label:"3d ago"}], comments: [{n:"Ravi",rl:"Citizen",c:"A cyclist got tangled last week. This is urgent."}] },
  { woundId: "SETU-KA-0001", ago: "1d", near: false, rising: false, spine: [{status:"healed",label:"done"},{status:"in-progress",label:"Apr"},{status:"reported",label:"Feb"}], comments: [{n:"Sunita",rl:"Citizen",c:"We can grow vegetables again. Thank you to everyone who stood behind this."}] },
  { woundId: "SETU-MH-0003", ago: "2d", near: false, rising: false, spine: [{status:"not-achieved",label:"as-is"},{status:"in-progress",label:"Mar"},{status:"reported",label:"Jan"}], comments: [{n:"Verifier",rl:"Verifier",c:"Built to standard. The behaviour-change component was too thin — noted for the next project."}] },
  { woundId: "SETU-MH-0004", ago: "3d", near: true, rising: false, spine: [{status:"reported",label:"new"}], comments: [] },
  { woundId: "SETU-MH-0002", ago: "4d", near: true, rising: false, spine: [{status:"in-progress",label:"now"},{status:"assessing",label:"5d"},{status:"reported",label:"6d"}], comments: [{n:"Anonymous",rl:"Citizen",c:"Dengue cases every monsoon because of this."}] },
];

/* ─── Stats ─── */
export const PLATFORM_STATS = {
  totalWounds: WOUNDS.length,
  healed: WOUNDS.filter(w => w.status === "healed").length,
  inProgress: WOUNDS.filter(w => w.status === "in-progress").length,
  reported: WOUNDS.filter(w => w.status === "reported").length,
  routed: WOUNDS.filter(w => w.status === "routed").length,
  assessing: WOUNDS.filter(w => w.status === "assessing").length,
  notAchieved: WOUNDS.filter(w => w.status === "not-achieved").length,
  districts: new Set(WOUNDS.map(w => w.placeId)).size,
  liveCount: 1269,
};

/* ─── Accessor Functions for New Data ─── */

export function getVerificationEvents(woundId: string): VerificationEvent[] {
  return VERIFICATION_EVENTS.filter(e => e.woundId === woundId);
}

export function getCorroborationEntries(woundId: string): CorroborationEntry[] {
  return CORROBORATION_ENTRIES.filter(e => e.woundId === woundId);
}

export function getFunding(woundId: string): FundingEntry[] | undefined {
  return FUNDING[woundId];
}

export function getTimelineEvents(woundId: string): TimelineEvent[] {
  return TIMELINE_EVENTS[woundId] || [];
}

export function getRelatedWounds(woundId: string): Wound[] {
  const wound = getWound(woundId);
  if (!wound || !wound.relatedWoundIds) return [];
  return wound.relatedWoundIds
    .map(id => getWound(id))
    .filter((w): w is Wound => w !== undefined);
}

export function getAuthority(woundId: string): AuthorityInfo | undefined {
  return AUTHORITY_INFO[woundId];
}

// ─── CSR Accessor Functions ───
export function getCSRCompany(id: string): CSRCompany | undefined {
  return CSR_COMPANIES.find(c => c.id === id);
}

export function getCSREscrows(companyId: string): CSREscrow[] {
  return CSR_ESCROWS.filter(e => e.companyId === companyId);
}

export function getCSRCompliance(companyId: string): CSRComplianceReport[] {
  return CSR_COMPLIANCE[companyId] || [];
}

// ════════════════════════════════════════════════════════════
// Phase 5 — Analytics Dashboard Data
// ════════════════════════════════════════════════════════════

export interface CSRSspendTrend {
  month: string;
  deployed: number;
  matched: number;
}

export interface NGOscore {
  id: string;
  name: string;
  initials: string;
  logoBg: string;
  verificationScore: number;
  projectsCompleted: number;
  trend: "up" | "down" | "flat";
}

export const CSR_SPEND_TRENDS: CSRSspendTrend[] = [
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

// ════════════════════════════════════════════════════════════
// Phase 5 — Funder Matching Data
// ════════════════════════════════════════════════════════════

export interface ScheduleVIICategory {
  key: string;
  scheduleLabel: string;
  description: string;
  ngoCount: number;
  csrAligned: number;
  totalFundingNeeded: number;
  totalFundingAvailable: number;
}

export const SCHEDULE_VII_CATEGORIES: ScheduleVIICategory[] = [
  { key: "water", scheduleLabel: "Drinking Water & Sanitation", description: "Water supply, sanitation, waste management", ngoCount: 8, csrAligned: 6, totalFundingNeeded: 4.2, totalFundingAvailable: 6.8 },
  { key: "education", scheduleLabel: "Education & Livelihood", description: "School infrastructure, skill development", ngoCount: 6, csrAligned: 5, totalFundingNeeded: 3.1, totalFundingAvailable: 4.5 },
  { key: "health", scheduleLabel: "Healthcare", description: "Public health, medical facilities", ngoCount: 5, csrAligned: 4, totalFundingNeeded: 2.8, totalFundingAvailable: 3.2 },
  { key: "roads", scheduleLabel: "Rural Infrastructure", description: "Roads, bridges, community infrastructure", ngoCount: 4, csrAligned: 3, totalFundingNeeded: 5.1, totalFundingAvailable: 4.0 },
  { key: "sanitation", scheduleLabel: "Drinking Water & Sanitation", description: "Sanitation facilities, waste treatment", ngoCount: 5, csrAligned: 4, totalFundingNeeded: 2.4, totalFundingAvailable: 3.6 },
  { key: "elder", scheduleLabel: "Senior Care & Welfare", description: "Elder care, disability support", ngoCount: 3, csrAligned: 2, totalFundingNeeded: 1.6, totalFundingAvailable: 1.2 },
];

export interface FundMatch {
  id: string;
  ngoName: string;
  ngoInitials: string;
  ngoLogoBg: string;
  woundId: string;
  woundTitle: string;
  category: CategoryKey;
  scheduleCategory: string;
  amountNeeded: number;
  amountAvailable: number;
  matchScore: number;
  matchFactors: string[];
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
  totalFundsNeeded: 18.4,
  totalFundsAvailable: 22.6,
  matchesLive: FUNDER_MATCHES.length,
  avgMatchScore: Math.round(FUNDER_MATCHES.reduce((s, m) => s + m.matchScore, 0) / FUNDER_MATCHES.length),
};
