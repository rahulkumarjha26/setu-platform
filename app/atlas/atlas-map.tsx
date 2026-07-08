"use client";

import { useEffect, useRef, useCallback } from "react";
import { Map, MapClusterLayer, MapControls } from "@/components/ui/map";
import type * as GeoJSON from "geojson";
import type { Wound } from "@/lib/mock-data";

interface AtlasMapProps {
  filteredData: GeoJSON.FeatureCollection<GeoJSON.Point, { woundId: string; status: string }>;
  selectedWound: Wound | null;
  selectedWoundId: string | null;
  onPointClick: (feature: GeoJSON.Feature<GeoJSON.Point>) => void;
  onClusterClick: (_id: number, coords: [number, number]) => void;
  onMapReady: (map: any) => void;
  onWoundSelect: (wound: Wound | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

const CLUSTER_COLORS: [string, string, string] = [
  cssVar("--c-p-700", "#12564F"),
  cssVar("--c-p-500", "#2B857C"),
  cssVar("--st-healed-mark", "#2F9E5E"),
];
const POINT_COLOR = cssVar("--c-p-700", "#12564F");

export default function AtlasMap({
  filteredData,
  selectedWound,
  selectedWoundId,
  onPointClick,
  onClusterClick,
  onMapReady,
  onWoundSelect,
  containerRef,
}: AtlasMapProps) {
  const mapRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("maplibre-gl").then((m) => {
      if (cancelled) return;
      m.prewarm();
    });
    return () => {
      cancelled = true;
      import("maplibre-gl").then((m) => m.clearPrewarmedResources());
    };
  }, []);

  // Track map ref for parent
  const handleMapInit = useCallback(
    (map: any) => {
      mapRef.current = map;
      onMapReady(map);
    },
    [onMapReady],
  );

  const handlePointClick = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point>) => {
      onPointClick(feature);
    },
    [onPointClick],
  );

  const handleClusterClick = useCallback(
    (id: number, coords: [number, number]) => {
      onClusterClick(id, coords);
    },
    [onClusterClick],
  );

  return (
    <Map
      ref={handleMapInit}
      center={[78.96, 22.59]}
      zoom={4.5}
      theme="light"
      styles={{ light: "https://tiles.openfreemap.org/styles/positron" }}
      localIdeographFontFamily="sans-serif"
      fadeDuration={200}
      className="absolute inset-0"
    >
      <MapControls position="bottom-right" className="atlas-controls" />

      <MapClusterLayer
        data={filteredData}
        clusterMaxZoom={12}
        clusterRadius={50}
        clusterColors={CLUSTER_COLORS}
        clusterThresholds={[8, 20]}
        pointColor={POINT_COLOR}
        pointRadius={14}
        onPointClick={handlePointClick}
        onClusterClick={handleClusterClick}
      />
    </Map>
  );
}
