"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ListFilter, Plus, User, Search, Bell, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useReportPopup } from "./ReportPopupContext";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { useRole } from "./RoleContext";

const ROLE_LENSES: Record<string, { id: string; href: string; Icon: typeof LayoutDashboard; label: string }[]> = {
  citizen: [
    { id: "home", href: "/home", Icon: LayoutDashboard, label: "Home" },
    { id: "atlas", href: "/atlas", Icon: Globe, label: "Atlas" },
    { id: "stream", href: "/stream", Icon: ListFilter, label: "Stream" },
    { id: "search", href: "/search", Icon: Search, label: "Search" },
    { id: "notifications", href: "/notifications", Icon: Bell, label: "Notifications" },
  ],
  ngo: [
    { id: "home", href: "/home", Icon: LayoutDashboard, label: "Home" },
    { id: "ngo", href: "/ngo", Icon: LayoutDashboard, label: "NGO" },
    { id: "atlas", href: "/atlas", Icon: Globe, label: "Atlas" },
    { id: "stream", href: "/stream", Icon: ListFilter, label: "Stream" },
    { id: "notifications", href: "/notifications", Icon: Bell, label: "Notifications" },
  ],
  corporate: [
    { id: "console", href: "/corporate", Icon: LayoutDashboard, label: "Console" },
    { id: "atlas", href: "/atlas", Icon: Globe, label: "Atlas" },
    { id: "stream", href: "/stream", Icon: ListFilter, label: "Stream" },
    { id: "search", href: "/search", Icon: Search, label: "Search" },
    { id: "notifications", href: "/notifications", Icon: Bell, label: "Notifications" },
  ],
  government: [
    { id: "home", href: "/home", Icon: LayoutDashboard, label: "Home" },
    { id: "government", href: "/government", Icon: LayoutDashboard, label: "Government" },
    { id: "atlas", href: "/atlas", Icon: Globe, label: "Atlas" },
    { id: "stream", href: "/stream", Icon: ListFilter, label: "Stream" },
    { id: "notifications", href: "/notifications", Icon: Bell, label: "Notifications" },
  ],
};

export function DockShell() {
  const pathname = usePathname();
  const { open } = useReportPopup();
  const { role } = useRole();
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;
  const lenses = ROLE_LENSES[role] ?? ROLE_LENSES.citizen;

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
      </motion.nav>
    </div>
  );
}
