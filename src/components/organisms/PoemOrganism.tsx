import Image from "next/image";

import { Surface } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";

import type { HomeSection } from "@/types/site";

type PoemOrganismProps = {
  sectionId: HomeSection;
  heading: string;
  body: string;
  aboutCtaLabel: string;
  aboutHref: string;
};

export function PoemOrganism({ sectionId, heading, body, aboutCtaLabel, aboutHref }: PoemOrganismProps) {
  const hasHeading = heading.trim().length > 0;

  return (
    <Surface
      as="section"
      id={sectionId}
      tone="light"
      labelledBy={hasHeading ? "home-poem-title" : undefined}
      className="fx-poem-organism"
    >
      <div className="fx-shell fx-poem-shell">
        <div className="fx-poem-copy">
          {hasHeading ? <SectionHeader title={heading} titleId="home-poem-title" /> : null}
          <p id="home-poem-text" className="fx-body-text fx-poem-body">
            {body}
          </p>
          <a className="fx-about-cta" href={aboutHref}>
            {aboutCtaLabel}
          </a>
        </div>
        <figure className="fx-poem-figure" aria-hidden="true">
          <Image
            src="/images/home/frame-2.png"
            alt=""
            width={1800}
            height={793}
            className="fx-poem-image"
            sizes="(max-width: 980px) 100vw, 42vw"
            priority
          />
        </figure>
      </div>
    </Surface>
  );
}
