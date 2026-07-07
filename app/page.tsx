"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, CheckCircle, Building2 } from "lucide-react";

const COVERAGE_GRID = [
  [1, 1, 1, 1, 0, 0],
  [1, 1, 0.4, 0, 0, 0],
  [1, 0.7, 0.3, 0, 0, 0],
  [0.8, 0.5, 0.3, 0.2, 0, 0],
  [0.6, 0.3, 0.2, 0, 0, 0],
  [0.3, 0.1, 0, 0, 0, 0],
];

const PINS: { row: number; col: number; color: string }[] = [
  { row: 0, col: 1, color: "var(--st-healed-mark)" },
  { row: 0, col: 3, color: "var(--st-open-mark)" },
  { row: 1, col: 0, color: "var(--st-active-mark)" },
  { row: 2, col: 1, color: "var(--st-open-mark)" },
  { row: 2, col: 2, color: "var(--st-healed-mark)" },
  { row: 3, col: 0, color: "var(--st-active-mark)" },
  { row: 3, col: 3, color: "var(--st-assess-mark)" },
  { row: 4, col: 0, color: "var(--st-open-mark)" },
  { row: 4, col: 2, color: "var(--st-gov-mark)" },
  { row: 5, col: 0, color: "var(--st-healed-mark)" },
  { row: 5, col: 1, color: "var(--st-assess-mark)" },
  { row: 1, col: 2, color: "var(--st-open-mark)" },
];

const CLUSTERS: { row: number; col: number; count: number }[] = [
  { row: 0, col: 0, count: 47 },
  { row: 3, col: 1, count: 18 },
  { row: 4, col: 2, count: 12 },
];

const STATS = [
  { label: "Wounds counted", value: "12,847", icon: MapPin, color: "var(--st-open-mark)" },
  { label: "Verified healed", value: "4,210", icon: CheckCircle, color: "var(--st-healed-mark)" },
  { label: "Districts", value: "640", icon: Building2, color: "var(--action)" },
];

function getCellOpacity(val: number) {
  if (val === 0) return 0;
  return 0.12 + val * 0.72;
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="container" style={{ paddingTop: 32, paddingBottom: 0 }}>
        <Link
          href="/"
          className="text-serif text-petrol"
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}
        >
          सेतु · SETU
        </Link>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container"
        style={{ paddingTop: 80, paddingBottom: 48 }}
      >
        <h1 className="text-display" style={{ maxWidth: 720, color: "var(--text)", overflowWrap: "break-word" }}>
          A nation, counted
          <br />
          one wound at a time.
        </h1>

        <p className="text-body-lg text-2" style={{ maxWidth: 520, marginTop: 24 }}>
          Every pin is a real report. Every status change is verified proof. No assumptions.
        </p>

        <div className="flex items-center gap-16 mob-flex-col mob-gap-12" style={{ marginTop: 40 }}>
          <Link
            href="/atlas"
            className="btn btn-primary mob-w-full"
            style={{ height: 46, padding: "0 26px", fontSize: 15 }}
          >
            Explore the Atlas &rarr;
          </Link>
          <Link
            href="/report"
            className="btn btn-outline mob-w-full"
            style={{
              height: 46,
              padding: "0 26px",
              fontSize: 15,
              borderColor: "var(--report)",
              color: "var(--report)",
            }}
          >
            Report a wound
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="container mob-flex-col"
        style={{ paddingTop: 32, paddingBottom: 48, display: "flex", gap: 64, flexWrap: "wrap" }}
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            style={{ minWidth: 180 }}
          >
            <span className="text-label-up text-2" style={{ marginBottom: 8, display: "block" }}>
              {stat.label}
            </span>
            <div className="flex items-center gap-8">
              <stat.icon size={18} color={stat.color} />
              <span className="text-number">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="container"
        style={{ paddingBottom: 64, flex: 1 }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "6 / 5",
            maxHeight: 480,
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            gap: 4,
            background: "var(--bg-alt)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border)",
            padding: 12,
            position: "relative",
            overflow: "hidden",
            justifyContent: "center",
          }}
        >
          {COVERAGE_GRID.map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={cell === 0 ? "hatch" : undefined}
                style={{
                  borderRadius: 4,
                  background:
                    cell > 0
                      ? `rgba(18, 86, 79, ${getCellOpacity(cell)})`
                      : "var(--nodata)",
                }}
              />
            ))
          )}

          {PINS.map((pin, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `calc(${(pin.row / 6) * 100}% + ${12 + ((pin.row + 0.5) / 6) * 4}px)`,
                left: `calc(${(pin.col / 6) * 100}% + ${12 + ((pin.col + 0.5) / 6) * 4}px)`,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: pin.color,
                boxShadow: "0 0 0 2px white",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {CLUSTERS.map((c, i) => (
            <div
              key={`cl-${i}`}
              style={{
                position: "absolute",
                top: `calc(${(c.row + 0.35) / 6} * 100%)`,
                left: `calc(${(c.col + 0.4) / 6} * 100%)`,
                background: "var(--action)",
                color: "#fff",
                borderRadius: "var(--radius-pill)",
                padding: "3px 10px",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                lineHeight: 1.4,
              }}
            >
              {c.count}
            </div>
          ))}
        </div>
      </motion.section>

      <footer
        className="mob-px-16"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
          padding: "24px 32px",
          borderTop: "1px solid var(--border)",
          marginBottom: 80,
        }}
      >
        <span
          className="text-serif text-2"
          style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.02em" }}
        >
          सेतु · SETU
        </span>
      </footer>
    </div>
  );
}
