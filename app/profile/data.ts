export type Role = "citizen" | "ngo" | "corporate" | "government";

export interface ActorItem {
  s: "healed" | "active" | "failed" | "assess" | "gov";
  t: string;
  cat: string;
  date: string;
  right: string;
  rl: string;
  body: string;
  out: [string, string][];
  linked: { bg: string; mono: string; pre: string; name: string };
}

export interface ActorTrust {
  type?: "score";
  v: string;
  sm?: string;
  l: string;
}

export interface ActorImpact {
  h: string;
  p: string;
  win: { ih: string; big: string; bigSm?: string; cap: string };
  other: { ih: string; big: string; cap: string };
}

export interface ActorData {
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
  impact: ActorImpact;
  itemsTitle: string;
  filters: string[];
  items: ActorItem[];
  about: string[];
  info: [string, string][];
}

export const PIN = "M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z";
export const CLOCK = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2";
export const USERS = "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75";
export const CHECK = "M20 6 9 17l-5-5";
export const BUILDING = "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01";
export const DROP = "M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z";
export const HANDSHAKE = "M11 17l2 2a1 1 0 0 0 1.4 0l3-3M6 12l3-3 3 3 3-3 3 3M3 12l3 3M21 12l-3 3";
export const MSG = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
export const PLUS = "M12 5v14M5 12h14";
export const CHEVRON = "M6 9l6 6 6-6";
export const ARROW_R = "M5 12h14M13 6l6 6-6 6";
export const INFO_C = "M12 8v5M12 16h.01";
export const SHAPE_HEALED = "M3 7h10v2H3z M7 3h2v10H7z";
export const SHAPE_ACTIVE = "M8 2l7 12H1z";
export const SHAPE_FAILED = "M3 7h10v2H3z";
export const SHAPE_ASSESS = "M5 2h6v6H5z";
export const SHAPE_GOV = "M6 2h4v12H6z";

