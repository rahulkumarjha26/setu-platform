"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { NGOscore } from "@/lib/mock-data";

/* ─── TopNGOs — ranked list with initials avatar, verification score, trend ─── */

interface TopNGOsProps {
  ngos: NGOscore[];
}

function TrendIcon({ trend }: { trend: NGOscore["trend"] }) {
  if (trend === "up")
    return <TrendingUp size={12} color="var(--st-healed-mark)" />;
  if (trend === "down")
    return <TrendingDown size={12} color="var(--st-failed-mark)" />;
  return <Minus size={12} color="var(--text-3)" />;
}

export default function TopNGOs({ ngos }: TopNGOsProps) {
  if (!ngos || ngos.length === 0) return null;

  const sorted = [...ngos].sort(
    (a, b) => b.verificationScore - a.verificationScore
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sorted.map((ngo, i) => (
        <motion.div
          key={ngo.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="card card-compact"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
          }}
        >
          {/* Rank */}
          <span
            className="text-mono text-3"
            style={{
              fontSize: 11,
              fontWeight: 600,
              width: 20,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Initials avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: ngo.logoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontWeight: 700,
              fontSize: 12,
              color: "#fff",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            {ngo.initials}
          </div>

          {/* Name and projects */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="text-label"
              style={{ fontSize: 13.5, color: "var(--text)", margin: 0 }}
            >
              {ngo.name}
            </div>
            <p
              className="text-caption text-3"
              style={{ margin: 0, marginTop: 2 }}
            >
              {ngo.projectsCompleted} project{ngo.projectsCompleted !== 1 ? "s" : ""} completed
            </p>
          </div>

          {/* Trend */}
          <TrendIcon trend={ngo.trend} />

          {/* Verification score */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                height: 4,
                width: 48,
                borderRadius: 2,
                background: "var(--bg-muted)",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ngo.verificationScore}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background:
                    ngo.verificationScore >= 85
                      ? "var(--st-healed-mark)"
                      : ngo.verificationScore >= 75
                      ? "var(--st-assess-mark)"
                      : "var(--st-failed-mark)",
                }}
              />
            </div>
            <span
              className="text-mono"
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text)",
                minWidth: 26,
                textAlign: "right",
              }}
            >
              {ngo.verificationScore}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
