"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import maplibregl from "maplibre-gl";
import { Map, MapClusterLayer, MapControls } from "@/components/ui/map";
import { StatusPill } from "../components/StatusPill";
import { WOUNDS, STATUS_META, CATEGORY_META, PLATFORM_STATS, type Wound, type StatusKey } from "@/lib/mock-data";
import type * as GeoJSON from "geojson";

/* ================================================================
   Build cluster data from shared wounds
   ================================================================ */
const clusterData: GeoJSON.FeatureCollection<GeoJSON.Point, { woundId: string; status: string }> = {
  type: "FeatureCollection",
  features: WOUNDS.map((w) => ({
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: [w.lng, w.lat] },
    properties: { woundId: w.id, status: w.status },
  })),
};

const STATUS_LIST: StatusKey[] = ["reported", "assessing", "routed", "in-progress", "healed", "not-achieved"];

/* ================================================================
   Component
   ================================================================ */
export default function AtlasPage() {
  const [metric, setMetric] = useState<"need" | "coverage" | "healed">("need");
  const [selectedWound, setSelectedWound] = useState<Wound | null>(null);
  const [liveCount, setLiveCount] = useState(PLATFORM_STATS.liveCount);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);
  const [meToo, setMeToo] = useState(false);

  useEffect(() => {
    maplibregl.prewarm();
    const iv = setInterval(() => setLiveCount((c) => c + 1), 3200);
    return () => clearInterval(iv);
  }, []);

  const rafRef = useRef<number | null>(null);
  const updateCardPos = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!selectedWound || !mapRef.current || !containerRef.current) return;
      const point = mapRef.current.project([selectedWound.lng, selectedWound.lat]);
      const rect = containerRef.current.getBoundingClientRect();
      setCardPos({ x: point.x, y: point.y - rect.top });
    });
  }, [selectedWound]);

  useEffect(() => {
    if (!selectedWound) return;
    setMeToo(false);
    updateCardPos();
    const m = mapRef.current;
    if (!m) return;
    m.on("move", updateCardPos);
    m.on("zoom", updateCardPos);
    m.on("resize", updateCardPos);
    return () => {
      m.off("move", updateCardPos);
      m.off("zoom", updateCardPos);
      m.off("resize", updateCardPos);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [selectedWound, updateCardPos]);

  const handlePointClick = (feature: GeoJSON.Feature<GeoJSON.Point>) => {
    const id = (feature.properties as any).woundId;
    const wound = WOUNDS.find((w) => w.id === id);
    if (wound) {
      setSelectedWound(wound);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [wound.lng, wound.lat],
          zoom: 15,
          speed: 1.4,
          curve: 1.42,
          easing: (t: number) => t * (2 - t),
          essential: true,
        });
      }
    }
  };

  const handleCloseCard = () => {
    setSelectedWound(null);
    setCardPos(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [78.96, 22.59],
        zoom: 4.5,
        speed: 1.0,
        curve: 1.42,
        easing: (t: number) => t * (2 - t),
        essential: true,
      });
    }
  };

  const statusKey = (w: Wound): StatusKey => w.status;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <Map
        ref={mapRef}
        center={[78.96, 22.59]}
        zoom={4.5}
        theme="light"
        styles={{ light: "https://tiles.openfreemap.org/styles/positron" }}
        localIdeographFontFamily="sans-serif"
        fadeDuration={200}
        className="absolute inset-0"
      >
        <MapControls position="bottom-right" />

        <MapClusterLayer
          data={clusterData}
          clusterMaxZoom={12}
          clusterRadius={50}
          clusterColors={["#12564F", "#2B857C", "#2F9E5E"]}
          clusterThresholds={[8, 20]}
          pointColor="#12564F"
          pointRadius={14}
          onPointClick={handlePointClick}
          onClusterClick={(_id, coords) => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: coords,
                zoom: Math.min(mapRef.current.getZoom() + 3, 14),
                speed: 1.2,
                easing: (t: number) => t * (2 - t),
                essential: true,
              });
            }
          }}
        />
      </Map>

      {/* ===== WOUND CARD — redesigned ===== */}
      <AnimatePresence>
        {selectedWound && cardPos && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              left: Math.min(Math.max(cardPos.x - 170, 16), (containerRef.current?.clientWidth ?? 0) - 356),
              top: Math.max(cardPos.y - 200, 90),
              zIndex: 20,
              width: 340,
            }}
          >
            <div
              style={{
                background: "#FCFEFD",
                border: "1px solid #E4EBE7",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 12px 40px -12px rgba(14,26,22,.18), 0 2px 8px -2px rgba(14,26,22,.06)",
              }}
            >
              {/* header strip — status colour */}
              <div style={{ height: 3, background: STATUS_META[statusKey(selectedWound)].mark }} />

              <div style={{ padding: "18px 20px 16px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <StatusPill status={statusKey(selectedWound)} />
                  <button
                    onClick={handleCloseCard}
                    aria-label="Close"
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: "1px solid #E4EBE7", background: "transparent",
                      color: "#6B7770", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>

                <h3
                  className="text-serif"
                  style={{
                    fontSize: 17, fontWeight: 500, letterSpacing: "-.01em",
                    lineHeight: 1.3, marginBottom: 8, color: "#0E1A16",
                  }}
                >
                  {selectedWound.title}
                </h3>

                <div
                  style={{
                    fontFamily: "'Geist Mono', 'SF Mono', monospace",
                    fontSize: 11, color: "#9AA09A",
                    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <span>{selectedWound.place}</span>
                  <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#E4EBE7" }} />
                  <span>{CATEGORY_META[selectedWound.category].label}</span>
                  <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#E4EBE7" }} />
                  <span>{selectedWound.corroborations} witnesses</span>
                </div>

                {selectedWound.outcome && selectedWound.outcome.length > 0 && (
                  <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
                    {selectedWound.outcome.map((o, i) => (
                      <div key={i}>
                        <div style={{
                          fontFamily: "'Geist', 'Inter', sans-serif",
                          fontWeight: 700, fontSize: 18,
                          letterSpacing: "-.02em", color: "#0B7A44",
                          lineHeight: 1,
                        }}>
                          {o[0]}
                        </div>
                        <div style={{ fontSize: 11, color: "#9AA09A", marginTop: 2 }}>{o[1]}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setMeToo(!meToo)}
                    style={{
                      flex: 1, height: 38, borderRadius: 9999,
                      border: meToo ? "1px solid #0C6B5E" : "1px solid #E4EBE7",
                      background: meToo ? "#EAF6F3" : "#FCFEFD",
                      color: meToo ? "#0C6B5E" : "#3D4A44",
                      fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, cursor: "pointer", transition: "all .15s",
                    }}
                  >
                    {meToo ? "＋ Witnessed" : "＋ Me too"}
                  </button>
                  <Link
                    href={`/wound/${selectedWound.id}`}
                    style={{
                      height: 38, padding: "0 16px", borderRadius: 9999,
                      border: "none", background: "#0C6B5E", color: "#fff",
                      fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 6,
                      cursor: "pointer", textDecoration: "none",
                    }}
                  >
                    Open <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TOP BAR ===== */}
      <div className="atlas-overlay mob-px-16" style={{
        top: 0, left: 0, right: 0,
        background: "rgba(252,251,249,.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)", padding: "10px 24px",
        display: "flex", alignItems: "center", gap: 8,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--action)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
          </div>
          <span className="text-serif" style={{ fontWeight: 600, fontSize: 17, color: "var(--action)" }}>सेतु</span>
        </div>

        <Link href="/search" style={{ flex: "1 1 auto", maxWidth: 360, position: "relative", minWidth: 0, textDecoration: "none" }}>
          <span style={{
            display: "flex", alignItems: "center", height: 38,
            border: "1px solid var(--border)", background: "var(--bg-raised)",
            borderRadius: 9999, padding: "0 14px", fontSize: 14, color: "var(--text-3)",
          }}>
            Search wounds, districts, places…
          </span>
        </Link>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-muted)", borderRadius: 9999, padding: "5px 12px", flexShrink: 0,
        }}>
          <span className="atlas-beat" />
          <span style={{ fontWeight: 600, fontSize: 13, fontVariantNumeric: "tabular-nums", color: "var(--text)" }}>
            {liveCount.toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>wounds live</span>
        </div>

        <div style={{ display: "flex", gap: 3, background: "var(--bg-muted)", borderRadius: 9999, padding: 3, flexShrink: 0 }}>
          {(["need", "coverage", "healed"] as const).map((m) => (
            <button key={m} onClick={() => setMetric(m)} style={{
              border: "none", background: metric === m ? "var(--action)" : "transparent",
              borderRadius: 9999, padding: "7px 14px", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
              color: metric === m ? "#fff" : "var(--text-2)", cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap",
            }}>
              {m === "need" ? "Need" : m === "coverage" ? "Coverage" : "Healed"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="atlas-overlay" style={{
        left: 20, bottom: 130,
        background: "rgba(252,251,249,.92)", backdropFilter: "blur(8px)",
        border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px",
        boxShadow: "0 2px 10px rgba(14,26,22,.06)", maxWidth: 200,
      }}>
        <h4 className="text-label-up" style={{ color: "var(--text-3)", marginBottom: 10, letterSpacing: ".06em", fontSize: 11 }}>By status</h4>
        {STATUS_LIST.map(key => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7, fontSize: 12, color: "var(--text-2)" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: STATUS_META[key].mark, flexShrink: 0, border: "2px solid #fff", boxShadow: "0 1px 2px rgba(0,0,0,.15)" }} />
            {STATUS_META[key].label}
          </div>
        ))}
      </div>

      <style jsx>{`
        .atlas-overlay { position: absolute; z-index: 10; pointer-events: none; }
        .atlas-overlay > * { pointer-events: auto; }
        .atlas-beat { width: 8px; height: 8px; border-radius: 50%; background: #2F9E5E; animation: atlas-beat 1.8s ease-out infinite; }
        @keyframes atlas-beat { 0% { box-shadow: 0 0 0 0 rgba(47,158,94,.5); } 70% { box-shadow: 0 0 0 8px rgba(47,158,94,0); } 100% { box-shadow: 0 0 0 0 rgba(47,158,94,0); } }
      `}</style>
    </div>
  );
}
