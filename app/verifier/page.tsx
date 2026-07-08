"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Camera,
  Check,
  Clock,
  WifiOff,
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  X,
  Circle,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

const ASSIGNMENTS = [
  {
    title: "Broken sewage pipe Ward 12",
    place: "Rajaji Nagar, Mysore",
    distance: "0.8 km away",
    deadline: "Today, 18:00",
    urgency: "high" as const,
    status: "assessing" as const,
  },
  {
    title: "Dumped medical waste near school",
    place: "Shivajinagar, Bangalore",
    distance: "1.2 km away",
    deadline: "Tomorrow, 12:00",
    urgency: "high" as const,
    status: "assessing" as const,
  },
  {
    title: "Road cave-in post monsoon",
    place: "Jayanagar 4th Block, Bangalore",
    distance: "2.4 km away",
    deadline: "12 Jul 2026",
    urgency: "medium" as const,
    status: "assessing" as const,
  },
  {
    title: "Tree fall on primary road",
    place: "Koramangala, Bangalore",
    distance: "3.1 km away",
    deadline: "14 Jul 2026",
    urgency: "low" as const,
    status: "assessing" as const,
  },
];

const MILESTONES = [
  "Pump structure intact",
  "Water flowing adequately",
  "Community confirms use",
  "No contamination detected",
];

