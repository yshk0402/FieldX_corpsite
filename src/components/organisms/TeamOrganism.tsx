import { BodyText, Surface } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";

import type { HomeSection } from "@/types/site";

type TeamOrganismProps = {
  sectionId: HomeSection;
  heading: string;
  body: string;
  members: {
    name: string;
    role: string;
    bio: string;
    imageSrc: string;
    imageAlt: string;
  }[];
  titleId?: string;
};

export function TeamOrganism({
  sectionId,
  heading,
  members,
  titleId = "home-team-title"
}: TeamOrganismProps) {
  return (
    <Surface as="section" id={sectionId} tone="light" labelledBy={titleId} className="fx-section-organism">
      <div className="fx-shell">
        <SectionHeader title={heading} titleId={titleId} />
        <ul className="fx-team-grid" aria-label={heading}>
          {members.map((member) => (
            <li key={member.name} className="fx-team-card">
              <img
                className="fx-team-avatar"
                src={member.imageSrc}
                alt={member.imageAlt}
                width={240}
                height={240}
                loading="lazy"
              />
              <div className="fx-team-card-body">
                <h3 className="fx-team-name">{member.name}</h3>
                <p className="fx-team-role">{member.role}</p>
                <BodyText className="fx-team-bio">{member.bio}</BodyText>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Surface>
  );
}
