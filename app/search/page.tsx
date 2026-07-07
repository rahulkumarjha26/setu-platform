"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  MapPin,
  Bookmark,
  List,
  Map as MapIcon,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

interface SearchResult {
  id: string;
  title: string;
  place: string;
  budget: string;
  status: "assessing" | "in-progress" | "in-progress" | "reported" | "healed";
  description: string;
  lat: number;
  lng: number;
}

const SEARCH_RESULTS: SearchResult[] = [
  {
    id: "SETU-KA-0431",
    title: "Keep girls enrolled in water-stressed schools",
    place: "Chitradurga district, Karnataka",
    budget: "\u20B912,40,000",
    status: "assessing",
    description: "12 schools in taluk with no running water, dropout rate at 34%",
    lat: 6,
    lng: 2,
  },
  {
    id: "SETU-RJ-0188",
    title: "Rainwater harvesting in 12 drought schools",
    place: "Barmer district, Rajasthan",
    budget: "\u20B98,75,000",
    status: "in-progress",
    description: "Rooftop harvesting for 12 schools serving 4,800 children",
    lat: 2,
    lng: 1,
  },
  {
    id: "SETU-MH-0901",
    title: "Sanitary pad units for 60 rural schools",
    place: "Gadchiroli district, Maharashtra",
    budget: "\u20B95,20,000",
    status: "in-progress",
    description: "Vending machines and disposal incinerators across 60 schools",
    lat: 3,
    lng: 4,
  },
  {
    id: "SETU-UP-0325",
    title: "Girls' hostel water connection at govt school",
    place: "Bahraich district, Uttar Pradesh",
    budget: "\u20B93,10,000",
    status: "reported",
    description: "Hostel for 120 tribal girls, handpump broke 6 months ago",
    lat: 4,
    lng: 2,
  },
  {
    id: "SETU-OR-0210",
    title: "Solar pump for drinking water in tribal school",
    place: "Koraput district, Odisha",
    budget: "\u20B97,80,000",
    status: "healed",
    description: "Solar-powered borewell pump now functional, 600 students served",
    lat: 5,
    lng: 3,
  },
  {
    id: "SETU-MP-0156",
    title: "Anganwadi toilet construction — 8 centres",
    place: "Mandla district, Madhya Pradesh",
    budget: "\u20B94,50,000",
    status: "assessing",
    description: "8 anganwadis without toilet facilities in forest villages",
    lat: 2,
    lng: 5,
  },
  {
    id: "SETU-BR-0092",
    title: "Mid-day meal kitchen repair for 5 schools",
    place: "Gaya district, Bihar",
    budget: "\u20B92,80,000",
    status: "in-progress",
    description: "Kitchen sheds damaged in monsoon, 2,400 meals/day affected",
    lat: 6,
    lng: 5,
  },
  {
    id: "SETU-JH-0078",
    title: "Cycle distribution for school-going girls",
    place: "Simdega district, Jharkhand",
    budget: "\u20B96,20,000",
    status: "in-progress",
    description: "150 cycles to reduce dropout between middle and high school",
    lat: 4,
    lng: 5,
  },
];

const FACETS = [
  { label: "Category", hasDropdown: true },
  { label: "Budget", hasDropdown: true },
  { label: "Place", hasDropdown: true },
  { label: "Status", hasDropdown: true },
  { label: "Fundable only", hasDropdown: false, selected: true },
  { label: "Magnitude", hasDropdown: true },
];

interface Pin {
  lat: number;
  lng: number;
  color: string;
}

