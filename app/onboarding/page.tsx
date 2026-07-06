"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, User, HeartHandshake, Building2, Landmark, ArrowRight } from "lucide-react";

const ROLES = [
  {
    key: "citizen",
    label: "Citizen",
    color: "var(--role-citizen)",
    description: "See and report wounds near you",
    icon: User,
    href: "/atlas",
  },
  {
    key: "ngo",
    label: "NGO",
    color: "var(--role-ngo)",
    description: "Find fundable projects and run them",
    icon: HeartHandshake,
    href: "/ngo",
  },
  {
    key: "corporate",
    label: "Corporate",
    color: "var(--role-corp)",
    description: "Fund verified projects with proof",
    icon: Building2,
    href: "/corporate",
  },
  {
    key: "government",
    label: "Government",
    color: "var(--role-gov)",
    description: "Track and resolve in your jurisdiction",
    icon: Landmark,
    href: "/government",
  },
];

export default function OnboardingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
      }}
    >
      <Link
        href="/"
        className="text-serif text-petrol"
        style={{
          fontSize: "clamp(2rem, 1.5rem + 3vw, 2.75rem)",
          marginBottom: 12,
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        सेतु
      </Link>

      <h1 className="text-h1" style={{ marginBottom: 40, textAlign: "center" }}>
        How will you use Setu?
      </h1>

      <div style={{ marginBottom: 40 }}>
        <button
          className="pill"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text-2)",
            fontWeight: 500,
            textTransform: "none",
            letterSpacing: 0,
            fontSize: 14,
            height: 38,
            padding: "0 18px",
            gap: 8,
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            border: "none",
          }}
        >
          <Globe size={15} />
          English
          <span style={{ fontSize: 10, opacity: 0.5 }}>▾</span>
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-2 gap-16"
        style={{ maxWidth: 900, width: "100%" }}
      >
        {ROLES.map((role) => (
          <motion.div
            key={role.key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={role.href}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 28,
                textDecoration: "none",
              }}
            >
              <div
                className="role-dot"
                style={{
                  width: 16,
                  height: 16,
                  background: role.color,
                }}
              />

              <div className="flex items-center justify-between">
                <h3 className="text-h3">{role.label}</h3>
                <motion.span
                  whileHover={{ x: 4 }}
                  style={{ color: "var(--text-3)", display: "flex", alignItems: "center" }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </div>

              <p className="text-body text-2">{role.description}</p>

              <div style={{ marginTop: "auto" }}>
                <role.icon size={18} color="var(--text-3)" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <p
        className="text-caption text-2"
        style={{ marginTop: 32, textAlign: "center" }}
      >
        Your role helps us show you the right lens. You can always switch later.
      </p>
    </motion.div>
  );
}
