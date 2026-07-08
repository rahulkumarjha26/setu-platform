"use client";

import type { FundMatch } from "@/lib/mock-data";

/* ─── Score → tier helpers ─── */
function scoreBorderColor(score: number): string {
  if (score >= 80) return "var(--st-healed-mark)";
  if (score >= 60) return "var(--st-assess-mark)";
  return "var(--text-3)";
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "var(--st-healed)";
  if (score >= 60) return "var(--st-assess)";
  return "var(--text-2)";
}

/* ─── Status map for match states ─── */
const MATCH_STATUS_PILL: Record<
  FundMatch["status"],
  { label: string; cls: string }
> = {
  new: { label: "New", cls: "pill--open" },
  proposed: { label: "Proposed", cls: "pill--assess" },
  "in-discussion": { label: "In Discussion", cls: "pill--active" },
  committed: { label: "Committed", cls: "pill--healed" },
};

/* ─── ProgressRing — inline SVG ─── */
function ProgressRing({
  score,
  size = 56,
  stroke = 5,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const filled = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Ghost track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ghost)"
        strokeWidth={stroke}
      />
      {/* Filled arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={scoreRingColor(score)}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Score text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text)"
        fontSize={16}
        fontWeight={700}
        fontFamily="var(--font-mono)"
      >
        {score}
      </text>
    </svg>
  );
}

/* ─── MatchCard ─── */
export default function MatchCard({ match }: { match: FundMatch }) {
  const barPct =
    match.amountAvailable > 0
      ? Math.min((match.amountNeeded / match.amountAvailable) * 100, 100)
      : 0;
  const barColor =
    match.amountNeeded <= match.amountAvailable
      ? "var(--action)"
      : "var(--report)";
  const statusMeta = MATCH_STATUS_PILL[match.status];

  return (
    <div
      className="card card-compact"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        borderLeft: `3px solid ${scoreBorderColor(match.matchScore)}`,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      {/* Row 1: Avatar + Name | Progress bar | Ring */}
      <div
        className="mob-flex-col"
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {/* Left: Avatar + identity */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            flex: "0 0 auto",
            minWidth: 180,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-input)",
              background: match.ngoLogoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "var(--font-mono)",
            }}
          >
            {match.ngoInitials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              className="text-label"
              style={{
                color: "var(--text)",
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {match.ngoName}
            </div>
            <div
              className="text-caption"
              style={{
                color: "var(--text-2)",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {match.woundTitle}
            </div>
            <div
              className="text-caption text-mono"
              style={{
                color: "var(--text-3)",
                marginTop: 4,
                fontSize: 11,
              }}
            >
              {match.csrCompanyName}
            </div>
          </div>
        </div>

        {/* Center: Amount progress bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 160,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              className="text-caption text-mono"
              style={{ color: "var(--text-2)", fontWeight: 500 }}
            >
              ₹{match.amountNeeded.toLocaleString("en-IN")}L needed
            </span>
            <span
              className="text-caption text-mono"
              style={{ color: "var(--text-3)" }}
            >
              ₹{match.amountAvailable.toLocaleString("en-IN")}L available
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--bg-muted)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barPct}%`,
                height: "100%",
                borderRadius: 4,
                background: barColor,
                transition: "width 0.6s var(--ease)",
              }}
            />
          </div>
          <span
            className="text-caption"
            style={{
              color: "var(--text-3)",
              fontSize: 11,
            }}
          >
            {barPct < 100
              ? `${Math.round(barPct)}% of target funded`
              : "Fully funded"}
          </span>
        </div>

        {/* Right: Score ring + status */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <ProgressRing score={match.matchScore} />
          <span className={`pill ${statusMeta.cls}`}>{statusMeta.label}</span>
        </div>
      </div>

      {/* Row 2: Match factors as pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {match.matchFactors.map((factor) => (
          <span
            key={factor}
            className="pill"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-2)",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 11.5,
            }}
          >
            {factor}
          </span>
        ))}
      </div>

      {/* Row 3: Action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm" type="button" aria-label="Propose this match">
            Propose match
          </button>
          <button className="btn btn-ghost btn-sm" type="button" aria-label="View NGO profile">
            View NGO
          </button>
        </div>
        <span className="text-caption" style={{ color: "var(--text-3)" }}>
          Match ID {match.id}
        </span>
      </div>
    </div>
  );
}
