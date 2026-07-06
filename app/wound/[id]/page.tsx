"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { StatusPill } from "@/app/components/StatusPill";
import { ProofGallery } from "@/app/components/ProofGallery";
import { VerificationEventCard } from "@/app/components/VerificationEventCard";
import { CorroborationList } from "@/app/components/CorroborationList";
import { FundingSection } from "@/app/components/FundingSection";
import { AuthoritySection } from "@/app/components/AuthoritySection";
import { ExpandedJourneyTimeline } from "@/app/components/ExpandedJourneyTimeline";
import { RelatedWounds } from "@/app/components/RelatedWounds";
import { WoundActionBar } from "@/app/components/WoundActionBar";
import {
  getWound, getPlace, CATEGORY_META,
  getVerificationEvents, getCorroborationEntries,
  getFunding, getTimelineEvents, getRelatedWounds, getAuthority,
} from "@/lib/mock-data";

const ease = [0.16, 1, 0.3, 1] as const;

export default function WoundJourneyPage() {
  const params = useParams();
  const [legalityOpen, setLegalityOpen] = useState(false);

  const woundId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const wound = getWound(woundId);
  const place = wound ? getPlace(wound.placeId) : undefined;

  const verifications = wound ? getVerificationEvents(woundId) : [];
  const corroborations = wound ? getCorroborationEntries(woundId) : [];
  const funding = wound ? getFunding(woundId) : undefined;
  const timelineEvents = wound ? getTimelineEvents(woundId) : [];
  const related = wound ? getRelatedWounds(woundId) : [];
  const authority = wound ? getAuthority(woundId) : undefined;

  if (!wound) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <h1 className="text-h1" style={{ marginBottom: 12 }}>Wound not found</h1>
        <p className="text-body text-2" style={{ marginBottom: 24 }}>
          The wound ID <code style={{ fontFamily: "var(--font-mono)" }}>{woundId}</code> doesn&apos;t exist in the record.
        </p>
        <Link href="/atlas" className="btn btn-primary">Back to the Atlas</Link>
      </div>
    );
  }

  const catMeta = CATEGORY_META[wound.category];

  return (
    <div className="mob-px-16" style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 32px 120px" }}>
      {/* Breadcrumb */}
      <Link
        href={`/place/${wound.placeId}`}
        style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-3)", textDecoration: "none" }}
      >
        <ChevronLeft size={14} />
        Back to {place?.name ?? wound.place}
      </Link>

      <div className="layout-split" style={{ marginTop: 8 }}>
        {/* ─── LEFT COLUMN ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col"
          style={{ gap: 24 }}
        >
          {/* Status + Category */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <StatusPill status={wound.status} />
            <span className="chip" style={{ pointerEvents: "none" }}>{catMeta.label}</span>
          </div>

          {/* Title */}
          <h1 className="text-h1" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1.8vw, 2rem)", margin: 0 }}>
            {wound.title}
          </h1>

          {/* Meta row */}
          <div className="wound-meta">
            <span>{wound.place}</span>
            <span>{wound.date}</span>
            <span>ID: {wound.id}</span>
          </div>

          {/* Proof Gallery */}
          <ProofGallery images={wound.proofUrls} woundTitle={wound.title} />

          {/* Body */}
          <p className="text-body text-2" style={{ lineHeight: 1.7, margin: 0 }}>
            {wound.body}
          </p>

          {/* Outcome metrics */}
          {wound.outcome && wound.outcome.length > 0 && (
            <div className="card" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {wound.outcome.map((o, i) => (
                <div key={i}>
                  <p className="text-number" style={{ fontSize: "1.5rem", color: wound.status === "not-achieved" && i > 0 ? "var(--st-failed-mark)" : "var(--st-healed-mark)", margin: 0 }}>
                    {o[0]}
                  </p>
                  <p className="text-caption text-2" style={{ marginTop: 2 }}>{o[1]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Corroborations */}
          <CorroborationList entries={corroborations} woundId={woundId} count={wound.corroborations} />

          {/* Funding */}
          <FundingSection funding={funding} />

          {/* Authority */}
          {authority && <AuthoritySection authority={authority} />}

          {/* Legality & Jurisdiction */}
          <div className="card" style={{ padding: 16 }}>
            <button
              onClick={() => setLegalityOpen(!legalityOpen)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}
            >
              <span className="text-label">Legality &amp; Jurisdiction</span>
              {legalityOpen ? <ChevronUp size={16} color="var(--text-3)" /> : <ChevronDown size={16} color="var(--text-3)" />}
            </button>
            {legalityOpen && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <p className="text-caption text-2" style={{ margin: 0 }}>
                  This wound falls under the jurisdiction of {place?.name ?? wound.place}, {place?.state ?? ""}.
                  Category: {catMeta.label}. The responsible body is determined by the nature of the
                  public asset and applicable state law.
                </p>
              </div>
            )}
          </div>

          {/* Related Wounds */}
          {related.length > 0 && <RelatedWounds wounds={related} currentId={woundId} />}
        </motion.div>

        {/* ─── RIGHT COLUMN ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 28 }}
        >
          {/* Action Bar */}
          <WoundActionBar woundId={wound.id} woundTitle={wound.title} />

          {/* Expanded Journey Timeline */}
          <div>
            <p className="text-label-up text-2" style={{ marginBottom: 16 }}>Journey</p>
            <ExpandedJourneyTimeline events={timelineEvents} woundStatus={wound.status} woundDate={wound.date} />
          </div>

          {/* Verification Timeline */}
          {verifications.length > 0 && (
            <div>
              <p className="text-label-up text-2" style={{ marginBottom: 16 }}>Verifications</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {verifications.map((ev) => (
                  <VerificationEventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          )}

          {/* Atlas link */}
          <Link
            href="/atlas"
            className="btn btn-outline btn-sm"
            style={{ textDecoration: "none", display: "inline-flex", alignSelf: "flex-start" }}
          >
            View on the Atlas <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
