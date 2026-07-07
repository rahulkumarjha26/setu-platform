"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { WOUNDS, VERIFICATION_EVENTS, FUNDING, STATUS_META, CATEGORY_META } from "@/lib/mock-data";
import type { Wound, StatusKey } from "@/lib/mock-data";
import { ArrowRight, CheckCircle2, Clock, AlertTriangle, Target, Users, Zap, Filter, RefreshCw } from "lucide-react";
import Link from "next/link";

/* ─── Helpers ─── */
const STAGE_ORDER: StatusKey[] = ["reported", "assessing", "routed", "in-progress", "healed", "not-achieved"];

function stageIndex(status: StatusKey): number {
  const idx = STAGE_ORDER.indexOf(status);
  return idx >= 0 ? idx : 99;
}

function stageColor(status: StatusKey): string {
  return STATUS_META[status]?.mark ?? "var(--text-3)";
}

function woundsByStage(): { status: StatusKey; wounds: Wound[] }[] {
  const buckets: Record<string, Wound[]> = {};
  for (const w of WOUNDS) {
    const s = w.status;
    if (!buckets[s]) buckets[s] = [];
    buckets[s].push(w);
  }
  return STAGE_ORDER
    .filter(s => buckets[s]?.length)
    .map(status => ({ status, wounds: buckets[status] }));
}

/* ─── Metric helpers ─── */
function totalCorroborations(): number {
  return WOUNDS.reduce((s, w) => s + w.corroborations, 0);
}

function activeEscrowAmount(): string {
  let total = 0;
  for (const entries of Object.values(FUNDING)) {
    for (const f of entries) {
      total += parseInt(f.amount.replace(/[₹,]/g, ""));
    }
  }
  return "₹" + (total / 100000).toFixed(1) + "L";
}

function pendingVerifications(): number {
  return VERIFICATION_EVENTS.filter(v => v.outcome === "partial").length;
}

