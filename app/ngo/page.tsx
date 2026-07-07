"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  TrendingUp,
  FileText,
  Search,
  BarChart3,
  Check,
  X,
  ChevronRight,
  ArrowUp,
  Minus,
  Users,
  Wallet,
  Target,
  MapPin,
  Award,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Download,
  Scale,
  Eye,
  Lightbulb,
  GraduationCap,
  FileUp,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

/* ─── Sub navigation ─── */

const SUB_NAV = [
  { id: "eligibility", label: "Eligibility", icon: ClipboardList },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "proposal", label: "Proposal drafter", icon: FileText },
  { id: "funders", label: "Funder matching", icon: Search },
  { id: "score", label: "Score & transparency", icon: BarChart3 },
];

/* ─── Mock data ─── */

const NGO_PROFILE = {
  name: "Jal Seva Foundation",
  shortName: "JSF",
  tagline: "Water, sanitation & livelihood for rural Bihar",
  established: "2018",
  logoInitials: "JS",
  verified: true,
  focusAreas: ["Water & Sanitation", "Health", "Livelihood"],
  districtsActive: 7,
  trustScore: 82,
  projectsCompleted: 14,
  projectsActive: 6,
  fundsDeployed: 34200000,
  livesImpacted: 28400,
};

const ELIGIBILITY_CRITERIA = [
  { label: "12A Registration", key: "twelveA", ok: true, detail: "Registered since 2019" },
  { label: "80G Tax Exemption", key: "eightyG", ok: true, detail: "Valid till 2027" },
  { label: "CSR-1 Filing", key: "csr1", ok: true, detail: "Filed for FY 2024-25" },
  { label: "Darpan Portal ID", key: "darpan", ok: true, detail: "HR-2020-123456" },
  { label: "Track record — 2 of 3 yrs", key: "trackRecord", ok: true, detail: "FY 2022–2024" },
  { label: "FCRA Registration", key: "fcra", ok: false, detail: "Application under review" },
  { label: "Annual Return Filed (3 yrs)", key: "annualReturn", ok: true, detail: "All three years on time" },
];

const DOC_STATUS = [
  { label: "Registration certificate", status: "uploaded" as const, date: "12 Jun 2024" },
  { label: "Audited financials (latest)", status: "uploaded" as const, date: "28 Mar 2025" },
  { label: "Annual Report (latest)", status: "uploaded" as const, date: "28 Mar 2025" },
  { label: "Tax exemption letter", status: "missing" as const, date: null },
  { label: "Board resolution", status: "uploaded" as const, date: "05 Apr 2025" },
  { label: "Project completion reports", status: "pending" as const, date: null },
];

const PIPELINE_COLS = [
  {
    title: "Matched",
    status: "assessing" as const,
    cards: [
      { title: "School sanitation — 8 units", budget: "₹3.2 L", district: "Arrah, Bihar", desc: "Construction of 8-unit toilet blocks in 3 govt schools" },
      { title: "Handpump repair — 14 villages", budget: "₹2.8 L", district: "Chhapra, Bihar", desc: "Deep borewell handpump restoration in flood-prone villages" },
      { title: "Drainage desilting Ward 4", budget: "₹1.2 L", district: "Ara, Bihar", desc: "Desilting of 2.5 km of storm-water drains" },
    ],
  },
  {
    title: "Drafting",
    status: "assessing" as const,
    cards: [
      { title: "Migrant labour health camp Q3", budget: "₹6.8 L", district: "Buxar, Bihar", desc: "Seasonal health screening and medicine distribution" },
      { title: "Waste segregation pilot 40 wards", budget: "₹4.5 L", district: "Sasaram, Bihar", desc: "Segregation-at-source training and bin distribution" },
    ],
  },
  {
    title: "Submitted",
    status: "assessing" as const,
    cards: [
      { title: "Lake restoration Phase I", budget: "₹22 L", district: "Muzaffarpur, Bihar", desc: "Dredging, desilting and biodiversity restoration" },
      { title: "Anganwadi repair 12 centres", budget: "₹5.4 L", district: "Darbhanga, Bihar", desc: "Structural repairs and hygiene facility upgrades" },
    ],
  },
  {
    title: "Approved",
    status: "in-progress" as const,
    cards: [
      { title: "Primary health centre Chintamani", budget: "₹15 L", district: "Gaya, Bihar", desc: "Staffing, equipment and medicine procurement" },
      { title: "Sewage connection 60 households", budget: "₹8.5 L", district: "Samastipur, Bihar", desc: "Individual household sewer connections in low-income colony" },
    ],
  },
];

