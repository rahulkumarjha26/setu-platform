"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Trash2,
  Route,
  BookOpen,
  Heart,
  Users,
} from "lucide-react";
import { SCHEDULE_VII_CATEGORIES, CATEGORY_META } from "@/lib/mock-data";
import type { CategoryKey } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ElementType> = {
  water: Droplets,
  sanitation: Trash2,
  roads: Route,
  education: BookOpen,
  health: Heart,
  elder: Users,
};

function getCategoryIcon(key: string): React.ElementType {
  return ICON_MAP[key] || Droplets;
}

export default function ScheduleVIIGrid() {
  return (
    <div>
      <h3
        className="text-label-up"
        style={{
          color: "var(--text-2)",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Schedule VII Alignment
      </h3>
      <div className="grid-2 mob-col-1" style={{ gap: 14 }}>
        {SCHEDULE_VII_CATEGORIES.map((cat, i) => {
          const Icon = getCategoryIcon(cat.key);
          const catMeta = CATEGORY_META[cat.key as CategoryKey];
          const alignmentPct =
            cat.ngoCount > 0
              ? Math.round((cat.csrAligned / cat.ngoCount) * 100)
              : 0;
          const barColor =
            alignmentPct >= 80
              ? "var(--st-healed-mark)"
              : alignmentPct >= 50
                ? "var(--st-assess-mark)"
                : "var(--text-3)";

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card card-compact"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                cursor: "default",
              }}
            >
              {/* Header: Icon + Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-input)",
                    background: "var(--bg-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: catMeta?.color ?? "var(--text-2)",
                    }}
                  />
                </div>
                <div>
                  <div className="text-label" style={{ color: "var(--text)" }}>
                    {cat.scheduleLabel}
                  </div>
                  <div
                    className="text-caption"
                    style={{ color: "var(--text-3)" }}
                  >
                    {cat.description}
                  </div>
                </div>
              </div>

              {/* Mini stat row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span className="text-caption" style={{ color: "var(--text-2)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {cat.ngoCount}
                  </span>{" "}
                  NGOs
                </span>
                <span className="text-caption" style={{ color: "var(--text-2)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {cat.csrAligned}
                  </span>{" "}
                  mandates aligned
                </span>
                <span
                  className="text-caption text-mono"
                  style={{ color: "var(--text-3)" }}
                >
                  ₹{(cat.totalFundingNeeded).toFixed(1)}Cr need · ₹
                  {(cat.totalFundingAvailable).toFixed(1)}Cr avail
                </span>
              </div>

              {/* Alignment progress bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "var(--bg-muted)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${alignmentPct}%` }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06 + 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      background: barColor,
                    }}
                  />
                </div>
                <span
                  className="text-mono"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: barColor,
                    minWidth: 38,
                    textAlign: "right",
                  }}
                >
                  {alignmentPct}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
