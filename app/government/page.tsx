"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Users,
  TrendingUp,
  AlertTriangle,
  Download,
  Calendar,
  ShieldAlert,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  Building2,
  Target,
  BarChart3,
  ListChecks,
  Check,
  User,
  Minus,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";
import { CATEGORY_META } from "@/lib/mock-data";

/* ─── Mock Data ─── */

type WoundStatus = "reported" | "assessing" | "routed" | "in-progress" | "healed" | "not-achieved";
type CategoryKey = "water" | "sanitation" | "roads" | "education" | "health" | "elder";

interface WoundItem {
  name: string;
  ward: string;
  category: CategoryKey;
  days: number;
  affected: number;
  status: WoundStatus;
  slaBreach: boolean;
}

interface RemediationItem {
  label: string;
  completed: number;
  total: number;
  deadline: string;
  assignee: string;
}

interface SLAEntry {
  department: string;
  compliance: number;
  overdue: number;
  total: number;
  trend: "up" | "down" | "flat";
}

interface ReportEntry {
  period: string;
  resolved: number;
  opened: number;
  avgResolution: number;
  slaCompliance: number;
}

const JURISDICTION = {
  zone: "East Zone",
  wards: "Ward 7–12",
  population: 284000,
  activeWounds: 412,
  resolutionRate: 78,
  department: "BBMP Storm-Water Dept",
  departmentCode: "BBMP-SW-EZ",
  contactName: "S. Ramesh",
  contactDesignation: "Zonal Engineer",
  contactPhone: "+91 98765 43210",
  contactEmail: "ramesh.s@bbmp.gov.in",
  team: [
    { name: "Anita Sharma", role: "Asst. Engineer", wards: "7, 8" },
    { name: "Karthik Nair", role: "Field Officer", wards: "9, 10" },
    { name: "Priya Venkat", role: "Inspector", wards: "11, 12" },
  ],
};

const WOUNDS: WoundItem[] = [
  { name: "Contaminated tap water in Ward 7", ward: "Jayanagar", category: "water", days: 42, affected: 3800, status: "routed", slaBreach: true },
  { name: "Broken sewage pipe near high school", ward: "Rajaji Nagar", category: "sanitation", days: 31, affected: 1200, status: "routed", slaBreach: true },
  { name: "Streetlight outage since monsoon rains", ward: "Hebbal", category: "roads", days: 21, affected: 520, status: "routed", slaBreach: true },
  { name: "14 potholes on NH service road", ward: "Yeshwantpur", category: "roads", days: 28, affected: 8200, status: "routed", slaBreach: true },
  { name: "Drainage overflow blocking market road", ward: "City Market", category: "sanitation", days: 14, affected: 1450, status: "in-progress", slaBreach: false },
  { name: "Waterlogging at bus depot terminal", ward: "Majestic", category: "water", days: 8, affected: 15000, status: "routed", slaBreach: false },
  { name: "Primary health centre roof collapse", ward: "Gubbi", category: "health", days: 5, affected: 240, status: "assessing", slaBreach: false },
  { name: "Lake encroachment settlement survey", ward: "Ulsoor", category: "education", days: 3, affected: 890, status: "assessing", slaBreach: false },
  { name: "Fallen tree blocking arterial road", ward: "Koramangala", category: "roads", days: 1, affected: 3200, status: "reported", slaBreach: false },
  { name: "Broken water main in market area", ward: "Jayanagar", category: "water", days: 18, affected: 2400, status: "in-progress", slaBreach: true },
  { name: "Damaged storm drain cover", ward: "Hebbal", category: "sanitation", days: 9, affected: 680, status: "assessing", slaBreach: false },
  { name: "Illegal dumping near lake", ward: "Ulsoor", category: "sanitation", days: 2, affected: 340, status: "reported", slaBreach: false },
];

const CATEGORY_COLOR: Record<CategoryKey, string> = {
  water: "var(--c-p-400)",
  sanitation: "var(--st-gov-mark)",
  roads: "var(--st-assess-mark)",
  education: "var(--st-healed-mark)",
  health: "var(--st-failed-mark)",
  elder: "var(--st-open-mark)",
};