/* ─── Tab config ─── */
const TABS = [
  { id: "pipeline", label: "Pipeline", icon: Target },
  { id: "approvals", label: "Approvals", icon: CheckCircle2 },
  { id: "entities", label: "By Entity", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function FlowPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");

  return (
    <motion.div
      className="container"
      style={{ paddingTop: 48, paddingBottom: 120 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 32 }}
      >
        <div className="flex items-center" style={{ gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--action)", opacity: 0.15, display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <RefreshCw size={18} color="var(--action)" />
          </div>
          <h1 className="text-h2" style={{ margin: 0 }}>Flow</h1>
        </div>
        <p className="text-caption text-2" style={{ margin: 0, maxWidth: 520 }}>
          Workflow engine — track wounds as they move through the civic pipeline,
          from reporting through verification to healing.
        </p>
      </motion.div>

      {/* ─── Metrics Strip ─── */}
      <motion.div
        className="grid-4"
        style={{ marginBottom: 32 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="card card-metric" style={{ padding: 20 }}>
          <p className="text-caption text-2" style={{ margin: 0, marginBottom: 4 }}>Total wounds</p>
          <span className="text-number" style={{ fontSize: "var(--fs-h3)" }}>{WOUNDS.length}</span>
        </div>
        <div className="card card-metric" style={{ padding: 20 }}>
          <p className="text-caption text-2" style={{ margin: 0, marginBottom: 4 }}>In pipeline</p>
          <span className="text-number" style={{ fontSize: "var(--fs-h3)" }}>
            {WOUNDS.filter(w => w.status !== "healed" && w.status !== "not-achieved").length}
          </span>
        </div>
        <div className="card card-metric" style={{ padding: 20 }}>
          <p className="text-caption text-2" style={{ margin: 0, marginBottom: 4 }}>Witnesses</p>
          <span className="text-number" style={{ fontSize: "var(--fs-h3)" }}>
            {totalCorroborations().toLocaleString("en-IN")}
          </span>
        </div>
        <div className="card card-metric" style={{ padding: 20 }}>
          <p className="text-caption text-2" style={{ margin: 0, marginBottom: 4 }}>In escrow</p>
          <span className="text-number" style={{ fontSize: "var(--fs-h3)" }}>{activeEscrowAmount()}</span>
        </div>
      </motion.div>

      {/* ─── Sub-navigation ─── */}
      <motion.div
        className="flex items-center"
        style={{ gap: 8, marginBottom: 24, flexWrap: "wrap" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`chip${activeTab === tab.id ? " selected" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* ─── Tab Content ─── */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "pipeline" && <PipelineView />}
        {activeTab === "approvals" && <ApprovalsView />}
        {activeTab === "entities" && <EntityView />}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PIPELINE VIEW — Wounds by stage
   ═══════════════════════════════════════════ */
function PipelineView() {
  const stages = useMemo(() => woundsByStage(), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stage overview bar */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="text-label-up text-2" style={{ margin: 0, marginBottom: 16 }}>
          <Target size={14} style={{ marginRight: 6 }} />
          Wound pipeline — {WOUNDS.length} total
        </h3>
        <div className="flex items-center" style={{ gap: 0, width: "100%", height: 28, borderRadius: "var(--radius-input)", overflow: "hidden" }}>
          {stages.map(({ status, wounds }) => {
            const pct = Math.round((wounds.length / WOUNDS.length) * 100);
            return (
              <div
                key={status}
                title={`${STATUS_META[status]?.label}: ${wounds.length} (${pct}%)`}
                style={{
                  flex: wounds.length,
                  background: stageColor(status),
                  opacity: 0.7,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 28,
                  transition: "flex 0.5s ease",
                }}
              >
                {pct > 8 && (
                  <span className="text-caption" style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>
                    {wounds.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center" style={{ gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          {stages.map(({ status, wounds }) => (
            <div className="flex items-center" key={status} style={{ gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: stageColor(status), display: "inline-block" }} />
              <span className="text-caption text-3">
                {STATUS_META[status]?.label} <strong>{wounds.length}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {stages.slice(0, 4).map(({ status, wounds }, si) => (
          <div key={status}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: stageColor(status), display: "inline-block",
              }} />
              <h4 className="text-label" style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {STATUS_META[status]?.label}
              </h4>
              <span className="text-caption text-3" style={{ marginLeft: "auto" }}>{wounds.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wounds.slice(0, 5).map((wound, i) => (
                <Link
                  key={wound.id}
                  href={`/wound/${wound.id}`}
                  className="card card-compact pipeline-card"
                  style={{
                    padding: 14, textDecoration: "none",
                    display: "flex", flexDirection: "column", gap: 6,
                    borderLeft: `3px solid ${stageColor(status)}`,
                  }}
                >
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: stageColor(status), flexShrink: 0,
                    }} />
                    <span className="text-mono text-3" style={{ fontSize: 11 }}>{wound.id}</span>
                  </div>
                  <p className="text-label" style={{
                    margin: 0, color: "var(--text)",
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {wound.title}
                  </p>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span className="text-caption text-3">{wound.place}</span>
                    <span className="text-caption text-3">·</span>
                    <span className="text-caption text-3">{wound.corroborations} corr.</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APPROVALS VIEW — Pending verifications, escrows, milestones
   ═══════════════════════════════════════════ */
function ApprovalsView() {
  const pendingV = useMemo(() =>
    VERIFICATION_EVENTS.filter(v => v.outcome !== "pass"),
  []);

  const activeEscrows = useMemo(() => {
    const result: { woundId: string; source: string; milestones: { label: string; status: string }[] }[] = [];
    for (const [woundId, entries] of Object.entries(FUNDING)) {
      for (const entry of entries) {
        const activeMiles = entry.milestones.filter(m => m.status === "in-progress" || m.status === "pending");
        if (activeMiles.length > 0) {
          result.push({ woundId, source: entry.source, milestones: activeMiles });
        }
      }
    }
    return result;
  }, []);

  const unreviewed = useMemo(() =>
    WOUNDS.filter(w => w.corroborations > 0 && !w.verifications?.length),
  []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Pending verifications */}
      <div className="card" style={{ padding: 24 }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={16} color="var(--report)" />
          <h3 className="text-label-up text-2" style={{ margin: 0 }}>Pending verification</h3>
          <span className="pill pill--assess">{pendingV.length}</span>
        </div>
        {pendingV.length === 0 ? (
          <p className="text-caption text-3" style={{ margin: 0 }}>All verifications passed ✅</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingV.map(v => (
              <div key={v.id} className="card card-compact" style={{ padding: 14 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                  <span className="text-mono text-3" style={{ fontSize: 11 }}>{v.woundId}</span>
                  <span className={`pill ${v.outcome === "partial" ? "pill--active" : "pill--failed"}`} style={{ fontSize: 10 }}>
                    {v.outcome}
                  </span>
                </div>
                <p className="text-label" style={{ margin: 0, marginBottom: 2 }}>{v.verifierName} — {v.verifierRole}</p>
                <p className="text-caption text-3" style={{ margin: 0 }}>{v.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active escrow milestones */}
      <div className="card" style={{ padding: 24 }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
          <Zap size={16} color="var(--action)" />
          <h3 className="text-label-up text-2" style={{ margin: 0 }}>Active escrow milestones</h3>
          <span className="pill pill--active">{activeEscrows.length}</span>
        </div>
        {activeEscrows.length === 0 ? (
          <p className="text-caption text-3" style={{ margin: 0 }}>No active escrows</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeEscrows.map((e, i) => (
              <Link
                key={`${e.woundId}-${i}`}
                href={`/wound/${e.woundId}`}
                className="card card-compact"
                style={{ padding: 14, textDecoration: "none" }}
              >
                <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                  <span className="text-mono text-3" style={{ fontSize: 11 }}>{e.woundId}</span>
                  <span className="text-caption text-2">{e.source}</span>
                </div>
                {e.milestones.map((m, mi) => (
                  <div key={mi} className="flex items-center" style={{ gap: 6, padding: "3px 0" }}>
                    {m.status === "in-progress" ? (
                      <RefreshCw size={12} color="var(--action)" />
                    ) : (
                      <Clock size={12} color="var(--text-3)" />
                    )}
                    <span className="text-caption" style={{ color: m.status === "in-progress" ? "var(--text)" : "var(--text-2)" }}>
                      {m.label}
                    </span>
                    <span className={`text-caption ${m.status === "in-progress" ? "text-petrol" : "text-3"}`} style={{ marginLeft: "auto" }}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Wounds awaiting verification assignment */}
      <div className="card" style={{ padding: 24 }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
          <Users size={16} color="var(--text-2)" />
          <h3 className="text-label-up text-2" style={{ margin: 0 }}>Unverified wounds (needs assignment)</h3>
          <span className="pill pill--open">{unreviewed.length}</span>
        </div>
        {unreviewed.length === 0 ? (
          <p className="text-caption text-3" style={{ margin: 0 }}>All wounds have verification coverage ✅</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {unreviewed.slice(0, 20).map(w => (
              <Link
                key={w.id}
                href={`/wound/${w.id}`}
                className="chip"
                style={{ textDecoration: "none", gap: 4 }}
              >
                {w.id}
                <span className="text-caption text-3">{w.corroborations} corr.</span>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════
   ENTITY VIEW — Workflows by actor role
   ═══════════════════════════════════════════ */
function EntityView() {
  const corporateWounds = useMemo(() =>
    WOUNDS.filter(w => w.fundedBy === "corporate"),
  []);
  const ngoWounds = useMemo(() =>
    WOUNDS.filter(w => w.healedBy === "ngo"),
  []);
  const govWounds = useMemo(() =>
    WOUNDS.filter(w => w.routedTo === "government"),
  []);

  const sections = [
    {
      id: "corporate",
      label: "Corporate CSR",
      desc: "Funded by CSR obligations — tracked through escrow to completion",
      icon: Target,
      iconBg: "var(--action)",
      wounds: corporateWounds,
      link: "/corporate",
    },
    {
      id: "ngo",
      label: "NGO Implementers",
      desc: "Ground-level wound healing — matched and funded through the platform",
      icon: Users,
      iconBg: "var(--st-active-mark)",
      wounds: ngoWounds,
      link: "/ngo",
    },
    {
      id: "government",
      label: "Government Duty",
      desc: "Routed to government departments — tracked against SLAs",
      icon: AlertTriangle,
      iconBg: "var(--st-gov-mark)",
      wounds: govWounds,
      link: "/government",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {sections.map((section, si) => (
        <motion.div
          key={section.id}
          className="card"
          style={{ padding: 24 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: si * 0.08 }}
        >
          <div className="flex items-center" style={{ gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: section.iconBg, opacity: 0.15, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <section.icon size={16} color={section.iconBg} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center" style={{ gap: 10 }}>
                <h3 className="text-label-up" style={{ margin: 0 }}>{section.label}</h3>
                <span className="text-caption text-3">{section.wounds.length} wounds</span>
              </div>
              <p className="text-caption text-3" style={{ margin: 0, marginTop: 2 }}>{section.desc}</p>
            </div>
            <Link
              href={section.link}
              className="btn btn-outline btn-sm"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              Dashboard <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {section.wounds.slice(0, 6).map((w, i) => (
              <Link
                key={w.id}
                href={`/wound/${w.id}`}
                className="card card-compact"
                style={{
                  padding: 12, textDecoration: "none",
                  borderLeft: `3px solid ${stageColor(w.status)}`,
                }}
              >
                <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
                  <span className="text-mono text-3" style={{ fontSize: 10 }}>{w.id}</span>
                  <span className={`pill ${STATUS_META[w.status]?.pillCls}`} style={{ fontSize: 9, marginLeft: "auto" }}>
                    {STATUS_META[w.status]?.label}
                  </span>
                </div>
                <p className="text-caption" style={{ margin: 0, color: "var(--text)", lineHeight: 1.4 }}>{w.title}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
