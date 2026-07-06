"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  TrendingUp,
  FileText,
  Globe,
  Search,
  BarChart3,
  Check,
} from "lucide-react";
import { StatusPill } from "../components/StatusPill";

const SUB_NAV = [
  { id: "eligibility", label: "Eligibility", icon: ClipboardList },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "proposal", label: "Proposal drafter", icon: FileText },
  { id: "microsite", label: "Microsite", icon: Globe },
  { id: "funders", label: "Find funders", icon: Search },
  { id: "score", label: "Score", icon: BarChart3 },
];

const KANBAN_COLS = [
  {
    title: "Matched",
    cards: [
      { title: "School sanitation — 8 units", budget: "₹3.2 L", district: "Arrah, Bihar", status: "assessing" as const },
      { title: "Handpump repair — 14 villages", budget: "₹2.8 L", district: "Chhapra, Bihar", status: "assessing" as const },
      { title: "Drainage desilting Ward 4", budget: "₹1.2 L", district: "Ara, Bihar", status: "assessing" as const },
    ],
  },
  {
    title: "Draft",
    cards: [
      { title: "Migrant labour health camp Q3", budget: "₹6.8 L", district: "Buxar, Bihar", status: "assessing" as const },
      { title: "Waste segregation pilot 40 wards", budget: "₹4.5 L", district: "Sasaram, Bihar", status: "assessing" as const },
    ],
  },
  {
    title: "Submitted",
    cards: [
      { title: "Lake restoration Phase I", budget: "₹22 L", district: "Muzaffarpur, Bihar", status: "assessing" as const },
      { title: "Anganwadi repair 12 centres", budget: "₹5.4 L", district: "Darbhanga, Bihar", status: "assessing" as const },
    ],
  },
  {
    title: "Funded",
    cards: [
      { title: "Primary health centre Chintamani", budget: "₹15 L", district: "Gaya, Bihar", status: "in-progress" as const },
      { title: "Sewage connection 60 households", budget: "₹8.5 L", district: "Samastipur, Bihar", status: "in-progress" as const },
    ],
  },
];

export default function NGOPage() {
  const [activeNav, setActiveNav] = useState("pipeline");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 56 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <h1 className="text-h1">NGO Workspace</h1>
          <span className="role-badge" style={{ background: "var(--st-gov-wash)" }}>
            <span className="role-dot" style={{ background: "var(--role-ngo)" }} />
            NGO
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 32 }}>
          Jal Seva Foundation
        </p>

        {/* Eligibility Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 36,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            {[
              { label: "12A", ok: true },
              { label: "80G", ok: true },
              { label: "CSR-1", ok: true },
              { label: "Darpan", ok: true },
            ].map((e) => (
              <span
                key={e.label}
                className="pill"
                style={{
                  color: "var(--st-healed-mark)",
                  background: "var(--st-healed-wash)",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: 13,
                  height: 28,
                  padding: "0 12px",
                }}
              >
                <Check size={12} />
                {e.label}
              </span>
            ))}
            <span
              className="pill"
              style={{
                color: "var(--report)",
                background: "var(--c-r-50)",
                fontWeight: 500,
                textTransform: "none",
                letterSpacing: 0,
                fontSize: 13,
                height: 28,
                padding: "0 12px",
              }}
            >
              Track record — 2 of 3 yrs
            </span>
          </div>

          {/* Score Ring */}
          <div
            className="desktop-only"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingLeft: 16,
              borderLeft: "1px solid var(--border)",
            }}
          >
            <svg width={52} height={52} viewBox="0 0 52 52">
              <circle cx={26} cy={26} r={22} fill="none" stroke="var(--border)" strokeWidth={3} />
              <circle
                cx={26}
                cy={26}
                r={22}
                fill="none"
                stroke="var(--st-healed-mark)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={`${(82 / 100) * 138.23} 138.23`}
                transform="rotate(-90 26 26)"
                style={{ transition: "stroke-dasharray 0.8s var(--ease)" }}
              />
              <text x={26} y={30} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--text)" fontFamily="var(--font-mono)">
                82
              </text>
            </svg>
            <span className="text-caption text-2" style={{ lineHeight: 1.2 }}>
              Verification<br />score
            </span>
          </div>
        </div>

        {/* Body: Sub-nav + Kanban */}
        <div className="mob-flex-col mob-gap-12" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Desktop Sub-nav */}
          <nav
            className="desktop-only"
            style={{
              width: 210,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "sticky",
              top: 32,
            }}
          >
            {SUB_NAV.map((item) => (
              <button
                key={item.id}
                className="tab-item"
                aria-selected={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <item.icon size={16} style={{ marginRight: 10 }} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Sub-nav */}
          <div
            className="mobile-only"
            style={{
              overflowX: "auto",
              paddingBottom: 8,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
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
          </div>

          {/* Kanban Board */}
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {activeNav === "pipeline" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {KANBAN_COLS.map((col) => (
                  <div key={col.title}>
                    <h3
                      className="text-label-up text-3"
                      style={{
                        marginBottom: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{col.title}</span>
                      <span
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: "var(--radius-pill)",
                          background: "var(--bg-muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--text-2)",
                        }}
                      >
                        {col.cards.length}
                      </span>
                    </h3>
                    <div
                      className="stagger"
                      style={{ display: "flex", flexDirection: "column", gap: 10 }}
                    >
                      {col.cards.length > 0 ? (
                        col.cards.map((card) => (
                          <Link
                            key={card.title}
                            href="/wound/SETU-BR-1201"
                            className="card card-compact"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                              transition: "box-shadow 0.2s var(--ease)",
                            }}
                          >
                            <StatusPill status={card.status} />
                            <h4
                              className="text-h3"
                              style={{
                                marginTop: 10,
                                marginBottom: 6,
                                fontSize: 14,
                              }}
                            >
                              {card.title}
                            </h4>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                              <span className="text-mono text-caption" style={{ fontWeight: 600 }}>
                                {card.budget}
                              </span>
                              <span className="text-caption text-2">{card.district}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div
                          style={{
                            padding: "40px 20px",
                            textAlign: "center",
                            border: "1px dashed var(--border)",
                            borderRadius: "var(--radius-card)",
                          }}
                        >
                          <p className="text-caption text-3">
                            No {col.title.toLowerCase()} projects yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeNav !== "pipeline" && (() => {
              const navItem = SUB_NAV.find((s) => s.id === activeNav);
              const NavIcon = navItem?.icon;
              return (
                <div className="card" style={{ padding: 48, textAlign: "center" }}>
                  {NavIcon && <NavIcon size={32} color="var(--text-3)" />}
                  <p className="text-body text-2" style={{ marginTop: 16 }}>
                    {navItem?.label} — coming soon
                  </p>
                </div>
              );
            })()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