const REMEDIATION_ITEMS: RemediationItem[] = [
  { label: "Fix 40 taps — Zone A, Ward 7", completed: 12, total: 40, deadline: "15 Aug 2026", assignee: "Anita Sharma" },
  { label: "Desilt 6 drains — Ward 4 & 5", completed: 4, total: 6, deadline: "22 Aug 2026", assignee: "Field Crew A" },
  { label: "Replace 14 streetlights — Hebbal", completed: 14, total: 14, deadline: "10 Jul 2026", assignee: "Karthik Nair" },
  { label: "Fill 22 potholes — NH service road", completed: 8, total: 22, deadline: "30 Aug 2026", assignee: "Priya Venkat" },
  { label: "Install water purifier — Ward 9 school", completed: 0, total: 3, deadline: "05 Sep 2026", assignee: "Anita Sharma" },
  { label: "Repair 8 manhole covers — Ward 11", completed: 6, total: 8, deadline: "18 Aug 2026", assignee: "Field Crew B" },
];

const SLA_ENTRIES: SLAEntry[] = [
  { department: "Water Supply", compliance: 62, overdue: 14, total: 37, trend: "down" },
  { department: "Sanitation", compliance: 78, overdue: 8, total: 42, trend: "up" },
  { department: "Roads & Infrastructure", compliance: 45, overdue: 22, total: 51, trend: "down" },
  { department: "Health & Safety", compliance: 85, overdue: 3, total: 18, trend: "up" },
  { department: "Parks & Environment", compliance: 71, overdue: 5, total: 23, trend: "flat" },
  { department: "Street Lighting", compliance: 58, overdue: 11, total: 29, trend: "down" },
];

const REPORTS: ReportEntry[] = [
  { period: "Jul 2026", resolved: 184, opened: 42, avgResolution: 14.2, slaCompliance: 72 },
  { period: "Jun 2026", resolved: 162, opened: 38, avgResolution: 16.8, slaCompliance: 68 },
  { period: "May 2026", resolved: 198, opened: 51, avgResolution: 12.5, slaCompliance: 76 },
  { period: "Apr 2026", resolved: 145, opened: 44, avgResolution: 18.1, slaCompliance: 65 },
  { period: "Q2 2026", resolved: 545, opened: 133, avgResolution: 14.8, slaCompliance: 71 },
  { period: "Q1 2026", resolved: 492, opened: 156, avgResolution: 16.3, slaCompliance: 67 },
];

const ALL_WARDS = [...new Set(WOUNDS.map(w => w.ward))];
const ALL_CATEGORIES: CategoryKey[] = ["water", "sanitation", "roads", "education", "health", "elder"];

/* ─── Helpers ─── */

function formatInr(n: number): string {
  return n.toLocaleString("en-IN");
}

function ProgressBar({ pct, color = "var(--action)", height = 6, label }: { pct: number; color?: string; height?: number; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height, borderRadius: height / 2, background: "var(--border)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", borderRadius: height / 2, background: color }}
        />
      </div>
      {label && <span className="text-mono" style={{ fontSize: 12, fontWeight: 600, minWidth: 30, textAlign: "right" }}>{label}</span>}
    </div>
  );
}

function ProgressRing({ pct, size = 44, stroke = 4, color = "var(--action)" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.max(0, (pct / 100) * circ);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={size * 0.28} fontWeight={600} fill="var(--text)" fontFamily="var(--font-mono)">
        {Math.round(pct)}
      </text>
    </svg>
  );
}

/* ─── Tab Config ─── */

