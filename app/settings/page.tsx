"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Download,
  Globe,
  Bell,
  Shield,
  FolderDown,
  UserCheck,
  LogOut,
} from "lucide-react";

const SECTIONS = [
  {
    label: "Preferences",
    rows: [
      { icon: Globe, label: "Language", value: "English", href: null },
      { icon: Bell, label: "Notifications", value: "On", href: null },
    ],
  },
  {
    label: "Data & Privacy",
    rows: [
      { icon: Shield, label: "Privacy & consent", value: undefined, href: null },
      { icon: Download, label: "Download my data", value: undefined, href: null },
    ],
  },
  {
    label: "Account",
    rows: [
      { icon: UserCheck, label: "Verify my role", value: undefined, href: "/onboarding" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", paddingBottom: 120 }}
    >
      <div className="container mob-px-16" style={{ paddingTop: 56, maxWidth: 640 }}>
        <h1 className="text-display" style={{ marginBottom: 40 }}>
          Settings
        </h1>

        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <h2
                className="text-label-up text-3"
                style={{ marginBottom: 12, padding: "0 4px" }}
              >
                {section.label}
              </h2>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {section.rows.map((row, i) => {
                  const RowContent = (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <row.icon size={18} color="var(--text-2)" />
                        <span className="text-body" style={{ fontWeight: 500 }}>
                          {row.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {row.value && (
                          <span className="text-caption text-2">{row.value}</span>
                        )}
                        <ChevronRight size={16} color="var(--text-3)" />
                      </div>
                    </div>
                  );

                  return (
                    <div key={row.label}>
                      {i > 0 && (
                        <hr className="divider" style={{ margin: "0 20px" }} />
                      )}
                      {row.href ? (
                        <Link
                          href={row.href}
                          style={{ textDecoration: "none", color: "inherit", display: "block" }}
                        >
                          {RowContent}
                        </Link>
                      ) : (
                        RowContent
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <div style={{ padding: "0 4px" }}>
            <button
              className="btn btn-ghost"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                padding: "16px 20px",
                height: "auto",
                borderRadius: "var(--radius-input)",
                color: "var(--report)",
                gap: 14,
              }}
            >
              <LogOut size={18} color="var(--report)" />
              <span className="text-body" style={{ fontWeight: 500 }}>
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
