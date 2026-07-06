"use client";

import { motion } from "framer-motion";
import { Building2, Landmark, Handshake, Users, Coins } from "lucide-react";
import type { FundingEntry } from "@/lib/mock-data";

interface FundingSectionProps {
  funding?: FundingEntry[];
}

const SOURCE_ICONS: Record<string, typeof Building2> = {
  corporate: Building2,
  government: Landmark,
  ngo: Handshake,
  community: Users,
};

export function FundingSection({ funding }: FundingSectionProps) {
  if (!funding || funding.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--bg-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Coins size={24} color="var(--text-3)" />
        </div>
        <p className="text-label" style={{ color: "var(--text-2)" }}>
          No funding data yet
        </p>
        <p className="text-caption" style={{ color: "var(--text-3)", maxWidth: 280 }}>
          When a CSR or government funder adopts this wound, funding and milestones will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
      style={{ gap: 16 }}
    >
      {funding.map((entry, fundIdx) => {
        const Icon = SOURCE_ICONS[entry.sourceType] || Building2;
        const completed = entry.milestones.filter(
          (m) => m.status === "completed"
        ).length;
        const total = entry.milestones.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <div key={fundIdx} className="card card-compact">
            {/* Funding source header */}
            <div className="flex items-center gap-10" style={{ marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--bg-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color="var(--action)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>
                  {entry.source}
                </p>
                <p className="text-caption" style={{ color: "var(--text-2)", textTransform: "capitalize" }}>
                  {entry.sourceType}
                </p>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <p className="text-mono" style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                  {entry.amount}
                </p>
                <p className="text-caption" style={{ color: "var(--text-3)" }}>committed</p>
              </div>
            </div>

            {/* Milestone progress bar */}
            <div style={{ marginBottom: 14 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <p className="text-caption" style={{ fontWeight: 500, color: "var(--text-2)" }}>
                  Milestones: {completed} / {total}
                </p>
                <p className="text-caption" style={{ fontWeight: 600, color: "var(--action)" }}>
                  {pct}%
                </p>
              </div>
              <div className="milestone-track">
                {entry.milestones.map((ms, msIdx) => (
                  <div
                    key={msIdx}
                    className={`milestone-segment ${
                      ms.status === "completed"
                        ? "filled"
                        : ms.status === "in-progress"
                        ? "active"
                        : "empty"
                    }`}
                    style={{
                      marginRight: msIdx < entry.milestones.length - 1 ? 4 : 0,
                    }}
                    title={`${ms.label}: ${ms.status}`}
                  />
                ))}
              </div>
            </div>

            {/* Milestone list */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              {entry.milestones.map((ms, msIdx) => (
                <div
                  key={msIdx}
                  className="flex items-center"
                  style={{ gap: 10 }}
                >
                  {/* Dot indicator */}
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        ms.status === "completed"
                          ? "var(--st-healed-mark)"
                          : ms.status === "in-progress"
                          ? "var(--action)"
                          : "var(--border)",
                      boxShadow:
                        ms.status === "in-progress"
                          ? "0 0 0 3px rgba(18,86,79,.15)"
                          : "none",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="text-label"
                      style={{
                        color:
                          ms.status === "completed"
                            ? "var(--text)"
                            : ms.status === "in-progress"
                            ? "var(--text)"
                            : "var(--text-3)",
                      }}
                    >
                      {ms.label}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      className="text-caption"
                      style={{
                        fontWeight: 600,
                        color:
                          ms.status === "completed"
                            ? "var(--st-healed-mark)"
                            : ms.status === "in-progress"
                            ? "var(--action)"
                            : "var(--text-3)",
                      }}
                    >
                      {ms.amount}
                    </p>
                    <p className="text-caption" style={{ color: "var(--text-3)", fontSize: 11 }}>
                      {ms.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
