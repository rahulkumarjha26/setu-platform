"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { type RoleKey, type StatusKey, type Wound, ACTORS, CATEGORY_META } from "@/lib/mock-data";
import { getHomeFeed, type ActivityEvent } from "@/lib/dashboard";
import { useReportPopup } from "../components/ReportPopupContext";

/* ─── Design tokens (matching the inspiration) ─── */
const T = {
  petrol: "#0C6B5E", emerald: "#12A860", emeraldFg: "#0B7A44", amber: "#F0851E",
  blue: "#2F7CE6", white: "#FFF", ink: "#0E1A16", ink2: "#3D4A44", ink3: "#6B7770",
  fog: "#E4EBE7", mist: "#F1F5F3", petrol50: "#EAF6F3", emerald50: "#E7F6EE",
  blue50: "#E8F1FD", amberGlow: "rgba(240,133,30,.45)",
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  serif: "Fraunces, Georgia, serif", mono: "Geist Mono, monospace",
};

/* ─── SVG icons ─── */
const I = {
  pin: "M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  drop: "M12 2s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z",
  heal: "M3 7h10v2H3z M7 3h2v10H7z",
  active: "M8 2l7 12H1z",
  gov: "M6 2h4v12H6z",
  assess: "M5 2h6v6H5z",
  arr: "M5 12h14M13 6l6 6-6 6",
  home: "M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z",
};
const shapeSVG = (s: string) => ({
  healed: I.heal, "in-progress": I.active, "not-achieved": I.active,
  assessing: I.assess, routed: I.gov, reported: I.assess,
}[s] || I.heal);

const statusPillCls: Record<string, { bg: string; fg: string }> = {
  healed: { bg: T.emerald50, fg: T.emeraldFg },
  "in-progress": { bg: T.petrol50, fg: T.petrol },
  "not-achieved": { bg: "#FBEDE5", fg: "#A63E1C" },
  assessing: { bg: "#FBF0DA", fg: "#8A5A00" },
  routed: { bg: T.blue50, fg: "#1F5AAD" },
  reported: { bg: T.mist, fg: T.ink3 },
};

const nm: Record<string, string> = {
  healed: "Healed", "in-progress": "In Progress", "not-achieved": "Not Achieved",
  assessing: "Assessing", routed: "Routed · Gov", reported: "Reported",
};

/* ─── Odometer counter ─── */
function useOdometer(target: number, duration = 1800, active = true) {
  const [val, setVal] = useState(0);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    if (!activeRef.current) return;
    const start = performance.now();
    const spring = (t: number) => 1 - Math.pow(1 - t, 4);
    let raf: number;
    const f = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(target * spring(p)));
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ─── Cursor glow tracker ─── */
function useGlow(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    };
    el.addEventListener("pointermove", handler);
    return () => el.removeEventListener("pointermove", handler);
  }, [ref]);
}

/* ─── Self-drawing chart path ─── */
function chartPath(): string {
  const pts: [number, number][] = [
    [0, 250], [60, 245], [110, 235], [160, 215],
    [220, 190], [260, 150], [310, 110], [345, 82], [375, 55], [400, 42],
  ];
  return "M" + pts.map(([x, y], i) => i === 0 ? `${x},${y}` : `C${x - 20},${y + 8} ${x - 8},${y - 6} ${x},${y}`).join(" ");
}

