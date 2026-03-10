import { BrandWordmark } from "@/components/atoms";
import { GlobalNavList } from "@/components/molecules";
import { MobileHeaderMenu } from "./MobileHeaderMenu";

type SiteHeaderProps = {
  company: string;
  nav: {
    about: string;
    whatWeDo: string;
    news: string;
    contact: string;
  };
  aboutSectionNav: {
    mvv: string;
    team: string;
    companyProfile: string;
  };
};

export function SiteHeader({ company, nav, aboutSectionNav }: SiteHeaderProps) {
  return (
    <header className="fx-site-header">
      <div className="fx-shell">
        <div className="fx-site-header-inner">
          <BrandWordmark company={company} />
          <div className="fx-site-header-desktop">
            <nav aria-label="Global" className="fx-site-nav">
              <GlobalNavList nav={nav} aboutSectionNav={aboutSectionNav} />
            </nav>
          </div>
          <MobileHeaderMenu nav={nav} />
        </div>
      </div>
    </header>
  );
}
