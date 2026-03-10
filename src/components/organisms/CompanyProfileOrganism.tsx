import { Surface } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";

import type { HomeSection } from "@/types/site";

type CompanyProfileOrganismProps = {
  sectionId: HomeSection;
  heading: string;
  items: {
    label: string;
    value: string | string[];
  }[];
  titleId?: string;
};

export function CompanyProfileOrganism({
  sectionId,
  heading,
  items,
  titleId = "about-company-profile-title"
}: CompanyProfileOrganismProps) {
  return (
    <Surface as="section" id={sectionId} tone="light" labelledBy={titleId} className="fx-section-organism">
      <div className="fx-shell">
        <SectionHeader title={heading} titleId={titleId} />
        <dl className="fx-company-profile-list">
          {items.map((item) => (
            <div key={item.label} className="fx-company-profile-row">
              <dt className="fx-company-profile-label">{item.label}</dt>
              <dd className="fx-company-profile-value">
                {Array.isArray(item.value) ? (
                  <ul className="fx-company-profile-bullets">
                    {item.value.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Surface>
  );
}
