import { ACTORS, WOUNDS, type RoleKey, type StatusKey, type Wound } from "./mock-data";

export type HomeModuleType =
  | "your-wounds" | "near-you" | "trending" | "needs-you"
  | "your-projects" | "matched" | "jurisdiction" | "activity"
  | "mini-atlas" | "watchlist";

export interface ActivityEvent {
  text: string;
  time: string;
  href: string;
  status?: StatusKey;
}

export interface HomeModule {
  type: HomeModuleType;
  title: string;
  subtitle?: string;
  items: (Wound | ActivityEvent)[];
  cta?: { label: string; href: string };
  emphasis?: "primary" | "normal";
}

export interface HomeFeed {
  greeting: { name: string; role: RoleKey; locationLabel: string; timeOfDay: string };
  headlineStat: { label: string; value: string };
  supportStats: { label: string; value: string; sub?: string }[];
  modules: HomeModule[];
  primaryCta: { label: string; href?: string; action?: "report" };
  rightRail: { type: "mini-atlas" | "activity" | "stat-card" | "cta"; title?: string; value?: string; subtitle?: string; items?: ActivityEvent[]; ctaLabel?: string; ctaHref?: string }[];
}

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function woundsNear(actorRole: RoleKey): Wound[] {
  if (actorRole === "citizen" || actorRole === "ngo" || actorRole === "government")
    return WOUNDS.filter(w => w.placeId === "jalgaon");
  return WOUNDS.filter(w => w.placeId === "mumbai" || w.placeId === "jalgaon");
}

function trendingWounds(actorRole: RoleKey): Wound[] {
  return WOUNDS.filter(w => w.corroborations >= 40).sort((a, b) => b.corroborations - a.corroborations).slice(0, 6);
}

function activityFor(actorRole: RoleKey): ActivityEvent[] {
  const base: ActivityEvent[] = [
    { text: "Ward 7 handpump reached 247 corroborations", time: "2h ago", href: "/wound/SETU-MH-0001", status: "healed" },
    { text: "Jeevan Setu Foundation verified milestone 2", time: "5h ago", href: "/ngo", status: "in-progress" },
    { text: "12 new witnesses on the cables wound", time: "8h ago", href: "/wound/SETU-MH-0005", status: "routed" },
  ];
  if (actorRole === "citizen") return [
    { text: "3 new corroborations on your Ward 7 wound", time: "2h ago", href: "/wound/SETU-MH-0001", status: "healed" },
    { text: "Verifier assigned to your open drain report", time: "5h ago", href: "/wound/SETU-MH-0002", status: "in-progress" },
    { text: "Jeevan Setu confirmed the Ward 7 handpump fix", time: "1d ago", href: "/wound/SETU-MH-0001", status: "healed" },
    { text: "Your corroboration on the cables wound reached 61", time: "2d ago", href: "/wound/SETU-MH-0005", status: "routed" },
  ];
  if (actorRole === "ngo") return [
    { text: "GreenWater Beverages funded your lake project", time: "3h ago", href: "/wound/SETU-MH-0010", status: "in-progress" },
    { text: "Verifier confirmed milestone 2 on the RO plant", time: "8h ago", href: "/wound/SETU-MH-0009", status: "not-achieved" },
    { text: "Aditya Infra added your handpump project to portfolio", time: "1d ago", href: "/wound/SETU-MH-0001", status: "healed" },
    ...base.slice(2),
  ];
  if (actorRole === "corporate") return [
    { text: "Proof ledger updated — milestone 3 verified", time: "4h ago", href: "/corporate", status: "healed" },
    { text: "CSR compliance check passed for Q2", time: "1d ago", href: "/corporate", status: "healed" },
    { text: "Jeevan Setu submitted next milestone for RO plant", time: "2d ago", href: "/wound/SETU-MH-0009", status: "not-achieved" },
    ...base.slice(1),
  ];
  if (actorRole === "government") return [
    { text: "14 new wounds reported in your jurisdiction", time: "1h ago", href: "/government", status: "reported" },
    { text: "Blocked storm drain on Market Road resolved in 9 days", time: "6h ago", href: "/wound/SETU-MH-0007", status: "healed" },
    { text: "Septic tank in Ward 9 overdue — 41 days past SLA", time: "12h ago", href: "/wound/SETU-MH-0006", status: "assessing" },
    { text: "Anjali Rao & 60 others corroborated the cables wound", time: "2d ago", href: "/wound/SETU-MH-0005", status: "routed" },
  ];
  return base;
}

