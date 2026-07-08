"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
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
    maplibregl.prewarm();
    return () => {
      maplibregl.clearPrewarmedResources();
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
      <MapControls position="bottom-right" />

      <MapClusterLayer
        data={filteredData}
        clusterMaxZoom={12}
        clusterRadius={50}
        clusterColors={["#12564F", "#2B857C", "#2F9E5E"]}
        clusterThresholds={[8, 20]}
        pointColor="#12564F"
        pointRadius={14}
        onPointClick={handlePointClick}
        onClusterClick={handleClusterClick}
      />
    </Map>
  );
}
