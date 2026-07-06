"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Share2, Printer, FileDown, Check } from "lucide-react";

interface WoundActionBarProps {
  woundId: string;
  woundTitle: string;
}

export function WoundActionBar({ woundId, woundTitle }: WoundActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/wound/${woundId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: try the Share API
      try {
        await navigator.share({ title: woundTitle, url: `/wound/${woundId}` });
      } catch {
        // Both failed — silently handle
      }
    }
  }, [woundId, woundTitle]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center"
      style={{ gap: 4 }}
    >
      {/* Share button */}
      <button
        onClick={handleShare}
        className="btn btn-icon"
        aria-label={copied ? "Copied to clipboard" : "Share wound URL"}
        title="Copy link to clipboard"
        style={{
          color: copied ? "var(--st-healed-mark)" : "var(--text-2)",
          transition: "color 0.2s",
        }}
      >
        {copied ? <Check size={18} /> : <Share2 size={18} />}
      </button>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="btn btn-icon"
        aria-label="Print wound details"
        title="Print this page"
      >
        <Printer size={18} />
      </button>

      {/* Export PDF — coming soon */}
      <div style={{ position: "relative" }}>
        <button
          className="btn btn-icon"
          aria-label="Export as PDF (coming soon)"
          disabled
          style={{ opacity: 0.45, cursor: "not-allowed" }}
        >
          <FileDown size={18} />
        </button>
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--c-carbon)",
            color: "#fff",
            fontSize: 12,
            padding: "5px 10px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.15s",
          }}
          className="group-hover:opacity-100"
          onMouseEnter={() => {}}
        >
          Coming soon
        </span>
      </div>
    </motion.div>
  );
}
