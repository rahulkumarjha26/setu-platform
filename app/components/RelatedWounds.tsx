"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { StatusPill } from "@/app/components/StatusPill";
import type { Wound } from "@/lib/mock-data";

interface RelatedWoundsProps {
  wounds: Wound[];
  currentId: string;
}

export function RelatedWounds({ wounds, currentId }: RelatedWoundsProps) {
  const related = wounds
    .filter((w) => w.id !== currentId)
    .slice(0, 5);

  if (related.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "24px 16px",
          color: "var(--text-3)",
        }}
      >
        <p className="text-caption">No related wounds found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      {related.map((wound, idx) => (
        <motion.div
          key={wound.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: idx * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            href={`/wound/${wound.id}`}
            className="card card-compact"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              textDecoration: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <div className="flex items-start justify-between" style={{ gap: 8 }}>
              <p
                className="text-label"
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                  lineHeight: 1.3,
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {wound.title}
              </p>
              <StatusPill status={wound.status} />
            </div>
            <div className="flex items-center" style={{ gap: 6 }}>
              <MapPin size={12} color="var(--text-3)" style={{ flexShrink: 0 }} />
              <p className="text-caption" style={{ color: "var(--text-3)" }}>
                {wound.place}
              </p>
              <span style={{ color: "var(--border)", margin: "0 2px" }}>·</span>
              <p className="text-caption" style={{ color: "var(--text-3)" }}>
                {wound.date}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
