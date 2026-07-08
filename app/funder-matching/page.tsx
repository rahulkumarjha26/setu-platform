"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FUNDER_MATCHES } from "@/lib/mock-data";
import type { FundMatch } from "@/lib/mock-data";
import MatchSummaryBar from "./components/MatchSummaryBar";
import ScheduleVIIGrid from "./components/ScheduleVIIGrid";
import MatchCard from "./components/MatchCard";

type FilterKey = "all" | "new" | "proposed" | "committed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "proposed", label: "Proposed" },
  { key: "committed", label: "Committed" },
];

const FILTER_COUNTS: Record<FilterKey, (ms: FundMatch[]) => number> = {
  all: (ms) => ms.length,
  new: (ms) => ms.filter((m) => m.status === "new").length,
  proposed: (ms) => ms.filter((m) => m.status === "proposed").length,
  committed: (ms) => ms.filter((m) => m.status === "committed").length,
};

export default function FunderMatchingPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredMatches = useMemo(() => {
    if (activeFilter === "all") return FUNDER_MATCHES;
    return FUNDER_MATCHES.filter((m) => m.status === activeFilter);
  }, [activeFilter]);

  /* Sorted by match score descending */
  const sortedMatches = useMemo(
    () => [...filteredMatches].sort((a, b) => b.matchScore - a.matchScore),
    [filteredMatches],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 48 }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 28 }}
        >
          <h1 className="text-h1" style={{ marginBottom: 6 }}>
            Funder Matching
          </h1>
          <p className="text-body" style={{ color: "var(--text-2)" }}>
            Match CSR mandates with verified NGO projects
          </p>
        </motion.div>

        {/* ── Summary bar ── */}
        <div style={{ marginBottom: 36 }}>
          <MatchSummaryBar />
        </div>

        {/* ── Schedule VII Grid ── */}
        <div style={{ marginBottom: 40 }}>
          <ScheduleVIIGrid />
        </div>

        {/* ── Active Matches section ── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <h2
              className="text-h2"
              style={{ color: "var(--text)" }}
            >
              Active Matches
            </h2>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS.map((f) => {
                const count = FILTER_COUNTS[f.key](FUNDER_MATCHES);
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === f.key}
                    className={`chip${activeFilter === f.key ? " selected" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        opacity: 0.7,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Match cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sortedMatches.length === 0 && (
              <div
                className="card card-compact"
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--text-3)",
                }}
              >
                <p className="text-body">No matches found for this filter.</p>
              </div>
            )}
            {sortedMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <MatchCard match={match} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
