"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  ChevronLeft,
  MapPin,
  ArrowRight,
  Check,
  Droplets,
  Trash2,
  Route,
  Zap,
  UserRound,
  GraduationCap,
  Camera,
} from "lucide-react";

const CATEGORIES = [
  { key: "water", label: "Water", icon: Droplets },
  { key: "sanitation", label: "Sanitation", icon: Trash2 },
  { key: "road", label: "Road", icon: Route },
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "elder", label: "Elder", icon: UserRound },
  { key: "school", label: "School", icon: GraduationCap },
];

const STEP_LABELS = ["Describe", "Category", "Locate", "Evidence", "Review"];

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (step === 3) {
      setLocationConfirmed(false);
      const t = setTimeout(() => setLocationConfirmed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      className="mob-px-16"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 640,
        margin: "0 auto",
        padding: "32px 32px 140px",
        width: "100%",
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-6 text-caption text-2"
        style={{ marginBottom: 24, display: "inline-flex" }}
      >
        <ChevronLeft size={14} />
        Back
      </Link>

      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className="text-label-up"
            style={{
              color: i + 1 === step ? "var(--action)" : "var(--text-3)",
              transition: "color 0.2s",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4" style={{ marginBottom: 48 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ flex: 1, position: "relative" }}>
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "100%",
                  width: 4,
                  height: 2,
                  background: i < step ? "var(--action)" : "var(--border)",
                  transform: "translateY(-50%)",
                }}
              />
            )}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: i < step ? "var(--action)" : "var(--border)",
                transition: "background 0.3s",
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            {step === 1 && (
              <>
                <motion.button
                  animate={{
                    scale: isRecording ? [1, 1.06, 1] : 1,
                    boxShadow: isRecording
                      ? "0 0 0 0 rgba(194,90,30,0.4)"
                      : "0 0 0 0 rgba(194,90,30,0)",
                  }}
                  transition={
                    isRecording
                      ? { repeat: Infinity, duration: 1.5 }
                      : { duration: 0.2 }
                  }
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  onMouseLeave={() => setIsRecording(false)}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "var(--c-r-50)",
                    border: "2px solid var(--report)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Mic size={36} color="var(--report)" />
                </motion.button>

                <p className="text-h3" style={{ textAlign: "center" }}>
                  Hold to speak
                </p>

                <div className="flex items-center gap-8" style={{ width: "100%", maxWidth: 400 }}>
                  <span className="text-caption text-2" style={{ whiteSpace: "nowrap" }}>
                    or type
                  </span>
                  <input
                    className="input"
                    placeholder="Describe the wound..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div className="flex flex-wrap gap-10 justify-center" style={{ maxWidth: 440 }}>
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat.key);
                  return (
                    <motion.button
                      key={cat.key}
                      whileTap={{ scale: 0.94 }}
                      className={`chip${selected ? " selected" : ""}`}
                      onClick={() => toggleCategory(cat.key)}
                      style={{ height: 40, padding: "0 16px", gap: 7 }}
                    >
                      <cat.icon size={15} />
                      {cat.label}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <>
                <div
                  className="card"
                  style={{
                    width: "100%",
                    maxWidth: 360,
                    aspectRatio: "1/1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <MapPin size={32} color="var(--ghost)" />
                  <p className="text-caption text-2">Location preview</p>
                </div>

                <button className="chip" style={{ height: 40, padding: "0 18px", gap: 8 }}>
                  <MapPin size={14} />
                  Use my location
                </button>

                {!locationConfirmed ? (
                  <div className="flex items-center gap-8 text-caption text-2">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--action)",
                        display: "inline-block",
                      }}
                    />
                    Detecting your location...
                  </div>
                ) : (
                  <span className="text-caption" style={{ color: "var(--st-healed)" }}>
                    Ward 7, Buxar, Bihar — confirmed &#10003;
                  </span>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 360,
                    aspectRatio: "4/3",
                    borderRadius: "var(--radius-card)",
                    border: "1.5px dashed var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    cursor: "pointer",
                    background: "var(--bg)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--bg-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera size={20} color="var(--text-2)" />
                  </div>
                  <p className="text-caption text-2">Tap to add photo</p>
                </div>

                <div className="tab-group" style={{ marginTop: 4 }}>
                  <button className="tab-item" aria-selected="true">
                    Before
                  </button>
                  <button className="tab-item">During</button>
                  <button className="tab-item">After</button>
                </div>

                <button className="btn btn-text text-2" style={{ fontSize: 13 }}>
                  Skip for now
                </button>
              </>
            )}

            {step === 5 && (
              <div
                className="flex flex-col gap-20"
                style={{ width: "100%", maxWidth: 400 }}
              >
                <div className="card" style={{ padding: "20px 24px" }}>
                  <p className="text-label-up text-2" style={{ marginBottom: 12 }}>
                    Summary
                  </p>
                  <div className="flex flex-col gap-10">
                    <div>
                      <span className="text-caption text-muted">Description</span>
                      <p className="text-body">
                        {description || "Broken handpump in Ward 7"}
                      </p>
                    </div>
                    <div>
                      <span className="text-caption text-muted">Categories</span>
                      <p className="text-body">
                        {selectedCategories.length > 0
                          ? selectedCategories.join(", ")
                          : "Water, Sanitation"}
                      </p>
                    </div>
                    <div>
                      <span className="text-caption text-muted">Location</span>
                      <p className="text-body">Ward 7, Buxar, Bihar</p>
                    </div>
                  </div>
                </div>

                <p className="text-caption text-2" style={{ textAlign: "center", lineHeight: 1.55 }}>
                  May we map this and show it to donors and the government? We never share
                  your name or number.
                </p>

                <Link href="/wound/1" className="btn btn-primary" style={{ width: "100%", height: 48 }}>
                  Post my wound
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 5 && (
        <div className="flex items-center justify-between" style={{ marginTop: 40 }}>
          <button
            className="btn btn-ghost btn-sm"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            style={{ visibility: step === 1 ? "hidden" : "visible" }}
          >
            <ChevronLeft size={14} />
            Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setStep((s) => Math.min(5, s + 1))}
          >
            {step === 4 ? "Review" : "Next"}
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