export const ACTORS: Record<Role, ActorData> = {
  citizen: {
    logoBg: "#3D4A44",
    mono: "AR",
    name: "Anjali Rao",
    roleLabel: "Citizen · Verified resident",
    verified: true,
    tag: "A schoolteacher in Ward 7 who refuses to accept a dry tap as normal.",
    meta: [["M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "Jalgaon, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "On Setu since 2024"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "A teacher"]],
    score: null,
    trust: [
      { v: "23", sm: "", l: "wounds reported" },
      { v: "186", sm: "", l: "corroborations given" },
      { v: "5", sm: "", l: "wounds she helped heal" },
    ],
    creds: null,
    tabs: ["Activity", "Reported", "About"],
    impact: {
      h: "One resident, and the wounds she refused to ignore.",
      p: "Every citizen on Setu builds a quiet record of what they noticed and what they helped move — not points, not badges, just the honest weight of showing up.",
      win: {
        ih: "Wounds she helped heal",
        big: "5",
        cap: "Reports she filed or corroborated that reached a verified outcome — including the Ward 7 handpump that now serves 340 families.",
      },
      other: {
        ih: "Still open",
        big: "8",
        cap: "Wounds she reported that are still moving through the system. She watches each one.",
      },
    },
    itemsTitle: "What she reported",
    filters: ["All 23", "Healed 5", "In progress 8", "Routed to gov 10"],
    items: [
      {
        s: "healed",
        t: "Handpump dry for 400 days — Ward 7",
        cat: "Water",
        date: "healed Jun 2026",
        right: "340",
        rl: "families",
        body: "The report that started it all. Anjali recorded a voice note about the dry pump; 247 neighbours corroborated within a week.",
        out: [["340", "families served"], ["+62%", "vs untreated wards"]],
        linked: { bg: "#0C6B5E", mono: "JS", pre: "Healed by", name: "Jeevan Setu Foundation" },
      },
      {
        s: "gov",
        t: "Cables slung dangerously low — Ward 14",
        cat: "Roads",
        date: "routed May 2026",
        right: "61",
        rl: "witnesses",
        body: "A government-duty wound. Anjali reported it; Setu routed it to the distribution company with 61 witnesses attached.",
        out: [["61", "witnesses"], ["14 days", "pending"]],
        linked: { bg: "#3B6A93", mono: "MJ", pre: "Routed to", name: "MSEDCL — Jalgaon Division" },
      },
      {
        s: "active",
        t: "Open drain beside the primary school",
        cat: "Sanitation",
        date: "in progress",
        right: "44",
        rl: "witnesses",
        body: "Scoped and matched to a local implementer. Anjali corroborates progress from the ground.",
        out: [["44", "witnesses"], ["scoped", "₹3.2L"]],
        linked: { bg: "#0C6B5E", mono: "CV", pre: "Being fixed by", name: "Clean Vidarbha Trust" },
      },
    ],
    about: [
      "Anjali Rao has taught at the Ward 7 government school for eleven years. She joined Setu in 2024 after watching her students arrive late, tired from fetching water before class.",
      "She is not an activist or an organiser. She is a resident who discovered that describing a problem clearly — and getting her neighbours to stand behind it — could actually move it.",
      "Her profile is simply the record of that: what she saw, and what it became.",
    ],
    info: [["On Setu since", "2024"], ["Reports filed", "23"], ["Corroborations", "186"], ["District", "Jalgaon"]],
  },

  ngo: {
    logoBg: "#0C6B5E",
    mono: "JS",
    name: "Jeevan Setu Foundation",
    roleLabel: "NGO · Water & Sanitation",
    verified: true,
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
      win: {
        ih: "Verified outcomes",
        big: "28",
        bigSm: " of 34",
        cap: "Independently confirmed and community-corroborated — an 82% verified success rate across eight years of work.",
      },
      other: {
        ih: "What didn't work",
        big: "3",
        cap: "Projects built and verified, but the outcome wasn't met — reported openly, with the lesson each one taught.",
      },
    },
    itemsTitle: "Thirty-four projects, each one accountable",
    filters: ["All 34", "Healed 28", "In progress 3", "Not achieved 3"],
    items: [
      {
        s: "healed",
        t: "Handpump revival & aquifer recharge — Ward 7",
        cat: "Water",
        date: "Jun 2026",
        right: "₹7.4L",
        rl: "delivered",
        body: "A pump dry for over 400 days serving 340 families. Revived through community-led recharge; water returned within nine days.",
        out: [["340", "families served"], ["+62%", "vs untreated"], ["100%", "confirmed"]],
        linked: { bg: "#3D4A44", mono: "A", pre: "Funded by", name: "Aditya Infra Ltd · CSR" },
      },
      {
        s: "active",
        t: "Lake desilting & bund repair — Nashik Road",
        cat: "Water",
        date: "started Apr 2026",
        right: "₹22L",
        rl: "in escrow",
        body: "A 35-year-dead lake being brought back. Funds held in escrow, released only against verified milestones.",
        out: [["180", "borewells"], ["2 / 3", "milestones"]],
        linked: { bg: "#3D4A44", mono: "G", pre: "Funded by", name: "GreenWater Beverages · CSR" },
      },
      {
        s: "failed",
        t: "Village RO plant — Parbhani cluster",
        cat: "Water",
        date: "closed Mar 2026",
        right: "₹9.2L",
        rl: "delivered",
        body: "Built and verified — but usage stayed low; the village kept to its old source. Reported honestly. The lesson reshaped how we scope community buy-in.",
        out: [["Built", "verified"], ["Not met", "usage target"]],
        linked: { bg: "#3D4A44", mono: "A", pre: "Funded by", name: "Aditya Infra Ltd · CSR" },
      },
    ],
    about: [
      "Jeevan Setu Foundation was founded in 2016 by hydrologists and community organisers with one conviction: that India's water crisis is not a lack of water, but a lack of maintained, community-owned water systems.",
      "Over eight years we have specialised in reviving dead water bodies — always with maintenance and community-ownership built in from day one, because an abandoned filter is worse than none at all.",
      "Every project passes through Setu's independent verification. That is why this record is the record that actually happened — successes and failures alike.",
    ],
    info: [["Founded", "2016"], ["Team size", "18"], ["Focus area", "Water"], ["Registered in", "Maharashtra"]],
  },

  corporate: {
    logoBg: "#8A6D4B",
    mono: "AI",
    name: "Aditya Infra Ltd",
    roleLabel: "Corporate · Infrastructure",
    verified: true,
    tag: "Meeting our CSR obligation where the need is greatest — and proving, to the rupee, that it worked.",
    meta: [["M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01", "Mumbai, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "CSR active since 2019"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "Listed · CIN L45200MH"]],
    score: null,
    trust: [
      { v: "₹8.2", sm: " Cr", l: "CSR delivered via Setu" },
      { v: "19", sm: "", l: "projects funded" },
      { v: "16", sm: " / 19", l: "independently verified" },
      { v: "0%", sm: "", l: "taken by the platform" },
    ],
    creds: [["CIN", "L45200MH"], ["CSR obligation", "₹9.4 Cr/yr"], ["Sector", "Infrastructure"], ["Since", "2019"]],
    tabs: ["Portfolio", "Funded", "About"],
    impact: {
      h: "Every rupee of our mandate,<br>routed to a verified outcome.",
      p: "Setu never touches our money — funds move through escrow to the implementer, released only when a verified milestone is met. This is the proof our board and auditor see.",
      win: {
        ih: "Verified impact of our spend",
        big: "16",
        bigSm: " of 19",
        cap: "Projects where an independent verifier and the community both confirmed the outcome. Audit-ready, board-ready, and public.",
      },
      other: {
        ih: "Not one rupee through Setu",
        big: "0%",
        cap: "The platform takes nothing from the funds. Every rupee of our obligation reaches the ground — and we can prove it.",
      },
    },
    itemsTitle: "Nineteen projects funded, each one verifiable",
    filters: ["All 19", "Verified 16", "In progress 2", "Not achieved 1"],
    items: [
      {
        s: "healed",
        t: "Handpump revival — Ward 7, Jalgaon",
        cat: "Water",
        date: "Jun 2026",
        right: "₹7.4L",
        rl: "CSR spent",
        body: "Funded under Schedule VII (i) & (iv). Delivered by a verified implementer; outcome confirmed independently and by the community.",
        out: [["340", "families served"], ["✓", "audit-ready"]],
        linked: { bg: "#0C6B5E", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation" },
      },
      {
        s: "active",
        t: "Rooftop rainwater harvesting — 12 ZP schools",
        cat: "Water",
        date: "started 2026",
        right: "₹31L",
        rl: "committed",
        body: "A costed, legality-cleared proposal we chose from Setu's pipeline. Funds in escrow, releasing against milestones.",
        out: [["12", "schools"], ["3,400", "children"]],
        linked: { bg: "#0C6B5E", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation" },
      },
      {
        s: "failed",
        t: "Village RO plant — Parbhani",
        cat: "Water",
        date: "closed Mar 2026",
        right: "₹9.2L",
        rl: "CSR spent",
        body: "Built and verified, but usage stayed low. We report it as-is in our CSR disclosure — an honest failure is still a compliant, defensible spend.",
        out: [["Built", "verified"], ["Not met", "outcome"]],
        linked: { bg: "#0C6B5E", mono: "JS", pre: "Delivered by", name: "Jeevan Setu Foundation" },
      },
    ],
    about: [
      "Aditya Infra Ltd is a listed infrastructure company with an annual CSR obligation of ₹9.4 crore under Section 135 of the Companies Act.",
      "For years, that obligation was met defensively — money to a few safe, famous names, with little proof it changed anything. Since 2019 we route through Setu: projects sourced from real citizen-reported need, cleared for legality, and verified on delivery.",
      "The result is a CSR record we can defend to our board, our auditor, and the public — including the projects that didn't work.",
    ],
    info: [["CIN", "L45200MH"], ["CSR obligation", "₹9.4 Cr/yr"], ["Sector", "Infrastructure"], ["CSR since", "2019"]],
  },

  government: {
    logoBg: "#3B6A93",
    mono: "JZ",
    name: "Jalgaon Zilla Parishad",
    roleLabel: "Government · District administration",
    verified: true,
    tag: "The duties the law assigns us — tracked in the open, resolved in the open.",
    meta: [["M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01", "Jalgaon District, Maharashtra"], ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2", "On Setu since 2025"], ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "District administration"]],
    score: null,
    trust: [
      { v: "412", sm: "", l: "wounds in our jurisdiction" },
      { v: "251", sm: "", l: "resolved by our offices" },
      { v: "61%", sm: "", l: "resolution rate" },
      { v: "18", sm: " days", l: "median time to resolve" },
    ],
    creds: [["Dept", "Zilla Parishad"], ["Jurisdiction", "Jalgaon"], ["SLA", "30 days"], ["Verified", "MoU 2025"]],
    tabs: ["Jurisdiction", "Resolved", "About"],
    impact: {
      h: "Every statutory duty, visible —<br>and every resolution, on the record.",
      p: "Setu routes government-duty wounds to us with citizen witnesses attached. We resolve them in the open, so residents see movement — and so credit for the work is ours to claim, honestly.",
      win: {
        ih: "Resolved by our offices",
        big: "251",
        bigSm: " of 412",
        cap: "Wounds that were our statutory duty, closed and confirmed. A 61% resolution rate, improving each quarter as routing sharpens.",
      },
      other: {
        ih: "Overdue past SLA",
        big: "34",
        cap: "Wounds past our 30-day service window. Shown openly — because hiding them helps no resident, and residents are watching.",
      },
    },
    itemsTitle: "Wounds in our jurisdiction",
    filters: ["All 412", "Resolved 251", "In progress 127", "Overdue 34"],
    items: [
      {
        s: "gov",
        t: "Cables slung dangerously low — Ward 14",
        cat: "Roads",
        date: "routed May 2026",
        right: "14",
        rl: "days",
        body: "Routed to MSEDCL Jalgaon with 61 citizen witnesses. Assigned, work order raised, resolution pending within SLA.",
        out: [["61", "witnesses"], ["within", "SLA"]],
        linked: { bg: "#3D4A44", mono: "AR", pre: "Reported by", name: "Anjali Rao & 60 others" },
      },
      {
        s: "healed",
        t: "Blocked storm drain — Market Road",
        cat: "Sanitation",
        date: "resolved Apr 2026",
        right: "9",
        rl: "days",
        body: "A clear municipal duty. Resolved by the ZP works department in nine days; confirmed by the residents who reported it.",
        out: [["9 days", "to resolve"], ["confirmed", "by community"]],
        linked: { bg: "#3D4A44", mono: "RS", pre: "Reported by", name: "Ramesh Sonawane & 30 others" },
      },
      {
        s: "assess",
        t: "Overflowing septic tank — Ward 9",
        cat: "Sanitation",
        date: "overdue 41 days",
        right: "41",
        rl: "days",
        body: "Past our SLA window. Shown openly on our record. Escalated internally; residents are notified of the delay honestly.",
        out: [["41 days", "overdue"], ["escalated", "internally"]],
        linked: { bg: "#3D4A44", mono: "PK", pre: "Reported by", name: "Priya Kadam & 18 others" },
      },
    ],
    about: [
      "Jalgaon Zilla Parishad is the district-level administration responsible for local infrastructure, water, sanitation and rural development across Jalgaon.",
      "We joined Setu in 2025 under an MoU. Rather than treat the platform as an outside critic, we use it as an ally: citizen-reported duties arrive well-structured and witnessed, and our resolutions are recorded where residents can see them.",
      "We show our overdue items openly. An administration that hides its backlog loses trust; one that resolves in the open earns it.",
    ],
    info: [["Body", "Zilla Parishad"], ["Jurisdiction", "Jalgaon"], ["On Setu since", "2025"], ["SLA window", "30 days"]],
  },
};