export default function VerifierPage() {
  const [view, setView] = useState<"list" | "capture" | "verdict">("list");
  const [captureTab, setCaptureTab] = useState<"before" | "during" | "after">("before");
  const [checkedMilestones, setCheckedMilestones] = useState<Set<number>>(new Set([0, 1, 2]));
  const [photoCount, setPhotoCount] = useState(0);
  const [online, setOnline] = useState(true);

  const toggleMilestone = (i: number) => {
    const next = new Set(checkedMilestones);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCheckedMilestones(next);
  };

  const handleCapture = () => {
    if (photoCount < 3) {
      setPhotoCount((c) => c + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        paddingBottom: 0,
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <AnimatePresence mode="wait">
        {view === "capture" || view === "verdict" ? (
          <motion.div
            key="capture"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setView("list")}
                className="btn btn-ghost btn-sm"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: "var(--radius-pill)",
                  background: online ? "var(--st-healed-wash)" : "var(--st-failed-wash)",
                }}
              >
                {online ? (
                  <Circle size={8} fill="var(--st-healed-mark)" color="var(--st-healed-mark)" />
                ) : (
                  <WifiOff size={10} color="var(--st-failed-mark)" />
                )}
                <span className="text-caption" style={{ color: online ? "var(--st-healed-mark)" : "var(--st-failed-mark)", fontWeight: 500 }}>
                  {online ? "Online" : "Offline — will sync when connected"}
                </span>
              </div>
            </div>

            {/* Camera View */}
            <div
              style={{
                flex: 1,
                margin: 16,
                borderRadius: "var(--radius-card)",
                background: "var(--dock-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: 260,
                border: "1px solid var(--dock-sep)",
                overflow: "hidden",
              }}
            >
              {/* Grid overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(color-mix(in srgb, var(--bg-raised) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--bg-raised) 4%, transparent) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Center crosshair */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 60,
                  height: 60,
                  borderColor: "color-mix(in srgb, var(--bg-raised) 25%, transparent)",
                }}
              >
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "color-mix(in srgb, var(--bg-raised) 20%, transparent)" }} />
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "color-mix(in srgb, var(--bg-raised) 20%, transparent)" }} />
              </div>

              {/* GPS */}
              <div
                className="text-mono"
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "color-mix(in srgb, var(--c-carbon) 60%, transparent)",
                  color: "var(--bg-raised)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                25.5941&deg;N, 85.1376&deg;E &middot; 14:32 IST
              </div>

              {/* GPS Locked */}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "color-mix(in srgb, var(--c-carbon) 60%, transparent)",
                  color: "var(--st-healed-mark)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Circle size={7} fill="var(--st-healed-mark)" color="var(--st-healed-mark)" />
                GPS locked
              </div>

              <Camera size={40} color="var(--ghost)" />
            </div>

            {/* Photo count */}
            <p className="text-caption text-3 text-center" style={{ marginBottom: 4 }}>
              {photoCount}/3 photos
            </p>

            {/* Before / During / After Tabs */}
            {view === "capture" && (
              <>
                <div className="tab-group" role="tablist" style={{ margin: "0 auto 16px" }}>
                  {(["before", "during", "after"] as const).map((t) => (
                    <button
                      key={t}
                      role="tab"
                      className="tab-item"
                      aria-selected={captureTab === t}
                      onClick={() => setCaptureTab(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Capture Button */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <button
                    onClick={handleCapture}
                    disabled={photoCount >= 3}
                    aria-label={photoCount >= 3 ? "Maximum photos taken" : "Take photo"}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      border: "4px solid var(--bg-raised)",
                      boxShadow: "0 0 0 4px var(--report), 0 8px 24px color-mix(in srgb, var(--report) 30%, transparent)",
                      background: "var(--report)",
                      cursor: photoCount >= 3 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: photoCount >= 3 ? 0.5 : 1,
                      transition: "transform 0.1s",
                    }}
                  >
                    <Camera size={28} color="var(--bg-raised)" />
                  </button>
                </div>

                <div style={{ padding: "0 20px 20px" }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => setView("verdict")}
                    disabled={photoCount === 0}
                  >
                    Continue to checklist
                  </button>
                </div>
              </>
            )}

            {/* Verdict View */}
            {view === "verdict" && (
              <div style={{ padding: "0 20px 32px" }}>
                {/* Milestone Checklist */}
                <h3 className="text-label-up text-3" style={{ marginBottom: 12 }}>
                  Milestone checklist
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
                  {MILESTONES.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => toggleMilestone(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 16px",
                        borderRadius: "var(--radius-input)",
                        border: "none",
                        cursor: "pointer",
                        background: checkedMilestones.has(i)
                          ? "var(--st-healed-wash)"
                          : "var(--bg-muted)",
                        minHeight: 48,
                        width: "100%",
                        textAlign: "left",
                        fontSize: 14,
                        fontWeight: 500,
                        color: checkedMilestones.has(i)
                          ? "var(--st-healed-mark)"
                          : "var(--text-2)",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: checkedMilestones.has(i)
                            ? "2px solid var(--st-healed-mark)"
                            : "2px solid var(--text-3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: checkedMilestones.has(i)
                            ? "var(--st-healed-mark)"
                            : "transparent",
                          flexShrink: 0,
                        }}
                      >
                        {checkedMilestones.has(i) && <Check size={12} color="var(--bg-raised)" />}
                      </div>
                      {m}
                    </button>
                  ))}
                </div>

                {/* Verdict Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{
                      minHeight: 48,
                      width: "100%",
                      fontSize: 15,
                    }}
                  >
                    <ShieldCheck size={18} />
                    Verified
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{
                      minHeight: 48,
                      width: "100%",
                      fontSize: 15,
                    }}
                  >
                    <X size={18} />
                    Not verified
                  </button>
                  <button
                    style={{
                      minHeight: 48,
                      width: "100%",
                      fontSize: 15,
                      borderRadius: "var(--radius-pill)",
                      border: "1.5px solid var(--report)",
                      background: "transparent",
                      color: "var(--report)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <AlertTriangle size={18} />
                    Dispute
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Assignment List */
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: "40px 24px 0" }}
          >
            <h1 className="text-h1" style={{ marginBottom: 6 }}>Verifier</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
              <Navigation size={14} color="var(--text-3)" />
              <span className="text-caption text-3">Bangalore Urban &middot; 7 assignments today</span>
            </div>

            <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ASSIGNMENTS.map((a) => (
                <motion.button
                  key={a.title}
                  onClick={() => {
                    setPhotoCount(0);
                    setView("capture");
                  }}
                  className="card"
                  style={{
                    padding: 20,
                    textAlign: "left",
                    borderLeft: a.urgency === "high" ? "3px solid var(--report)" : "3px solid transparent",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="text-h3" style={{ fontSize: 15, marginBottom: 6 }}>
                        {a.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                        <span className="text-caption text-2" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} />
                          {a.place}
                        </span>
                        <span className="text-caption text-2" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Navigation size={11} />
                          {a.distance}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={12} color="var(--text-3)" />
                        <span className="text-caption text-3">{a.deadline}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <StatusPill status={a.status} />
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--action)",
                        }}
                      >
                        Verify &rarr;
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
