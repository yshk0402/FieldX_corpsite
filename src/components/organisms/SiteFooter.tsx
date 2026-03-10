import Link from "next/link";

type SiteFooterProps = {
  company: string;
};

type FooterLink = {
  href: string;
  label: string;
};

type FooterGroup = {
  heading: FooterLink;
  children?: FooterLink[];
};

type FooterContent = {
  groups: FooterGroup[];
  secondary: FooterLink[];
};

function getFooterContent(): FooterContent {
  return {
    groups: [
      {
        heading: { href: "/about", label: "about" },
        children: [
          { href: "/about#mvv", label: "MVV" },
          { href: "/about#team", label: "Team" },
          { href: "/about#company-profile", label: "会社概要" }
        ]
      },
      {
        heading: { href: "/what-we-do", label: "what we do" }
      }
    ],
    secondary: [
      { href: "/news", label: "News" },
      { href: "/contact", label: "Contact" }
    ]
  };
}

export function SiteFooter({ company }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const footerContent = getFooterContent();

  return (
    <footer className="fx-site-footer">
      <div className="fx-shell">
        <div className="fx-footer-main">
          <p className="fx-footer-wordmark">{company}</p>
          <nav aria-label="Footer" className="fx-footer-nav">
            <ul className="fx-footer-groups">
              {footerContent.groups.map((group) => (
                <li key={`${group.heading.label}-${group.heading.href}`} className="fx-footer-group">
                  <Link href={group.heading.href} className="fx-footer-link">
                    {group.heading.label}
                  </Link>
                  {group.children?.length ? (
                    <ul className="fx-footer-sub-links">
                      {group.children.map((child) => (
                        <li key={`${child.label}-${child.href}`}>
                          <Link href={child.href} className="fx-footer-sub-link">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              <li className="fx-footer-group fx-footer-group-secondary">
                <ul className="fx-footer-secondary-links">
                  {footerContent.secondary.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link href={link.href} className="fx-footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div className="fx-footer-meta">
          <p>
            © {year} {company}
          </p>
        </div>
      </div>
    </footer>
  );
}
