"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Users,
  MapPin,
  CheckCircle,
  ArrowUp,
  Zap,
} from "lucide-react";

/* ─── ActivityFeed — feed of recent platform events ─── */

interface ActivityItem {
  time: string;
  text: string;
  type: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const typeStyles: Record<
  string,
  { bg: string; dot: string; icon: typeof Activity }
> = {
  reported: {
    bg: "var(--st-open-wash)",
    dot: "var(--st-open-mark)",
    icon: MapPin,
  },
  assigned: {
    bg: "var(--st-active-wash)",
    dot: "var(--st-active-mark)",
    icon: Activity,
  },
  progress: {
    bg: "var(--c-p-50)",
    dot: "var(--action)",
    icon: TrendingUp,
  },
  funding: {
    bg: "var(--st-gov-wash)",
    dot: "var(--st-gov-mark)",
    icon: Zap,
  },
  healed: {
    bg: "var(--st-healed-wash)",
    dot: "var(--st-healed-mark)",
    icon: CheckCircle,
  },
  corroboration: {
    bg: "var(--bg-muted)",
    dot: "var(--text-2)",
    icon: Users,
  },
  routed: {
    bg: "var(--st-gov-wash)",
    dot: "var(--st-gov-mark)",
    icon: ArrowUp,
  },
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((a, i) => {
        const ts = typeStyles[a.type] || typeStyles.reported;
        const Icon = ts.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="card card-compact"
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: ts.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={15} color={ts.dot} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="text-label"
                style={{
                  fontSize: 13.5,
                  color: "var(--text)",
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                {a.text}
              </p>
              <p
                className="text-caption text-3"
                style={{ marginTop: 3, marginBottom: 0 }}
              >
                {a.time}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
