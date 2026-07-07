"use client";

import { motion } from "framer-motion";

/* ─── BarChart — inline SVG vertical bars (two series) ─── */

interface BarDatum {
  month: string;
  deployed: number;
  matched: number;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
}

export default function BarChart({ data, height = 180 }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const allValues = data.flatMap((d) => [d.deployed, d.matched]);
  const max = Math.max(...allValues, 0.1);
  const barAreaHeight = height - 28; // room for labels
  const colCount = data.length;
  const barGap = colCount > 1 ? 4 : 0;
  const barWidthPerGroup = 100 / colCount; // %
  const barWidth = Math.max(6, (barWidthPerGroup - 3) * 0.42); // % — two bars per group

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${colCount * 60} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        {/* Y-axis grid lines */}
        {gridLines.map((pct) => {
          if (pct === 0) return null;
          const y = barAreaHeight - barAreaHeight * pct;
          return (
            <line
              key={pct}
              x1={0}
              y1={y}
              x2={colCount * 60}
              y2={y}
              stroke="var(--border)"
              strokeOpacity={0.4}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const deployedH = (d.deployed / max) * barAreaHeight;
          const matchedH = (d.matched / max) * barAreaHeight;
          const groupX = i * (100 / colCount); // %
          const barX1 = groupX + (barWidthPerGroup - barWidth * 2 - barGap) / 2;
          const barX2 = barX1 + barWidth + barGap;

          return (
            <g key={i}>
              {/* Deployed bar */}
              <motion.rect
                x={`${barX1}%`}
                y={barAreaHeight - deployedH}
                width={`${barWidth}%`}
                height={0}
                animate={{ height: deployedH }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                fill="var(--action)"
                rx={3}
              />
              {/* Matched bar */}
              <motion.rect
                x={`${barX2}%`}
                y={barAreaHeight - matchedH}
                width={`${barWidth}%`}
                height={0}
                animate={{ height: matchedH }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08 + 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                fill="var(--c-p-400)"
                rx={3}
              />
              {/* X-axis month label */}
              <text
                x={`${groupX + barWidthPerGroup / 2}%`}
                y={height - 4}
                textAnchor="middle"
                className="text-caption text-3"
                fontSize={11}
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "var(--action)",
              flexShrink: 0,
            }}
          />
          <span className="text-caption text-2">Deployed (₹ Cr)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "var(--c-p-400)",
              flexShrink: 0,
            }}
          />
          <span className="text-caption text-2">Matched (₹ Cr)</span>
        </div>
      </div>
    </div>
  );
}
