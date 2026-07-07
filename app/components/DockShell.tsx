"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ListFilter, Plus, User, Search, Bell, LayoutDashboard, Settings, BarChart3, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { useReportPopup } from "./ReportPopupContext";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { useRole } from "./RoleContext";

const CONSOLE_ROUTE: Record<string, string> = {
  citizen: "/home",
  ngo: "/ngo",
  corporate: "/corporate",
  government: "/government",
};

const LENSES: { id: string; href: string; Icon: typeof LayoutDashboard; label: string }[] = [
  { id: "console", href: "", Icon: LayoutDashboard, label: "Console" },
  { id: "analytics", href: "/analytics", Icon: BarChart3, label: "Analytics" },
  { id: "atlas", href: "/atlas", Icon: Globe, label: "Atlas" },
  { id: "stream", href: "/stream", Icon: ListFilter, label: "Stream" },
  { id: "search", href: "/search", Icon: Search, label: "Search" },
  { id: "funder-matching", href: "/funder-matching", Icon: Handshake, label: "Funder" },
  { id: "notifications", href: "/notifications", Icon: Bell, label: "Notifications" },
];

export function DockShell() {
  const pathname = usePathname();
  const { open } = useReportPopup();
  const { role } = useRole();
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;
  const lenses = LENSES.map((lens) =>
    lens.id === "console"
      ? { ...lens, href: CONSOLE_ROUTE[role] ?? "/home" }
      : lens
  );

  return (
    <div className="dock-container">
      <motion.nav
        className="dock"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
      >
        {lenses.map((lens) => (
          <Link
            key={lens.id}
            href={lens.href}
            className={`dock-btn${pathname === lens.href ? " is-active" : ""}`}
            aria-label={lens.label}
            aria-current={pathname === lens.href ? "page" : undefined}
            style={{ position: "relative" }}
          >
            <lens.Icon size={20} />
            {lens.id === "notifications" && unreadCount > 0 && (
              <span className="dock-badge">{unreadCount}</span>
            )}
          </Link>
        ))}
        <span className="dock-divider" aria-hidden="true" />
        <button
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
          className="dock-report-btn"
          aria-label="Report a wound"
        >
          <Plus size={22} />
        </button>
        <span className="dock-divider" aria-hidden="true" />
        <Link
          href="/profile"
          className={`dock-btn${pathname === "/profile" ? " is-active" : ""}`}
          aria-label="My profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          <User size={20} />
        </Link>
        <Link
          href="/settings"
          className={`dock-btn${pathname === "/settings" ? " is-active" : ""}`}
          aria-label="Settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
        >
          <Settings size={20} />
        </Link>
      </motion.nav>
    </div>
  );
}
