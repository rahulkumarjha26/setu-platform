"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { StatusPill } from "@/app/components/StatusPill";
import { getPlace, woundsByPlace } from "@/lib/mock-data";

const COVERAGE = [
  { name: "Water", source: "CGWB", done: true },
  { name: "Schools", source: "UDISE", done: true },
  { name: "Elder care", source: null, done: false },
];

const CHART_POINTS = [
  "0,58", "25,56", "50,54", "75,52", "100,50", "125,48",
  "150,45", "175,44", "200,41", "225,40", "250,38", "275,35",
  "300,32", "325,30", "350,28", "375,26", "400,25", "425,23",
  "450,22", "475,20",
];

const GHOST_POINTS = [
  "0,62", "25,60", "50,59", "75,58", "100,57", "125,56",
  "150,55", "175,54", "200,54", "225,53", "250,52", "275,52",
  "300,51", "325,51", "350,50", "375,50", "400,50", "425,49",
  "450,49", "475,49",
];

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function PlacePage() {
  const params = useParams();
  const placeId = (params?.id as string) || "buxar";
  const place = getPlace(placeId);
  const displayName = place?.name || (placeId.charAt(0).toUpperCase() + placeId.slice(1));
  const wounds = woundsByPlace(placeId);

  const total = wounds.length;
  const healed = wounds.filter((w) => w.status === "healed").length;
  const inProgress = wounds.filter((w) => w.status === "in-progress").length;
  const open = wounds.filter((w) => w.status === "reported" || w.status === "assessing").length;

  const METRICS = [
    { label: "Wounds", value: String(total), delta: { val: "\u2014", cls: "delta-flat" } },
    { label: "Healed", value: String(healed), delta: { val: "\u2014", cls: "delta-flat" } },
    { label: "In Progress", value: String(inProgress), delta: { val: "\u2014", cls: "delta-flat" } },
    { label: "Open", value: String(open), delta: { val: "\u2014", cls: "delta-flat" } },
  ];

  return (
    <div
      className="mob-px-16"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 32px 120px",
      }}
    >
      <div style={{ background: "var(--bg-raised)", borderRadius: "var(--radius-card)", padding: 24, marginBottom: 24 }}>
        <nav className="breadcrumb" style={{ marginBottom: 16 }}>
          <Link href="/atlas">India</Link>
          <ChevronRight size={12} />
          <Link href="/atlas">{place?.state || "State"}</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>{displayName}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-12">
          <h1 className="text-display">{displayName}</h1>
          <span
            className="pill pill--active"
            style={{ height: 24, fontSize: 11 }}
          >
            {place?.rank || "Active district"}{place?.focus ? ` · ${place.focus}` : ""}
          </span>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-4 mob-col-2 gap-12"
        style={{ marginBottom: 32 }}
      >
        {METRICS.map((m) => (
          <motion.div
            key={m.label}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="card-metric"
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <span className="text-label-up text-2">{m.label}</span>
            <div className="flex items-center gap-10">
              <span className="text-number" style={{ fontSize: "clamp(1.25rem, 0.9rem + 1.5vw, 1.75rem)" }}>
                {m.value}
              </span>
              <span className={`delta ${m.delta.cls}`}>
                {m.delta.val === "flat" ? "—" : m.delta.val}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap items-center gap-12" style={{ marginBottom: 32 }}>
        {COVERAGE.map((c) => (
          <span
            key={c.name}
            className="pill"
            style={{
              background: c.done ? "var(--c-p-50)" : "var(--c-r-50)",
              color: c.done ? "var(--action)" : "var(--report)",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 12.5,
              height: 30,
              padding: "0 14px",
              gap: 6,
            }}
          >
            {c.name}
            {c.done && (
              <span style={{ fontSize: 11, opacity: 0.7 }}>
                · {c.source} &#10003;
              </span>
            )}
            {!c.done && (
              <>
                &nbsp;— be the first
                <ArrowUpRight size={11} />
              </>
            )}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 32, padding: "24px 24px 20px" }}>
        <p className="text-label-up text-2" style={{ marginBottom: 16 }}>
          Wound Trend — 12 months
        </p>

        <svg
          viewBox="0 0 500 120"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {[20, 40, 60, 80, 100].map((y) => (
            <line
              key={`g-${y}`}
              x1={0} y1={y} x2={500} y2={y}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          <polyline
            fill="none"
            stroke="var(--ghost)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            points={GHOST_POINTS.join(" ")}
          />

          <polyline
            fill="none"
            stroke="var(--action)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={CHART_POINTS.join(" ")}
          />

          <line
            x1={240} y1={100} x2={240} y2={45}
            stroke="var(--report)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle cx={240} cy={45} r={5} fill="var(--bg-raised)" stroke="var(--report)" strokeWidth="1.5" />

          <line
            x1={375} y1={100} x2={375} y2={28}
            stroke="var(--st-healed-mark)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle cx={375} cy={28} r={5} fill="var(--st-healed-wash)" stroke="var(--st-healed-mark)" strokeWidth="1.5" />

          {[0, 45, 90, 135, 180, 225, 275, 320, 365, 410, 455, 500].map((x, i) => (
            <text
              key={`m-${i}`}
              x={x}
              y={118}
              textAnchor="middle"
              fill="var(--text-3)"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {MONTHS[i]}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-4">
        {wounds.map((w, i) => (
          <Link
            key={i}
            href={`/wound/${w.id}`}
            className="card"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 20px",
            }}
          >
            <div className="flex items-center gap-12" style={{ minWidth: 0 }}>
              <StatusPill status={w.status} />
              <div style={{ minWidth: 0 }}>
                <p className="text-body" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {w.title}
                </p>
                <p className="text-caption text-2">{w.place}</p>
              </div>
            </div>
            <span className="text-mono text-2" style={{ whiteSpace: "nowrap", fontSize: 13 }}>
              {w.corroborations} corr.
            </span>
          </Link>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 110,
          right: 32,
          zIndex: 20,
        }}
        className="desktop-only"
      >
        <Link href="/report" className="btn btn-report">
          Report a wound here
        </Link>
      </div>
    </div>
  );
}
