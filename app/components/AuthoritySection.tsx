"use client";

import { motion } from "framer-motion";
import { Building2, Phone, Clock, AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import type { AuthorityInfo } from "@/lib/mock-data";

interface AuthoritySectionProps {
  authority: AuthorityInfo;
}

const STATUS_META: Record<
  AuthorityInfo["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle }
> = {
  "within-sla": {
    label: "Within SLA",
    color: "var(--st-healed-mark)",
    bg: "var(--st-healed-wash)",
    icon: CheckCircle,
  },
  overdue: {
    label: "Overdue",
    color: "var(--st-failed-mark)",
    bg: "var(--st-failed-wash)",
    icon: AlertTriangle,
  },
  "no-response": {
    label: "No Response",
    color: "var(--st-assess-mark)",
    bg: "var(--st-assess-wash)",
    icon: HelpCircle,
  },
  resolved: {
    label: "Resolved",
    color: "var(--st-healed-mark)",
    bg: "var(--st-healed-wash)",
    icon: XCircle,
  },
};

export function AuthoritySection({ authority }: AuthoritySectionProps) {
  const statusMeta = STATUS_META[authority.status];
  const StatusIcon = statusMeta.icon;
  const isOverdue = authority.status === "overdue" || authority.status === "no-response";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card card-compact"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderColor: isOverdue ? "var(--st-failed-mark)" : "var(--border)",
      }}
    >
      {/* Header with status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-10">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--bg-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Building2 size={20} color="var(--action)" />
          </div>
          <div>
            <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>
              {authority.department}
            </p>
            <p className="text-caption" style={{ color: "var(--text-2)", marginTop: 1 }}>
              {authority.departmentId}
            </p>
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 11px",
            borderRadius: "var(--radius-pill)",
            fontSize: 11.5,
            fontWeight: 600,
            background: statusMeta.bg,
            color: statusMeta.color,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <StatusIcon size={12} />
          {statusMeta.label}
        </span>
      </div>

      {/* SLA info */}
      <div className="flex items-center gap-10">
        <Clock size={15} color="var(--text-3)" style={{ flexShrink: 0 }} />
        <div>
          <p className="text-caption" style={{ color: "var(--text-2)" }}>
            SLA: <span style={{ fontWeight: 600, color: "var(--text)" }}>{authority.sla}</span>
          </p>
          {authority.slaRemaining !== null && (
            <p
              className="text-caption"
              style={{
                color: isOverdue ? "var(--st-failed-mark)" : "var(--st-healed-mark)",
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {authority.slaRemaining > 0
                ? `${authority.slaRemaining} days remaining`
                : `${Math.abs(authority.slaRemaining)} days overdue`}
            </p>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p className="text-label-up text-2" style={{ marginBottom: 2 }}>
          Contact
        </p>
        <div className="flex items-center gap-10">
          <Phone size={15} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <div>
            <p className="text-label" style={{ color: "var(--text)", fontWeight: 600 }}>
              {authority.contactName}
            </p>
            <p className="text-caption" style={{ color: "var(--text-2)" }}>
              {authority.contactDesignation}
            </p>
          </div>
        </div>
      </div>

      {/* Overdue warning banner */}
      {isOverdue && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: "var(--radius-input)",
            background: "var(--st-failed-wash)",
            color: "var(--st-failed-mark)",
            fontSize: 13,
            fontWeight: 500,
            border: "1px solid rgba(194,90,30,.15)",
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          This wound is past its SLA window and requires escalation.
        </div>
      )}
    </motion.div>
  );
}
