"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/mock-data";
import type { Notification } from "@/lib/mock-data";

const TABS = ["All", "Following", "Nearby"] as const;

const TYPE_CONFIG = {
  "new-report": {
    glyph: "\u25CF",
    color: "var(--st-open-mark)",
    bg: "var(--st-open-wash)",
    label: "New report",
  },
  progress: {
    glyph: "\u25B2",
    color: "var(--st-active-mark)",
    bg: "var(--st-active-wash)",
    label: "In progress",
  },
  healed: {
    glyph: "\uFF0B",
    color: "var(--st-healed-mark)",
    bg: "var(--st-healed-wash)",
    label: "Healed",
  },
  routed: {
    glyph: "\u258F",
    color: "var(--st-gov-mark)",
    bg: "var(--st-gov-wash)",
    label: "Routed",
  },
  "not-achieved": {
    glyph: "\u2014",
    color: "var(--st-failed-mark)",
    bg: "var(--st-failed-wash)",
    label: "Not achieved",
  },
  status: {
    glyph: "\u25B2",
    color: "var(--st-active-mark)",
    bg: "var(--st-active-wash)",
    label: "Status update",
  },
  failed: {
    glyph: "\u2014",
    color: "var(--st-failed-mark)",
    bg: "var(--st-failed-wash)",
    label: "Not achieved",
  },
  verifier: {
    glyph: "\u25C6",
    color: "var(--st-assess-mark)",
    bg: "var(--st-assess-wash)",
    label: "Verifier",
  },
  corroboration: {
    glyph: "\u25C6",
    color: "var(--st-assess-mark)",
    bg: "var(--st-assess-wash)",
    label: "Verified",
  },
  nearby: {
    glyph: "\u25CF",
    color: "var(--st-open-mark)",
    bg: "var(--st-open-wash)",
    label: "Nearby",
  },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered = NOTIFICATIONS.filter(
    (_n) => activeTab === "All" // all tabs show all for now
  );

  const todayItems = filtered.filter((n) => n.group === "today");
  const weekItems = filtered.filter((n) => n.group === "week");
  const earlierItems = filtered.filter((n) => n.group === "earlier");

  const renderGroup = (items: Notification[], groupName: string) => {
    if (items.length === 0) return null;
    return (
      <div key={groupName} style={{ marginBottom: groupName !== "Earlier" ? 32 : 0 }}>
        <span
          className="text-label-up text-muted"
          style={{ display: "block", marginBottom: 10 }}
        >
          {groupName}
        </span>

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 * i, duration: 0.25 }}
          >
            <Link
              href={`/wound/${item.woundId}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 0",
                borderBottom: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                opacity: item.read ? 0.75 : 1,
              }}
            >
              {/* Glyph dot */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: TYPE_CONFIG[item.type].bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    lineHeight: 1,
                    color: TYPE_CONFIG[item.type].color,
                    fontWeight: 700,
                  }}
                  aria-hidden="true"
                >
                  {TYPE_CONFIG[item.type].glyph}
                </span>

                {/* Unread dot */}
                {!item.read && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "var(--action)",
                      border: "2px solid var(--bg-raised)",
                    }}
                  />
                )}
              </div>

              {/* Message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="text-body"
                  style={{
                    color: "var(--text)",
                    lineHeight: 1.4,
                    fontWeight: item.read ? 400 : 500,
                  }}
                >
                  {item.text}
                </p>
              </div>

              {/* Timestamp */}
              <span
                className="text-caption text-muted"
                style={{
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {item.time}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div className="container mob-px-16" style={{ paddingTop: 44 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 20, flexWrap: "wrap", gap: 12 }}
          >
            <div>
              <h1 className="text-display" style={{ color: "var(--text)", marginBottom: 4 }}>
                Alerts
              </h1>
              <p className="text-body text-2">
                Stay close to what matters.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" aria-label="Mark all notifications as read">
              <CheckCheck size={15} />
              Mark all read
            </button>
          </div>
        </motion.div>

        {/* Tab group */}
        <div className="tab-group" style={{ marginBottom: 32 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className="tab-item"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification groups */}
        <div style={{ maxWidth: 680 }}>
          {renderGroup(todayItems, "Today")}
          {renderGroup(weekItems, "This Week")}
          {renderGroup(earlierItems, "Earlier")}
        </div>
      </div>
    </div>
  );
}
