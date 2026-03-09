import { ContactOrganism, HeroOrganism, NewsOrganism, PoemOrganism, WhatWeDoOrganism } from "@/components/organisms";
import type { SiteLocaleContent } from "@/components/site/content";
import type { BlogPost } from "@/types/content";
import type { HomeSection } from "@/types/site";

const SECTION_IDS: Record<HomeSection, HomeSection> = {
  hero: "hero",
  poem: "poem",
  about: "about",
  mvv: "mvv",
  "what-we-do": "what-we-do",
  team: "team",
  history: "history",
  "company-profile": "company-profile",
  news: "news",
  contact: "contact"
};

type HomeTemplateProps = {
  content: SiteLocaleContent;
  posts: BlogPost[];
};

export function HomeTemplate({ content, posts }: HomeTemplateProps) {
  return (
    <>
      <HeroOrganism sectionId={SECTION_IDS.hero} title={content.hero.title} body={content.hero.body} />

      <PoemOrganism
        sectionId={SECTION_IDS.poem}
        heading={content.poem.heading}
        body={content.poem.body}
        aboutCtaLabel={content.poem.aboutCtaLabel}
        aboutHref="/about"
      />

      <WhatWeDoOrganism
        sectionId={SECTION_IDS["what-we-do"]}
        heading={content.whatWeDo.heading}
        services={content.whatWeDo.services}
        featuredRows={content.whatWeDo.featuredRows}
        accentBackground={false}
        layout="featured"
      />

      <NewsOrganism sectionId={SECTION_IDS.news} heading={content.news.heading} emptyLabel={content.news.empty} posts={posts} />

      <ContactOrganism
        sectionId={SECTION_IDS.contact}
        heading={content.contact.heading}
        body={content.contact.body}
        ctaLabel={content.contact.ctaLabel}
        ctaHref={content.contact.ctaHref}
      />
    </>
  );
}
