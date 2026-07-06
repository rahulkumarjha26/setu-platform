"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Users,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

const WOUNDS = [
  { name: "Contaminated tap water in Ward 7", ward: "Jayanagar", days: 42, affected: 3800, status: "routed" as const },
  { name: "Broken sewage pipe near high school", ward: "Rajaji Nagar", days: 31, affected: 1200, status: "routed" as const },
  { name: "Streetlight outage since monsoon rains", ward: "Hebbal", days: 21, affected: 520, status: "routed" as const },
  { name: "14 potholes on NH service road", ward: "Yeshwantpur", days: 28, affected: 8200, status: "routed" as const },
  { name: "Drainage overflow blocking market road", ward: "City Market", days: 14, affected: 1450, status: "in-progress" as const },
  { name: "Waterlogging at bus depot terminal", ward: "Majestic", days: 8, affected: 15000, status: "routed" as const },
  { name: "Primary health centre roof collapse", ward: "Gubbi", days: 5, affected: 240, status: "assessing" as const },
  { name: "Lake encroachment settlement survey", ward: "Ulsoor", days: 3, affected: 890, status: "assessing" as const },
  { name: "Fallen tree blocking arterial road", ward: "Koramangala", days: 1, affected: 3200, status: "reported" as const },
];

const REMEDIATION_ITEMS = [
  { label: "Fix 40 taps — Zone A, Ward 7", completed: 12, total: 40 },
  { label: "Desilt 6 drains — Ward 4 & 5", completed: 4, total: 6 },
  { label: "Replace 14 streetlights — Hebbal", completed: 14, total: 14 },
  { label: "Fill 22 potholes — NH service road", completed: 8, total: 22 },
];

export default function GovernmentPage() {
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());

  const toggleAck = (i: number) => {
    const next = new Set(acknowledged);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setAcknowledged(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container" style={{ paddingTop: 56 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <h1 className="text-h1">Government View</h1>
          <span className="role-badge" style={{ background: "var(--bg-muted)" }}>
            <span className="role-dot" style={{ background: "var(--role-gov)" }} />
            Government
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 32 }}>
          BBMP Storm-Water Dept
        </p>

        {/* Metric Strip */}
        <div className="grid grid-3 gap-24" style={{ marginBottom: 36 }}>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">In jurisdiction</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">412</span>
              <MapPin size={16} color="var(--text-3)" />
            </div>
          </div>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Overdue</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number" style={{ color: "var(--report)" }}>88</span>
              <span className="delta delta-down">
                <ArrowDown size={10} />
                7
              </span>
            </div>
          </div>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Resolved this quarter</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">61%</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                8%
              </span>
            </div>
          </div>
        </div>

        {/* Main: Table + Right Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Wound</th>
                  <th>Ward</th>
                  <th className="cell-right">Days pending</th>
                  <th className="cell-right">Citizens affected</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {WOUNDS.map((w, i) => (
                  <tr
                    key={w.name}
                    style={
                      w.days > 14
                        ? { borderLeft: "3px solid var(--c-r-50)" }
                        : undefined
                    }
                  >
                    <td style={{ fontWeight: 500 }}>{w.name}</td>
                    <td style={{ color: "var(--text-2)" }}>{w.ward}</td>
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
                    <td className="cell-right" style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <Users size={12} color="var(--text-3)" />
                      {w.affected.toLocaleString()}
                    </td>
                    <td>
                      <StatusPill status={w.status} />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => toggleAck(i)}
                        style={{
                          background: acknowledged.has(i) ? "var(--st-healed-wash)" : "var(--action)",
                          color: acknowledged.has(i) ? "var(--st-healed-mark)" : "#fff",
                          boxShadow: acknowledged.has(i) ? "none" : "var(--shadow-btn)",
                        }}
                      >
                        {acknowledged.has(i) ? (
                          <>
                            <CheckCircle size={12} />
                            Acknowledged
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

          {/* Right Panel — Remediation Queue */}
          <div className="desktop-only" style={{ position: "sticky", top: 32 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 className="text-label-up text-3" style={{ marginBottom: 8 }}>
                Remediation queue
              </h3>
              <p className="text-caption text-2" style={{ marginBottom: 16 }}>
                Fix these in 30 days — shown as resolved by your office
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {REMEDIATION_ITEMS.map((item, i) => {
                  const isDone = item.completed >= item.total;
                  return (
                    <div
                      key={item.label}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-input)",
                        background: isDone ? "var(--st-healed-wash)" : "var(--bg-muted)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span
                          className="text-caption"
                          style={{
                            fontWeight: 500,
                            color: isDone ? "var(--st-healed-mark)" : "var(--text)",
                          }}
                        >
                          {item.label}
                        </span>
                        <span className="text-mono text-caption text-2">
                          {item.completed}/{item.total}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "var(--border)",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.completed / item.total) * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            height: "100%",
                            borderRadius: 2,
                            background: isDone ? "var(--st-healed-mark)" : "var(--action)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  padding: "12px",
                  borderRadius: "var(--radius-input)",
                  background: "var(--c-p-50)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Clock size={14} color="var(--action)" />
                <span className="text-caption" style={{ color: "var(--action)", fontWeight: 500 }}>
                  30 days to resolve
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
