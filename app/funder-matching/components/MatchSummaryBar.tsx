"use client";

import { motion } from "framer-motion";
import { FUNDING_REQUESTS_SUMMARY } from "@/lib/mock-data";

export default function MatchSummaryBar() {
  const {
    totalNGOs,
    totalFundsNeeded,
    totalFundsAvailable,
    avgMatchScore,
  } = FUNDING_REQUESTS_SUMMARY;

  const gap = totalFundsAvailable - totalFundsNeeded;
  const gapLabel = gap >= 0 ? "Surplus" : "Shortfall";

  const metrics = [
    {
      label: "NGOs seeking funding",
      value: totalNGOs,
      suffix: "",
      note: "verified on Setu",
    },
    {
      label: "CSR funds available",
      value: `₹${totalFundsAvailable.toFixed(1)}`,
      suffix: "Cr",
      note: "across matched mandates",
    },
    {
      label: "Avg match score",
      value: avgMatchScore,
      suffix: "%",
      note: `${FUNDING_REQUESTS_SUMMARY.matchesLive} active match${FUNDING_REQUESTS_SUMMARY.matchesLive !== 1 ? "es" : ""}`,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
      }}
      className="mob-flex-col"
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="card card-metric"
          style={{
            flex: "1 1 0",
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span className="text-caption" style={{ color: "var(--text-2)" }}>
            {m.label}
          </span>
          <span className="text-number" style={{ color: "var(--text)" }}>
            {typeof m.value === "number"
              ? m.value.toLocaleString("en-IN")
              : m.value}
            {m.suffix && (
              <span
                style={{
                  fontSize: "0.55em",
                  fontWeight: 500,
                  color: "var(--text-2)",
                  marginLeft: 4,
                }}
              >
                {m.suffix}
              </span>
            )}
          </span>
          <span className="text-caption" style={{ color: "var(--text-3)" }}>
            {m.note}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