function MapPanel({ pins, count }: { pins: Pin[]; count: number }) {
  const gridSize = 6;
  const cells: { tint: number; pin: string | null }[] = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const pinHere = pins.find((p) => p.lat === r && p.lng === c);
      let tint = 0;
      if (pinHere) tint = 0.55;
      else {
        const nearPins = pins.filter(
          (p) => Math.abs(p.lat - r) <= 1 && Math.abs(p.lng - c) <= 1
        );
        if (nearPins.length > 0) tint = 0.08 + nearPins.length * 0.06;
      }
      cells.push({ tint, pin: pinHere?.color || null });
    }
  }

  return (
    <div style={{ width: "100%", aspectRatio: "1 / 1", position: "relative", background: "var(--bg-alt)", borderRadius: "var(--radius-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: 3,
          padding: 10,
          width: "100%",
          height: "100%",
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            style={{
              borderRadius: 3,
              background: cell.tint > 0 ? `color-mix(in srgb, var(--color-primary) ${Math.round(cell.tint * 100)}%, transparent)` : "var(--nodata)",
              position: "relative",
            }}
          >
            {cell.pin && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: cell.pin,
                  boxShadow: "0 0 0 2px white",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          background: "var(--bg-raised)",
          borderRadius: "var(--radius-pill)",
          padding: "5px 14px",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-2)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {count} results on map
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedFacets, setSelectedFacets] = useState<string[]>(["Fundable only"]);
  const [query, setQuery] = useState("");

  const toggleFacet = (label: string) => {
    if (selectedFacets.includes(label)) {
      setSelectedFacets(selectedFacets.filter((f) => f !== label));
    } else {
      setSelectedFacets([...selectedFacets, label]);
    }
  };

  const filteredResults =
    query.length > 0
      ? SEARCH_RESULTS.filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.place.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase())
        )
      : SEARCH_RESULTS;

  const mapPins: Pin[] = filteredResults.map((r) => ({
    lat: r.lat,
    lng: r.lng,
    color:
      r.status === "healed"
        ? "var(--st-healed-mark)"
        : r.status === "in-progress"
        ? "var(--st-active-mark)"
        : r.status === "assessing"
        ? "var(--st-assess-mark)"
        : "var(--st-open-mark)",
  }));

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96 }}>
      <div className="container" style={{ paddingTop: 44 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display" style={{ color: "var(--text)", marginBottom: 6 }}>
            Search
          </h1>
          <p className="text-body text-2" style={{ marginBottom: 24 }}>
            Find wounds, projects, and places across the ledger.
          </p>
        </motion.div>

        {/* Search field */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ marginBottom: 18 }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              color="var(--text-3)"
              style={{ position: "absolute", top: 15, left: 16, pointerEvents: "none" }}
            />
            <input
              className="input"
              type="text"
              placeholder="projects that keep girls in school in water-stressed districts\u2026"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                paddingLeft: 44,
                paddingRight: 18,
                height: 44,
                borderRadius: "var(--radius-pill)",
                fontSize: 15,
              }}
            />
          </div>
        </motion.div>

        {/* Facet chip bar */}
        <div
          className="flex items-center"
          style={{
            gap: 8,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 4,
            flexWrap: "nowrap",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {FACETS.map((facet) => {
            const isSelected = selectedFacets.includes(facet.label);
            return (
              <button
                key={facet.label}
                className={`chip${isSelected ? " selected" : ""}`}
                onClick={() => toggleFacet(facet.label)}
              >
                {facet.label}
                {facet.hasDropdown && <ChevronDown size={14} />}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <span className="text-label text-2">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-8">
            <button className="btn btn-ghost btn-sm">
              <Bookmark size={14} />
              <span className="desktop-only">Save this search</span>
            </button>
            <div className="tab-group mobile-only">
              <button
                className="tab-item"
                aria-selected={view === "list"}
                onClick={() => setView("list")}
              >
                <List size={15} />
              </button>
              <button
                className="tab-item"
                aria-selected={view === "map"}
                onClick={() => setView("map")}
              >
                <MapIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "64px 24px",
              background: "var(--bg-alt)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border)",
            }}
          >
            <Search size={32} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
            <h3 className="text-h3" style={{ color: "var(--text)", marginBottom: 6 }}>
              No wounds match your search
            </h3>
            <p className="text-caption text-2" style={{ maxWidth: 400, margin: "0 auto 16px" }}>
              Try adjusting your filters or search with a different phrase. You can also browse
              all wounds by clearing the search.
            </p>
            <button className="btn btn-ghost" onClick={() => { setQuery(""); setSelectedFacets([]); }}>
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Results + Map */}
        {filteredResults.length > 0 && (
          <div
            className="mob-col-1 mob-gap-12"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              alignItems: "start",
            }}
          >
            {/* ── Result list ── */}
            <div
              style={{
                display: view === "list" ? "flex" : "none",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {filteredResults.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                  style={{ display: "flex" }}
                >
                  <Link
                    href={`/wound/${result.id}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      padding: 18,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-card)",
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    <div className="flex items-center gap-10">
                      <StatusPill status={result.status} />
                    </div>
                    <h3
                      className="text-h3"
                      style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.35 }}
                    >
                      {result.title}
                    </h3>
                    <p className="text-caption text-2" style={{ lineHeight: 1.45 }}>
                      {result.description}
                    </p>
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-4">
                        <MapPin size={12} color="var(--text-3)" />
                        <span className="text-caption text-2">{result.place}</span>
                      </div>
                      <span
                        className="text-caption"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-2)",
                          fontSize: 13,
                        }}
                      >
                        {result.budget}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ── Map panel ── */}
            <div
              className="desktop-only"
              style={{
                flexDirection: "column",
                position: "sticky",
                top: 100,
              }}
            >
              <MapPanel pins={mapPins} count={filteredResults.length} />
            </div>

            {/* Mobile map */}
            {view === "map" && (
              <div
                className="mobile-only"
                style={{
                  flexDirection: "column",
                }}
              >
                <MapPanel pins={mapPins} count={filteredResults.length} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
