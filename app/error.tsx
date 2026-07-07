"use client"

import { motion } from "framer-motion"
import { TriangleAlert } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "60vh", padding: 32 }}>
      <motion.div
        className="card flex-col items-center"
        style={{ padding: "48px 40px", textAlign: "center", maxWidth: 420, width: "100%" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-card)",
            background: "var(--st-failed-wash)",
            color: "var(--report)",
            marginBottom: 24,
          }}
        >
          <TriangleAlert size={28} />
        </div>

        <h1 className="text-h1 text-carbon" style={{ marginBottom: 8 }}>
          Something went wrong
        </h1>

        <p className="text-body text-2" style={{ marginBottom: 32, lineHeight: 1.6 }}>
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>

        <button className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
      </motion.div>
    </div>
  )
}
