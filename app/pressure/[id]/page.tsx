"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ChevronRight,
  Building2,
  Clock,
  ExternalLink,
  Copy,
  Share2,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { StatusPill } from "../../components/StatusPill";

// ── Animated Counter ──
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v) + suffix);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1,
    });
    return controls.stop;
  }, [inView, value, count]);

  return (
    <span ref={nodeRef} style={{ position: "relative" }}>
      <motion.span
        className="text-number"
        style={{ color: "var(--text)", display: "inline" }}
        onViewportEnter={() => setInView(true)}
      >
        {rounded}
      </motion.span>
    </span>
  );
}

// ── Data ──
const TIMELINE = [
  {
    ref: "SETU-KA-2025-00431",
    date: "14 Jul 2025, 18:32",
    action: "Filed via BBMP Storm-Water portal",
    dot: "origin",
  },
  {
    ref: "BBMP-SWD-8821",
    date: "14 Jul 2025, 18:33",
    action: "Auto-acknowledged by BBMP system",
    dot: "done",
  },
  {
    ref: "BBMP-SWD-8821",
    date: "15 Jul 2025, 09:14",
    action: "Assigned to Ward Engineer · Ward 187",
    dot: "done",
  },
  {
    ref: "BBMP-SWD-8821",
    date: "19 Jul 2025, 11:00",
    action: "Site inspection scheduled",
    dot: "in-progress",
  },
];

function generateCitizenDots(count: number, filedCount: number) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: 4 + ((i * 127 + 31) % 92),
      y: 4 + ((i * 83 + 17) % 92),
      filed: i < filedCount,
    });
  }
  return dots;
}

const CITIZEN_DOTS = generateCitizenDots(247, 189);