export function getHomeFeed(actorRole: RoleKey): HomeFeed {
  const a = ACTORS[actorRole];
  const near = woundsNear(actorRole);
  const trending = trendingWounds(actorRole);
  const activity = activityFor(actorRole);
  const actorWounds = WOUNDS.filter(w => w.reportedBy === actorRole || w.healedBy === actorRole || w.fundedBy === actorRole || w.routedTo === actorRole);

  const common: Partial<HomeFeed> = {
    greeting: {
      name: a.name.split(" ")[0],
      role: actorRole,
      locationLabel: actorRole === "citizen" || actorRole === "ngo" ? "Jalgaon" : actorRole === "corporate" ? "Mumbai" : "Jalgaon",
      timeOfDay: timeOfDay(),
    },
    modules: [],
    rightRail: [],
  };

  switch (actorRole) {
    case "citizen":
      return {
        ...common as HomeFeed,
        headlineStat: { label: "Wounds near you moving", value: String(near.filter(w => w.status === "in-progress" || w.status === "healed").length) },
        supportStats: [
          { label: "You reported", value: "23" },
          { label: "Corroborated", value: "186" },
          { label: "Helped heal", value: "5" },
        ],
        modules: [
          { type: "your-wounds", title: "What you reported", emphasis: "primary", items: actorWounds.filter(w => w.reportedBy === "citizen").slice(0, 5) as Wound[], cta: { label: "See all reports", href: "/stream" } },
          { type: "near-you", title: "Happening near you", items: near.slice(0, 5), cta: { label: "View on the Atlas", href: "/atlas" } },
          { type: "trending", title: `Rising in ${common.greeting?.locationLabel}`, items: trending.slice(0, 5), cta: { label: "Open the Stream", href: "/stream" } },
        ],
        primaryCta: { label: "Report a wound", action: "report" },
        rightRail: [
          { type: "mini-atlas", title: "Jalgaon" },
          { type: "activity", title: "Recent activity", items: activity },
        ],
      };

    case "ngo":
      return {
        ...common as HomeFeed,
        headlineStat: { label: "Fundable wounds matching your focus", value: String(WOUNDS.filter(w => w.category === "water" && (w.status === "reported" || w.status === "assessing") && w.fundedBy === undefined).length) },
        supportStats: [
          { label: "Your projects", value: "34" },
          { label: "Verified outcomes", value: "28", sub: "of 34" },
          { label: "Matched & delivered", value: "₹4.6", sub: " Cr" },
        ],
        modules: [
          { type: "matched", title: "Matched to your work", subtitle: "Fundable wounds in your category and districts — ready for a proposal.", emphasis: "primary", items: WOUNDS.filter(w => w.category === "water" && (w.status === "reported" || w.status === "assessing") && w.fundedBy === undefined).slice(0, 5), cta: { label: "Find more fundable wounds", href: "/search" } },
          { type: "your-projects", title: "Your active projects", items: actorWounds.filter(w => w.healedBy === "ngo").slice(0, 5), cta: { label: "View all projects", href: "/ngo" } },
          { type: "trending", title: "Rising needs in your districts", items: trending.slice(0, 5), cta: { label: "Open the Stream", href: "/stream" } },
        ],
        primaryCta: { label: "Find fundable wounds", href: "/search" },
        rightRail: [
          { type: "mini-atlas", title: "Jalgaon" },
          { type: "activity", title: "Recent activity", items: activity },
        ],
      };

    case "corporate":
      return {
        ...common as HomeFeed,
        headlineStat: { label: "CSR obligation deployed", value: "₹3.2 Cr" },
        supportStats: [
          { label: "Annual obligation", value: "₹9.4 Cr" },
          { label: "Projects funded", value: "19" },
          { label: "Verified by Setu", value: "84%" },
        ],
        modules: [
          { type: "matched", title: "Matched to your CSR mandate", subtitle: "Bundled projects fitting your sector and geography, pre-cleared for legality.", emphasis: "primary", items: WOUNDS.filter(w => w.fundedBy === undefined && (w.status === "reported" || w.status === "assessing") && w.category === "water").slice(0, 5), cta: { label: "Discover more projects", href: "/search" } },
          { type: "your-projects", title: "Your portfolio", items: actorWounds.filter(w => w.fundedBy === "corporate").slice(0, 5), cta: { label: "View portfolio", href: "/corporate" } },
          { type: "activity", title: "Verification updates", items: activity },
        ],
        primaryCta: { label: "Export board report", href: "/corporate" },
        rightRail: [
          { type: "mini-atlas", title: "Mumbai" },
          { type: "stat-card", title: "Compliance", value: "On track", subtitle: "Next check 31 Mar", ctaLabel: "View proof ledger", ctaHref: "/corporate" },
        ],
      };

    case "government":
      return {
        ...common as HomeFeed,
        headlineStat: { label: "Wounds in Jalgaon", value: "412" },
        supportStats: [
          { label: "Resolved", value: "251" },
          { label: "Resolution rate", value: "61%" },
          { label: "Overdue", value: "34" },
        ],
        modules: [
          { type: "jurisdiction", title: "Needs your action", subtitle: "Government-duty wounds routed to you, sorted by overdue first.", emphasis: "primary", items: [...actorWounds.filter(w => w.routedTo === "government")].sort((a, b) => {
            const aDays = parseInt(a.date.match(/\d+/)?.[0] || "0");
            const bDays = parseInt(b.date.match(/\d+/)?.[0] || "0");
            return bDays - aDays;
          }).slice(0, 5), cta: { label: "View all jurisdiction", href: "/government" } },
          { type: "activity", title: "Recently resolved", items: activity.filter(e => e.status === "healed") },
          { type: "trending", title: "Rising in your district", items: trending.slice(0, 5), cta: { label: "Open the Stream", href: "/stream" } },
        ],
        primaryCta: { label: "View overdue queue", href: "/government" },
        rightRail: [
          { type: "mini-atlas", title: "Jalgaon" },
          { type: "stat-card", title: "SLA window", value: "30 days", subtitle: "34 wounds overdue", ctaLabel: "See overdue", ctaHref: "/government" },
        ],
      };
  }
}
