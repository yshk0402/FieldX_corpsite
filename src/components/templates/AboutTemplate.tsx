import { AboutOrganism, CompanyProfileOrganism, MvvOrganism, TeamOrganism } from "@/components/organisms";
import type { SiteLocaleContent } from "@/components/site/content";

type AboutTemplateProps = {
  content: SiteLocaleContent;
};

export function AboutTemplate({ content }: AboutTemplateProps) {
  return (
    <>
      <AboutOrganism
        sectionId="about"
        heading={content.nav.about}
        body={content.about.body}
        titleId="about-page-who-we-are-title"
        headingLevel="h1"
      />
      <MvvOrganism
        sectionId="mvv"
        heading={content.mvv.heading}
        items={content.mvv.items}
        titleId="about-page-mvv-title"
      />
      <TeamOrganism
        sectionId="team"
        heading={content.team.heading}
        body={content.team.body}
        members={content.team.members}
        titleId="about-page-team-title"
      />
      <CompanyProfileOrganism
        sectionId="company-profile"
        heading={content.companyProfile.heading}
        items={content.companyProfile.items}
        titleId="about-page-company-profile-title"
      />
    </>
  );
}