// ── Page ──
export default function PressurePage() {
  const isOverdue = true;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div className="container mob-px-16" style={{ paddingTop: 40 }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/wound/SETU-KA-2025-00431" style={{ color: "var(--text-2)" }}>
            Wound SETU-KA-00431
          </Link>
          <ChevronRight size={13} />
          <Link href="/place/buxar" style={{ color: "var(--text-2)" }}>
            Bengaluru Urban
          </Link>
          <ChevronRight size={13} />
          <span style={{ color: "var(--text)" }}>Pressure Thread</span>
        </nav>

        {/* Status + Title */}
        <div className="flex items-center gap-12" style={{ marginBottom: 12 }}>
          <StatusPill status="routed" />
        </div>

        <h1
          className="text-display"
          style={{ color: "var(--text)", maxWidth: 720, lineHeight: 1.12 }}
        >
          Open drain &mdash; Jayanagar 4th Block
        </h1>

        <p className="text-body-lg text-2" style={{ marginTop: 12, marginBottom: 36 }}>
          Collapsed storm-water drain near Anjaneya Temple. Waterlogging for over 3 weeks.
        </p>

        {/* ── HUGE COUNTER STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center flex-wrap"
          style={{
            gap: "12px 48px",
            padding: "28px 0",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            marginBottom: 36,
          }}
        >
          {[
            { value: 247, label: "affected", bg: "var(--bg-muted)" },
            { value: 189, label: "filed", bg: "var(--st-active-wash)" },
            { value: 14, label: "days pending", bg: "var(--st-failed-wash)" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
              style={{
                flex: "1 1 auto",
                minWidth: 180,
                background: stat.bg,
                borderRadius: "var(--radius-card)",
                padding: "20px 24px",
              }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.label === "days pending" ? "d" : ""} />
              <span
                className="text-label-up text-muted"
                style={{ display: "block", marginTop: 4 }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* ── DEPARTMENT CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card"
            style={{ padding: 24 }}
          >
            <div className="flex items-center gap-8" style={{ marginBottom: 8 }}>
              <Building2 size={16} color="var(--st-gov-mark)" />
              <span className="text-label-up text-muted">Routed to</span>
            </div>
            <h3 className="text-h3" style={{ color: "var(--text)", marginBottom: 2 }}>
              BBMP Storm-Water Dept
            </h3>
            <p className="text-caption text-2" style={{ marginBottom: 14 }}>
              Jurisdiction: Ward 187, South Zone
            </p>
            <div
              className="flex items-center gap-8"
              style={{
                padding: "10px 14px",
                background: "var(--bg-muted)",
                borderRadius: "var(--radius-input)",
                marginBottom: 18,
              }}
            >
              <Clock size={14} color="var(--text-2)" />
              <span className="text-caption text-2" style={{ flex: 1 }}>
                SLA: 14 days &middot; 2 days remaining
              </span>
              <div
                style={{
                  width: 80,
                  height: 4,
                  borderRadius: "var(--radius-pill)",
                  background: "var(--border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "86%",
                    height: "100%",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--report)",
                  }}
                />
              </div>
            </div>
            <Link
              href="https://bbmp.gov.in/swd-complaint"
              target="_blank"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              File your complaint (takes 10s)
              <ExternalLink size={14} />
            </Link>
          </motion.div>

          {/* ── PRE-DRAFTED COMPLAINT ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              padding: 24,
            }}
          >
            <div className="flex items-center gap-8" style={{ marginBottom: 10 }}>
              <FileText size={16} color="var(--text-2)" />
              <span className="text-label-up text-muted">Pre-drafted complaint</span>
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                borderRadius: "var(--radius-input)",
                padding: "16px 18px",
                border: "1px solid var(--border)",
                marginBottom: 14,
                lineHeight: 1.65,
                fontSize: 14,
                color: "var(--text)",
                fontFamily: "var(--font-serif)",
                borderLeft: "3px solid var(--action)",
              }}
            >
              To the Commissioner, BBMP. Subject: Collapsed storm-water drain at 4th Cross,
              Jayanagar 4th Block, near Anjaneya Temple Ward 187. The drain has been collapsed
              for over 3 weeks causing waterlogging and mosquito breeding. Request urgent repair
              under SWD maintenance mandate. &mdash; Filed via SETU.
            </div>

            <div
              className="flex items-center gap-8"
              style={{
                padding: "10px 14px",
                background: "var(--st-healed-wash)",
                borderRadius: "var(--radius-input)",
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={14} color="var(--st-healed-mark)" />
              <span className="text-caption" style={{ color: "var(--st-healed)", fontWeight: 500 }}>
                189 similar complaints filed successfully in this ward
              </span>
            </div>

            <div className="flex items-center gap-12" style={{ flexWrap: "wrap" }}>
              <Link
                href="https://bbmp.gov.in/swd-complaint"
                target="_blank"
                className="btn btn-outline"
              >
                <ExternalLink size={14} />
                Open official channel &rarr;
              </Link>
              <div
                className="flex items-center gap-6"
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  padding: "0 14px",
                  height: 42,
                }}
              >
                <span className="text-caption text-muted" style={{ whiteSpace: "nowrap" }}>
                  Paste reference #
                </span>
                <input
                  type="text"
                  placeholder="BBMP-SWD-..."
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text)",
                    outline: "none",
                    width: 130,
                  }}
                />
                <button className="btn btn-ghost btn-sm" style={{ padding: "0 6px" }}>
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── OVERDUE BANNER ── */}
        {isOverdue && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="feedback--negative"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 24px",
              borderRadius: "var(--radius-card)",
              marginBottom: 32,
            }}
          >
            <AlertTriangle size={18} />
            <span style={{ flex: 1, fontWeight: 500 }}>
              This is overdue by 3 days &mdash; share to add pressure
            </span>
            <button className="btn btn-report btn-sm">
              <Share2 size={14} />
              Share
            </button>
          </motion.div>
        )}

        {/* ── ACCOUNTABILITY TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="card"
          style={{ padding: 24, marginBottom: 32 }}
        >
          <div className="flex items-center gap-8" style={{ marginBottom: 20 }}>
            <Users size={16} color="var(--text-2)" />
            <h3 className="text-h3" style={{ color: "var(--text)" }}>
              Accountability Timeline
            </h3>
          </div>

          <div className="spine-wrapper">
            {TIMELINE.map((item, i) => (
              <div key={item.ref} className="spine-node">
                {i < TIMELINE.length - 1 && <div className="spine-rail" />}
                <div
                  className={`spine-dot spine-dot--${item.dot}`}
                  style={
                    item.dot === "in-progress"
                      ? { boxShadow: "0 0 0 4px rgba(18,86,79,.12)" }
                      : undefined
                  }
                />
                <div className="spine-body">
                  <div className="flex items-center gap-12" style={{ marginBottom: 3 }}>
                    <span
                      className="text-label text-mono"
                      style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
                    >
                      {item.ref}
                    </span>
                    <span className="text-caption text-muted">{item.date}</span>
                  </div>
                  <p className="text-caption text-2">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CITIZEN DOT-MAP ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="card"
          style={{ padding: 24, marginBottom: 32 }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <div className="flex items-center gap-8">
              <Users size={16} color="var(--text-2)" />
              <h3 className="text-h3" style={{ color: "var(--text)" }}>
                Affected Citizens
              </h3>
            </div>
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-6">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--action)",
                    display: "inline-block",
                  }}
                />
                <span className="text-caption text-2">Filed (189)</span>
              </div>
              <div className="flex items-center gap-6">
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    border: "1.5px solid var(--text-3)",
                    display: "inline-block",
                  }}
                />
                <span className="text-caption text-2">Not yet (58)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              aspectRatio: "2.6 / 1",
              maxHeight: 280,
              background: "var(--bg-alt)",
              borderRadius: "var(--radius-input)",
              border: "1px solid var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {CITIZEN_DOTS.map((dot, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${dot.y}%`,
                  left: `${dot.x}%`,
                  width: dot.filed ? 6 : 5,
                  height: dot.filed ? 6 : 5,
                  borderRadius: "50%",
                  background: dot.filed ? "var(--action)" : "transparent",
                  border: dot.filed ? "none" : "1.5px solid var(--text-3)",
                  opacity: dot.filed ? 0.75 : 0.5,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                background: "var(--bg-raised)",
                borderRadius: "var(--radius-pill)",
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-2)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Ward 187 &amp; surrounding
            </div>
          </div>
        </motion.div>

        {/* ── Share ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ textAlign: "center", paddingBottom: 20 }}
        >
          <button className="btn btn-ghost">
            <Share2 size={16} />
            Share this pressure thread
          </button>
        </motion.div>
      </div>
    </div>
  );
}