const PROPOSAL_TEMPLATES = [
  { id: "watersan", label: "Water & Sanitation", icon: "💧", fields: "Project scope, beneficiaries, budget, timeline, outcomes" },
  { id: "health", label: "Health & Nutrition", icon: "🏥", fields: "Health indicators, target group, intervention plan, M&E" },
  { id: "education", label: "Education", icon: "📚", fields: "Educational outcomes, infrastructure, teacher training" },
  { id: "livelihood", label: "Livelihood", icon: "🌾", fields: "Skill mapping, value chain, market linkages" },
];

const FUNDER_MATCHES = [
  {
    name: "Tata CSR Foundation",
    initials: "TC",
    focus: "Water & Sanitation",
    matchPct: 94,
    budget: "₹2.5 Cr",
    projects: 12,
    activeIn: "Bihar, Jharkhand, UP",
    compatibility: ["Geographic overlap", "Thematic aligned", "Past collaboration"],
  },
  {
    name: "Reliance Foundation",
    initials: "RF",
    focus: "Health & Livelihood",
    matchPct: 87,
    budget: "₹5 Cr",
    projects: 8,
    activeIn: "Bihar, Odisha, MP",
    compatibility: ["Thematic aligned", "Scalable model", "Reporting capacity"],
  },
  {
    name: "HDFC CSR Initiative",
    initials: "HI",
    focus: "Water & Sanitation",
    matchPct: 82,
    budget: "₹1.8 Cr",
    projects: 6,
    activeIn: "Bihar, Assam",
    compatibility: ["Geographic overlap", "Past collaboration"],
  },
  {
    name: "ITC Sunehra Kal",
    initials: "IS",
    focus: "Livelihood",
    matchPct: 76,
    budget: "₹1.2 Cr",
    projects: 4,
    activeIn: "Bihar, West Bengal",
    compatibility: ["Thematic aligned", "Village-level reach"],
  },
  {
    name: "Infosys Foundation",
    initials: "IF",
    focus: "Education & Sanitation",
    matchPct: 71,
    budget: "₹3 Cr",
    projects: 9,
    activeIn: "Karnataka, Rajasthan, Bihar",
    compatibility: ["Geographic overlap", "Strong M&E framework"],
  },
];

const SCORE_BREAKDOWN = [
  { category: "Verification Rate", score: 88, weight: 35, detail: "Avg pass rate across all completed projects", color: "var(--st-healed-mark)" },
  { category: "Project Completion", score: 92, weight: 25, detail: "On-time vs overdue milestone ratio", color: "var(--st-healed-mark)" },
  { category: "Community Feedback", score: 76, weight: 20, detail: "Corroboration attestation quality from beneficiaries", color: "var(--st-assess-mark)" },
  { category: "Financial Accuracy", score: 81, weight: 20, detail: "Fund utilisation variance < 5% across portfolio", color: "var(--st-assess-mark)" },
];

const TRANSPARENCY_METRICS = [
  { label: "Audited accounts published", ok: true },
  { label: "Annual report on website", ok: true },
  { label: "Board meetings minuted", ok: true },
  { label: "Whistleblower policy", ok: false },
  { label: "Govt. project disclosure", ok: true },
  { label: "Impact assessment shared", ok: true },
];

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

function formatInr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ─── Doc status pill ─── */

function DocStatusPill({ status }: { status: "uploaded" | "missing" | "pending" }) {
  const meta = {
    uploaded: { label: "Uploaded", color: "var(--st-healed-mark)", bg: "var(--st-healed-wash)", icon: Check },
    missing: { label: "Missing", color: "var(--st-failed-mark)", bg: "var(--st-failed-wash)", icon: X },
    pending: { label: "Pending", color: "var(--st-assess-mark)", bg: "var(--st-assess-wash)", icon: Minus },
  };
  const m = meta[status];
  const Icon = m.icon;
  return (
    <span className="pill" style={{ background: m.bg, color: m.color, fontSize: 11, padding: "2px 10px", height: 22, textTransform: "none", letterSpacing: 0 }}>
      <Icon size={11} />
      {m.label}
    </span>
  );
}

