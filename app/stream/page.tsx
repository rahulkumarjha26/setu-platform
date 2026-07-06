"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ChevronDown, Plus, ArrowUp, Check } from "lucide-react";
import { StatusPill } from "../components/StatusPill";
import {
  WOUNDS, STREAM_DATA, STATUS_META, CATEGORY_META,
  type StatusKey, type CategoryKey, type Wound as SharedWound,
} from "@/lib/mock-data";

/* ================================================================
   Combined stream wound type — shared data + stream presentation
   ================================================================ */
interface StreamWound extends SharedWound {
  ago: string;
  near: boolean;
  rising: boolean;
  me: boolean;
  spine: { status: StatusKey; label: string }[];
  comments: { n: string; rl: string; c: string }[];
}

const SEED: StreamWound[] = STREAM_DATA.map(sd => {
  const w = WOUNDS.find(x => x.id === sd.woundId)!;
  return { ...w, ago: sd.ago, near: sd.near, rising: sd.rising, me: false, spine: sd.spine, comments: sd.comments };
});

const STATUS_MARK: Record<StatusKey, string> = {
  "reported": "var(--st-open-mark)", "assessing": "var(--st-assess-mark)",
  "routed": "var(--st-gov-mark)", "in-progress": "var(--st-active-mark)",
  "healed": "var(--st-healed-mark)", "not-achieved": "var(--st-failed-mark)",
};

const ROLE_COLOR: Record<string, string> = {
  Teacher: "var(--st-healed-mark)", Citizen: "var(--st-open-mark)", Verifier: "var(--st-gov-mark)",
};

/* ================================================================
   Shared style constants (keeps everything aligned)
   ================================================================ */
const S = {
  bp: "@media(max-width:900px)",

  /* Top bar */
  topBar: {
    position: "sticky" as const, top: 0, zIndex: 30,
    background: "rgba(252,251,249,.88)",
    backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid var(--border)",
  },
  topBarInner: {
    maxWidth: 1120, margin: "0 auto",
    padding: "14px 28px", display: "flex" as const,
    alignItems: "center", justifyContent: "space-between", gap: 20,
  },

  /* Brand mark */
  brandMark: {
    width: 26, height: 26, borderRadius: "50%",
    background: "var(--action)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  brandMarkInner: {
    width: 9, height: 9, borderRadius: "50%", background: "var(--bg)",
  },

  /* Avatar */
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, var(--c-p-300), var(--action))",
    border: "2px solid var(--bg-raised)",
    boxShadow: "0 0 0 1px var(--border)",
    flexShrink: 0,
  },

  /* Feed head */
  feedHead: {
    marginBottom: 20,
  },

  /* Tab bar */
  tabBar: {
    display: "flex", gap: 0, borderBottom: "1px solid var(--border)",
    marginBottom: 18, overflowX: "auto" as const,
    marginLeft: -4, paddingLeft: 4,
  },

  /* Category chips wrapper */
  chipBar: {
    display: "flex", gap: 8, flexWrap: "wrap" as const,
    marginBottom: 22,
  },

  /* Dispatch card */
  dispatch: {
    background: "var(--bg-raised)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "20px 22px", marginBottom: 14,
    transition: "box-shadow .2s, border-color .2s",
  },

  /* Pill */
  statusPill: {
    display: "inline-flex" as const, alignItems: "center", gap: 6,
    height: 24, padding: "0 11px", borderRadius: "var(--radius-pill)",
    fontSize: 11, fontWeight: 600, letterSpacing: ".03em",
    textTransform: "uppercase" as const,
  },

  /* Category tag */
  catTag: {
    fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-3)",
    textTransform: "capitalize" as const, background: "var(--bg-muted)",
    padding: "3px 9px", borderRadius: "var(--radius-pill)",
  },

  /* Action button */
  actionBtn: {
    display: "inline-flex" as const, alignItems: "center", gap: 7,
    height: 36, padding: "0 15px", borderRadius: "var(--radius-pill)",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: "inherit", transition: "all .15s",
  },

  /* Rail card */
  railCard: {
    background: "var(--bg-raised)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)", padding: 20,
  },

  /* Toast */
  toast: (visible: boolean) => ({
    position: "fixed" as const, bottom: 96, left: "50%",
    transform: `translateX(-50%) translateY(${visible ? -6 : 0}px)`,
    background: "var(--dock-bg)", color: "#fff",
    padding: "12px 20px", borderRadius: "var(--radius-pill)",
    fontSize: 14, fontWeight: 500, zIndex: 70,
    display: "flex", alignItems: "center", gap: 9,
    opacity: visible ? 1 : 0, pointerEvents: "none" as const,
    transition: "opacity .3s, transform .3s",
  }),
};

