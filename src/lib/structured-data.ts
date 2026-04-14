import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    founder: {
      "@type": "Person",
      name: "Norbert Sommer",
    },
    email: "office@doylim.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Langgewann 18",
      postalCode: "69121",
      addressLocality: "Heidelberg",
      addressCountry: "DE",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "de-DE",
  };
}

export type FaqItem = { frage: string; antwort: string };

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.frage,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.antwort,
      },
    })),
  };
}
