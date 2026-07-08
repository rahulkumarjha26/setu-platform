import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · SETU",
  description:
    "Terms of service for SETU — the civic issue tracking platform. Acceptance, use license, limitations, and governing law.",
};

const SECTIONS = [
  {
    title: "Acceptance",
    body: "By accessing or using the SETU platform, you agree to be bound by these terms. If you do not agree, you may not use the platform. Continued use after changes to these terms constitutes acceptance of the updated terms. You must be at least 18 years old to create an account.",
  },
  {
    title: "Use License",
    body: "SETU grants you a non-exclusive, non-transferable, revocable license to access and use the platform for lawful purposes related to civic issue reporting, tracking, and resolution. You may not reproduce, distribute, or create derivative works from the platform without prior written consent. Report data submitted to SETU becomes part of the public civic ledger.",
  },
  {
    title: "User Responsibilities",
    body: "You agree to provide accurate information when submitting reports and to not misuse the platform for spam, harassment, fraud, or any unlawful activity. You are responsible for maintaining the confidentiality of your account credentials. You must not attempt to manipulate verification data, impersonate verifiers, or disrupt platform operations.",
  },
  {
    title: "Limitations",
    body: "SETU is provided \"as is\" without warranties of any kind, express or implied. We do not guarantee that the platform will be uninterrupted, error-free, or that all reported issues will be resolved. SETU shall not be liable for any indirect, incidental, or consequential damages arising from the use of the platform. Our total liability is limited to the amount you have paid to use the platform in the preceding twelve months.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of New Delhi. The platform operates from India and makes no claim that it is accessible or appropriate outside India.",
  },
  {
    title: "Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Significant changes will be communicated to registered users via email or platform notification.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 16,
          paddingBottom: 16,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          className="text-serif text-petrol"
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}
        >
          सेतु · SETU
        </Link>
        <nav className="flex items-center" style={{ gap: 20 }}>
          <Link href="/atlas" className="text-body text-2" style={{ fontWeight: 500 }}>
            Atlas
          </Link>
          <Link
            href="/report"
            className="btn btn-primary"
            style={{ height: 36, padding: "0 18px", fontSize: 14 }}
          >
            Report a wound
          </Link>
        </nav>
      </header>

      <section className="container" style={{ paddingTop: 64, paddingBottom: 48, flex: 1 }}>
        <h1 className="text-display" style={{ color: "var(--text)", maxWidth: 640, marginBottom: 48 }}>
          Terms of Service
        </h1>
        <p
          className="text-body text-2"
          style={{ maxWidth: 680, marginBottom: 40, fontSize: 14 }}
        >
          Last updated: July 2026
        </p>

        <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 40 }}>
          {SECTIONS.map((section) => (
            <article key={section.title}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {section.title}
              </h2>
              <p className="text-body" style={{ color: "var(--text-2)", lineHeight: 1.7, maxWidth: 600 }}>
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer
        className="mob-px-16"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
          padding: "24px 32px",
          borderTop: "1px solid var(--border)",
          marginBottom: 80,
        }}
      >
        <span
          className="text-serif text-2"
          style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.02em" }}
        >
          सेतु · SETU
        </span>
      </footer>
    </div>
  );
}
