"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { VerificationEvent } from "@/lib/mock-data";

interface VerificationEventCardProps {
  event: VerificationEvent;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const OUTCOME_META: Record<
  VerificationEvent["outcome"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle }
> = {
  pass: {
    label: "Pass",
    color: "var(--st-healed-mark)",
    bg: "var(--st-healed-wash)",
    icon: CheckCircle,
  },
  fail: {
    label: "Fail",
    color: "var(--st-failed-mark)",
    bg: "var(--st-failed-wash)",
    icon: XCircle,
  },
  partial: {
    label: "Partial",
    color: "var(--st-assess-mark)",
    bg: "var(--st-assess-wash)",
    icon: AlertTriangle,
  },
};

export function VerificationEventCard({ event }: VerificationEventCardProps) {
  const outcome = OUTCOME_META[event.outcome];
  const OutcomeIcon = outcome.icon;
  const initials = getInitials(event.verifierName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card card-compact"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-12">
          {/* Avatar */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {initials}
          </div>
          <div>
            <p className="text-label" style={{ color: "var(--text)", fontWeight: 600 }}>
              {event.verifierName}
            </p>
            <p className="text-caption" style={{ color: "var(--text-2)", marginTop: 1 }}>
              {event.verifierRole}
            </p>
            <p className="text-caption" style={{ color: "var(--text-3)", marginTop: 2 }}>
              {formatDate(event.date)}
            </p>
          </div>
        </div>

        {/* Outcome badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 11px",
            borderRadius: "var(--radius-pill)",
            fontSize: 12,
            fontWeight: 600,
            background: outcome.bg,
            color: outcome.color,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <OutcomeIcon size={13} />
          {outcome.label}
        </span>
      </div>

      {/* Notes */}
      {event.notes && (
        <p className="text-body" style={{ color: "var(--text-2)", lineHeight: 1.65 }}>
          {event.notes}
        </p>
      )}

      {/* Evidence thumbnails */}
      {event.evidenceUrls && event.evidenceUrls.length > 0 && (
        <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
          {event.evidenceUrls.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 72,
                height: 72,
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--bg-alt)",
                display: "block",
                flexShrink: 0,
              }}
            >
              <img
                src={url}
                alt={`Evidence ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
