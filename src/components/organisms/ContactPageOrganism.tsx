import { BodyText, Surface } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";

import { ContactForm } from "./ContactForm";

type ContactPageOrganismProps = {
  heading: string;
  body: string;
  titleId?: string;
};

export function ContactPageOrganism({
  heading,
  body,
  titleId = "contact-page-title"
}: ContactPageOrganismProps) {
  return (
    <Surface
      as="section"
      id="contact"
      tone="light"
      labelledBy={titleId}
      className="fx-section-organism fx-contact-page-organism"
    >
      <div className="fx-shell">
        <div className="fx-contact-page-grid">
          <div className="fx-contact-page-copy">
            <SectionHeader title={heading} titleId={titleId} level="h1" />
            <BodyText>{body}</BodyText>
          </div>
          <ContactForm />
        </div>
      </div>
    </Surface>
  );
}
