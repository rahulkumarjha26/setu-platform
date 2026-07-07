"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RoleKey } from "@/lib/mock-data";

const STORAGE_KEY = "setu-role";

interface RoleContextValue {
  role: RoleKey;
  setRole: (role: RoleKey) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleKey>("citizen");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["citizen", "ngo", "corporate", "government"].includes(stored)) {
      setRole(stored as RoleKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
