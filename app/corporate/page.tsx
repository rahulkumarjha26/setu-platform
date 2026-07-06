"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  BarChart3,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Check,
  ArrowUp,
  Minus,
  Download,
  Calendar,
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Target,
  LineChart,
  Building2,
  ExternalLink,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";
import { VerificationEventCard } from "../components/VerificationEventCard";
import {
  getCSRCompany,
  getCSREscrows,
  getCSRCompliance,
  VERIFICATION_EVENTS,
  WOUNDS,
  type CSREscrow,
  type CSRComplianceReport,
} from "@/lib/mock-data";

const COMPANY_ID = "CSR-TATA";

const SUB_NAV = [
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "compliance", label: "Compliance", icon: FileCheck },
  { id: "proof", label: "Proof", icon: ShieldCheck },
  { id: "discovery", label: "Discovery", icon: Search },
  { id: "bundles", label: "Bundles", icon: Package },
  { id: "scoring", label: "NGO scoring", icon: BarChart3 },
];

const PROJECTS = [
  {
    name: "Lake restoration Phase I",
    district: "Muzaffarpur, Bihar",
    budget: "₹22,00,000",
    milestone: { disbursed: 45, held: 35, pending: 20 },
    status: "in-progress" as const,
    verified: true,
    impact: "3,400 households",
  },
  {
    name: "School sanitation — 8 units",
    district: "Arrah, Bihar",
    budget: "₹8,50,000",
    milestone: { disbursed: 100, held: 0, pending: 0 },
    status: "healed" as const,
    verified: true,
    impact: "1,200 children",
  },
  {
    name: "Migrant health camp Q3",
    district: "Buxar, Bihar",
    budget: "₹6,80,000",
    milestone: { disbursed: 30, held: 50, pending: 20 },
    status: "assessing" as const,
    verified: false,
    impact: "800 workers",
  },
  {
    name: "Anganwadi repair — 12 centres",
    district: "Darbhanga, Bihar",
    budget: "₹5,40,000",
    milestone: { disbursed: 70, held: 20, pending: 10 },
    status: "in-progress" as const,
    verified: true,
    impact: "600 children",
  },
  {
    name: "Waste segregation — 40 wards",
    district: "Sasaram, Bihar",
    budget: "₹18,00,000",
    milestone: { disbursed: 15, held: 60, pending: 25 },
    status: "in-progress" as const,
    verified: false,
    impact: "8,000 residents",
  },
  {
    name: "Sewage connection — 60 HH",
    district: "Samastipur, Bihar",
    budget: "₹8,80,000",
    milestone: { disbursed: 55, held: 25, pending: 20 },
    status: "in-progress" as const,
    verified: true,
    impact: "300 families",
  },
];

const BUNDLES = [
  { label: "Water & Sanitation", count: 7, icon: "💧" },
  { label: "Education", count: 4, icon: "📚" },
  { label: "Health", count: 3, icon: "🏥" },
  { label: "Infrastructure", count: 5, icon: "🏗️" },
];

const NGO_METRICS = [
  { name: "Jeevan Setu Foundation", score: 91, projects: 34, verifiedRate: "82%" },
  { name: "Gram Vikas Trust", score: 87, projects: 18, verifiedRate: "78%" },
  { name: "Sarthak Sansthan", score: 84, projects: 12, verifiedRate: "75%" },
  { name: "Neelkanth Foundation", score: 79, projects: 8, verifiedRate: "63%" },
  { name: "Aadhar Samiti", score: 73, projects: 5, verifiedRate: "60%" },
];

const DISCOVERY_WOUNDS = WOUNDS.filter(w => w.status === "reported" || w.status === "assessing").slice(0, 5);

/* ─── Helpers ─── */

