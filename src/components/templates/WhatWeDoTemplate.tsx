import { WhatWeDoOrganism } from "@/components/organisms";
import type { SiteLocaleContent } from "@/components/site/content";

type WhatWeDoTemplateProps = {
  content: SiteLocaleContent;
};

export function WhatWeDoTemplate({ content }: WhatWeDoTemplateProps) {
  return (
    <WhatWeDoOrganism
      sectionId="what-we-do"
      heading={content.nav.whatWeDo}
      intro={content.whatWeDo.intro}
      services={content.whatWeDo.services}
      titleId="what-we-do-page-title"
      headingLevel="h1"
      kicker={null}
      accentBackground={false}
      showMedia
      linkBasePath="what-we-do"
      featuredRows={content.whatWeDo.featuredRows}
      showServiceDescriptions={false}
      showServiceCatalog={false}
    />
  );
}
