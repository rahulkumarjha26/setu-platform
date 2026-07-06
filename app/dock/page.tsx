"use client";

import { motion } from "framer-motion";
import { Globe, Activity, ListFilter, TrendingUp, Plus, Radio } from "lucide-react";
import { DockShell } from "../components/DockShell";

const LEGEND = [
  {
    icon: Globe,
    label: "Atlas",
    description: "The live map",
  },
  {
    icon: Activity,
    label: "Pulse",
    description: "Vital signs over time",
  },
  {
    icon: ListFilter,
    label: "Stream",
    description: "The dispatch wire",
  },
  {
    icon: TrendingUp,
    label: "Flow",
    description: "The lifecycle funnel",
  },
  {
    icon: Plus,
    label: "Report",
    description: "The elevated action, always reachable",
    accent: true,
  },
  {
    icon: Radio,
    label: "Live",
    description: "Wounds moving right now",
    badge: "47",
    live: true,
  },
];

export default function DockPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "40px 24px",
        gap: 48,
      }}
      className="mob-px-16"
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1 className="text-h2" style={{ marginBottom: 8 }}>
          The Dock &mdash; one navigation, always present
        </h1>
        <p className="text-body text-2" style={{ maxWidth: 420, margin: "0 auto" }}>
          Dark charcoal pill housing four lenses, the clay Report button, and a live counter.
        </p>
      </div>

      {/* Large Dock Shell */}
      <div className="card mob-px-16" style={{ padding: "40px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, position: "relative" }}>
        <div style={{ position: "relative", transform: "scale(1.1)", pointerEvents: "none", maxWidth: "100%" }}>
          {/* Render actual dock structure for visual consistency */}
          <div className="dock" style={{ boxShadow: "var(--shadow-dock)" }}>
            {[
              { Icon: Globe, id: "atlas" },
              { Icon: Activity, id: "pulse" },
              { Icon: ListFilter, id: "stream" },
              { Icon: TrendingUp, id: "flow" },
            ].map(({ Icon, id }) => (
              <div key={id} className="dock-btn is-active">
                <Icon size={20} />
              </div>
            ))}
            <span className="dock-divider" />
            <div className="dock-report-btn">
              <Plus size={22} />
            </div>
            <span className="dock-divider" />
            <div className="dock-btn" style={{ position: "relative" }}>
              <Radio size={18} style={{ color: "var(--c-p-400)" }} />
              <span className="dock-badge">47</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card" style={{ padding: 28, maxWidth: 500, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LEGEND.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: item.accent
                    ? "var(--report)"
                    : item.live
                    ? "rgba(255,255,255,.06)"
                    : "var(--bg-muted)",
                  color: item.accent
                    ? "#fff"
                    : item.live
                    ? "var(--c-p-400)"
                    : "var(--text-2)",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <item.icon size={18} />
                {item.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      minWidth: 18,
                      height: 18,
                      borderRadius: "var(--radius-pill)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#fff",
                      background: "var(--c-p-600)",
                      padding: "0 5px",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div>
                <p className="text-label" style={{ fontWeight: 600 }}>
                  {item.label}
                </p>
                <p className="text-caption text-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
