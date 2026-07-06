import type { Metadata } from "next";
import "./globals.css";
import { DockShell } from "./components/DockShell";
import { Providers } from "./components/Providers";
import { ReportPopup } from "./components/ReportPopup";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "सेतु · SETU — The White Civic Ledger",
  description:
    "One living civic record. Wounds mapped, healing verified, proof public.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <main id="main" style={{ minHeight: "100vh", paddingBottom: 100 }}>
            {children}
          </main>
          <DockShell />
          <ReportPopup />
        </Providers>
      </body>
    </html>
  );
}
