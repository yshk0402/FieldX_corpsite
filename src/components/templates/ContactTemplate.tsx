import { ContactPageOrganism } from "@/components/organisms";
import type { SiteLocaleContent } from "@/components/site/content";

type ContactTemplateProps = {
  content: SiteLocaleContent;
};

export function ContactTemplate({ content }: ContactTemplateProps) {
  return <ContactPageOrganism heading={content.contact.heading} body={content.contact.body} titleId="contact-page-title" />;
}
