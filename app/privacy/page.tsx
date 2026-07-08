import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · SETU",
  description:
    "SETU privacy policy — how we collect, use, and protect your personal data on the civic issue tracking platform.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you use SETU, we collect information you provide directly — such as your name, email address, and location data when submitting a report. We also collect usage data, including page views, interactions, and device information, to improve the platform. Reports you submit are stored permanently as part of the public civic ledger, associated with your account.",
  },
  {
    title: "How We Use It",
    body: "Your information is used to operate and maintain the SETU platform, to verify civic reports, to communicate status updates, and to generate anonymised aggregate statistics about civic issues across India. We do not sell personal data. Account information is kept private; only report content and verification data are visible on the public atlas.",
  },
  {
    title: "Data Sharing",
    body: "Report data may be shared with government agencies, NGOs, or corporate partners responsible for resolution in the relevant jurisdiction. This sharing is limited to what is necessary to address the reported issue. We never share your personal contact information outside the platform without your explicit consent.",
  },
  {
    title: "Data Security",
    body: "We implement industry-standard security measures, including encryption in transit and at rest, access controls, and regular security audits. Account passwords are hashed and salted. Your data is stored on secure servers. Despite these measures, no online platform can guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us. Report data that is part of the civic ledger cannot be deleted, as it forms a permanent public record. You may close your account at any time, which will remove your personal profile but preserve public report history.",
  },
  {
    title: "Contact",
    body: "For privacy-related inquiries, please reach out to our data protection team. We respond to all requests within 30 days.",
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
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
