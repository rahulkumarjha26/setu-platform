"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";

const BROKEN_IMAGE_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect width="100" height="100" fill="#f4f4f5" rx="6"/>' +
    '<g transform="translate(50,50)" fill="none" stroke="#a1a1aa" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M-16,-7 L-10,-7 L-8,-12 L8,-12 L10,-7 L16,-7 C19,-7 21,-5 21,-2 L21,10 C21,13 19,15 16,15 L-16,15 C-19,15 -21,13 -21,10 L-21,-2 C-21,-5 -19,-7 -16,-7 Z"/>' +
    '<circle cx="0" cy="4" r="6"/>' +
    "</g>" +
    "</svg>",
  );

interface ProofGalleryProps {
  images?: string[];
  woundTitle?: string;
}

export function ProofGallery({ images, woundTitle }: ProofGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--bg-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageOff size={24} color="var(--text-3)" />
        </div>
        <p className="text-label" style={{ color: "var(--text-2)" }}>
          Photo evidence not yet available
        </p>
        <p className="text-caption" style={{ color: "var(--text-3)", maxWidth: 280 }}>
          When a verifier uploads before-and-after photos, they&rsquo;ll appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="gallery-scroll">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIdx(idx)}
              style={{
                width: 280,
                flexShrink: 0,
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--bg-alt)",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
              }}
            >
              <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                <img
                  src={url}
                  alt={woundTitle ? `${woundTitle} — photo ${idx + 1}` : `Evidence photo ${idx + 1}`}
                  onError={(e) => { e.currentTarget.src = BROKEN_IMAGE_PLACEHOLDER; }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="text-caption" style={{ fontWeight: 600, color: "var(--text-2)" }}>
                  {idx === 0 ? "Before" : idx === images.length - 1 ? "After" : `Photo ${idx + 1}`}
                </span>
                <span className="text-caption" style={{ color: "var(--text-3)" }}>
                  {idx + 1} / {images.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lightbox-overlay"
            onClick={() => setLightboxIdx(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setLightboxIdx(null);
              if (e.key === "ArrowLeft" && lightboxIdx > 0) {
                setLightboxIdx(lightboxIdx - 1);
              }
              if (e.key === "ArrowRight" && lightboxIdx < images.length - 1) {
                setLightboxIdx(lightboxIdx + 1);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
            tabIndex={-1}
          >
            <button
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
              style={{
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 510,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                color: "#fff",
              }}
            >
              <X size={22} />
            </button>

            {/* Previous */}
            {lightboxIdx > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx - 1);
                }}
                aria-label="Previous photo"
                style={{
                  position: "fixed",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 510,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none",
                  color: "#fff",
                  fontSize: 24,
                }}
              >
                ‹
              </button>
            )}

            {/* Next */}
            {lightboxIdx < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx + 1);
                }}
                aria-label="Next photo"
                style={{
                  position: "fixed",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 510,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none",
                  color: "#fff",
                  fontSize: 24,
                }}
              >
                ›
              </button>
            )}

            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              src={images[lightboxIdx]}
              alt={woundTitle ? `${woundTitle} — photo ${lightboxIdx + 1}` : `Evidence photo ${lightboxIdx + 1}`}
              onError={(e) => { e.currentTarget.src = BROKEN_IMAGE_PLACEHOLDER; }}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "var(--radius-card)",
                objectFit: "contain",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
