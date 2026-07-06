"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowUpRight, Lock } from "lucide-react";
import { useReportPopup } from "./ReportPopupContext";

const SIMULATED_PHRASE =
  "The water pump near the school has been dry for months. We fetch water from far away.";

export function ReportPopup() {
  const { isOpen, close } = useReportPopup();

  // Form state
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category] = useState("water");

  const taRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setText("");
      setRecording(false);
      setSubmitted(false);
    }
  }, [isOpen]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const startRec = useCallback(() => {
    setRecording(true);
    // Auto-stop after 2.6s
    timerRef.current = setTimeout(() => stopRec(true), 2600);
  }, []);

  const stopRec = useCallback(
    (fill = true) => {
      setRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typerRef.current) clearInterval(typerRef.current);
      if (fill) {
        let i = 0;
        typerRef.current = setInterval(() => {
          setText(SIMULATED_PHRASE.slice(0, i));
          i += 2;
          if (i > SIMULATED_PHRASE.length) {
            setText(SIMULATED_PHRASE);
            if (typerRef.current) clearInterval(typerRef.current);
          }
        }, 16);
      }
    },
    [],
  );

  const handleMicClick = () => {
    if (recording) {
      stopRec(true);
    } else {
      startRec();
    }
  };

  const handlePost = () => {
    stopRec(false);
    setSubmitted(true);
  };

  const canPost = text.trim().length >= 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(14,26,22,.28)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Popup — centered with flex, no CSS transform conflicts */}
          <div className="report-popup-wrapper" style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="report-popup-card"
            style={{
              pointerEvents: "auto",
              width: 480,
              maxWidth: "calc(100% - 32px)",
              background: "var(--bg-raised)",
              borderRadius: 28,
              boxShadow: "0 40px 90px -30px rgba(14,26,22,.45), 0 0 0 1px rgba(14,26,22,.04)",
              padding: 28,
            }}
          >
            <div style={{ position: "relative" }}>
              {!submitted ? (
                /* ===== FORM ===== */
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between" style={{ marginBottom: 18 }}>
                    <div>
                      <div
                        className="text-serif"
                        style={{
                          fontSize: 25,
                          fontWeight: 500,
                          letterSpacing: "-.01em",
                          lineHeight: 1.15,
                          color: "var(--text)",
                        }}
                      >
                        What's wrong?
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-2)",
                          marginTop: 6,
                          lineHeight: 1.45,
                          maxWidth: "34ch",
                        }}
                      >
                        Just say it, in any language. Setu figures out the rest.
                      </p>
                    </div>
                    <button
                      onClick={close}
                      aria-label="Close"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "var(--bg-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <X size={16} color="var(--text-2)" />
                    </button>
                  </div>

                  {/* Location chip */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 9,
                      background: "var(--c-p-50)",
                      borderRadius: "var(--radius-pill)",
                      padding: "8px 8px 8px 14px",
                      margin: "20px 0 16px",
                      maxWidth: "100%",
                    }}
                  >
                    <MapPin size={15} color="var(--action)" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--action)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Ward 7, Jalgaon
                    </span>
                    <button
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--action)",
                        background: "var(--bg-raised)",
                        borderRadius: "var(--radius-pill)",
                        padding: "5px 11px",
                        flexShrink: 0,
                      }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Textarea + Mic field */}
                  <div
                    className={`report-field${recording ? " report-field--rec" : ""}`}
                    style={{
                      position: "relative",
                      border: recording
                        ? "1.5px solid var(--report)"
                        : "1.5px solid var(--border)",
                      borderRadius: 20,
                      background: "var(--bg-raised)",
                      transition: "border-color .2s, box-shadow .2s",
                      boxShadow: recording
                        ? "0 0 0 4px rgba(194,90,30,.12)"
                        : "none",
                    }}
                  >
                    <textarea
                      ref={taRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Speak or type… e.g. the water pump near the school has been dry for months"
                      style={{
                        width: "100%",
                        minHeight: 96,
                        border: "none",
                        outline: "none",
                        resize: "none",
                        background: "none",
                        fontFamily: "var(--font-ui)",
                        fontSize: 17,
                        lineHeight: 1.5,
                        color: "var(--text)",
                        padding: "18px 66px 18px 18px",
                      }}
                      rows={3}
                    />
                    <button
                      onClick={handleMicClick}
                      aria-label="Tap to speak"
                      className={`report-mic${recording ? " report-mic--rec" : ""}`}
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 12,
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: recording ? "var(--report)" : "var(--report)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 20px -6px rgba(194,90,30,.45)",
                        transition: "transform .15s, background .15s",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      {recording && (
                        <>
                          <span className="report-mic-ring" style={{ animationDelay: "0s" }} />
                          <span className="report-mic-ring" style={{ animationDelay: ".5s" }} />
                        </>
                      )}
                      <MicIcon />
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--report)",
                      fontWeight: 600,
                      marginTop: 10,
                      height: 16,
                      opacity: recording ? 1 : 0,
                      transition: "opacity .2s",
                    }}
                  >
                    Listening… tap the mic again to stop
                  </div>

                  {/* Post button */}
                  <button
                    onClick={handlePost}
                    disabled={!canPost}
                    style={{
                      width: "100%",
                      height: 54,
                      borderRadius: "var(--radius-pill)",
                      background: canPost ? "var(--report)" : "var(--border)",
                      color: canPost ? "#fff" : "var(--text-3)",
                      fontSize: 16,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 9,
                      marginTop: 20,
                      cursor: canPost ? "pointer" : "not-allowed",
                      border: "none",
                      boxShadow: canPost
                        ? "0 10px 26px -8px rgba(194,90,30,.45)"
                        : "none",
                      transition: "all .2s",
                      fontFamily: "inherit",
                    }}
                  >
                    Post{" "}
                    <ArrowUpRight size={19} />
                  </button>

                  {/* Privacy reassurance */}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      color: "var(--text-3)",
                      marginTop: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                    }}
                  >
                    <Lock size={14} />
                    We never share your name or number.
                  </p>
                </>
              ) : (
                /* ===== SUCCESS ===== */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ textAlign: "center", padding: "12px 4px 4px" }}
                >
                  {/* Checkmark circle */}
                  <div
                    className="report-check-circle"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "var(--st-healed-mark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "8px auto 0",
                      boxShadow: "0 14px 34px -10px rgba(18,168,96,.5)",
                    }}
                  >
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="report-check-draw"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>

                  <h2
                    className="text-serif"
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: "-.01em",
                      margin: "22px 0 10px",
                      lineHeight: 1.15,
                      color: "var(--text)",
                    }}
                  >
                    It's on the map.
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text-2)",
                      lineHeight: 1.5,
                      maxWidth: "34ch",
                      margin: "0 auto",
                    }}
                  >
                    You didn't fill a form — you refused to accept something as
                    normal. Setu takes it from here.
                  </p>

                  {/* Category recognition */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "var(--bg-muted)",
                      borderRadius: "var(--radius-pill)",
                      padding: "9px 15px",
                      marginTop: 20,
                      fontSize: 13,
                      color: "var(--text-2)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--action)",
                        flexShrink: 0,
                      }}
                    />
                    Recognised as a{" "}
                    <b style={{ color: "var(--text)", fontWeight: 600 }}>
                      {category}
                    </b>{" "}
                    problem · sorting who can help
                  </div>

                  {/* Action buttons */}
                  <div className="report-actions" style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    <button
                      onClick={close}
                      style={{
                        flex: 1,
                        height: 50,
                        borderRadius: "var(--radius-pill)",
                        background: "var(--action)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Watch it move{" "}
                      <ArrowUpRight size={17} />
                    </button>
                    <button
                      onClick={close}
                      style={{
                        height: 50,
                        padding: "0 22px",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--bg-raised)",
                        border: "1px solid var(--border)",
                        fontWeight: 600,
                        fontSize: 15,
                        color: "var(--text-2)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          </div>{/* /report-popup-wrapper */}

          <style jsx>{`
            /* Mobile: bottom sheet instead of centered */
            @media (max-width: 560px) {
              .report-popup-wrapper {
                align-items: flex-end !important;
                padding-bottom: 0 !important;
              }
              .report-popup-card {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 26px 26px 0 0 !important;
                padding: 24px 20px calc(24px + env(safe-area-inset-bottom)) !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
                margin-bottom: 0 !important;
              }
              .report-popup-card .report-actions {
                flex-direction: column !important;
              }
              .report-popup-card .report-actions button {
                width: 100% !important;
              }
            }

            .report-mic-ring {
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 2px solid var(--report);
              opacity: 0;
              animation: report-ring 1.5s ease-out infinite;
            }
            @keyframes report-ring {
              0% {
                inset: 0;
                opacity: 0.55;
              }
              100% {
                inset: -22px;
                opacity: 0;
              }
            }

            .report-check-circle {
              animation: report-pop .5s cubic-bezier(.34,1.6,.64,1);
            }
            @keyframes report-pop {
              0% { transform: scale(0); }
              100% { transform: scale(1); }
            }

            .report-check-draw path {
              stroke-dasharray: 40;
              stroke-dashoffset: 40;
              animation: report-draw .5s .25s forwards;
            }
            @keyframes report-draw {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

/* Inline SVG mic icon */
function MicIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="#fff"
    >
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path
        d="M19 10v1a7 7 0 0 1-14 0v-1"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18v3"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
