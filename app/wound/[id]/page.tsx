"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronUp, MapPin, Plus, ArrowRight } from "lucide-react";
import { StatusPill } from "@/app/components/StatusPill";
import { getWound, getPlace, CATEGORY_META, STATUS_META, type StatusKey } from "@/lib/mock-data";

/* Build a journey spine from the wound's status and date */
function buildJourney(status: StatusKey, date: string): { kind: "node"; type: string; label: string; date: string; dotClass: string }[] {
  const nodes: { kind: "node"; type: string; label: string; date: string; dotClass: string }[] = [];
  const labelMap: Record<StatusKey, string> = {
    "healed": "Healed",
    "in-progress": "In Progress",
    "routed": "Routed",
    "assessing": "Assessing",
    "reported": "Reported",
    "not-achieved": "Not Achieved",
  };
  const dotMap: Record<string, string> = {
    done: "spine-dot--done",
    active: "spine-dot--active",
    origin: "spine-dot--origin",
  };
  const order: StatusKey[] = ["reported", "assessing", "routed", "in-progress", "healed"];
  const idx = order.indexOf(status);
  if (status === "not-achieved") {
    nodes.push({ kind: "node", type: "failed", label: "Not Achieved", date, dotClass: "spine-dot--done" });
    nodes.push({ kind: "node", type: "active", label: "In Progress", date: "earlier", dotClass: "spine-dot--done" });
    nodes.push({ kind: "node", type: "origin", label: "Reported", date: "earlier", dotClass: dotMap.origin });
  } else {
    for (let i = 0; i <= idx; i++) {
      const s = order[i];
      const isCurrent = i === idx;
      nodes.unshift({
        kind: "node",
        type: isCurrent ? (i === 0 ? "origin" : "active") : "done",
        label: labelMap[s],
        date: isCurrent ? date : "earlier",
        dotClass: isCurrent ? (i === 0 ? dotMap.origin : dotMap.active) : dotMap.done,
      });
    }
  }
  return nodes;
}

export default function WoundJourneyPage() {
  const params = useParams();
  const [legalityOpen, setLegalityOpen] = useState(false);

  const woundId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const wound = getWound(woundId);
  const place = wound ? getPlace(wound.placeId) : undefined;

  if (!wound) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <h1 className="text-h1" style={{ marginBottom: 12 }}>Wound not found</h1>
        <p className="text-body text-2" style={{ marginBottom: 24 }}>
          The wound ID <code style={{ fontFamily: "var(--font-mono)" }}>{woundId}</code> doesn't exist in the record.
        </p>
        <Link href="/atlas" className="btn btn-primary">Back to the Atlas</Link>
      </div>
    );
  }

  const journeyNodes = buildJourney(wound.status, wound.date);
  const catMeta = CATEGORY_META[wound.category];
  const statusMeta = STATUS_META[wound.status];

  return (
    <div className="mob-px-16" style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 32px 120px" }}>
      <Link
        href={`/place/${wound.placeId}`}
        className="flex items-center gap-6 text-caption text-2"
        style={{ marginBottom: 24, display: "inline-flex" }}
      >
        <ChevronLeft size={14} />
        Back to {place?.name ?? wound.place}
      </Link>

      <div className="grid gap-32" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-20"
        >
          <StatusPill status={wound.status} />

          <h1 className="text-h1" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1.8vw, 2rem)" }}>
            {wound.title}
          </h1>

          <div
            style={{
              aspectRatio: "16/10",
              background: "var(--bg-alt)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 6,
              position: "relative",
            }}
          >
            <MapPin size={28} color="var(--ghost)" />
            <p className="text-caption text-2">{wound.place}</p>
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "var(--bg-raised)",
                borderRadius: "var(--radius-pill)",
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 500,
                color: "var(--text-2)",
                border: "1px solid var(--border)",
              }}
            >
              {wound.lng.toFixed(2)}°, {wound.lat.toFixed(2)}°
            </span>
          </div>

          <p className="text-body text-2" style={{ lineHeight: 1.7 }}>
            {wound.body}
          </p>

          {wound.outcome && wound.outcome.length > 0 && (
            <div className="card" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {wound.outcome.map((o, i) => (
                <div key={i}>
                  <p className="text-number" style={{ fontSize: "1.5rem", color: wound.status === "not-achieved" && i > 0 ? "var(--st-failed-mark)" : "var(--st-healed-mark)" }}>
                    {o[0]}
                  </p>
                  <p className="text-caption text-2" style={{ marginTop: 2 }}>{o[1]}</p>
                </div>
              ))}
            </div>
          )}

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="flex items-center justify-between">
              <span className="text-number" style={{ fontSize: "1.5rem" }}>
                {wound.corroborations}
              </span>
              <button className="btn btn-ghost btn-sm">
                <Plus size={14} />
                Add your witness
              </button>
            </div>
            <p className="text-caption text-2">corroborations</p>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <button
              onClick={() => setLegalityOpen(!legalityOpen)}
              className="flex items-center justify-between"
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}
            >
              <span className="text-label">Legality &amp; Jurisdiction</span>
              {legalityOpen ? <ChevronUp size={16} color="var(--text-3)" /> : <ChevronDown size={16} color="var(--text-3)" />}
            </button>
            {legalityOpen && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <p className="text-caption text-2">
                  This wound falls under the jurisdiction of {place?.name ?? wound.place}, {place?.state ?? ""}.
                  Category: {catMeta.label}. The responsible body is determined by the nature of the
                  public asset and applicable state law.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-label-up text-2" style={{ marginBottom: 20 }}>Journey</p>

          <div className="spine-wrapper" style={{ position: "relative" }}>
            <div className="spine-rail" style={{ position: "absolute", top: 8, bottom: 8, left: 5 }} />
            {journeyNodes.map((item, i) => (
              <div key={i} className="spine-node">
                <div className={`spine-dot ${item.dotClass}`} />
                <div className="spine-body">
                  <p className="text-label">{item.label}</p>
                  <p className="text-caption text-2" style={{ marginTop: 2 }}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <Link href="/atlas" className="btn btn-outline btn-sm">
              View on the Atlas <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