/* ─── Hero section ─── */
function Hero({ feed, role }: { feed: ReturnType<typeof getHomeFeed>; role: RoleKey }) {
  const heroRef = useRef<HTMLDivElement>(null);
  useGlow(heroRef);
  const numRef = useRef<HTMLSpanElement>(null);
  const corrRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const heroCfg = {
    citizen: { kick: "The wound you raised", big: 340, bigFmt: (v: number) => v.toLocaleString("en-IN"), line: "families have water again — because you spoke up.", desc: "The Ward 7 handpump was dry for 400 days. Nine days of work brought it back. Verified, and confirmed by your neighbours.", cta: "See its full journey", href: "/wound/SETU-MH-0001", chartNum: 247, chartLabel: "Corroborations · 30 days", chartUnit: "witnesses", chartColor: "#6FD3C2" },
    ngo: { kick: "Your verification record", big: 91, bigFmt: (v: number) => `${v}`, line: "out of 100 — independently confirmed, not self-reported.", desc: "Every figure on your profile is drawn from verified projects. It includes the failures, because a record that shows only wins is one no one should believe.", cta: "See your full record", href: "/profile", chartNum: 28, chartLabel: "Verified outcomes · 8 years", chartUnit: "of 34", chartColor: "#6FD3C2" },
    corporate: { kick: "Your CSR mandate", big: 3.2, bigFmt: (v: number) => `₹${v.toFixed(1)} Cr`, line: "deployed through Setu — to the rupee, auditable.", desc: "Funds move through escrow to the implementer, released only when a verified milestone is met. Every rupee of your obligation reaches the ground — and you can prove it.", cta: "Export board report", href: "/corporate", chartNum: 16, chartLabel: "Verified impact · this fiscal year", chartUnit: "of 19 projects", chartColor: "#6FD3C2" },
    government: { kick: "Jurisdiction status", big: 251, bigFmt: (v: number) => v.toLocaleString("en-IN"), line: "wounds resolved by your offices — and the overdue ones shown openly.", desc: "Citizen-reported duties arrive structured and witnessed. Your resolutions are recorded where residents can see them. An administration that hides its backlog loses trust; one that resolves openly earns it.", cta: "View the overdue queue", href: "/government", chartNum: 61, chartLabel: "Resolution rate · Jalgaon", chartUnit: "percent", chartColor: "#6FD3C2" },
  }[role];

  const bigNum = useOdometer(heroCfg.big, 1800, inView);
  const chartN = useOdometer(heroCfg.chartNum, 2000, inView);

  return (
    <div ref={heroRef} className="hero-glow" style={{
      marginTop: 32, borderRadius: 26, background: T.white,
      border: `1px solid ${T.fog}`, overflow: "hidden", position: "relative",
      boxShadow: "0 1px 2px rgba(14,26,22,.04), 0 8px 24px -16px rgba(14,26,22,.15)",
      display: "grid", gridTemplateColumns: "1.05fr 1fr",
      transition: "box-shadow .5s cubic-bezier(.34,1.56,.64,1), transform .5s cubic-bezier(.34,1.56,.64,1)",
      cursor: "default",
    }}>
      <style>{`
        .hero-glow::before{content:"";position:absolute;width:340px;height:340px;border-radius:50%;pointer-events:none;
          background:radial-gradient(circle,rgba(18,168,96,.14),transparent 70%);left:var(--mx,50%);top:var(--my,50%);
          transform:translate(-50%,-50%);opacity:0;transition:opacity .4s}
        .hero-glow:hover::before{opacity:1}
        .hero-glow:hover{transform:translateY(-3px);box-shadow:0 1px 2px rgba(14,26,22,.04),0 26px 50px -24px rgba(14,26,22,.28)!important}
        .draw-line{fill:none;stroke:${heroCfg.chartColor};stroke-width:2.5;stroke-linecap:round;animation:draw 2s cubic-bezier(.34,1.56,.64,1) .4s forwards}
        @keyframes draw{to{stroke-dashoffset:0}}
        .end-pop{opacity:0;animation:epop .01s 2.2s forwards}
        @keyframes epop{to{opacity:1}}
        .end-pulse{animation:epulse 2s ease-out 2.2s infinite;transform-origin:center}
        @keyframes epulse{0%{r:5;opacity:.8}100%{r:20;opacity:0}}
      `}</style>

      <div style={{ padding: "38px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: T.amber, marginBottom: 18 }}>{heroCfg.kick}</div>
        <div style={{
          fontFamily: "Geist, Inter, sans-serif", fontWeight: 700,
          fontSize: "clamp(3.4rem, 2rem + 5vw, 5rem)",
          letterSpacing: "-.04em", lineHeight: 0.9, color: T.emeraldFg,
          fontVariantNumeric: "tabular-nums",
        }}>
          {heroCfg.bigFmt(bigNum)}
        </div>
        <div style={{
          fontFamily: T.serif, fontSize: "clamp(1.3rem, 1.05rem + 1vw, 1.7rem)",
          fontWeight: 500, letterSpacing: "-.01em", lineHeight: 1.25,
          marginTop: 16, maxWidth: "22ch", color: T.ink,
        }}>
          {heroCfg.line}
        </div>
        <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.6, marginTop: 14, maxWidth: "34ch" }}>{heroCfg.desc}</p>
        <Link href={heroCfg.href} style={{
          marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8,
          color: T.petrol, fontWeight: 600, fontSize: 15, textDecoration: "none",
          transition: "gap .25s cubic-bezier(.34,1.56,.64,1)",
        }}
          onMouseEnter={e => e.currentTarget.style.gap = "13px"}
          onMouseLeave={e => e.currentTarget.style.gap = "8px"}
        >
          {heroCfg.cta}
          <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke={T.petrol} strokeWidth={2.2}>
            <path d={I.arr} />
          </svg>
        </Link>
      </div>

      <div style={{
        position: "relative", background: "linear-gradient(165deg,#0B3B36,#0C6B5E 130%)",
        overflow: "hidden", minHeight: 300,
      }}>
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(111,211,194,.35),transparent 70%)", top: "10%", right: -40 }} />
        <div style={{ position: "absolute", top: 26, left: 28, zIndex: 2 }}>
          <div style={{ color: "#fff", fontFamily: T.mono, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", opacity: 0.65 }}>{heroCfg.chartLabel}</div>
          <div style={{ color: "#fff", fontFamily: "Geist, Inter, sans-serif", fontWeight: 600, fontSize: 28, fontVariantNumeric: "tabular-nums", marginTop: 4 }}>
            {chartN.toLocaleString("en-IN")} <span style={{ fontSize: 15, opacity: 0.6, fontWeight: 500 }}>{heroCfg.chartUnit}</span>
          </div>
        </div>
        <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <path id="chart-line" d={chartPath()} />
          </defs>
          <use href="#chart-line" className="draw-line" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
          <g className="end-pop">
            <circle className="end-pulse" cx="400" cy="42" r="5" fill={heroCfg.chartColor} />
            <circle cx="400" cy="42" r="5" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ─── Standing cards ─── */
function Standing({ feed }: { feed: ReturnType<typeof getHomeFeed> }) {
  const allStats: { label: string; value: string; sub?: string }[] = [feed.headlineStat, ...(feed.supportStats || [])].slice(0, 4);
  return (
    <div className="standing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: 20 }}>
      {allStats.map((s, i) => {
        const numVal = parseInt(s.value.replace(/\D/g, "")) || 0;
        const odometer = useOdometer(numVal, 1400 + i * 200, true);
        return (
          <div key={i} style={{
            background: T.white, border: `1px solid ${T.fog}`, borderRadius: 18,
            padding: "22px 24px", position: "relative", overflow: "hidden",
            transition: "transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .45s cubic-bezier(.34,1.56,.64,1), border-color .3s",
            cursor: "default",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.015)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -22px rgba(14,26,22,.3)"; (e.currentTarget as HTMLElement).style.borderColor = "#6FD3C2"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
          >
            <div style={{ fontFamily: "Geist, Inter, sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1, color: T.ink }}>
              {s.value.startsWith("₹") ? s.value : s.value.includes("%") ? s.value :
                s.value.includes("Cr") ? s.value :
                (s.sub ? `${odometer.toLocaleString("en-IN")}${s.sub}` : odometer.toLocaleString("en-IN"))}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 8, lineHeight: 1.35 }}>{s.label}</div>
            <Sparkline color="#6FD3C2" opacity={0.5} />
          </div>
        );
      })}
    </div>
  );
}

function Sparkline({ color, opacity }: { color: string; opacity: number }) {
  const bars = [30, 50, 42, 68, 55, 85];
  return (
    <div style={{ position: "absolute", right: 16, bottom: 14, display: "flex", alignItems: "flex-end", gap: 2, height: 22, opacity }}>
      {bars.map((h, i) => <span key={i} style={{ width: 3, borderRadius: 1, background: color, display: "block", height: `${h}%` }} />)}
    </div>
  );
}

/* ─── Watch wound card ─── */
function WatchCard({ wound, fills }: { wound: Wound; fills: Record<string, number> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useGlow(cardRef);
  const cls = statusPillCls[wound.status] || statusPillCls.reported;
  const fill = fills[wound.id] ?? 0;

  return (
    <Link href={`/wound/${wound.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div ref={cardRef} className="card-glow" style={{
        background: T.white, border: `1px solid ${T.fog}`, borderRadius: 18,
        padding: "20px 22px", marginBottom: 14, cursor: "pointer",
        position: "relative", overflow: "hidden",
        transition: "transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .45s cubic-bezier(.34,1.56,.64,1), border-color .3s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 18px 40px -22px rgba(14,26,22,.26)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
      >
        <style>{`.card-glow::after{content:"";position:absolute;inset:0;border-radius:18px;pointer-events:none;opacity:0;transition:opacity .4s;background:radial-gradient(220px circle at var(--mx,50%) var(--my,50%),rgba(12,107,94,.07),transparent 65%)}.card-glow:hover::after{opacity:1}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, height: 24, padding: "0 11px",
            borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: ".03em",
            textTransform: "uppercase", background: cls.bg, color: cls.fg,
          }}>
            <svg viewBox="0 0 16 16" width={11} height={11} fill="currentColor"><path d={shapeSVG(wound.status)} /></svg>
            {nm[wound.status]}
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3 }}>{CATEGORY_META[wound.category]?.label}</span>
        </div>
        <h4 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 500, letterSpacing: "-.01em", lineHeight: 1.28, margin: 0, color: T.ink }}>{wound.title}</h4>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.ink3, marginTop: 7 }}>{wound.place} · {wound.corroborations} witnesses</div>
        <div style={{ height: 6, background: T.mist, borderRadius: 999, marginTop: 15, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 999, width: `${fill}%`, transition: "width 1.1s cubic-bezier(.34,1.56,.64,1)", background: wound.status === "routed" ? T.blue : wound.status === "healed" ? T.emerald : `linear-gradient(90deg,${T.petrol},#6FD3C2)` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 11, fontSize: 13 }}>
          <span style={{ fontWeight: 500, color: T.ink2 }}>{wound.status === "healed" ? "Confirmed by community" : wound.status === "routed" ? "Awaiting department response" : wound.status === "in-progress" ? "Verifier assigned" : "Under review"}</span>
          <span style={{ fontFamily: T.mono, fontSize: 12, color: T.ink3 }}>{wound.date}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Rising across India rows ─── */
