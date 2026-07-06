"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity, TrendingUp, Users, MapPin, CheckCircle,
  Clock, ArrowUp, ArrowDown, Zap
} from "lucide-react";
import Link from "next/link";

const PULSE_DATA = {
  wounds: { total: 12847, open: 3421, assessing: 1256, routed: 893, inProgress: 2147, healed: 4210, failed: 920 },
  activity: [
    { time: "2m ago", text: "New wound reported in Ward 7, Jalgaon — broken handpump", type: "reported" as const },
    { time: "5m ago", text: "Verifier assigned to SETU-MH-0008 — Lake desilting milestone 2", type: "assigned" as const },
    { time: "12m ago", text: "SETU-BR-0001 marked In Progress — NGO mobilized", type: "progress" as const },
    { time: "18m ago", text: "Escrow release triggered for Lake restoration Phase I — ₹4.4L", type: "funding" as const },
    { time: "25m ago", text: "SETU-KA-0001 verification passed — Lake revived, 180 borewells recharged", type: "healed" as const },
    { time: "32m ago", text: "New corroboration on SETU-UP-0002 — Arsenic in handpump", type: "corroboration" as const },
    { time: "41m ago", text: "SETU-MH-0005 routed to MSEDCL — 61 witnesses attached", type: "routed" as const },
    { time: "55m ago", text: "CSR matched: Aditya Infra Ltd adopts SETU-MH-0010 — Lake desilting", type: "funding" as const },
  ],
  csr: { totalDeployed: "₹8.2 Cr", activeProjects: 12, companiesEngaged: 4, pendingApprovals: 3 },
  growth: { wounds: "+12%", verifications: "+18%", csrMatch: "+24%" },
};

const typeStyles: Record<string, { bg: string; dot: string; icon: typeof Activity }> = {
  reported: { bg: "var(--st-open-wash)", dot: "var(--st-open-mark)", icon: MapPin },
  assigned: { bg: "var(--st-active-wash)", dot: "var(--st-active-mark)", icon: Activity },
  progress: { bg: "var(--c-p-50)", dot: "var(--action)", icon: TrendingUp },
  funding: { bg: "var(--st-gov-wash)", dot: "var(--st-gov-mark)", icon: Zap },
  healed: { bg: "var(--st-healed-wash)", dot: "var(--st-healed-mark)", icon: CheckCircle },
  corroboration: { bg: "var(--bg-muted)", dot: "var(--text-2)", icon: Users },
  routed: { bg: "var(--st-gov-wash)", dot: "var(--st-gov-mark)", icon: ArrowUp },
};

export default function PulsePage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 40 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <h1 className="text-h1" style={{ margin: 0 }}>Pulse</h1>
          <span className="chip" style={{ background: "var(--st-healed-wash)", pointerEvents: "none" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--st-healed-mark)", display: "inline-block", marginRight: 6, animation: "pulse-beat 2s infinite" }} />
            Live
          </span>
        </div>
        <p className="text-body-lg text-2" style={{ marginBottom: 32 }}>
          {formatTime(time)} IST — Real-time platform activity
        </p>

        {/* Metric Row */}
        <div className="grid-responsive" style={{ marginBottom: 36 }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Total wounds</p>
            <span className="text-number">{PULSE_DATA.wounds.total.toLocaleString("en-IN")}</span>
            <span className="delta delta-up" style={{ alignSelf: "flex-start" }}>
              <ArrowUp size={10} />{PULSE_DATA.growth.wounds}
            </span>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">Healed</p>
            <span className="text-number" style={{ color: "var(--st-healed-mark)" }}>{PULSE_DATA.wounds.healed.toLocaleString("en-IN")}</span>
            <span className="delta delta-up" style={{ alignSelf: "flex-start" }}>
              <ArrowUp size={10} />{PULSE_DATA.growth.verifications}
            </span>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="text-caption text-2">CSR deployed</p>
            <span className="text-number" style={{ color: "var(--action)" }}>{PULSE_DATA.csr.totalDeployed}</span>
            <span className="delta delta-up" style={{ alignSelf: "flex-start" }}>
              <ArrowUp size={10} />{PULSE_DATA.growth.csrMatch}
            </span>
          </div>
        </div>

        {/* Main two-column */}
        <div className="layout-split" style={{ marginTop: 8 }}>
          {/* Left: Activity feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 className="text-label-up text-2" style={{ marginBottom: 0 }}>Live activity</h2>
            {PULSE_DATA.activity.map((a, i) => {
              const ts = typeStyles[a.type] || typeStyles.reported;
              const Icon = ts.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="card card-compact"
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: ts.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={15} color={ts.dot} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="text-label" style={{ fontSize: 13.5, color: "var(--text)", margin: 0 }}>{a.text}</p>
                    <p className="text-caption text-3" style={{ marginTop: 3 }}>{a.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Stats panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Wound breakdown */}
            <div className="card" style={{ padding: 20 }}>
              <h3 className="text-label-up text-3" style={{ marginBottom: 16 }}>Wound breakdown</h3>
              {[
                { label: "Open", value: PULSE_DATA.wounds.open, color: "var(--st-open-mark)" },
                { label: "Assessing", value: PULSE_DATA.wounds.assessing, color: "var(--st-assess-mark)" },
                { label: "Routed", value: PULSE_DATA.wounds.routed, color: "var(--st-gov-mark)" },
                { label: "In Progress", value: PULSE_DATA.wounds.inProgress, color: "var(--st-active-mark)" },
                { label: "Healed", value: PULSE_DATA.wounds.healed, color: "var(--st-healed-mark)" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span className="text-caption" style={{ flex: 1, color: "var(--text-2)" }}>{item.label}</span>
                  <span className="text-mono" style={{ fontWeight: 600, fontSize: 13 }}>{item.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* CSR overview */}
            <div className="card" style={{ padding: 20 }}>
              <h3 className="text-label-up text-3" style={{ marginBottom: 16 }}>CSR at a glance</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-2">Active projects</span>
                  <span className="text-mono" style={{ fontWeight: 600 }}>{PULSE_DATA.csr.activeProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-2">Companies engaged</span>
                  <span className="text-mono" style={{ fontWeight: 600 }}>{PULSE_DATA.csr.companiesEngaged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-2">Pending approvals</span>
                  <span className="text-mono" style={{ fontWeight: 600, color: "var(--st-failed-mark)" }}>{PULSE_DATA.csr.pendingApprovals}</span>
                </div>
              </div>
            </div>

            <Link href="/atlas" className="btn btn-outline" style={{ textDecoration: "none", justifyContent: "center" }}>
              View full Atlas <ArrowUp size={14} style={{ transform: "rotate(45deg)" }} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-beat { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </motion.div>
  );
}