/* ─── Main Component ─── */

export default function NGOPage() {
  const [activeNav, setActiveNav] = useState("pipeline");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const ngo = NGO_PROFILE;

  const renderTabContent = () => {
    switch (activeNav) {
      case "eligibility": return renderEligibility();
      case "pipeline": return renderPipeline();
      case "proposal": return renderProposal();
      case "funders": return renderFunders();
      case "score": return renderScore();
      default: return renderPipeline();
    }
  };

  /* ─── Eligibility Tab ─── */
  const renderEligibility = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* Eligibility Checklist */}
        <div>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <ClipboardList size={14} />
            Eligibility criteria
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {ELIGIBILITY_CRITERIA.map((c) => (
              <div
                key={c.key}
                className="card card-compact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: c.ok ? "var(--st-healed-wash)" : "var(--bg-raised)",
                  border: c.ok ? "1px solid transparent" : "1px solid var(--st-failed-mark)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c.ok ? "var(--st-healed-mark)" : "var(--st-failed-mark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {c.ok ? <Check size={14} color="var(--c-white)" /> : <X size={14} color="var(--c-white)" />}
                  </div>
                  <div>
                    <p className="text-label" style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{c.label}</p>
                    <p className="text-caption" style={{ color: "var(--text-3)" }}>{c.detail}</p>
                  </div>
                </div>
                {c.ok && (
                  <span style={{ color: "var(--st-healed-mark)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                    <Check size={12} style={{ display: "inline", marginRight: 3 }} />
                    Compliant
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Status */}
        <div>
          <h3 className="text-label-up text-3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} />
            Documentation status
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Status</th>
                  <th className="cell-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {DOC_STATUS.map((d) => (
                  <tr key={d.label}>
                    <td style={{ fontWeight: 500 }}>{d.label}</td>
                    <td>
                      <DocStatusPill status={d.status} />
                    </td>
                    <td className="cell-right" style={{ color: "var(--text-2)", fontSize: 13 }}>{d.date || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 16, gap: 6 }}>
            <FileUp size={14} />
            Upload pending documents
          </button>
        </div>
      </div>

      {/* Right panel — Compliance Summary */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Compliance overview
          </h3>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <div className="flex items-center gap-12">
              <ProgressRing pct={ngo.trustScore} size={52} stroke={4} color={ngo.trustScore >= 80 ? "var(--st-healed-mark)" : "var(--st-assess-mark)"} />
              <div>
                <p className="text-number" style={{ fontSize: 22 }}>{ngo.trustScore}%</p>
                <p className="text-caption" style={{ color: "var(--text-2)" }}>Trust score</p>
              </div>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)" }} />
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Criteria met</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{ELIGIBILITY_CRITERIA.filter(c => c.ok).length}/{ELIGIBILITY_CRITERIA.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Docs uploaded</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{DOC_STATUS.filter(d => d.status === "uploaded").length}/{DOC_STATUS.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Next renewal</span>
              <span style={{ fontWeight: 500, fontSize: 13, color: "var(--action)" }}>31 Mar 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">FCRA status</span>
              <span style={{ fontWeight: 500, fontSize: 13, color: "var(--st-failed-mark)" }}>Under review</span>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Quick actions
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", gap: 8 }}>
              <Download size={13} />
              Download compliance report
            </button>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", gap: 8 }}>
              <Eye size={13} />
              View all submitted forms
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Pipeline Tab ─── */
  const renderPipeline = () => (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {PIPELINE_COLS.map((col) => (
          <div key={col.title} style={{ flex: "1 1 240px", minWidth: 240 }}>
            <h3
              className="text-label-up text-3"
              style={{
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{col.title}</span>
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: "var(--radius-pill)",
                  background: "var(--bg-muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                {col.cards.length}
              </span>
            </h3>
            <div
              className="stagger"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {col.cards.length > 0 ? (
                col.cards.map((card) => (
                  <div
                    key={card.title}
                    className="card card-compact"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                      transition: "box-shadow 0.2s var(--ease)",
                    }}
                  >
                    <StatusPill status={col.status} />
                    <h4
                      className="text-h3"
                      style={{
                        marginTop: 10,
                        marginBottom: 4,
                        fontSize: 14,
                      }}
                    >
                      {card.title}
                    </h4>
                    <p className="text-caption text-3" style={{ marginBottom: 10, lineHeight: 1.4 }}>
                      {card.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
                      <span className="text-mono text-caption" style={{ fontWeight: 600 }}>
                        {card.budget}
                      </span>
                      <span className="text-caption text-2" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={11} />
                        {card.district}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-card)",
                  }}
                >
                  <p className="text-caption text-3">
                    No {col.title.toLowerCase()} projects yet
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Proposal Drafter Tab ─── */
  const renderProposal = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 20 }}>
        <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <FileText size={14} />
          Template-based proposal generator
        </h3>
        <p className="text-caption text-2" style={{ marginBottom: 8 }}>
          Select a template to auto-generate a structured proposal draft.
        </p>
        <div className="grid grid-2" style={{ gap: 16 }}>
          {PROPOSAL_TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="card card-compact"
              onClick={() => setSelectedTemplate(t.id === selectedTemplate ? null : t.id)}
              style={{
                cursor: "pointer",
                padding: "18px 20px",
                border: selectedTemplate === t.id ? "1px solid var(--action)" : "1px solid transparent",
                background: selectedTemplate === t.id ? "var(--c-p-50)" : "var(--bg-raised)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
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
                    flexShrink: 0,
                  }}
                >
                  {t.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-label" style={{ fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{t.label}</p>
                  <p className="text-caption text-3">{t.fields}</p>
                </div>
                <ChevronRight size={16} color={selectedTemplate === t.id ? "var(--action)" : "var(--text-3)"} />
              </div>

              {selectedTemplate === t.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex flex-col" style={{ gap: 12 }}>
                    <div>
                      <p className="text-caption text-3" style={{ marginBottom: 4 }}>Project title</p>
                      <div className="input-faux" style={{ padding: "10px 14px", borderRadius: "var(--radius-input)", border: "1px solid var(--border)", background: "var(--bg-raised)", color: "var(--text-3)" }}>
                        e.g., Safe drinking water in Buxar
                      </div>
                    </div>
                    <div>
                      <p className="text-caption text-3" style={{ marginBottom: 4 }}>Target district</p>
                      <div className="input-faux" style={{ padding: "10px 14px", borderRadius: "var(--radius-input)", border: "1px solid var(--border)", background: "var(--bg-raised)", color: "var(--text-3)" }}>
                        Select district...
                      </div>
                    </div>
                    <div>
                      <p className="text-caption text-3" style={{ marginBottom: 4 }}>Budget range</p>
                      <div className="input-faux" style={{ padding: "10px 14px", borderRadius: "var(--radius-input)", border: "1px solid var(--border)", background: "var(--bg-raised)", color: "var(--text-3)" }}>
                        ₹ 0 - 10,00,000
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ gap: 6, marginTop: 4 }}>
                      <FileText size={14} />
                      Generate proposal draft
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Recent Drafts */}
        <div style={{ marginTop: 8 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen size={14} />
            Recent drafts
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {[
              { title: "School sanitation proposal — Arrah", updated: "2 days ago", status: "in-progress" as const },
              { title: "Health camp Q3 — Buxar", updated: "5 days ago", status: "draft" as const },
              { title: "Lake restoration Phase II", updated: "1 week ago", status: "draft" as const },
            ].map((d, i) => {
              const pillMeta = d.status === "draft"
                ? { label: "Draft", color: "var(--st-assess-mark)", bg: "var(--st-assess-wash)" }
                : { label: "In progress", color: "var(--action)", bg: "var(--c-p-50)" };
              return (
                <div key={i} className="card card-compact" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
                  <div>
                    <p className="text-caption" style={{ fontWeight: 600, color: "var(--text)" }}>{d.title}</p>
                    <p className="text-caption text-3">Updated {d.updated}</p>
                  </div>
                  <span className="pill" style={{ background: pillMeta.bg, color: pillMeta.color, fontSize: 10, textTransform: "none", letterSpacing: 0 }}>
                    {pillMeta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel — Tips */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Lightbulb size={13} />
            Proposal tips
          </h3>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {[
              "Include specific measurable outcomes",
              "Mention past project success metrics",
              "Align budget with SDG targets",
              "Add community validation letters",
            ].map((tip) => (
              <div key={tip} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--action)", fontSize: 14 }}>•</span>
                <p className="text-caption text-2" style={{ lineHeight: 1.4 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 12 }}>
            Recently submitted
          </h3>
          <p className="text-caption text-2" style={{ marginBottom: 8 }}>
            Lake restoration Phase I — <strong style={{ color: "var(--st-healed-mark)" }}>₹22 L</strong>
          </p>
          <p className="text-caption text-3">
            Submitted 3 weeks ago · Awaiting funder review
          </p>
        </div>
      </div>
    </div>
  );

  /* ─── Funder Matching Tab ─── */
  const renderFunders = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Search size={14} />
            Corporate CSR matching
          </h3>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Water & Sanitation", "Health", "Livelihood"].map((f) => (
              <button key={f} className="stream-chip" style={{ fontSize: 12, height: 30 }}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: 12 }}>
          {FUNDER_MATCHES.map((funder, i) => (
            <motion.div
              key={funder.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="card card-compact"
              style={{ padding: "18px 20px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                {/* Funder avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-input)",
                    background: "var(--c-p-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--action)",
                    flexShrink: 0,
                  }}
                >
                  {funder.initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <p className="text-label" style={{ fontWeight: 600, color: "var(--text)", fontSize: 15 }}>{funder.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <ProgressRing pct={funder.matchPct} size={36} stroke={3} color={funder.matchPct >= 85 ? "var(--st-healed-mark)" : funder.matchPct >= 75 ? "var(--st-assess-mark)" : "var(--st-failed-mark)"} />
                      <span className="text-mono" style={{ fontWeight: 700, fontSize: 13, color: funder.matchPct >= 85 ? "var(--st-healed-mark)" : funder.matchPct >= 75 ? "var(--st-assess-mark)" : "var(--st-failed-mark)" }}>{funder.matchPct}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <span className="pill" style={{ fontSize: 10, background: "var(--bg-muted)", color: "var(--text-2)", textTransform: "none", letterSpacing: 0, height: 20, padding: "0 8px" }}>
                      <Target size={10} />
                      {funder.focus}
                    </span>
                    <span className="pill" style={{ fontSize: 10, background: "var(--bg-muted)", color: "var(--text-2)", textTransform: "none", letterSpacing: 0, height: 20, padding: "0 8px" }}>
                      <Wallet size={10} />
                      {funder.budget}
                    </span>
                  </div>
                  <p className="text-caption text-3" style={{ marginBottom: 8 }}>
                    {funder.projects} projects · {funder.activeIn}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {funder.compatibility.map((tag) => (
                      <span
                        key={tag}
                        className="pill"
                        style={{
                          fontSize: 10,
                          background: "var(--st-healed-wash)",
                          color: "var(--st-healed-mark)",
                          textTransform: "none",
                          letterSpacing: 0,
                          height: 20,
                          padding: "0 8px",
                        }}
                      >
                        <Check size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                  <button className="btn btn-primary btn-sm" style={{ gap: 6 }}>
                    <FileText size={13} />
                    Apply
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                    View <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel — Matching summary */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Matching summary
          </h3>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total funders</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{FUNDER_MATCHES.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Avg. match score</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--action)" }}>
                {Math.round(FUNDER_MATCHES.reduce((s, f) => s + f.matchPct, 0) / FUNDER_MATCHES.length)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption text-2">Total accessible budget</span>
              <span className="text-mono" style={{ fontWeight: 600, fontSize: 14 }}>
                ₹13.7 Cr
              </span>
            </div>
            <div className="divider" style={{ borderTop: "1px solid var(--border)" }} />
            <div className="flex flex-col" style={{ gap: 8 }}>
              <p className="text-caption text-3" style={{ marginBottom: 4 }}>Top match factors</p>
              {["Geographic overlap (4/5)", "Thematic alignment (5/5)", "Past collaboration (3/5)"].map((f) => (
                <div key={f} className="flex items-center gap-8">
                  <Check size={11} color="var(--st-healed-mark)" />
                  <span className="text-caption text-2">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 12 }}>
            Your profile strength
          </h3>
          <p className="text-number" style={{ fontSize: 28, color: "var(--st-healed-mark)" }}>82%</p>
          <p className="text-caption text-2" style={{ marginTop: 4 }}>Complete your profile to improve matches</p>
          <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "var(--bg-muted)", overflow: "hidden" }}>
            <div style={{ width: "82%", height: "100%", borderRadius: 3, background: "var(--st-healed-mark)" }} />
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 16, width: "100%", gap: 6 }}>
            <ShieldCheck size={13} />
            Improve profile
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── Score & Transparency Tab ─── */
  const renderScore = () => (
    <div className="split-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* Score overview */}
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
            <ProgressRing pct={ngo.trustScore} size={80} stroke={6} color={ngo.trustScore >= 80 ? "var(--st-healed-mark)" : ngo.trustScore >= 70 ? "var(--st-assess-mark)" : "var(--st-failed-mark)"} />
            <div style={{ textAlign: "left" }}>
              <p className="text-h2" style={{ marginBottom: 2 }}>{ngo.trustScore}/100</p>
              <p className="text-caption text-2" style={{ marginBottom: 4 }}>Overall NGO trust score</p>
              <span
                className="pill"
                style={{
                  background: ngo.trustScore >= 80 ? "var(--st-healed-wash)" : "var(--st-assess-wash)",
                  color: ngo.trustScore >= 80 ? "var(--st-healed-mark)" : "var(--st-assess-mark)",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                <Award size={12} />
                {ngo.trustScore >= 80 ? "High trust" : "Moderate trust"}
              </span>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <h3 className="text-label-up text-3" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <BarChart3 size={14} />
          Score breakdown
        </h3>
        <div className="flex flex-col" style={{ gap: 12 }}>
          {SCORE_BREAKDOWN.map((item) => (
            <div key={item.category} className="card card-compact" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <p className="text-label" style={{ fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{item.category}</p>
                  <p className="text-caption text-3">{item.detail}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="text-number" style={{ fontSize: 20, color: item.color }}>{item.score}</span>
                  <span className="pill" style={{ fontSize: 9.5, padding: "1px 7px", height: 18, background: "var(--c-p-50)", color: "var(--action)" }}>{item.weight}%</span>
                </div>
              </div>
              {/* Mini score bar */}
              <div style={{ height: 4, borderRadius: 2, background: "var(--bg-muted)", overflow: "hidden" }}>
                <div style={{ width: `${item.score}%`, height: "100%", borderRadius: 2, background: item.color, transition: "width 0.6s var(--ease)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Metrics */}
        <div style={{ marginTop: 8 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Eye size={14} />
            Transparency metrics
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {TRANSPARENCY_METRICS.map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-input)",
                  background: m.ok ? "var(--st-healed-wash)" : "var(--bg-muted)",
                }}
              >
                {m.ok ? (
                  <Check size={16} color="var(--st-healed-mark)" />
                ) : (
                  <X size={16} color="var(--st-failed-mark)" />
                )}
                <span className="text-caption" style={{ fontWeight: 500, color: m.ok ? "var(--st-healed-mark)" : "var(--text-3)" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology button */}
        <button className="btn btn-outline btn-sm" style={{ alignSelf: "flex-start", gap: 6 }}>
          <Scale size={14} />
          View scoring methodology
        </button>
      </div>

      {/* Right panel — Scoring insights */}
      <div className="desktop-only" style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
            Weighted score
          </h3>
          <div className="flex items-center gap-12" style={{ marginBottom: 14 }}>
            <ProgressRing
              pct={SCORE_BREAKDOWN.reduce((s, c) => s + c.score * (c.weight / 100), 0)}
              size={56}
              stroke={4}
              color="var(--action)"
            />
            <div>
              <p className="text-number" style={{ fontSize: 24 }}>
                {Math.round(SCORE_BREAKDOWN.reduce((s, c) => s + c.score * (c.weight / 100), 0))}
              </p>
              <p className="text-caption text-2">Weighted score</p>
            </div>
          </div>
          <div className="divider" style={{ borderTop: "1px solid var(--border)" }} />
          <div className="flex flex-col" style={{ gap: 10, marginTop: 14 }}>
            <p className="text-caption text-3" style={{ marginBottom: 2 }}>Scoring factors</p>
            {SCORE_BREAKDOWN.map((c) => (
              <div key={c.category} className="flex items-center justify-between">
                <span className="text-caption text-2">{c.category}</span>
                <span className="text-caption" style={{ fontWeight: 600, color: c.color }}>{c.score} · {c.weight}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="text-label-up text-3" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <GraduationCap size={13} />
            Improvement areas
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {[
              { area: "Community feedback", score: 76, tip: "Collect more beneficiary attestations" },
              { area: "Financial accuracy", score: 81, tip: "Tighten fund utilisation variance" },
              { area: "Whistleblower policy", score: 0, tip: "Adopt a formal policy" },
            ].map((a) => (
              <div key={a.area} style={{ padding: "10px 12px", borderRadius: "var(--radius-input)", background: "var(--bg-muted)" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                  <span className="text-caption" style={{ fontWeight: 600, color: "var(--text)" }}>{a.area}</span>
                  <span className="text-caption" style={{ color: "var(--text-3)" }}>{a.score}/100</span>
                </div>
                <p className="text-caption text-3" style={{ lineHeight: 1.3 }}>{a.tip}</p>
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
        {/* ─── NGO Profile Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{
            marginBottom: 24,
            padding: "24px 28px",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
          }}
        >
          <div className="flex items-start justify-between" style={{ flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Logo */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius-input)",
                  background: "var(--action)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--c-white)",
                  flexShrink: 0,
                }}
              >
                {ngo.logoInitials}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 className="text-h1" style={{ fontSize: "clamp(1.3rem, 1rem + 1.4vw, 1.8rem)" }}>{ngo.name}</h1>
                  {ngo.verified && (
                    <span className="pill" style={{ background: "var(--st-healed-wash)", color: "var(--st-healed-mark)", fontSize: 10, textTransform: "none", letterSpacing: 0, height: 22, padding: "0 10px", gap: 4 }}>
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  )}
                  <span className="role-badge" style={{ background: "var(--st-gov-wash)" }}>
                    <span className="role-dot" style={{ background: "var(--role-ngo)" }} />
                    NGO
                  </span>
                </div>
                <p className="text-body-lg text-2" style={{ marginBottom: 6 }}>
                  {ngo.tagline} · Est. {ngo.established}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {ngo.focusAreas.map((area) => (
                    <span key={area} className="pill" style={{ fontSize: 11, background: "var(--bg-raised)", color: "var(--text-2)", textTransform: "none", letterSpacing: 0, height: 24, padding: "0 10px" }}>
                      <Target size={10} />
                      {area}
                    </span>
                  ))}
                  <span className="pill" style={{ fontSize: 11, background: "var(--bg-raised)", color: "var(--text-2)", textTransform: "none", letterSpacing: 0, height: 24, padding: "0 10px" }}>
                    <MapPin size={10} />
                    {ngo.districtsActive} districts
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Score Ring */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingLeft: 20,
                borderLeft: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <ProgressRing pct={ngo.trustScore} size={56} stroke={4} color={ngo.trustScore >= 80 ? "var(--st-healed-mark)" : "var(--st-assess-mark)"} />
              <div>
                <p className="text-number" style={{ fontSize: 18, lineHeight: 1.2 }}>{ngo.trustScore}</p>
                <p className="text-caption text-2" style={{ lineHeight: 1.2 }}>Trust<br />score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Metric Strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-4"
          style={{ gap: 16, marginBottom: 36 }}
        >
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Projects completed</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{ngo.projectsCompleted}</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                Total
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Active projects</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{ngo.projectsActive}</span>
              <span className="delta delta-flat">
                <Minus size={10} />
                Ongoing
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Funds deployed</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{formatInr(ngo.fundsDeployed)}</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                Cumulative
              </span>
            </div>
          </div>

          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Lives impacted</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">{ngo.livesImpacted.toLocaleString("en-IN")}</span>
              <span className="delta delta-up">
                <Users size={10} />
                Cumulative
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Sub-nav (Desktop + Mobile) ─── */}
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
