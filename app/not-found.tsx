"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "60vh", padding: 32 }}>
      <motion.div
        className="card flex-col items-center"
        style={{ padding: "48px 40px", textAlign: "center", maxWidth: 420, width: "100%" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-h1 text-carbon" style={{ marginBottom: 8 }}>
          404
        </h1>

        <p className="text-h3 text-2" style={{ marginBottom: 24 }}>
          Page not found
        </p>

        <p className="text-body text-2" style={{ marginBottom: 32, lineHeight: 1.6 }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>

        <Link href="/home" className="btn btn-primary">
          <Home size={16} />
          Back to home
        </Link>
      </motion.div>
    </div>
  )
}