/* ================================================================
   Component
   ================================================================ */
export default function StreamPage() {
  const [data, setData] = useState<StreamWound[]>(SEED);
  const [tab, setTab] = useState("all");
  const [cats, setCats] = useState<Set<string>>(new Set(["all"]));
  const [sort, setSort] = useState<"recent" | "corr">("recent");
  const [openThreads, setOpenThreads] = useState<Set<string>>(new Set());
  const [showNewPill, setShowNewPill] = useState(false);

  // Compose
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeCat, setComposeCat] = useState("water");
  const [composeTitle, setComposeTitle] = useState("");
  const [composePlace, setComposePlace] = useState("Jalgaon");

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowNewPill(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Filter + sort
  const filtered = data.filter((w) => {
    if (tab === "near" && !w.near) return false;
    if (tab === "rising" && !w.rising) return false;
    if (tab === "healed" && w.status !== "healed") return false;
    if (tab === "not-achieved" && w.status !== "not-achieved") return false;
    if (!cats.has("all") && !cats.has(w.category)) return false;
    return true;
  });
  const sorted = sort === "corr"
    ? [...filtered].sort((a, b) => b.corroborations - a.corroborations)
    : filtered;

  // Handlers
  const toggleMeToo = (id: string) => setData((prev) =>
    prev.map((w) => w.id !== id ? w : w.me
      ? { ...w, me: false, corroborations: w.corroborations - 1 }
      : { ...w, me: true, corroborations: w.corroborations + 1 }));

  const toggleThread = (id: string) => setOpenThreads((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const addComment = (id: string, body: string) => {
    if (!body.trim()) return;
    setData((prev) => prev.map((w) => w.id !== id ? w
      : { ...w, comments: [...w.comments, { n: "You", rl: "Citizen", c: body }] }));
  };

  const handleNewDispatches = () => {
    setData((prev) => [{
      ...WOUNDS[0], id: "live" + Date.now(), status: "reported" as StatusKey, category: "roads" as CategoryKey,
      title: "Pothole reopened after rain — NH-6 bypass",
      place: "Bypass, Jalgaon", ago: "now", near: true, corroborations: 3, rising: true,
      me: false, body: "Reported live moments ago by a commuter. Awaiting classification.",
      spine: [{ status: "reported", label: "now" }], comments: [],
    } as StreamWound, ...prev]);
    setShowNewPill(false);
  };

  const handlePostWound = () => {
    setData((prev) => [{
      ...WOUNDS[0], id: "n" + Date.now(), status: "reported" as StatusKey,
      category: composeCat as CategoryKey,
      title: composeTitle.trim() || "Untitled wound",
      place: composePlace.trim() || "Jalgaon, Maharashtra",
      ago: "now", near: true, corroborations: 1,
      rising: false, me: true,
      body: "Just reported. Awaiting classification by the Legality Engine.",
      spine: [{ status: "reported", label: "now" }], comments: [],
    } as StreamWound, ...prev]);
    setComposeOpen(false); setComposeTitle("");
    setTab("all"); setCats(new Set(["all"]));
    showToast("Your wound is on the map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCatToggle = (cat: string) => setCats((prev) => {
    if (cat === "all") return new Set(["all"]);
    const next = new Set(prev); next.delete("all");
    next.has(cat) ? next.delete(cat) : next.add(cat);
    return next.size === 0 ? new Set(["all"]) : next;
  });

  /* ---- Render ---- */
  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div style={S.topBar}>
        <div style={S.topBarInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={S.brandMark}><div style={S.brandMarkInner} /></div>
            <span className="text-serif" style={{ fontSize: 19, fontWeight: 600, color: "var(--action)" }}>
              सेतु
            </span>
            <span style={{ fontSize: 13, color: "var(--text-2)", borderLeft: "1px solid var(--border)", paddingLeft: 12, display: "flex", alignItems: "center", gap: 6 }}>
              Jalgaon <ChevronDown size={12} />
            </span>
          </div>
          <div style={{ flex: 1, maxWidth: 340, position: "relative", minWidth: 0 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none", zIndex: 1 }} />
            <input
              placeholder="Search wounds, places…"
              style={{
                width: "100%", height: 40, border: "1px solid var(--border)",
                background: "var(--bg-raised)", borderRadius: "var(--radius-pill)",
                padding: "0 16px 0 40px", fontSize: 14, color: "var(--text)",
                outline: "none", fontFamily: "inherit",
                transition: "border-color .15s",
              }}
              onFocus={e => {
                e.target.style.borderColor = "var(--action)";
                e.target.style.boxShadow = "0 0 0 3px rgba(18,86,79,.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <div style={S.avatar} />
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div
        style={{
          maxWidth: 1120, margin: "0 auto",
          padding: "28px 28px 120px",
        }}
        className="layout-split"
      >
        <main>
          {/* Feed head */}
          <div style={S.feedHead}>
            <h1 className="text-serif" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 4, color: "var(--text)" }}>
              The Stream
            </h1>
            <p style={{ color: "var(--text-2)", fontSize: 14 }}>
              What Jalgaon is reporting, corroborating, and healing — right now.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 18, overflowX: "auto", marginLeft: -4, paddingLeft: 4 }}>
            {([["all","All"],["near","Near me"],["rising","Rising"],["healed","Healed"],["not-achieved","Not achieved"]] as [string,string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="stream-tab"
                aria-selected={tab === key}
                style={{ color: tab === key ? "var(--text)" : "var(--text-3)" }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            {([["all","All categories",""],["water","Water",CATEGORY_META.water.icon],["sanitation","Sanitation",CATEGORY_META.sanitation.icon],["roads","Roads",CATEGORY_META.roads.icon],["education","Education",CATEGORY_META.education.icon],["health","Health",CATEGORY_META.health.icon],["elder","Elder",CATEGORY_META.elder.icon]]).map(([cat, label, ip]) => {
              const sel = cats.has(cat as string);
              return (
                <button key={cat as string} onClick={() => handleCatToggle(cat as string)}
                  className={`stream-chip${sel ? " selected" : ""}`}>
                  {ip ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{ __html: ip as string }} /> : null}
                  {label}
                </button>
              );
            })}
          </div>

          {/* New dispatches pill */}
          <AnimatePresence>
            {showNewPill && (
              <motion.button initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleNewDispatches}
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "var(--action)", color: "#fff", border: "none", borderRadius: "var(--radius-pill)", padding: 11, fontSize: 14, fontWeight: 600, marginBottom: 16, boxShadow: "0 6px 18px -6px rgba(18,86,79,.5)", cursor: "pointer", fontFamily: "inherit" }}>
                <ArrowUp size={15} />3 new dispatches
              </motion.button>
            )}
          </AnimatePresence>

          {/* Sort bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>
              <b style={{ color: "var(--text)", fontWeight: 600 }}>{sorted.length}</b> wounds in view
            </p>
            <button onClick={() => setSort(sort === "recent" ? "corr" : "recent")} className="stream-sort">
              {sort === "recent" ? "Most recent " : "Most witnessed "}
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-2)" }}>
              <p className="text-serif" style={{ fontSize: 20, marginBottom: 6, color: "var(--text)" }}>Nothing here yet.</p>
              <p style={{ fontSize: 14 }}>Be the first to report a wound in this filter.</p>
            </div>
          )}

          {/* Dispatch cards */}
          {sorted.map((w) => {
            const sparkHeights = [30, 45, 60, 40, 70, 55, 85, w.rising ? 95 : 50];
            const isOpen = openThreads.has(w.id);

            return (
              <motion.article key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="stream-card">

                {/* Top row — status pill / category / role */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <StatusPill status={w.status} />
                  <span style={S.catTag}>{CATEGORY_META[w.category]?.label || w.category}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--role-citizen)", flexShrink: 0 }} />
                    Citizen · anon
                  </span>
                </div>

                {/* Title */}
                <h2 className="stream-title" onClick={() => toggleThread(w.id)}>
                  <Link href={`/wound/${w.id}`} onClick={e => e.stopPropagation()} style={{ textDecoration: "none", color: "inherit" }}>
                    {w.title}
                  </Link>
                </h2>

                {/* Meta */}
                <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {w.place}
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
                  {w.ago} ago
                </p>

                {/* Body */}
                <p style={{ fontSize: 15, color: "var(--text-2)", marginTop: 10, lineHeight: 1.55 }}>
                  {w.body}
                </p>

                {/* Action bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                  <button onClick={() => toggleMeToo(w.id)}
                    className={`stream-action ${w.me ? "stream-action--active" : "stream-action--default"}`}>
                    {w.me ? <Check size={15} /> : <Plus size={15} />}
                    {w.me ? "Witnessed" : "Me too"} <span className="text-mono" style={{ fontWeight: 500 }}>{w.corroborations}</span>
                  </button>
                  <button onClick={() => toggleThread(w.id)}
                    className="stream-action stream-action--default">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {w.comments.length}
                  </button>

                  {/* Sparkline */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, marginLeft: "auto" }}>
                    {sparkHeights.map((h, i) => (
                      <span key={i} style={{ width: 3, height: `${h}%`, background: w.rising && i === sparkHeights.length - 1 ? "var(--st-assess-mark)" : "var(--c-p-300)", borderRadius: 2, display: "block" }} />
                    ))}
                  </div>
                </div>

                {/* Expandable thread */}
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 16 }}>
                    {/* Mini-spine */}
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                      {w.spine.map((s, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-2)" }}>
                          <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_MARK[s.status], flexShrink: 0 }} />
                          {STATUS_META[s.status].label} · {s.label}
                        </span>
                      ))}
                    </div>

                    {/* Comments */}
                    {w.comments.length > 0 ? w.comments.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, var(--c-p-300), var(--action))" }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                            {c.n}
                            <span className="text-mono" style={{
                              fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em",
                              padding: "1px 6px", borderRadius: "var(--radius-pill)",
                              background: `${ROLE_COLOR[c.rl] || "var(--text-3)"}22`,
                              color: ROLE_COLOR[c.rl] || "var(--text-3)",
                            }}>{c.rl}</span>
                          </div>
                          <div style={{ background: "var(--bg-muted)", borderRadius: 12, padding: "9px 13px", fontSize: 14, color: "var(--text)" }}>
                            {c.c}
                          </div>
                        </div>
                      </div>
                    )) : <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 8 }}>No comments yet — be the first.</p>}

                    <CommentInput onSend={(body: string) => addComment(w.id, body)} />
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </main>

        {/* ===== RIGHT RAIL ===== */}
        <aside className="desktop-only" style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={S.railCard}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              Jalgaon today
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500, color: "var(--st-healed)", background: "var(--st-healed-wash)", padding: "2px 8px", borderRadius: "var(--radius-pill)", textTransform: "uppercase", letterSpacing: ".04em" }}>live</span>
            </h3>
            {[["Wounds open","84",undefined],["Healed this month","12","var(--st-healed)"],["Corroborations","1,204",undefined],["Verified","96%",undefined]].map(([label, value, color], i, arr) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                <span style={{ color: "var(--text-2)" }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: 18, fontVariantNumeric: "tabular-nums", color: (color as string) || "var(--text)" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={S.railCard}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Rising this week</h3>
            {[["1","Handpump dry — Ward 7","↑ 247","30 days"],["2","No girls' toilet — ZP School","↑ 96","rising fast"],["3","Cables slung low — Ward 14","↑ 61","gov-duty"],["4","Open drain near market","↑ 44","this week"]].map(([rank, title, up, meta], i, arr) => (
              <div key={rank as string} className="stream-trend" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="text-mono" style={{ fontSize: 13, color: "var(--text-3)", width: 16, flexShrink: 0 }}>{rank}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="stream-trend-title">{title}</div>
                  <div className="text-mono" style={{ fontSize: 11, color: "var(--text-3)" }}>
                    <span style={{ color: "var(--st-assess-mark)", fontWeight: 600 }}>{up}</span> · {meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile: dock space handled by body paddingBottom */}

      {/* ===== COMPOSE MODAL ===== */}
      <AnimatePresence>
        {composeOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setComposeOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(14,26,22,.4)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg-raised)", borderRadius: 24, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 30px 60px -20px rgba(14,26,22,.4)" }}>
              <h2 className="text-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>Report a wound</h2>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 20 }}>Describe what's broken. Your name is never shared.</p>

              <label className="text-label-up" style={{ display: "block", marginBottom: 8, color: "var(--text-2)" }}>What's wrong?</label>
              <input className="input" placeholder="e.g. Streetlight out on the school lane" value={composeTitle} onChange={e => setComposeTitle(e.target.value)} style={{ borderRadius: 12, marginBottom: 16 }} />

              <label className="text-label-up" style={{ display: "block", marginBottom: 8, color: "var(--text-2)" }}>Where?</label>
              <input className="input" placeholder="Ward, landmark…" value={composePlace} onChange={e => setComposePlace(e.target.value)} style={{ borderRadius: 12, marginBottom: 16 }} />

              <label className="text-label-up" style={{ display: "block", marginBottom: 8, color: "var(--text-2)" }}>Category</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <button key={key} onClick={() => setComposeCat(key)}
                    className={`stream-compose-chip${composeCat === key ? " selected" : ""}`}>
                    {meta.icon ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={meta.icon} /></svg> : null}
                    {meta.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => setComposeOpen(false)} className="btn btn-ghost" style={{ height: 44 }}>Cancel</button>
                <button onClick={handlePostWound} style={{ height: 44, padding: "0 24px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--report)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 16px -4px rgba(194,90,30,.5)" }}>Post my wound</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TOAST ===== */}
      <div style={S.toast(toastVisible)}>
        <Check size={16} style={{ color: "var(--st-healed-mark)" }} />
        {toastMsg}
      </div>
    </>
  );
}

/* ================================================================
   CommentInput
   ================================================================ */
function CommentInput({ onSend }: { onSend: (body: string) => void }) {
  const [val, setVal] = useState("");
  const send = () => { if (!val.trim()) return; onSend(val.trim()); setVal(""); };
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
      <input className="input" placeholder="Add a comment…" value={val}
        onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }}
        style={{ flex: 1, height: 38, borderRadius: "var(--radius-pill)", background: "var(--bg-raised)" }} />
      <button onClick={send} style={{ height: 38, padding: "0 18px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--action)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>Send</button>
    </div>
  );
}
