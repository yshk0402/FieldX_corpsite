import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "AImate" },
  { href: "/#about-title", label: "概要" },
  { href: "/#service-core-title", label: "サービス" },
  { href: "/#section6", label: "導入の流れ" },
  { href: "/#section5", label: "導入事例" },
  { href: "/news", label: "ニュース" },
  { href: "/blog", label: "記事" },
  { href: "/contact", label: "お問い合わせ" }
] as const;

export function SiteFooter() {
  return (
    <footer className="fx-footer" aria-labelledby="footer-brand">
      <div className="fx-footer-inner">
        <h2 id="footer-brand" className="fx-footer-brand">
          AImate
        </h2>
        <div className="fx-footer-logo-wrap">
          <Image src="/icon.png" alt="AImateロゴ" width={98} height={98} className="fx-footer-logo" />
        </div>
        <nav className="fx-footer-nav" aria-label="フッターナビゲーション">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="fx-footer-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="fx-footer-legal">
          <p className="fx-footer-copy">© 2026 AImate</p>
          <div className="fx-footer-legal-links">
            <Link href="/privacy" className="fx-footer-link fx-footer-link-legal">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="fx-footer-link fx-footer-link-legal">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
