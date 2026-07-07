"use client";

import { motion } from "framer-motion";

/* ─── Simplified India outline SVG with position dots ─── */

interface Region {
  region: string;
  count: number;
  lat: number;
  lng: number;
}

interface WoundMapProps {
  regions: Region[];
}

/* 
  India coordinate mapping:
    lng ~68–98 → SVG X 25–375 (range 350)
    lat ~8–36  → SVG Y 440–40  (range 400, inverted)
*/
function lngToX(lng: number): number {
  return 25 + ((lng - 68) / (98 - 68)) * 350;
}
function latToY(lat: number): number {
  return 440 - ((lat - 8) / (36 - 8)) * 400;
}

/* 
  Simplified India outline path (approximate polygon).
  This is a hand-curated outline tracing the major border shape.
*/
const INDIA_OUTLINE = `
M 78.5 36.5
L 80.5 35.5 L 82.5 35.0 L 84.0 34.5 L 85.5 34.0
L 87.0 33.5 L 88.5 32.5 L 89.5 31.5 L 90.5 30.0
L 91.5 28.5 L 92.0 27.0 L 92.5 26.0 L 93.5 25.0
L 95.0 24.0 L 96.5 22.5 L 97.0 21.0 L 97.5 19.5
L 97.0 18.0 L 96.5 16.5 L 95.5 15.0 L 94.5 13.5
L 93.5 12.0 L 92.0 11.0 L 90.5 10.5 L 89.0 10.0
L 87.5 9.5 L 86.0 9.0 L 84.5 8.5 L 83.0 8.5
L 81.5 8.5 L 80.0 8.5 L 78.5 8.5 L 77.0 8.5
L 75.5 8.5 L 74.0 9.0 L 72.5 9.5 L 71.0 10.0
L 69.5 10.5 L 68.5 11.5 L 68.0 12.5 L 68.5 13.5
L 69.0 14.5 L 69.5 15.5 L 69.0 16.5 L 68.5 17.5
L 68.5 18.5 L 69.0 19.5 L 69.5 20.5 L 70.0 21.5
L 70.5 22.5 L 71.0 23.5 L 71.5 24.5 L 72.0 25.5
L 72.5 26.5 L 73.0 27.5 L 73.5 28.5 L 74.0 29.5
L 74.5 30.5 L 75.0 31.5 L 75.5 32.5 L 76.0 33.5
L 76.5 34.5 L 77.0 35.5 L 77.5 36.0 L 78.5 36.5
Z
`.trim();

export default function WoundMap({ regions }: WoundMapProps) {
  if (!regions || regions.length === 0) return null;

  const maxCount = Math.max(...regions.map((r) => r.count));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <svg
        viewBox="60 5 45 38"
        style={{ width: "100%", maxHeight: 320 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* India outline */}
        <path
          d={INDIA_OUTLINE}
          fill="var(--bg-muted)"
          stroke="var(--border)"
          strokeWidth={0.3}
          strokeOpacity={0.8}
        />

        {/* Region dots */}
        {regions.map((r, i) => {
          const x = lngToX(r.lng);
          const y = latToY(r.lat);
          const rSize = 2 + (r.count / maxCount) * 8;

          return (
            <g key={r.region}>
              {/* Glow halo */}
              <motion.circle
                cx={x}
                cy={y}
                r={rSize * 1.8}
                fill="var(--action)"
                fillOpacity={0.08}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: rSize * 1.8, opacity: 0.08 }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
              />
              {/* Dot */}
              <motion.circle
                cx={x}
                cy={y}
                r={rSize}
                fill="var(--action)"
                fillOpacity={0.75}
                stroke="#fff"
                strokeWidth={0.5}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: rSize, opacity: 0.75 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Label */}
              <motion.text
                x={x}
                y={y - rSize - 3}
                textAnchor="middle"
                className="text-caption"
                fontSize={3.2}
                fill="var(--text-2)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {r.region}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
