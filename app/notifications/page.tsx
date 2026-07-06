"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

const TABS = ["All", "Following", "Nearby"] as const;

interface NotificationItem {
  id: string;
  type: "new-report" | "progress" | "healed" | "routed" | "not-achieved" | "corroboration" | "nearby";
  message: string;
  time: string;
  group: "Today" | "This Week" | "Earlier";
  woundSlug: string;
  read: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "progress",
    message: "Your reported handpump moved to In Progress",
    time: "2h ago",
    group: "Today",
    woundSlug: "SETU-RJ-0182",
    read: false,
  },
  {
    id: "n2",
    type: "healed",
    message: "A wound near you was healed \u2014 Jayanagar, Bangalore",
    time: "5h ago",
    group: "Today",
    woundSlug: "SETU-KA-1250",
    read: false,
  },
  {
    id: "n3",
    type: "corroboration",
    message: "Corroboration threshold met \u2014 your report is now verified",
    time: "7h ago",
    group: "Today",
    woundSlug: "SETU-DL-0567",
    read: false,
  },
  {
    id: "n4",
    type: "new-report",
    message: "New report near you \u2014 Broken streetlight, Ward 7",
    time: "9h ago",
    group: "Today",
    woundSlug: "SETU-DL-0580",
    read: true,
  },
  {
    id: "n5",
    type: "not-achieved",
    message: "Your wound was marked Not Achieved \u2014 here\u2019s why",
    time: "Yesterday",
    group: "Today",
    woundSlug: "SETU-UP-0321",
    read: true,
  },
  {
    id: "n6",
    type: "routed",
    message: "Streetlight outage routed to NDMC \u2014 tracking ref DL-0567",
    time: "Yesterday",
    group: "Today",
    woundSlug: "SETU-DL-0567",
    read: true,
  },
  {
    id: "n7",
    type: "healed",
    message: "Pipeline replacement in T Nagar completed \u2014 84 corroborations",
    time: "Mon, 3:30 PM",
    group: "This Week",
    woundSlug: "SETU-TN-0450",
    read: true,
  },
  {
    id: "n8",
    type: "new-report",
    message: "New classified wounds need your verification: 4 in Delhi NCR",
    time: "Mon, 10:15 AM",
    group: "This Week",
    woundSlug: "SETU-DL-0580",
    read: true,
  },
  {
    id: "n9",
    type: "routed",
    message: "Lake encroachment survey routed to Karnataka Lake Authority",
    time: "Sun, 2:00 PM",
    group: "This Week",
    woundSlug: "SETU-KA-0431",
    read: true,
  },
  {
    id: "n10",
    type: "corroboration",
    message: "Pothole cluster on Ring Road \u2014 corroborated by 63 citizens",
    time: "Sat, 9:22 AM",
    group: "This Week",
    woundSlug: "SETU-KA-1210",
    read: true,
  },
  {
    id: "n11",
    type: "nearby",
    message: "3 new wounds reported in your area: Koramangala, Bengaluru",
    time: "18 Jun",
    group: "Earlier",
    woundSlug: "SETU-KA-1224",
    read: true,
  },
  {
    id: "n12",
    type: "healed",
    message: "Mithi River debris clearing completed \u2014 112 corroborations",
    time: "14 Jun",
    group: "Earlier",
    woundSlug: "SETU-MH-0891",
    read: true,
  },
];

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

  const todayItems = filtered.filter((n) => n.group === "Today");
  const weekItems = filtered.filter((n) => n.group === "This Week");
  const earlierItems = filtered.filter((n) => n.group === "Earlier");

  const renderGroup = (items: NotificationItem[], groupName: string) => {
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
              href={`/wound/${item.woundSlug}`}
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
                  {item.message}
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
            <button className="btn btn-ghost btn-sm">
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
