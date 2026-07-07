"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Building2,
  Map,
  TrendingUp,
  ArrowUp,
} from "lucide-react";
import {
  PLATFORM_STATS,
  CSR_SPEND_TRENDS,
  NGO_VERIFICATION_SCORES,
  ACTIVE_WOUND_REGIONS,
  ANALYTICS_DATA,
} from "@/lib/mock-data";
import RingChart from "./components/RingChart";
import BarChart from "./components/BarChart";
import WoundMap from "./components/WoundMap";
import TopNGOs from "./components/TopNGOs";
import ActivityFeed from "./components/ActivityFeed";

/* ─── Activity data (matches Pulse page pattern) ─── */

const ACTIVITY_ITEMS = [
  { time: "2m ago", text: "New wound reported in Ward 7, Jalgaon — broken handpump", type: "reported" },
  { time: "5m ago", text: "Verifier assigned to SETU-MH-0008 — Lake desilting milestone 2", type: "assigned" },
  { time: "12m ago", text: "SETU-BR-0001 marked In Progress — NGO mobilized", type: "progress" },
  { time: "18m ago", text: "Escrow release triggered for Lake restoration Phase I — ₹4.4L", type: "funding" },
  { time: "25m ago", text: "SETU-KA-0001 verification passed — Lake revived, 180 borewells recharged", type: "healed" },
  { time: "32m ago", text: "New corroboration on SETU-UP-0002 — Arsenic in handpump", type: "corroboration" },
  { time: "41m ago", text: "SETU-MH-0005 routed to MSEDCL — 61 witnesses attached", type: "routed" },
  { time: "55m ago", text: "CSR matched: Aditya Infra Ltd adopts SETU-MH-0010 — Lake desilting", type: "funding" },
];

/* ─── Wound breakdown segments for RingChart ─── */

const WOUND_SEGMENTS = [
  { label: "Open", value: PLATFORM_STATS.reported, color: "var(--st-open-mark)" },
  { label: "Assessing", value: PLATFORM_STATS.assessing, color: "var(--st-assess-mark)" },
  { label: "Routed", value: PLATFORM_STATS.routed, color: "var(--st-gov-mark)" },
  { label: "In Progress", value: PLATFORM_STATS.inProgress, color: "var(--st-active-mark)" },
  { label: "Healed", value: PLATFORM_STATS.healed, color: "var(--st-healed-mark)" },
];

/* ─── Section wrapper style ─── */

const sectionStyle: React.CSSProperties = {
  background: "var(--bg-raised)",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border)",
  padding: "var(--space-card)",
};

/* ─── Metrics ─── */

const METRICS = [
  {
    label: "Total wounds",
    value: ANALYTICS_DATA.totalWounds.toLocaleString("en-IN"),
    delta: "+8%",
    deltaTrend: "up" as const,
    icon: Activity,
  },
  {
    label: "Healed",
    value: `${ANALYTICS_DATA.healedPct}%`,
    delta: "+5%",
    deltaTrend: "up" as const,
    icon: TrendingUp,
  },
  {
    label: "CSR deployed",
    value: ANALYTICS_DATA.csrDeployed,
    delta: "+24%",
    deltaTrend: "up" as const,
    icon: BarChart3,
  },
  {
    label: "NGOs active",
    value: String(ANALYTICS_DATA.ngosActive),
    delta: "2 new",
    deltaTrend: "up" as const,
    icon: Building2,
  },
];

/* ─── PAGE ─── */

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 40 }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 className="text-h1" style={{ margin: 0 }}>Analytics</h1>
          </div>
          <p className="text-body text-2" style={{ margin: 0 }}>
            Platform-wide metrics
          </p>
        </motion.div>

        {/* ── Section 1: Metric cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                className="card-metric"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <p
                    className="text-caption text-2"
                    style={{ margin: 0 }}
                  >
                    {m.label}
                  </p>
                  <m.icon
                    size={16}
                    color="var(--text-3)"
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <span
                  className="text-number"
                  style={{
                    color: "var(--text)",
                    fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)",
                  }}
                >
                  {m.value}
                </span>
                {m.delta && (
                  <span
                    className={`delta delta-${m.deltaTrend}`}
                    style={{
                      alignSelf: "flex-start",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <ArrowUp size={10} />
                    {m.delta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 2: RingChart + legend (wounds by status) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...sectionStyle, marginBottom: 24 }}
        >
          <h2
            className="text-label-up text-2"
            style={{ marginTop: 0, marginBottom: 20 }}
          >
            Wounds by status
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <RingChart segments={WOUND_SEGMENTS} size={180} stroke={22} />
          </div>
        </motion.div>

        {/* ── Section 3: BarChart (CSR spend trends) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...sectionStyle, marginBottom: 24 }}
        >
          <h2
            className="text-label-up text-2"
            style={{ marginTop: 0, marginBottom: 20 }}
          >
            CSR spend trends (6 months)
          </h2>
          <BarChart data={CSR_SPEND_TRENDS} height={180} />
        </motion.div>

        {/* ── Section 4: TopNGOs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...sectionStyle, marginBottom: 24 }}
        >
          <h2
            className="text-label-up text-2"
            style={{ marginTop: 0, marginBottom: 16 }}
          >
            Top NGOs — verification score ranking
          </h2>
          <TopNGOs ngos={NGO_VERIFICATION_SCORES} />
        </motion.div>

        {/* ── Section 5: WoundMap ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...sectionStyle, marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2
              className="text-label-up text-2"
              style={{ margin: 0 }}
            >
              Wound distribution — India
            </h2>
            <Map size={16} color="var(--text-3)" style={{ opacity: 0.5 }} />
          </div>
          <WoundMap regions={ACTIVE_WOUND_REGIONS} />
        </motion.div>

        {/* ── Section 6: ActivityFeed ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...sectionStyle, marginBottom: 24 }}
        >
          <h2
            className="text-label-up text-2"
            style={{ marginTop: 0, marginBottom: 16 }}
          >
            Recent platform events
          </h2>
          <ActivityFeed items={ACTIVITY_ITEMS} />
        </motion.div>
      </div>
    </motion.div>
  );
}