function RisingRow({ wound }: { wound: Wound }) {
  const c = statusPillCls[wound.status] || statusPillCls.reported;
  const randomBars = [30, 45, 60, 40, 72, 90];
  return (
    <Link href={`/wound/${wound.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "16px 8px",
        borderBottom: `1px solid ${T.fog}`, cursor: "pointer",
        transition: "background .3s, padding-left .3s cubic-bezier(.34,1.56,.64,1)",
        borderRadius: 12,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.white; (e.currentTarget as HTMLElement).style.paddingLeft = "16px"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.paddingLeft = "8px"; }}
      >
        <span style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${c.fg}18`, transition: "transform .4s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={c.fg} strokeWidth={2}><path d={I.drop} /></svg>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 500, letterSpacing: "-.01em", color: T.ink }}>{wound.title}</div>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.ink3, marginTop: 3 }}>{wound.place} · {wound.corroborations} witnesses</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20, width: 46, flexShrink: 0 }}>
          {randomBars.map((h, i) => <span key={i} style={{ flex: 1, borderRadius: 1, background: i === randomBars.length - 1 ? T.amber : "#6FD3C2", display: "block", height: `${h}%` }} />)}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase", flexShrink: 0, color: c.fg }}>{nm[wound.status]}</span>
      </div>
    </Link>
  );
}

/* ─── Live feed ─── */
function LiveFeed({ items, role }: { items: ActivityEvent[]; role: RoleKey }) {
  const [stream, setStream] = useState<{ text: string; time: string; color: string; isNew: boolean }[]>([]);
  const { open } = useReportPopup();

  const seedColors = ["#12A860", "#2F7CE6", "#F0851E"];
  const seedItems = items.slice(0, 4).map((item, i) => ({
    text: item.text, time: item.time, color: seedColors[i % 3], isNew: false,
  }));
  const streamPool = [
    { text: "A neighbour just corroborated your report", time: "now", color: "#F0851E" },
    { text: "A wound near you was marked healed", time: "now", color: "#12A860" },
    { text: "Your report was viewed by an NGO", time: "now", color: "#0C6B5E" },
    { text: "A verifier is en route to your wound", time: "now", color: "#2F7CE6" },
    { text: "Someone just filed a corroboration near you", time: "now", color: "#F0851E" },
  ];

  useEffect(() => {
    setStream(seedItems);
    const iv = setInterval(() => {
      const next = streamPool[Math.floor(Math.random() * streamPool.length)];
      setStream(prev => [{ ...next, isNew: true, text: `${next.text} ${Math.floor(Math.random() * 20 + 1)}` }, ...prev.slice(0, 4)]);
    }, 3600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      background: T.white, border: `1px solid ${T.fog}`, borderRadius: 20,
      padding: 22, boxShadow: "0 1px 2px rgba(14,26,22,.04)",
    }}>
      <div style={{ fontFamily: T.serif, fontSize: 17, fontWeight: 600, marginBottom: 4, color: T.ink }}>Live activity</div>
      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 18, display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, animation: "beat 2s infinite", boxShadow: "0 0 0 0 rgba(18,168,96,.5)" }} />
        updating in real time
      </div>
      <div>
        {stream.map((s, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "12px 0",
            borderBottom: i < stream.length - 1 ? `1px solid ${T.fog}` : "none",
          }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, marginTop: 5, background: s.color }} />
            <div>
              <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.45 }}>{s.text}</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, marginTop: 3 }}>{s.time}</div>
            </div>
          </div>
        ))}
        {/* Quick-access links to Pulse and Flow */}
        <div className="flex items-center" style={{ gap: 6, marginTop: 16, flexWrap: "wrap" }}>
          <Link
            href="/pulse"
            className="chip"
            style={{ textDecoration: "none", fontSize: 12, gap: 4 }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--st-healed-mark)", display: "inline-block" }} />
            Pulse
          </Link>
          <Link
            href="/flow"
            className="chip"
            style={{ textDecoration: "none", fontSize: 12, gap: 4 }}
          >
            <RefreshCw size={11} />
            Flow
          </Link>
        </div>
      </div>
      <button
        onClick={open}
        style={{
          marginTop: 20, width: "100%", height: 52, borderRadius: 999,
          background: T.amber, color: "#fff", fontWeight: 600, fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          boxShadow: `0 10px 26px -8px ${T.amberGlow}`,
          transition: "transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s cubic-bezier(.34,1.56,.64,1)",
          border: "none", cursor: "pointer", fontFamily: "inherit",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 18px 34px -8px ${T.amberGlow}`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
      >
        <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="#fff" strokeWidth={2.4}><path d="M12 5v14M5 12h14" /></svg>
        Report a wound
      </button>
    </div>
  );
}

/* ─── PAGE ─── */
export default function HomePage() {
  const [role, setRole] = useState<RoleKey>("citizen");
  const feed = getHomeFeed(role);
  const a = ACTORS[role];
  const { open } = useReportPopup();

  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Animate progress fills on watch cards
  const [fills, setFills] = useState<Record<string, number>>({});
  useEffect(() => {
    setFills({});
    const wounds = feed.modules
      .filter(m => m.type !== "activity")
      .flatMap(m => m.items) as Wound[];
    const timeout = setTimeout(() => {
      const newFills: Record<string, number> = {};
      wounds.forEach((w, i) => { newFills[w.id] = Math.floor(Math.random() * 40 + 40); });
      setFills(newFills);
    }, 400);
    return () => clearTimeout(timeout);
  }, [role]);

  const roles: { key: RoleKey; label: string }[] = [
    { key: "citizen", label: "Citizen" },
    { key: "ngo", label: "NGO" },
    { key: "corporate", label: "Corporate" },
    { key: "government", label: "Government" },
  ];

  const watchModule = feed.modules.find(m => m.type === "your-wounds" || m.type === "jurisdiction" || m.type === "matched" || m.type === "your-projects");
  const trendingModule = feed.modules.find(m => m.type === "trending");
  const activityItems = feed.modules.find(m => m.type === "activity")?.items as ActivityEvent[] || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes beat{0%{box-shadow:0 0 0 0 rgba(18,168,96,.5)}70%{box-shadow:0 0 0 7px rgba(18,168,96,0)}100%{box-shadow:0 0 0 0 rgba(18,168,96,0)}}
      `}</style>

      <div className="mob-px-16" style={{ maxWidth: 1060, margin: "0 auto", padding: "40px 32px 60px", backgroundImage: "radial-gradient(60% 40% at 80% -5%,rgba(111,211,194,.10),transparent 60%)" }}>
        {/* Dev role switcher */}
        <div className="mob-hide" style={{
          position: "fixed", top: 16, right: 20, zIndex: 50,
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(14,26,22,.06)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(14,26,22,.08)", borderRadius: 999,
          padding: "3px 4px 3px 12px",
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#9AA09A", marginRight: 4 }}>view as</span>
          {roles.map(r => (
            <button key={r.key} onClick={() => setRole(r.key)} style={{
              height: 26, padding: "0 11px", borderRadius: 999,
              fontSize: 11.5, fontWeight: 500, fontFamily: "inherit",
              color: role === r.key ? "#fff" : "#6B7770",
              background: role === r.key ? "#0E1A16" : "transparent",
              border: "none", cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap",
            }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.05 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: T.ink3, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: T.ink2 }}>{a.roleLabel}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.fog }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.emerald50, color: T.emeraldFg, fontWeight: 600, fontSize: 11, padding: "3px 12px 3px 9px", borderRadius: 999, letterSpacing: ".03em", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, animation: "beat 2s infinite" }} />
              live
            </span>
          </div>
          <h1 style={{
            fontFamily: T.serif, fontSize: "clamp(2rem, 1.5rem + 2vw, 2.9rem)",
            fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: T.ink,
          }}>
            {timeOfDay()}, {a.name.split(" ")[0]}.
          </h1>
          <p style={{
            fontFamily: T.serif, fontStyle: "italic", color: T.ink2,
            fontSize: "clamp(1.05rem, .95rem + .5vw, 1.25rem)", marginTop: 10, lineHeight: 1.4,
          }}>
            {role === "citizen" ? "Here is what your courage changed today."
              : role === "ngo" ? "Wounds that match your work, and the difference you made."
              : role === "corporate" ? "Your mandate, matched to need — with the proof to show."
              : "Duties routed to you, and what your offices delivered."}
          </p>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.12 }}>
          <Hero feed={feed} role={role} />
        </motion.div>

        {/* Standing */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.2 }}>
          <Standing feed={feed} />
        </motion.div>

        {/* Two-column */}
        <div className="split-right-sidebar" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 26, marginTop: 38, alignItems: "start" }}>
          {/* Main */}
          <div>
            {watchModule && (
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.3 }}>
                <h2 style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 16, color: T.ink }}>
                  {watchModule.title}
                </h2>
                {(watchModule.items as Wound[]).map(w => <WatchCard key={w.id} wound={w} fills={fills} />)}
              </motion.div>
            )}

            {trendingModule && (
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.4 }}>
                <h2 style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, letterSpacing: "-.01em", marginTop: 30, marginBottom: 4, color: T.ink }}>Rising across India</h2>
                <div style={{ borderTop: `1px solid ${T.fog}`, marginTop: 20 }}>
                  {(trendingModule.items as Wound[]).map(w => <RisingRow key={w.id} wound={w} />)}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right rail */}
          <motion.div style={{ position: "sticky", top: 24 }} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: T.spring, delay: 0.34 }}>
            <LiveFeed items={activityItems} role={role} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
