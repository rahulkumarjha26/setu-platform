"use client";

import { motion } from "framer-motion";
import { MapPin, RefreshCw, AlertTriangle } from "lucide-react";

export default function StatesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container" style={{ paddingTop: 56 }}>
        <h1 className="text-display" style={{ marginBottom: 8 }}>
          System States
        </h1>
        <p className="text-body text-2" style={{ marginBottom: 40 }}>
          Empty, loading, and error patterns used across the platform.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {/* EMPTY STATE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="card relative"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "56px 32px",
              textAlign: "center",
            }}
          >
            <span
              className="text-label-up text-3"
              style={{ position: "absolute", top: 16, right: 20 }}
            >
              Empty
            </span>
            <div
              className="hatch"
              style={{
                width: 120,
                height: 120,
                borderRadius: 14,
                marginBottom: 28,
              }}
            />
            <h3 className="text-h3" style={{ marginBottom: 8 }}>
              No wounds mapped here yet
            </h3>
            <p className="text-body text-2" style={{ marginBottom: 24, maxWidth: 260 }}>
              Be the first citizen to report a wound in this district.
            </p>
            <button className="btn btn-report">
              <MapPin size={15} />
              Be the first &rarr;
            </button>
          </motion.div>

          {/* LOADING STATE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="card relative"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <span
              className="text-label-up text-3"
              style={{ position: "absolute", top: 16, right: 20, zIndex: 1 }}
            >
              Loading
            </span>

            {/* Skeleton Row 1 */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton" style={{ width: "75%", height: 20 }} />
              <div className="skeleton" style={{ width: "50%", height: 14 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <div className="skeleton" style={{ width: 60, height: 14 }} />
                <div className="skeleton" style={{ width: 80, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 90, height: 22, borderRadius: "var(--radius-pill)" }} />
            </div>

            <hr style={{ margin: "0 24px", border: "none", borderTop: "1px solid var(--border)" }} />

            {/* Skeleton Row 2 */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton" style={{ width: "65%", height: 20 }} />
              <div className="skeleton" style={{ width: "40%", height: 14 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <div className="skeleton" style={{ width: 50, height: 14 }} />
                <div className="skeleton" style={{ width: 70, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 85, height: 22, borderRadius: "var(--radius-pill)" }} />
            </div>

            <hr style={{ margin: "0 24px", border: "none", borderTop: "1px solid var(--border)" }} />

            {/* Skeleton Row 3 */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton" style={{ width: "80%", height: 20 }} />
              <div className="skeleton" style={{ width: "55%", height: 14 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <div className="skeleton" style={{ width: 56, height: 14 }} />
                <div className="skeleton" style={{ width: 90, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 95, height: 22, borderRadius: "var(--radius-pill)" }} />
            </div>

            {/* Loading caption */}
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid var(--border)" }}>
              <p className="text-caption text-3" style={{ textAlign: "center" }}>
                Loading wound data...
              </p>
            </div>
          </motion.div>

          {/* ERROR STATE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="card relative"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "56px 32px",
              textAlign: "center",
            }}
          >
            <span
              className="text-label-up text-3"
              style={{ position: "absolute", top: 16, right: 20 }}
            >
              Error
            </span>
            <AlertTriangle
              size={40}
              color="var(--text-3)"
              style={{ marginBottom: 24 }}
            />
            <h3 className="text-h3" style={{ marginBottom: 8 }}>
              Something went wrong
            </h3>
            <p className="text-body text-2" style={{ marginBottom: 24, maxWidth: 280 }}>
              We couldn&apos;t load this data. It may be a temporary issue.
            </p>
            <button className="btn btn-primary">
              <RefreshCw size={15} />
              Try again
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
