"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  BarChart3,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Check,
  ArrowUp,
  Minus,
  Download,
  Calendar,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

const SUB_NAV = [
  { id: "discovery", label: "Discovery", icon: Search },
  { id: "bundles", label: "Bundles", icon: Package },
  { id: "scoring", label: "NGO scoring", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "proof", label: "Proof", icon: ShieldCheck },
  { id: "compliance", label: "Compliance", icon: FileCheck },
];

const PROJECTS = [
  {
    name: "Lake restoration Phase I",
    district: "Muzaffarpur, Bihar",
    budget: "₹22,00,000",
    milestone: { disbursed: 45, held: 35, pending: 20 },
    status: "in-progress" as const,
    verified: true,
  },
  {
    name: "School sanitation — 8 units",
    district: "Arrah, Bihar",
    budget: "₹8,50,000",
    milestone: { disbursed: 100, held: 0, pending: 0 },
    status: "healed" as const,
    verified: true,
  },
  {
    name: "Migrant health camp Q3",
    district: "Buxar, Bihar",
    budget: "₹6,80,000",
    milestone: { disbursed: 30, held: 50, pending: 20 },
    status: "assessing" as const,
    verified: false,
  },
  {
    name: "Anganwadi repair — 12 centres",
    district: "Darbhanga, Bihar",
    budget: "₹5,40,000",
    milestone: { disbursed: 70, held: 20, pending: 10 },
    status: "in-progress" as const,
    verified: true,
  },
  {
    name: "Waste segregation — 40 wards",
    district: "Sasaram, Bihar",
    budget: "₹18,00,000",
    milestone: { disbursed: 15, held: 60, pending: 25 },
    status: "in-progress" as const,
    verified: false,
  },
  {
    name: "Sewage connection — 60 HH",
    district: "Samastipur, Bihar",
    budget: "₹8,80,000",
    milestone: { disbursed: 55, held: 25, pending: 20 },
    status: "in-progress" as const,
    verified: true,
  },
];

const PROOF_LAYERS = [
  { label: "Geo-tagged photo", done: true },
  { label: "Independent verifier", done: true },
  { label: "Community validation", done: false },
  { label: "Outcome measured", done: false },
];

export default function CorporatePage() {
  const [activeNav, setActiveNav] = useState("portfolio");
  const [selectedProject, setSelectedProject] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container" style={{ paddingTop: 56 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <h1 className="text-h1">Corporate Console</h1>
          <span className="role-badge" style={{ background: "var(--c-r-50)" }}>
            <span className="role-dot" style={{ background: "var(--role-corp)" }} />
            Corporate
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 32 }}>
          Tata CSR Foundation
        </p>

        {/* Metric Strip */}
        <div className="grid grid-3 gap-24" style={{ marginBottom: 36 }}>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Total matched</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">₹3.2 Cr</span>
              <span className="delta delta-up">
                <ArrowUp size={10} />
                18%
              </span>
            </div>
          </div>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Active projects</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">12</span>
              <span className="delta delta-flat">
                <Minus size={10} />
                Q2
              </span>
            </div>
          </div>
          <div className="card card-metric" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Verified projects</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span className="text-number">87%</span>
              <svg width={32} height={32} viewBox="0 0 32 32">
                <circle cx={16} cy={16} r={13} fill="none" stroke="var(--border)" strokeWidth={2} />
                <circle
                  cx={16} cy={16} r={13}
                  fill="none"
                  stroke="var(--st-healed-mark)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={`${(87 / 100) * 81.68} 81.68`}
                  transform="rotate(-90 16 16)"
                />
                <text x={16} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--text)" fontFamily="var(--font-mono)">
                  87
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {SUB_NAV.map((item) => (
            <button
              key={item.id}
              className={`chip${activeNav === item.id ? " selected" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main: Table + Right Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>District</th>
                  <th className="cell-right">Budget ₹</th>
                  <th>Milestone</th>
                  <th>Status</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p, i) => (
                  <tr
                    key={p.name}
                    onClick={() => setSelectedProject(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ fontWeight: 500, color: i === selectedProject ? "var(--action)" : "inherit" }}>
                      {p.name}
                    </td>
                    <td style={{ color: "var(--text-2)" }}>{p.district}</td>
                    <td className="cell-right">{p.budget}</td>
                    <td>
                      <div style={{ display: "flex", gap: 2, alignItems: "center", width: 100 }}>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: "var(--action)",
                            flex: p.milestone.disbursed,
                            minWidth: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: "var(--border)",
                            flex: p.milestone.held,
                            minWidth: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: "var(--bg-muted)",
                            flex: p.milestone.pending,
                            minWidth: 4,
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <StatusPill status={p.status} />
                    </td>
                    <td>
                      {p.verified ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--st-healed-mark)", fontWeight: 500 }}>
                          <Check size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="text-caption text-3">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Panel — desktop */}
          <div className="desktop-only" style={{ flexDirection: "column", display: "flex", gap: 20, position: "sticky", top: 32 }}>
            {/* Proof Ledger */}
            <div className="card" style={{ padding: 20 }}>
              <h3 className="text-label-up text-3" style={{ marginBottom: 16 }}>
                Proof ledger
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PROOF_LAYERS.map((layer) => (
                  <div
                    key={layer.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-input)",
                      background: layer.done ? "var(--st-healed-wash)" : "var(--bg-muted)",
                    }}
                  >
                    {layer.done ? (
                      <Check size={14} color="var(--st-healed-mark)" />
                    ) : (
                      <span style={{ width: 14, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>&mdash;</span>
                    )}
                    <span
                      className="text-caption"
                      style={{
                        color: layer.done ? "var(--st-healed-mark)" : "var(--text-3)",
                        fontWeight: 500,
                      }}
                    >
                      {layer.label}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16, width: "100%" }}
              >
                <Download size={14} />
                Export board report
              </button>
            </div>

            {/* CSR Compliance */}
            <div className="card" style={{ padding: 20 }}>
              <h3 className="text-label-up text-3" style={{ marginBottom: 14 }}>
                CSR Compliance
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Check size={16} color="var(--st-healed-mark)" />
                <span className="text-body" style={{ fontWeight: 500 }}>All funds compliant</span>
              </div>
              <p className="text-caption text-2" style={{ marginBottom: 12 }}>
                Next audit: 31 Mar 2026
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-input)",
                  background: "var(--bg-muted)",
                  cursor: "pointer",
                }}
              >
                <Calendar size={14} color="var(--text-2)" />
                <span className="text-caption" style={{ color: "var(--action)", fontWeight: 500 }}>
                  CSR calendar &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
