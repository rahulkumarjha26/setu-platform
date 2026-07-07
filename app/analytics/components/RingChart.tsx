"use client";

import { motion } from "framer-motion";
import type { StatusKey } from "@/lib/mock-data";
import { STATUS_META } from "@/lib/mock-data";

/* ─── RingChart — inline SVG donut ─── */

interface RingSegment {
  label: string;
  value: number;
  color: string;
}

function useWoundStatusSegments(): RingSegment[] {
  // Import PLATFORM_STATS at call site if needed; here we accept segments as param
  return [
    { label: "Open", value: 0, color: "var(--st-open-mark)" },
    { label: "Assessing", value: 0, color: "var(--st-assess-mark)" },
    { label: "Routed", value: 0, color: "var(--st-gov-mark)" },
    { label: "In Progress", value: 0, color: "var(--st-active-mark)" },
    { label: "Healed", value: 0, color: "var(--st-healed-mark)" },
  ];
}

interface RingChartProps {
  segments: RingSegment[];
  size?: number;
  stroke?: number;
}

export { type RingSegment };

export default function RingChart({
  segments,
  size = 180,
  stroke = 22,
}: RingChartProps) {
  const total = segments.reduce((s, sg) => s + sg.value, 0);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let accum = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ghost track ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--ghost)"
          strokeWidth={stroke}
        />

        {/* Animated segments */}
        {segments.map((sg, i) => {
          const segLen = total > 0 ? (sg.value / total) * circ : 0;
          const offset = accum - circ * 0.25;
          accum += segLen;

          if (segLen <= 0) return null;

          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={sg.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${segLen} ${circ - segLen}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${segLen} ${circ - segLen}` }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}

        {/* Center text showing total count */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-number"
          fill="var(--text)"
          fontSize={28}
          fontWeight={700}
        >
          {total.toLocaleString("en-IN")}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", justifyContent: "center", marginTop: 4 }}>
        {segments.map((sg) => (
          <div
            key={sg.label}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: sg.color,
                flexShrink: 0,
              }}
            />
            <span className="text-caption" style={{ color: "var(--text-2)" }}>
              {sg.label}
            </span>
            <span
              className="text-mono"
              style={{ fontWeight: 600, fontSize: 12, color: "var(--text)" }}
            >
              {sg.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
