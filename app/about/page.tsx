import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · SETU — The White Civic Ledger",
  description:
    "SETU is a civic issue tracking platform for India. Every pin is a real report, every status change is verified proof.",
};

const SECTIONS = [
  {
    title: "Our Mission",
    body: "SETU exists to build the first open, verifiable civic ledger for India. Every pothole, broken streetlight, stalled repair, and resolved grievance is recorded — not in forgotten complaint books, but on a public map that anyone can inspect. We believe transparency is the foundation of civic trust.",
  },
  {
    title: "What We Do",
    body: "Citizens report civic issues — what we call wounds — through the SETU platform. Each report becomes a pin on the national atlas. Government agencies, NGOs, and corporate partners can claim, route, and resolve wounds. Every status transition is witnessed and verified, creating an unbroken chain of custody from report to resolution.",
  },
  {
    title: "How Verification Works",
    body: "Verification is the core of SETU. When a wound is reported, it carries photo evidence and location data. When progress is made, it is documented and attested. When a wound is healed, independent verifiers confirm the resolution. This multi-party witnessing ensures that the civic record reflects reality, not bureaucracy.",
  },
  {
    title: "Who It Is For",
    body: "SETU is designed for every stakeholder in India's civic ecosystem: citizens who want their neighbourhoods fixed, government agencies that need reliable data to prioritise work, NGOs that advocate for community infrastructure, and corporate partners fulfilling CSR obligations with measurable impact.",
  },
  {
    title: "The Name",
    body: "सेतु (Setu) means bridge in Sanskrit and many Indian languages. The platform is a bridge between those who report problems and those who can solve them — between a wound and its healing, between data and action.",
  },
];

export default function AboutPage() {
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
          About SETU
        </h1>

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
