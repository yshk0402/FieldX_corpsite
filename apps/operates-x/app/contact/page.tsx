import type { Metadata } from "next";

import { TallyRequestEmbed } from "../components/ContactEmbeds";
import { SiteHeader } from "../components/SiteHeader";
import { getSiteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ | AImate",
  description: "AI業務改善のご相談・資料請求はこちらからお問い合わせください。",
  alternates: {
    canonical: `${getSiteUrl()}/contact`
  }
};

export default function ContactPage() {
  return (
    <main className="fx-site fx-listing-page">
      <div className="fx-shell">
        <section className="fx-listing-hero" aria-labelledby="contact-page-title">
          <SiteHeader currentPath="/contact" />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">contact</p>
            <h1 id="contact-page-title" className="fx-listing-title">
              お問い合わせ
            </h1>
          </div>
        </section>
        <section className="fx-listing-section" aria-label="お問い合わせ">
          <div className="fx-subpage-content">
            <TallyRequestEmbed />
          </div>
        </section>
      </div>
    </main>
  );
}
