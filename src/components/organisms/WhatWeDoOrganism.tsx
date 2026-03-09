import Image from "next/image";
import Link from "next/link";

import { BodyText, Surface } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";

import type {
  HomeSection,
  ServiceCard as ServiceCardType,
  WhatWeDoFeatureRow
} from "@/types/site";

type WhatWeDoOrganismProps = {
  sectionId: HomeSection;
  heading: string;
  intro?: string;
  services: ServiceCardType[];
  titleId?: string;
  headingLevel?: "h1" | "h2" | "h3";
  kicker?: string | null;
  accentBackground?: boolean;
  showMedia?: boolean;
  linkBasePath?: string;
  layout?: "featured" | "catalog";
  featuredRows?: WhatWeDoFeatureRow[];
};

export function WhatWeDoOrganism({
  sectionId,
  heading,
  intro,
  services,
  titleId = "home-services-title",
  headingLevel = "h2",
  kicker = "Business",
  accentBackground = true,
  showMedia = false,
  linkBasePath = "what-we-do",
  layout = "catalog",
  featuredRows = []
}: WhatWeDoOrganismProps) {
  const groupedServices = services.reduce<Array<{ category: string; items: ServiceCardType[] }>>(
    (acc, service) => {
      const category = service.category ?? "Services";
      const found = acc.find((group) => group.category === category);

      if (found) {
        found.items.push(service);
        return acc;
      }

      acc.push({ category, items: [service] });
      return acc;
    },
    []
  );

  const getCategoryAnchorId = (category: string) => {
    const compact = category.toLowerCase().replace(/\s+/g, "");

    if (compact.includes("aidx")) {
      return "ai-dx";
    }

    if (compact.includes("education") || compact.includes("教育")) {
      return "education";
    }

    return compact.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  };

  return (
    <Surface
      as="section"
      id={sectionId}
      tone="light"
      labelledBy={titleId}
      className={[
        "fx-section-organism",
        "fx-services-organism",
        layout === "featured" ? "fx-services-organism-featured" : null,
        showMedia ? "fx-services-organism-page" : null,
        accentBackground ? "fx-services-organism-accent" : "fx-services-organism-default"
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="fx-shell">
        {layout === "featured" ? (
          <div className="fx-whatwedo-featured">
            <div className="fx-whatwedo-featured-inner">
              <SectionHeader
                title={heading}
                titleId={titleId}
                level={headingLevel}
                kicker={undefined}
                className="fx-whatwedo-featured-header"
              />
              <div className="fx-whatwedo-featured-list" aria-label={heading} role="list">
                {featuredRows.map((row) => (
                  <article key={row.title} className="fx-whatwedo-featured-row" role="listitem">
                    <h3 className="fx-whatwedo-featured-title">{row.title}</h3>
                    <p className="fx-whatwedo-featured-body">
                      {row.body.split("\n").map((line, index) => (
                        <span key={`${row.title}-${index}`} className="fx-whatwedo-featured-line">
                          {line}
                        </span>
                      ))}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <SectionHeader title={heading} titleId={titleId} level={headingLevel} kicker={kicker ?? undefined} />
            {intro ? <BodyText className="fx-whatwedo-intro">{intro}</BodyText> : null}
            <div className="fx-whatwedo-stack" aria-label={heading} role="list">
              {groupedServices.map((group) => (
                <article
                  key={group.category}
                  id={getCategoryAnchorId(group.category)}
                  className="fx-whatwedo-group"
                  role="listitem"
                >
                  <h3 className="fx-whatwedo-category">{group.category}</h3>
                  <ul className="fx-whatwedo-list" aria-label={group.category}>
                    {group.items.map((service) => (
                      <li key={service.slug ?? service.name}>
                        {service.slug ? (
                          <Link href={`/${linkBasePath}/${service.slug}`} className="fx-whatwedo-item-link">
                            <article className={showMedia ? "fx-whatwedo-item fx-whatwedo-item-media" : "fx-whatwedo-item"}>
                              <div className="fx-whatwedo-item-content">
                                <h4 className="fx-whatwedo-item-title">{service.name}</h4>
                                <p className="fx-whatwedo-item-body">{service.description}</p>
                              </div>
                              {showMedia && service.image ? (
                                <figure className="fx-whatwedo-item-image">
                                  <Image src={service.image.src} alt={service.image.alt} width={280} height={168} />
                                </figure>
                              ) : null}
                              <span className="fx-whatwedo-arrow" aria-hidden="true">
                                →
                              </span>
                            </article>
                          </Link>
                        ) : (
                          <article className={showMedia ? "fx-whatwedo-item fx-whatwedo-item-media" : "fx-whatwedo-item"}>
                            <div className="fx-whatwedo-item-content">
                              <h4 className="fx-whatwedo-item-title">{service.name}</h4>
                              <p className="fx-whatwedo-item-body">{service.description}</p>
                            </div>
                            {showMedia && service.image ? (
                              <figure className="fx-whatwedo-item-image">
                                <Image src={service.image.src} alt={service.image.alt} width={280} height={168} />
                              </figure>
                            ) : null}
                            <span className="fx-whatwedo-arrow" aria-hidden="true">
                              →
                            </span>
                          </article>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </Surface>
  );
}
