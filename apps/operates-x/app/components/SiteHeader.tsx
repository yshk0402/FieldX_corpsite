import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  currentPath?: string;
};

const links = [
  { href: "/news", label: "ニュース" },
  { href: "/case", label: "導入事例" },
  { href: "/article", label: "記事" }
] as const;

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  return (
    <header className="fx-site-header">
      <div className="fx-site-header-inner">
        <Link href="/" className="fx-brand" aria-label="AImate トップ">
          <Image src="/icon.png" alt="" width={58} height={58} className="fx-brand-mark" priority />
        </Link>
        <div className="fx-header-pill">
          <nav className="fx-global-nav" aria-label="グローバルナビゲーション">
            {links.map((link) => {
              const active = currentPath === link.href;
              return (
                <Link key={link.href} href={link.href} className="fx-nav-link" aria-current={active ? "page" : undefined}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/contact" className="fx-btn fx-btn-primary fx-site-header-cta" aria-current={currentPath === "/contact" ? "page" : undefined}>
            無料相談
          </Link>
        </div>
      </div>
    </header>
  );
}
