import Image from "next/image";
import Link from "next/link";

import footerBrandImage from "../../../Group 235.png";

type SiteFooterProps = {
  company: string;
};

const footerColumns = [
  {
    heading: "ABOUT",
    links: [
      { href: "/about#company-profile", label: "会社概要" },
      { href: "/about#team", label: "役員紹介" },
      { href: "/about#mvv", label: "私たちについて" },
      { href: "/about#history", label: "採用情報" }
    ]
  },
  {
    heading: "SERVICE",
    links: [
      { href: "/service", label: "AX Solution事業" },
      { href: "/service", label: "AI Agent事業" }
    ]
  },
  {
    heading: "COLUMN",
    links: [
      { href: "/column/magazine", label: "マガジン" },
      { href: "/column/materials", label: "資料一覧" }
    ]
  },
  {
    heading: "NEWS",
    links: []
  }
] as const;

export function SiteFooter({ company }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="fx-site-footer">
      <div className="fx-shell fx-site-footer-shell">
        <div className="fx-site-footer-brand">
          <div className="fx-site-footer-brand-image-wrap" aria-hidden="true">
            <Image
              src={footerBrandImage}
              alt=""
              width={1072}
              height={313}
              className="fx-site-footer-brand-image"
            />
          </div>
          <p className="fx-site-footer-copyright">
            @{year} {company} inc. All Rights Reserved
          </p>
        </div>

        <div className="fx-site-footer-side">
          <nav aria-label="Footer" className="fx-site-footer-nav">
            <ul className="fx-site-footer-columns">
              {footerColumns.map((column) => (
                <li key={column.heading} className="fx-site-footer-column">
                  <Link
                    href={
                      column.heading === "ABOUT"
                        ? "/about"
                        : column.heading === "SERVICE"
                          ? "/service"
                          : column.heading === "COLUMN"
                            ? "/column"
                            : "/news"
                    }
                    className="fx-site-footer-heading"
                  >
                    {column.heading}
                  </Link>

                  {column.links.length ? (
                    <ul className="fx-site-footer-links">
                      {column.links.map((link) => (
                        <li key={`${column.heading}-${link.href}-${link.label}`}>
                          <Link href={link.href} className="fx-site-footer-link">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="fx-site-footer-cta-group">
            <Link href="/contact" className="fx-site-footer-cta fx-site-footer-cta-primary">
              まずは相談する
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