function ProgressRing({ pct, size = 36, stroke = 3, color = "var(--action)" }: { pct: number; size?: number; stroke?: number; color?: string }) {
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

function formatCr(n: number): string {
  return `₹${n} Cr`;
}

function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ─── Main Component ─── */

export default function CorporatePage() {
  const [activeNav, setActiveNav] = useState("portfolio");
  const [selectedProject, setSelectedProject] = useState(0);
  const [showAllEscrows, setShowAllEscrows] = useState(false);

  const company = getCSRCompany(COMPANY_ID);
  const escrows = getCSREscrows(COMPANY_ID);
  const complianceReports = getCSRCompliance(COMPANY_ID);
  const verificationEvents = VERIFICATION_EVENTS.slice(0, 4);

  if (!company) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ minHeight: "100vh", paddingBottom: 120 }}>
        <div className="container mob-px-16" style={{ paddingTop: 56 }}>
          <h1 className="text-h1">CSR Compliance Dashboard</h1>
          <p className="text-body text-2">Company data not found.</p>
        </div>
      </motion.div>
    );
  }

  const obligation = company.csrObligation;
  const spent = company.csrSpent;
  const unspent = company.csrUnspent;
  const spentPct = obligation > 0 ? Math.round((spent / obligation) * 100) : 0;

  const displayedEscrows = showAllEscrows ? escrows : escrows.slice(0, 2);

  const renderTabContent = () => {
    switch (activeNav) {
      case "portfolio":
        return renderPortfolio();
      case "compliance":
        return renderCompliance();
      case "proof":
        return renderProof();
      case "discovery":
        return renderDiscovery();
      case "bundles":
        return renderBundles();
      case "scoring":
        return renderScoring();
      default:
        return renderPortfolio();
    }
  };

  /* ─── Portfolio Tab ─── */
  const renderPortfolio = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>District</th>
              <th className="cell-right">Budget ₹</th>
              <th>Milestone</th>
              <th>Impact</th>
              <th>Status</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p, i) => (
              <tr
                key={p.name}
                onClick={() => setSelectedProject(i)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ fontWeight: 500, color: i === selectedProject ? "var(--action)" : "inherit" }}>
                  {p.name}
                </td>
                <td style={{ color: "var(--text-2)" }}>{p.district}</td>
                <td className="cell-right" style={{ fontSize: 13 }}>{p.budget}</td>
                <td>
                  <div style={{ display: "flex", gap: 2, alignItems: "center", width: 100 }}>
                    <div
                      style={{
                        height: 5,
                        borderRadius: 3,
                        background: "var(--st-healed-mark)",
                        flex: p.milestone.disbursed,
                        minWidth: 4,
                      }}
                      title={`Disbursed: ${p.milestone.disbursed}%`}
                    />
                    <div
                      style={{
                        height: 5,
                        borderRadius: 3,
                        background: "var(--action)",
                        flex: p.milestone.held,
                        minWidth: 4,
                      }}
                      title={`Held (escrow): ${p.milestone.held}%`}
                    />
                    <div
                      style={{
                        height: 5,
                        borderRadius: 3,
                        background: "var(--bg-muted)",
                        flex: p.milestone.pending,
                        minWidth: 4,
                      }}
                      title={`Pending: ${p.milestone.pending}%`}
                    />
                  </div>
                </td>
                <td style={{ color: "var(--text-2)", fontSize: 13 }}>{p.impact}</td>
                <td>
                  <StatusPill status={p.status} />
                </td>
                <td>
                  {p.verified ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--st-healed-mark)", fontWeight: 500 }}>
                      <Check size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="text-caption text-3">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Panel — Escrow Overview */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        {/* Escrow Overview */}
        <div className="card" style={{ padding: 20 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Wallet size={13} />
              Escrow overview
            </h3>
            <span className="pill pill--active" style={{ fontSize: 10 }}>
              <Target size={10} />
              {escrows.filter(e => e.status === "active").length} active
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {displayedEscrows.map((escrow, i) => {
              const total = escrow.totalAmount;
              const disbursedPct = total > 0 ? Math.round((escrow.disbursed / total) * 100) : 0;
              const heldPct = total > 0 ? Math.round((escrow.held / total) * 100) : 0;
              const pendingPct = total > 0 ? Math.round((escrow.pending / total) * 100) : 0;
              return (
                <div
                  key={escrow.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-input)",
                    background: "var(--bg-muted)",
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <p className="text-caption" style={{ fontWeight: 600, color: "var(--text)", lineHeight: 1.3, flex: 1, minWidth: 0 }}>{escrow.projectName}</p>
                    <span
                      className="pill"
                      style={{
                        background: escrow.status === "completed" ? "var(--st-healed-wash)" : escrow.status === "paused" ? "var(--st-failed-wash)" : "var(--c-p-50)",
                        color: escrow.status === "completed" ? "var(--st-healed-mark)" : escrow.status === "paused" ? "var(--st-failed-mark)" : "var(--action)",
                        fontSize: 9.5,
                        padding: "2px 8px",
                        height: 18,
                        marginLeft: 8,
                      }}
                    >
                      {escrow.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: "var(--border)", display: "flex" }}>
                      <div style={{ flex: Math.max(1, disbursedPct), background: "var(--st-healed-mark)", borderRadius: 2 }} />
                      <div style={{ flex: Math.max(1, heldPct), background: "var(--action)", borderRadius: 2 }} />
                      <div style={{ flex: Math.max(1, pendingPct), background: "var(--bg-muted)", borderRadius: 2 }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption" style={{ color: "var(--text-2)" }}>{formatInr(total)}</span>
                    <span className="text-caption" style={{ color: "var(--text-3)", fontSize: 11 }}>
                      Next: {escrow.nextRelease}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {escrows.length > 2 && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 12, width: "100%" }}
              onClick={() => setShowAllEscrows(!showAllEscrows)}
            >
              {showAllEscrows ? "Show less" : `Show all ${escrows.length} escrows`}
            </button>
          )}
        </div>

        {/* Quick Summary */}
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Portfolio summary
          </h3>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total committed</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>{formatInr(escrows.reduce((s, e) => s + e.totalAmount, 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Disbursed</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--st-healed-mark)" }}>{formatInr(escrows.reduce((s, e) => s + e.disbursed, 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">In escrow</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--action)" }}>{formatInr(escrows.reduce((s, e) => s + e.held, 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Pending release</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--text-3)" }}>{formatInr(escrows.reduce((s, e) => s + e.pending, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Compliance Tab ─── */
  const renderCompliance = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* Annual Report Cards */}
        <div>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <FileCheck size={14} />
            Annual CSR compliance reports
          </h3>
          <div className="flex flex-col" style={{ gap: 12 }}>
            {complianceReports.map((report, i) => (
              <motion.div
                key={report.year}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card card-compact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* FY badge */}
                  <div
                    style={{
                      width: 64,
                      padding: "6px 0",
                      textAlign: "center",
                      borderRadius: "var(--radius-input)",
                      background: "var(--bg-muted)",
                    }}
                  >
                    <p className="text-label-up" style={{ color: "var(--text-2)" }}>FY</p>
                    <p className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{report.year}</p>
                  </div>
                  {/* Status */}
                  <div>
                    <span
                      className="pill"
                      style={{
                        background:
                          report.status === "filed"
                            ? "var(--st-healed-wash)"
                            : report.status === "overdue"
                            ? "var(--st-failed-wash)"
                            : "var(--st-assess-wash)",
                        color:
                          report.status === "filed"
                            ? "var(--st-healed-mark)"
                            : report.status === "overdue"
                            ? "var(--st-failed-mark)"
                            : "var(--st-assess-mark)",
                        marginBottom: 4,
                      }}
                    >
                      {report.status === "filed" ? <Check size={11} /> : <AlertTriangle size={11} />}
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    <p className="text-caption" style={{ color: "var(--text-3)" }}>
                      Due: {report.dueDate}{report.filedDate ? ` · Filed: ${report.filedDate}` : ""}
                    </p>
                  </div>
                </div>
                {/* Accuracy Score */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <p className="text-caption text-2">Accuracy</p>
                    <p
                      className="text-number"
                      style={{
                        fontSize: 20,
                        color:
                          report.accuracyScore >= 85
                            ? "var(--st-healed-mark)"
                            : report.accuracyScore >= 75
                            ? "var(--st-assess-mark)"
                            : "var(--st-failed-mark)",
                      }}
                    >
                      {report.accuracyScore}%
                    </p>
                  </div>
                  <ProgressRing pct={report.accuracyScore || 0} size={40} stroke={3.5} color={report.accuracyScore >= 85 ? "var(--st-healed-mark)" : report.accuracyScore >= 75 ? "var(--st-assess-mark)" : "var(--st-failed-mark)"} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filing details table */}
        <div>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <FileCheck size={14} />
            Filing requirements
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Form</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th className="cell-right">Due date</th>
                  <th className="cell-right">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {complianceReports.map((r) => (
                  <tr key={`filing-${r.year}`}>
                    <td style={{ fontWeight: 500 }}>CSR-1</td>
                    <td style={{ color: "var(--text-2)" }}>Sec. 135 · {r.year}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                          fontWeight: 500,
                          color:
                            r.status === "filed"
                              ? "var(--st-healed-mark)"
                              : r.status === "overdue"
                              ? "var(--st-failed-mark)"
                              : "var(--st-assess-mark)",
                        }}
                      >
                        {r.status === "filed" ? <Check size={13} /> : <AlertTriangle size={13} />}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="cell-right" style={{ color: "var(--text-2)" }}>{r.dueDate}</td>
                    <td className="cell-right" style={{ fontWeight: 600 }}>{r.accuracyScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Report Button */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ gap: 8 }}>
            <Download size={15} />
            Generate compliance report
          </button>
          <button className="btn btn-outline" style={{ gap: 8 }}>
            <Calendar size={15} />
            Schedule audit
          </button>
        </div>
      </div>

      {/* Right Panel — Compliance Summary */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Compliance summary
          </h3>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <div className="flex items-center gap-12">
              <ProgressRing pct={company.complianceScore} size={52} stroke={4} color="var(--action)" />
              <div>
                <p className="text-number" style={{ fontSize: 22 }}>{company.complianceScore}%</p>
                <p className="text-caption" style={{ color: "var(--text-2)" }}>Compliance score</p>
              </div>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)" }} />
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Reports filed</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{complianceReports.filter(r => r.status === "filed").length}/{complianceReports.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Avg. accuracy</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {complianceReports.length > 0
                  ? Math.round(complianceReports.reduce((sum, r) => sum + (r.accuracyScore || 0), 0) / complianceReports.length)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Next audit</span>
              <span style={{ fontWeight: 500, fontSize: 13, color: "var(--action)" }}>31 Mar 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Next due</span>
              <span style={{ fontWeight: 500, fontSize: 13, color: complianceReports.find(r => r.status === "pending") ? "var(--st-assess-mark)" : "var(--st-healed-mark)" }}>
                {complianceReports.find(r => r.status === "pending")?.dueDate || "All filed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Proof Tab ─── */
  const renderProof = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 20 }}>
        <h3 className="text-label-up text-3" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={14} />
          Verification events
        </h3>
        {verificationEvents.map((evt, i) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <VerificationEventCard event={evt} />
          </motion.div>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", gap: 6 }}>
          View all events <ChevronRight size={13} />
        </button>
      </div>

      {/* Right Panel — proof layers */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16 }}>
            Proof ledger
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Geo-tagged photo", done: true },
              { label: "Independent verifier", done: true },
              { label: "Community validation", done: true },
              { label: "Outcome measured", done: false },
            ].map((layer) => (
              <div
                key={layer.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-input)",
                  background: layer.done ? "var(--st-healed-wash)" : "var(--bg-muted)",
                }}
              >
                {layer.done ? (
                  <Check size={14} color="var(--st-healed-mark)" />
                ) : (
                  <span style={{ width: 14, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>&mdash;</span>
                )}
                <span
                  className="text-caption"
                  style={{
                    color: layer.done ? "var(--st-healed-mark)" : "var(--text-3)",
                    fontWeight: 500,
                  }}
                >
                  {layer.label}
                </span>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 16, width: "100%" }}
          >
            <Download size={14} />
            Export board report
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── Discovery Tab ─── */
  const renderDiscovery = () => (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Search size={14} />
          Wound discovery feed
        </h3>
        <div style={{ display: "flex", gap: 6 }}>
          {["Newest", "Trending", "Nearby"].map((f) => (
            <button key={f} className="stream-chip" style={{ fontSize: 12, height: 30 }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {DISCOVERY_WOUNDS.map((w, i) => (
        <motion.div
          key={w.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="stream-card"
          style={{ cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <p className="stream-title" style={{ fontSize: 17, marginBottom: 4 }}>{w.title}</p>
              <p className="text-caption" style={{ color: "var(--text-2)", marginBottom: 8 }}>{w.body.slice(0, 120)}…</p>
              <div className="wound-meta" style={{ gap: "6px 14px" }}>
                <span>{w.id}</span>
                <span>{w.place}</span>
                <span>{w.date}</span>
                <span>{w.corroborations} corroborations</span>
              </div>
            </div>
            <StatusPill status={w.status} />
          </div>
        </motion.div>
      ))}
      <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", gap: 6 }}>
        View full discovery feed <ChevronRight size={13} />
      </button>
    </div>
  );

  /* ─── Bundles Tab ─── */
  const renderBundles = () => (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Package size={14} />
        Project categories
      </h3>
      <div className="grid grid-2" style={{ gap: 16 }}>
        {BUNDLES.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="card card-compact"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-input)",
                  background: "var(--bg-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {b.icon}
              </div>
              <div>
                <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>{b.label}</p>
                <p className="text-caption text-2">{b.count} projects</p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-3)" />
          </motion.div>
        ))}
      </div>
    </div>
  );

  /* ─── NGO Scoring Tab ─── */
  const renderScoring = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 20 }}>
        <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={14} />
          NGO verification scores
        </h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>NGO</th>
                <th className="cell-right">Score</th>
                <th className="cell-right">Projects</th>
                <th className="cell-right">Verified rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {NGO_METRICS.map((ngo, i) => (
                <tr key={ngo.name} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: i === 0 ? "var(--action)" : "var(--bg-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 600,
                          color: i === 0 ? "#fff" : "var(--text-2)",
                        }}
                      >
                        {ngo.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{ngo.name}</span>
                    </div>
                  </td>
                  <td className="cell-right">
                    <span style={{
                      fontWeight: 600,
                      color: ngo.score >= 85 ? "var(--st-healed-mark)" : ngo.score >= 75 ? "var(--st-assess-mark)" : "var(--st-failed-mark)",
                    }}>
                      {ngo.score}
                    </span>
                  </td>
                  <td className="cell-right" style={{ color: "var(--text-2)" }}>{ngo.projects}</td>
                  <td className="cell-right" style={{ color: "var(--text-2)" }}>{ngo.verifiedRate}</td>
                  <td>
                    <span className="text-caption" style={{ color: "var(--action)", fontWeight: 500 }}>
                      View profile
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline btn-sm" style={{ alignSelf: "flex-start" }}>
          <LineChart size={14} />
          Scoring methodology
        </button>
      </div>

      {/* Right panel */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Scoring factors
          </h3>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {[
              { factor: "Verification rate", weight: "35%", value: "Avg pass rate across all projects" },
              { factor: "Project completion", weight: "25%", value: "On-time vs overdue milestones" },
              { factor: "Community feedback", weight: "20%", value: "Corroboration attestation quality" },
              { factor: "Financial accuracy", weight: "20%", value: "Fund utilisation variance < 5%" },
            ].map((item) => (
              <div key={item.factor} style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span className="text-caption" style={{ fontWeight: 600, color: "var(--text)" }}>{item.factor}</span>
                  <span className="pill" style={{ fontSize: 9.5, padding: "1px 7px", height: 18, background: "var(--c-p-50)", color: "var(--action)" }}>{item.weight}</span>
                </div>
                <p className="text-caption" style={{ color: "var(--text-3)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Render ─── */

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
          <h1 className="text-h1">CSR Compliance Dashboard</h1>
          <span className="role-badge" style={{ background: "var(--c-r-50)" }}>
            <span className="role-dot" style={{ background: "var(--role-corp)" }} />
            Corporate
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 24 }}>
          {company.name} · {company.industry} · FY {company.financialYear}
        </p>

        {/* ─── CSR Mandate Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{
            marginBottom: 28,
            padding: "24px 28px",
            background: "linear-gradient(135deg, var(--c-p-50) 0%, var(--c-p-100) 100%)",
            border: "1px solid var(--c-p-200)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
          }}
        >
          <div className="flex items-start justify-between" style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="text-label-up text-petrol" style={{ marginBottom: 6 }}>
                <Calendar size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                FY {company.financialYear} CSR Obligation
              </p>
              <p className="text-h1" style={{ fontSize: "clamp(1.5rem, 1rem + 1.8vw, 2rem)", marginBottom: 2 }}>
                {formatCr(obligation)}
              </p>
              <p className="text-caption" style={{ color: "var(--action)" }}>
                Deadline: {company.csrDeadline}
              </p>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Spent</p>
                <p className="text-number" style={{ fontSize: 20, color: "var(--st-healed-mark)" }}>{formatCr(spent)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Unspent</p>
                <p className="text-number" style={{ fontSize: 20, color: "var(--st-failed-mark)" }}>{formatCr(unspent)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="text-caption text-2">Met</p>
                <p className="text-number" style={{ fontSize: 20, color: "var(--action)" }}>{spentPct}%</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} color="var(--action)" />
                <span className="text-label" style={{ color: "var(--text-2)" }}>Spending progress</span>
              </div>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                {formatCr(spent)} / {formatCr(obligation)}
              </span>
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 6,
                background: "var(--bg-raised)",
                overflow: "hidden",
                border: "1px solid var(--c-p-200)",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${spentPct}%`,
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
                    color: "#fff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {spentPct}%
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
          {/* Total matched / obligation */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">CSR obligation</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{formatCr(obligation)}</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                FY {company.financialYear}
              </span>
            </div>
          </div>

          {/* Active projects */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Active projects</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{company.projectsActive}</span>
              <span className="delta delta-flat">
                <Minus size={10} />
                +{company.projectsCompleted} completed
              </span>
            </div>
          </div>

          {/* Obligation met % */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">CSR obligation met</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{spentPct}%</span>
              <span className="delta delta-up">
                <TrendingUp size={10} />
                Spent
              </span>
            </div>
          </div>

          {/* Compliance score ring */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Compliance score</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ProgressRing pct={company.complianceScore} size={42} stroke={3.5} color="var(--action)" />
              <span className="text-number" style={{ fontSize: "clamp(1.2rem, 0.9rem + 1.2vw, 1.8rem)" }}>{company.complianceScore}</span>
            </div>
          </div>

          {/* Escrow balance */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">In escrow</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{formatInr(escrows.reduce((s, e) => s + e.held, 0))}</span>
              <span className="delta delta-flat">
                <Wallet size={10} />
                Held
              </span>
            </div>
          </div>

          {/* Lives Impacted */}
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Lives impacted</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{company.totalImpact.lives.toLocaleString("en-IN")}</span>
              <span className="delta delta-up">
                <Users size={10} />
                Cumulative
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