const SUB_NAV = [
  { id: "queue", label: "Wound Queue", icon: ListChecks },
  { id: "remediation", label: "Remediation", icon: Target },
  { id: "sla", label: "SLA Dashboard", icon: ShieldAlert },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

/* ─── Main Component ─── */

export default function GovernmentPage() {
  const [activeNav, setActiveNav] = useState("queue");
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showTeam, setShowTeam] = useState(false);

  const toggleAck = (i: number) => {
    const next = new Set(acknowledged);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setAcknowledged(next);
  };

  const openWounds = WOUNDS.filter(w => w.status !== "healed" && w.status !== "not-achieved").length;
  const overdueWounds = WOUNDS.filter(w => w.slaBreach).length;
  const resolvedThisMonth = 184;
  const avgResolutionTime = 14.2;
  const slaCompliance = 68;
  const resolutionRate = JURISDICTION.resolutionRate;

  // Derive per-department SLA data for metric
  const avgSlaCompliance = Math.round(SLA_ENTRIES.reduce((s, e) => s + e.compliance, 0) / SLA_ENTRIES.length);

  const filteredWounds = WOUNDS.filter(w => {
    if (statusFilter !== "all" && w.status !== statusFilter) return false;
    if (wardFilter !== "all" && w.ward !== wardFilter) return false;
    if (categoryFilter !== "all" && w.category !== categoryFilter) return false;
    return true;
  });

  const renderTabContent = () => {
    switch (activeNav) {
      case "queue": return renderWoundQueue();
      case "remediation": return renderRemediation();
      case "sla": return renderSLADashboard();
      case "reports": return renderReports();
      default: return renderWoundQueue();
    }
  };

  /* ─── Wound Queue Tab ─── */
  const renderWoundQueue = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
      {/* Table */}
      <div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <select
            className="input"
            style={{ width: "auto", minWidth: 120, height: 34, fontSize: 13, padding: "0 12px", cursor: "pointer" }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="reported">Reported</option>
            <option value="assessing">Assessing</option>
            <option value="routed">Routed · Gov</option>
            <option value="in-progress">In Progress</option>
            <option value="healed">Healed</option>
          </select>
          <select
            className="input"
            style={{ width: "auto", minWidth: 120, height: 34, fontSize: 13, padding: "0 12px", cursor: "pointer" }}
            value={wardFilter}
            onChange={e => setWardFilter(e.target.value)}
          >
            <option value="all">All wards</option>
            {ALL_WARDS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select
            className="input"
            style={{ width: "auto", minWidth: 120, height: 34, fontSize: 13, padding: "0 12px", cursor: "pointer" }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
          </select>
          <span className="text-caption text-2" style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
            {filteredWounds.length} wound{filteredWounds.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Wound</th>
                <th>Ward</th>
                <th>Category</th>
                <th className="cell-right">Days</th>
                <th className="cell-right">Affected</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWounds.map((w, i) => (
                <tr
                  key={w.name}
                  style={
                    w.slaBreach
                      ? { borderLeft: "3px solid var(--st-failed-mark)" }
                      : w.days > 14
                      ? { borderLeft: "3px solid var(--c-r-50)" }
                      : undefined
                  }
                >
                  <td style={{ fontWeight: 500 }}>{w.name}</td>
                  <td style={{ color: "var(--text-2)" }}>{w.ward}</td>
                  <td>
                    <span
                      className="text-caption"
                      style={{ color: CATEGORY_COLOR[w.category], fontWeight: 500 }}
                    >
                      {CATEGORY_META[w.category].label}
                    </span>
                  </td>
                  <td className="cell-right">
                    <span
                      style={{
                        color: w.days > 14 ? "var(--report)" : "var(--text-2)",
                        fontWeight: w.days > 14 ? 600 : 400,
                      }}
                    >
                      {w.days}
                    </span>
                  </td>
                  <td className="cell-right">{w.affected.toLocaleString()}</td>
                  <td>
                    <StatusPill status={w.status} />
                  </td>
                  <td>
                    {w.slaBreach ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: "var(--st-failed-mark)" }}>
                        <AlertTriangle size={11} />
                        Overdue
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--st-healed-mark)", fontWeight: 500 }}>
                        <Check size={11} style={{ display: "inline", marginRight: 2, verticalAlign: "middle" }} />
                        Within SLA
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => toggleAck(i)}
                      style={{
                        background: acknowledged.has(i) ? "var(--st-healed-wash)" : "var(--action)",
                        color: acknowledged.has(i) ? "var(--st-healed-mark)" : "var(--c-white)",
                        boxShadow: acknowledged.has(i) ? "none" : "var(--shadow-btn)",
                        fontSize: 12,
                        height: 30,
                        padding: "0 12px",
                      }}
                    >
                      {acknowledged.has(i) ? (
                        <>
                          <CheckCircle size={11} />
                          Ack'd
                        </>
                      ) : (
                        "Acknowledge"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel — Queue Summary + Department Info */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Queue summary
          </h3>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total wounds</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{WOUNDS.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Overdue SLA</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--st-failed-mark)" }}>{overdueWounds}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Within SLA</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--st-healed-mark)" }}>{WOUNDS.length - overdueWounds}</span>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Avg resolution</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{avgResolutionTime} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">SLA compliance</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: slaCompliance >= 70 ? "var(--st-healed-mark)" : "var(--st-failed-mark)" }}>
                {slaCompliance}%
              </span>
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Building2 size={13} />
            Department
          </h3>
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div>
              <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>{JURISDICTION.department}</p>
              <p className="text-caption text-2">{JURISDICTION.departmentCode}</p>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)", margin: "2px 0" }} />
            <div className="flex items-center gap-8">
              <Phone size={12} color="var(--text-3)" />
              <span className="text-caption" style={{ color: "var(--text-2)" }}>{JURISDICTION.contactPhone}</span>
            </div>
            <div className="flex items-center gap-8">
              <Mail size={12} color="var(--text-3)" />
              <span className="text-caption" style={{ color: "var(--text-2)" }}>{JURISDICTION.contactEmail}</span>
            </div>
            <div className="flex items-center gap-8">
              <User size={12} color="var(--text-3)" />
              <span className="text-caption" style={{ color: "var(--text-2)" }}>
                {JURISDICTION.contactName} · {JURISDICTION.contactDesignation}
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 4, width: "100%", fontSize: 12, height: 30 }}
              onClick={() => setShowTeam(!showTeam)}
            >
              {showTeam ? "Hide team" : "Show team"} ({JURISDICTION.team.length})
            </button>
            {showTeam && (
              <div className="flex flex-col" style={{ gap: 8, marginTop: 4 }}>
                {JURISDICTION.team.map(m => (
                  <div key={m.name} style={{ padding: "8px 10px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)" }}>
                    <p className="text-caption" style={{ fontWeight: 600 }}>{m.name}</p>
                    <p className="text-caption text-2">{m.role} · Ward{m.wards.includes(",") ? "s" : ""} {m.wards}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Remediation Tab ─── */
  const renderRemediation = () => {
    const overallCompleted = REMEDIATION_ITEMS.reduce((s, i) => s + i.completed, 0);
    const overallTotal = REMEDIATION_ITEMS.reduce((s, i) => s + i.total, 0);
    const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    return (
      <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
        <div className="flex flex-col" style={{ gap: 20 }}>
          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="card"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-start justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <p className="text-label-up text-petrol" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Target size={12} />
                  Overall remediation progress
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span className="text-number">{overallPct}%</span>
                  <span className="text-caption text-2">
                    {overallCompleted} / {overallTotal} items completed
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Deadline</p>
                <p className="text-label" style={{ color: "var(--action)", fontWeight: 600 }}>
                  <Calendar size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  30 Aug 2026
                </p>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <ProgressBar pct={overallPct} color="var(--action)" height={10} label={`${overallPct}%`} />
            </div>
          </motion.div>

          {/* Remediation List */}
          {REMEDIATION_ITEMS.map((item, i) => {
            const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
            const isDone = item.completed >= item.total;
            const isAtRisk = !isDone && pct < 50;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="card card-compact"
                style={{
                  borderLeft: isAtRisk ? "3px solid var(--st-failed-mark)" : isDone ? "3px solid var(--st-healed-mark)" : "3px solid var(--c-p-300)",
                }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: 10, gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span
                        className="text-label"
                        style={{
                          fontWeight: 600,
                          color: isDone ? "var(--st-healed-mark)" : "var(--text)",
                        }}
                      >
                        {item.label}
                      </span>
                      {isDone && <CheckCircle size={13} color="var(--st-healed-mark)" />}
                      {isAtRisk && <AlertTriangle size={13} color="var(--st-failed-mark)" />}
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span className="text-caption text-2">
                        <Calendar size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                        {item.deadline}
                      </span>
                      <span className="text-caption text-2">
                        <User size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                        {item.assignee}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-mono text-caption"
                    style={{
                      fontWeight: 600,
                      color: isDone ? "var(--st-healed-mark)" : isAtRisk ? "var(--st-failed-mark)" : "var(--text)",
                    }}
                  >
                    {item.completed}/{item.total}
                  </span>
                </div>
                <ProgressBar pct={pct} color={isDone ? "var(--st-healed-mark)" : isAtRisk ? "var(--st-failed-mark)" : "var(--action)"} height={8} />
                {isAtRisk && (
                  <p className="text-caption" style={{ color: "var(--st-failed-mark)", marginTop: 6, fontWeight: 500 }}>
                    Below 50% completion — at risk of missing deadline
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Panel — Remediation Summary */}
        <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
              Status breakdown
            </h3>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {[
                { label: "Completed", count: REMEDIATION_ITEMS.filter(i => i.completed >= i.total).length, color: "var(--st-healed-mark)" },
                { label: "In progress", count: REMEDIATION_ITEMS.filter(i => i.completed > 0 && i.completed < i.total).length, color: "var(--action)" },
                { label: "At risk", count: REMEDIATION_ITEMS.filter(i => i.completed > 0 && i.completed < i.total && (i.completed / i.total) < 0.5).length, color: "var(--st-failed-mark)" },
                { label: "Not started", count: REMEDIATION_ITEMS.filter(i => i.completed === 0).length, color: "var(--text-3)" },
              ].map(s => (
                <div key={s.label} style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="text-caption" style={{ fontWeight: 500, color: s.color }}>{s.label}</span>
                  <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
              Quick actions
            </h3>
            <div className="flex flex-col" style={{ gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                <FileText size={13} />
                Generate work order
              </button>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                <Users size={13} />
                Assign crew
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                <Download size={13} />
                Export list
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─── SLA Dashboard Tab ─── */
  const renderSLADashboard = () => {
    const overallCompliance = Math.round(SLA_ENTRIES.reduce((s, e) => s + e.compliance, 0) / SLA_ENTRIES.length);
    const totalOverdue = SLA_ENTRIES.reduce((s, e) => s + e.overdue, 0);
    const totalCases = SLA_ENTRIES.reduce((s, e) => s + e.total, 0);

    return (
      <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
        <div className="flex flex-col" style={{ gap: 24 }}>
          {/* SLA Summary Cards */}
          <div className="grid grid-3" style={{ gap: 16 }}>
            <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p className="text-caption text-2">Overall SLA compliance</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressRing pct={overallCompliance} size={48} stroke={4} color={overallCompliance >= 70 ? "var(--st-healed-mark)" : overallCompliance >= 55 ? "var(--st-assess-mark)" : "var(--st-failed-mark)"} />
                <span className="text-number" style={{ fontSize: "clamp(1.2rem, 0.9rem + 1.2vw, 1.8rem)" }}>{overallCompliance}%</span>
              </div>
            </div>
            <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p className="text-caption text-2">Overdue cases</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span className="text-number" style={{ color: "var(--report)" }}>{totalOverdue}</span>
                <span className="delta delta-down">
                  <ArrowDown size={10} />
                  of {totalCases} total
                </span>
              </div>
            </div>
            <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p className="text-caption text-2">Depts below target</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span className="text-number" style={{ color: "var(--report)" }}>{SLA_ENTRIES.filter(e => e.compliance < 70).length}</span>
                <span className="delta delta-down">
                  <ArrowDown size={10} />
                  of {SLA_ENTRIES.length}
                </span>
              </div>
            </div>
          </div>

          {/* SLA Table */}
          <div>
            <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldAlert size={14} />
              Department-wise SLA compliance
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="cell-right">Compliance</th>
                    <th className="cell-right">Overdue</th>
                    <th className="cell-right">Total</th>
                    <th>Trend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SLA_ENTRIES.map((entry, i) => {
                    const isBelowTarget = entry.compliance < 70;
                    return (
                      <tr
                        key={entry.department}
                        style={isBelowTarget ? { borderLeft: "3px solid var(--st-failed-mark)" } : { borderLeft: "3px solid var(--st-healed-mark)" }}
                      >
                        <td style={{ fontWeight: 500 }}>{entry.department}</td>
                        <td className="cell-right">
                          <span style={{ fontWeight: 600, color: isBelowTarget ? "var(--st-failed-mark)" : "var(--st-healed-mark)" }}>
                            {entry.compliance}%
                          </span>
                        </td>
                        <td className="cell-right">
                          <span style={{ color: "var(--report)", fontWeight: 600 }}>{entry.overdue}</span>
                        </td>
                        <td className="cell-right" style={{ color: "var(--text-2)" }}>{entry.total}</td>
                        <td>
                          {entry.trend === "up" ? (
                            <span className="delta delta-up">
                              <ArrowUp size={10} />
                              Improving
                            </span>
                          ) : entry.trend === "down" ? (
                            <span className="delta delta-down">
                              <ArrowDown size={10} />
                              Declining
                            </span>
                          ) : (
                            <span className="delta delta-flat">
                              <Minus size={10} />
                              Stable
                            </span>
                          )}
                        </td>
                        <td>
                          {isBelowTarget ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--st-failed-mark)" }}>
                              <AlertTriangle size={11} />
                              Below target
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--st-healed-mark)" }}>
                              <CheckCircle size={11} />
                              On track
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Required — Overdue Items */}
          <div>
            <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "var(--report)" }}>
              <AlertTriangle size={14} />
              Overdue items requiring immediate action
            </h3>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {WOUNDS.filter(w => w.slaBreach).slice(0, 5).map((w, i) => (
                <motion.div
                  key={w.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-input)",
                    background: "var(--st-failed-wash)",
                    border: "1px solid var(--st-failed-wash)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>{w.name}</p>
                    <p className="text-caption" style={{ color: "var(--st-failed-mark)", fontWeight: 500 }}>
                      {w.days} days overdue · {w.ward}
                    </p>
                  </div>
                  <StatusPill status={w.status} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — SLA Summary */}
        <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
              SLA targets
            </h3>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {[
                { label: "Emergency response", target: "24 hrs", met: true },
                { label: "Routine repair", target: "7 days", met: false },
                { label: "Infrastructure fix", target: "30 days", met: false },
                { label: "Health hazard", target: "48 hrs", met: true },
                { label: "Water supply issue", target: "3 days", met: false },
              ].map(s => (
                <div key={s.label} style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)" }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                    <span className="text-caption" style={{ fontWeight: 500 }}>{s.label}</span>
                    <span className="pill" style={{ fontSize: 9.5, height: 18, padding: "1px 7px", background: s.met ? "var(--st-healed-wash)" : "var(--st-failed-wash)", color: s.met ? "var(--st-healed-mark)" : "var(--st-failed-mark)" }}>
                      {s.target}
                    </span>
                  </div>
                  <p className="text-caption text-2">
                    {s.met ? "Currently within SLA" : "Repeatedly breaching"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
              Department contacts
            </h3>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {SLA_ENTRIES.slice(0, 4).map(e => (
                <div key={e.department} style={{ padding: "8px 10px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="text-caption" style={{ fontWeight: 500 }}>{e.department}</span>
                  <button className="btn btn-ghost btn-sm" style={{ height: 26, fontSize: 11, padding: "0 8px" }}>
                    <Phone size={10} />
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─── Reports Tab ─── */
  const renderReports = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* Report Header with Export */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BarChart3 size={14} />
            Resolution reports
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm">
              <Download size={13} />
              Export CSV
            </button>
            <button className="btn btn-outline btn-sm">
              <FileText size={13} />
              Generate PDF
            </button>
          </div>
        </div>

        {/* Report Cards */}
        {REPORTS.map((report, i) => {
          const isQuarterly = report.period.includes("Q");
          return (
            <motion.div
              key={report.period}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="card card-compact"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderLeft: isQuarterly ? "3px solid var(--action)" : "3px solid var(--c-p-300)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Period badge */}
                <div
                  style={{
                    width: 64,
                    padding: "6px 0",
                    textAlign: "center",
                    borderRadius: "var(--radius-input)",
                    background: isQuarterly ? "var(--c-p-50)" : "var(--bg-muted)",
                  }}
                >
                  <p className="text-label-up" style={{ color: isQuarterly ? "var(--action)" : "var(--text-2)" }}>
                    {isQuarterly ? "QTR" : "MONTH"}
                  </p>
                  <p className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{report.period}</p>
                </div>
                {/* Stats */}
                <div style={{ display: "flex", gap: 24 }}>
                  <div>
                    <p className="text-caption text-2">Resolved</p>
                    <p className="text-label" style={{ fontWeight: 600, color: "var(--st-healed-mark)" }}>{report.resolved}</p>
                  </div>
                  <div>
                    <p className="text-caption text-2">Opened</p>
                    <p className="text-label" style={{ fontWeight: 600, color: "var(--report)" }}>{report.opened}</p>
                  </div>
                  <div>
                    <p className="text-caption text-2">Avg resolution</p>
                    <p className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{report.avgResolution}d</p>
                  </div>
                  <div>
                    <p className="text-caption text-2">SLA compliance</p>
                    <p className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: report.slaCompliance >= 70 ? "var(--st-healed-mark)" : "var(--st-failed-mark)" }}>
                      {report.slaCompliance}%
                    </p>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-3)" />
            </motion.div>
          );
        })}

        {/* Monthly trend bar chart */}
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16 }}>
            <TrendingUp size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
            Monthly resolution trend
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, paddingTop: 8 }}>
            {REPORTS.filter(r => !r.period.includes("Q")).map((r, i) => {
              const maxResolved = Math.max(...REPORTS.filter(r => !r.period.includes("Q")).map(r => r.resolved));
              const heightPct = maxResolved > 0 ? (r.resolved / maxResolved) * 100 : 0;
              return (
                <div key={r.period} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span className="text-mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{r.resolved}</span>
                  <div
                    style={{
                      width: "100%",
                      height: `${heightPct}%`,
                      borderRadius: "4px 4px 0 0",
                      background: r.slaCompliance >= 70 ? "var(--c-p-400)" : "var(--c-r-500)",
                      minHeight: 8,
                      transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    title={`${r.period}: ${r.resolved} resolved, ${r.slaCompliance}% SLA`}
                  />
                  <span className="text-caption text-2" style={{ fontSize: 10 }}>{r.period.split(" ")[0].slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <span className="text-caption text-2">
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "var(--c-p-400)", marginRight: 6, verticalAlign: "middle" }} />
              Within SLA target
            </span>
            <span className="text-caption text-2">
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "var(--c-r-500)", marginRight: 6, verticalAlign: "middle" }} />
              Below SLA target
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel — Reports Summary */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            YTD summary
          </h3>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total resolved</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--st-healed-mark)" }}>
                {REPORTS.filter(r => !r.period.includes("Q")).reduce((s, r) => s + r.resolved, 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total opened</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{REPORTS.filter(r => !r.period.includes("Q")).reduce((s, r) => s + r.opened, 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Avg SLA compliance</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>
                {Math.round(REPORTS.filter(r => !r.period.includes("Q")).reduce((s, r) => s + r.slaCompliance, 0) / REPORTS.filter(r => !r.period.includes("Q")).length)}%
              </span>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Avg resolution time</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>
                {(REPORTS.filter(r => !r.period.includes("Q")).reduce((s, r) => s + r.avgResolution, 0) / REPORTS.filter(r => !r.period.includes("Q")).length).toFixed(1)} days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Best month</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--st-healed-mark)" }}>
                {REPORTS.filter(r => !r.period.includes("Q")).sort((a, b) => b.resolved - a.resolved)[0]?.period}
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Export options
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              <Download size={13} />
              Monthly report (CSV)
            </button>
            <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              <Download size={13} />
              Quarterly report (PDF)
            </button>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              <Calendar size={13} />
              Schedule auto-report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Component render ─── */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 56 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <h1 className="text-h1">Government Dashboard</h1>
          <span className="role-badge" style={{ background: "var(--bg-muted)" }}>
            <span className="role-dot" style={{ background: "var(--role-gov)" }} />
            Government
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 24 }}>
          {JURISDICTION.department} · {JURISDICTION.zone} · {JURISDICTION.wards}
        </p>

        {/* ─── Jurisdiction Header Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{
            marginBottom: 28,
            padding: "24px 28px",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
          }}
        >
          <div className="flex items-start justify-between" style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="text-label-up text-petrol" style={{ marginBottom: 6 }}>
                <MapPin size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                Jurisdiction overview
              </p>
              <p className="text-h1" style={{ fontSize: "clamp(1.5rem, 1rem + 1.8vw, 2rem)", marginBottom: 2 }}>
                {JURISDICTION.zone}
              </p>
              <p className="text-caption" style={{ color: "var(--text-2)" }}>
                {JURISDICTION.wards} · {formatInr(JURISDICTION.population)} residents
              </p>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Active wounds</p>
                <p className="text-number" style={{ fontSize: 20, color: "var(--text)" }}>{openWounds}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Resolution rate</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                  <span className="text-number" style={{ fontSize: 20, color: resolutionRate >= 70 ? "var(--st-healed-mark)" : "var(--st-failed-mark)" }}>{resolutionRate}%</span>
                  {resolutionRate >= 70 ? (
                    <ArrowUp size={14} color="var(--st-healed-mark)" />
                  ) : (
                    <ArrowDown size={14} color="var(--st-failed-mark)" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Rate Bar */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} color="var(--action)" />
                <span className="text-label" style={{ color: "var(--text-2)" }}>Resolution progress</span>
              </div>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                {resolutionRate}% resolved
              </span>
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 6,
                background: "var(--bg-raised)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${resolutionRate}%`,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, var(--c-p-600) 0%, var(--st-healed-mark) 100%)`,
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "var(--c-white)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {resolutionRate}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Enhanced Metric Strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-3"
          style={{ gap: 16, marginBottom: 36 }}
        >
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Open wounds</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{openWounds}</span>
              <span className="delta delta-flat">
                <ListChecks size={10} />
                In jurisdiction
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Overdue wounds</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number" style={{ color: "var(--report)" }}>{overdueWounds}</span>
              <span className="delta delta-down">
                <ArrowDown size={10} />
                SLA breached
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Resolved this month</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number" style={{ color: "var(--st-healed-mark)" }}>{resolvedThisMonth}</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                +14% vs Jun
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Avg resolution time</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number" style={{ fontSize: "clamp(1.2rem, 0.9rem + 1.2vw, 1.8rem)" }}>{avgResolutionTime}</span>
              <span className="delta delta-up" style={{ fontSize: 10.5 }}>
                <ArrowUp size={9} />
                days
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">SLA compliance</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ProgressRing pct={avgSlaCompliance} size={40} stroke={3.5} color={avgSlaCompliance >= 70 ? "var(--st-healed-mark)" : "var(--st-failed-mark)"} />
              <span className="text-number" style={{ fontSize: "clamp(1.2rem, 0.9rem + 1.2vw, 1.8rem)", color: avgSlaCompliance >= 70 ? "var(--st-healed-mark)" : "var(--st-failed-mark)" }}>
                {avgSlaCompliance}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Sub-nav ─── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4, flexWrap: "nowrap" }}>
          {SUB_NAV.map((item) => (
            <button
              key={item.id}
              className={`chip${activeNav === item.id ? " selected" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <motion.div
          key={activeNav}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}
