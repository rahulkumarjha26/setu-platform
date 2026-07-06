"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  ClipboardCheck,
  Users,
  Coins,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { STATUS_META, type TimelineEvent, type StatusKey } from "@/lib/mock-data";

interface ExpandedJourneyTimelineProps {
  events: TimelineEvent[];
  woundStatus: string;
  woundDate: string;
}

const STATUS_ORDER: StatusKey[] = [
  "reported",
  "assessing",
  "routed",
  "in-progress",
  "healed",
];

const EVENT_ICONS: Record<TimelineEvent["type"], LucideIcon> = {
  "status-change": RotateCcw,
  verification: ClipboardCheck,
  corroboration: Users,
  funding: Coins,
  note: FileText,
};

const EVENT_DOT_COLORS: Record<TimelineEvent["type"], string> = {
  "status-change": "var(--action)",
  verification: "var(--st-healed-mark)",
  corroboration: "var(--st-open-mark)",
  funding: "var(--st-assess-mark)",
  note: "var(--text-3)",
};

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

export function ExpandedJourneyTimeline({
  events,
  woundStatus,
  woundDate,
}: ExpandedJourneyTimelineProps) {
  // Build milestone nodes from the wound's status path
  const milestoneNodes = useMemo(() => {
    const nodes: {
      kind: "milestone";
      label: string;
      date: string;
      dotClass: string;
    }[] = [];

    const idx = STATUS_ORDER.indexOf(woundStatus as StatusKey);

    if (woundStatus === "not-achieved") {
      // Show the full journey but highlight the dead-end
      nodes.push({
        kind: "milestone",
        label: "Not Achieved",
        date: woundDate,
        dotClass: "spine-dot--done",
      });
      for (let i = STATUS_ORDER.indexOf("in-progress"); i >= 0; i--) {
        const s = STATUS_ORDER[i];
        const meta = STATUS_META[s];
        nodes.push({
          kind: "milestone",
          label: meta ? meta.label : s,
          date: i === 0 ? woundDate : "earlier",
          dotClass: "spine-dot--done",
        });
      }
    } else if (idx >= 0) {
      for (let i = 0; i <= idx; i++) {
        const s = STATUS_ORDER[i];
        const meta = STATUS_META[s];
        const isCurrent = i === idx;
        nodes.push({
          kind: "milestone",
          label: meta ? meta.label : s,
          date: isCurrent ? woundDate : "earlier",
          dotClass: isCurrent
            ? i === 0
              ? "spine-dot--origin"
              : "spine-dot--active"
            : "spine-dot--done",
        });
      }
    }

    return nodes;
  }, [woundStatus, woundDate]);

  // Sort events by date ascending
  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events]);

  // Interleave milestones and events chronologically
  const timeline = useMemo(() => {
    const items: Array<
      | { kind: "milestone"; label: string; date: string; dotClass: string }
      | { kind: "event"; event: TimelineEvent }
    > = [];

    let mi = 0;
    let ei = 0;

    // Milestones go first (they represent the wound's status path),
    // then interleave events that fall between them
    while (mi < milestoneNodes.length || ei < sortedEvents.length) {
      if (mi < milestoneNodes.length) {
        items.push(milestoneNodes[mi]);
        mi++;
      }
      // Insert events that belong near this milestone
      while (ei < sortedEvents.length) {
        items.push({ kind: "event", event: sortedEvents[ei] });
        ei++;
      }
    }

    return items;
  }, [milestoneNodes, sortedEvents]);

  if (timeline.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 16px",
          color: "var(--text-3)",
        }}
      >
        <RotateCcw size={28} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
        <p className="text-caption">No timeline events yet.</p>
      </div>
    );
  }

  return (
    <div className="spine-wrapper" style={{ position: "relative" }}>
      <div
        className="spine-rail"
        style={{ position: "absolute", top: 8, bottom: 8, left: 5 }}
      />
      {timeline.map((item, i) => {
        if (item.kind === "milestone") {
          return (
            <motion.div
              key={`ms-${item.label}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="spine-node"
            >
              <div className={`spine-dot ${item.dotClass}`} />
              <div className="spine-body">
                <p className="text-label" style={{ color: "var(--text)", fontWeight: 600 }}>
                  {item.label}
                </p>
                <p className="text-caption" style={{ color: "var(--text-2)", marginTop: 2 }}>
                  {item.date}
                </p>
              </div>
            </motion.div>
          );
        }

        const event = item.event;
        const EventIcon = EVENT_ICONS[event.type];
        const dotColor = EVENT_DOT_COLORS[event.type];

        return (
          <motion.div
            key={`ev-${event.id}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="spine-node"
          >
            <div className="spine-dot--event">
              <div className="inner" style={{ background: dotColor }} />
            </div>
            <div className="spine-body">
              <div
                className="flex items-center"
                style={{ gap: 6, marginBottom: 2 }}
              >
                {EventIcon && <EventIcon size={13} color={dotColor} />}
                <p className="text-label" style={{ fontWeight: 600, color: "var(--text)" }}>
                  {event.title}
                </p>
              </div>
              <p className="text-body" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
                {event.description}
              </p>
              <div
                className="flex items-center"
                style={{ gap: 8, marginTop: 6 }}
              >
                <span className="text-caption" style={{ color: "var(--text-3)" }}>
                  {formatDate(event.date)}
                </span>
                {event.actorName && (
                  <>
                    <span style={{ color: "var(--text-3)" }}>·</span>
                    <span className="text-caption" style={{ color: "var(--text-2)" }}>
                      {event.actorName}
                      {event.actorRole ? `, ${event.actorRole}` : ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
