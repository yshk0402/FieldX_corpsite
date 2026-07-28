import {
  HeroOrganism,
  HomeColumnOrganism,
  HomeNewsOrganism,
  PoemOrganism,
  ServiceViewOrganism
} from "@/components/organisms";
import type { SiteLocaleContent } from "@/components/site/content";
import type { ColumnPost } from "@/types/content";
import type { HomeSection } from "@/types/site";

const SECTION_IDS: Record<HomeSection, HomeSection> = {
  hero: "hero",
  poem: "poem",
  about: "about",
  mvv: "mvv",
  "what-we-do": "what-we-do",
  column: "column",
  team: "team",
  "company-profile": "company-profile",
  news: "news",
  contact: "contact"
};

type HomeTemplateProps = {
  content: SiteLocaleContent;
  columnPosts: ColumnPost[];
  newsPosts: ColumnPost[];
};

export function HomeTemplate({ content, columnPosts, newsPosts }: HomeTemplateProps) {
  return (
    <>
      <HeroOrganism
        sectionId={SECTION_IDS.hero}
        title={content.hero.title}
        body={content.hero.body}
      />

      <PoemOrganism
        sectionId={SECTION_IDS.poem}
        eyebrowEn={content.poem.eyebrowEn}
        eyebrowJa={content.poem.eyebrowJa}
        title={content.poem.title}
        body={content.poem.body}
        aboutCtaLabel={content.poem.aboutCtaLabel}
        aboutHref="/about"
      />

      <ServiceViewOrganism
        sectionId={SECTION_IDS["what-we-do"]}
        eyebrowEn={content.serviceView.eyebrowEn}
        eyebrowJa={content.serviceView.eyebrowJa}
        title={content.serviceView.title}
        body={content.serviceView.body}
        primaryCtaLabel={content.serviceView.primaryCtaLabel}
        primaryCtaHref={content.serviceView.primaryCtaHref}
        agents={content.serviceView.agents}
      />

      <HomeColumnOrganism
        sectionId={SECTION_IDS.column}
        heading={content.column.heading}
        eyebrowJa={content.column.eyebrowJa}
        ctaLabel={content.column.ctaLabel}
        ctaHref={content.column.ctaHref}
        emptyLabel={content.column.empty}
        listAriaLabel={content.column.listAriaLabel}
        posts={columnPosts}
      />

      <HomeNewsOrganism
        sectionId={SECTION_IDS.news}
        heading={content.news.heading}
        eyebrowJa={content.news.eyebrowJa}
        emptyLabel={content.news.empty}
        posts={newsPosts}
      />
    </>
  );
}
