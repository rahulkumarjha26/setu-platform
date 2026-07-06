"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ReportPopupCtx {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const Ctx = createContext<ReportPopupCtx>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function useReportPopup() {
  return useContext(Ctx);
}

export function ReportPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return <Ctx.Provider value={{ isOpen, open, close }}>{children}</Ctx.Provider>;
}
