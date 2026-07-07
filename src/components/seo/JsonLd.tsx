import type { Locale } from "@/i18n/routing";
import { SITE_URL, BRAND } from "@/lib/seo";

/** Typed JSON-LD injector — one <script> per entity. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; no user HTML is embedded raw.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type Settings = Record<string, string>;

export function organizationSchema(settings: Settings) {
  const sameAs: string[] = [];
  if (settings.tgChannelUrl) sameAs.push(settings.tgChannelUrl);
  if (settings.instagramUrl) sameAs.push(settings.instagramUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: settings.phone,
            contactType: "sales",
            areaServed: "UZ",
            availableLanguage: ["uz", "ru"],
          },
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND,
    url: SITE_URL,
    inLanguage: ["uz", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/katalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema(settings: Settings, locale: Locale) {
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE_URL}/#localbusiness`,
    name: BRAND,
    image: `${SITE_URL}/opengraph-image.png`,
    url: SITE_URL,
    telephone: settings.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bek Baraka bozori, 12-qator, 473-do'kon",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
    ...(settings.geoLat && settings.geoLng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: settings.geoLat,
            longitude: settings.geoLng,
          },
        }
      : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
    description: address,
  };
}

type ProductSchemaInput = {
  name: string;
  description: string;
  sku: string | null;
  material: string | null;
  price: number;
  availability: "ACTIVE" | "SOLD_OUT" | "HIDDEN";
  images: string[];
  url: string;
};

export function productSchema(p: ProductSchemaInput) {
  const availability =
    p.availability === "ACTIVE"
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    ...(p.sku ? { sku: p.sku, mpn: p.sku } : {}),
    ...(p.material ? { material: p.material } : {}),
    image: p.images,
    brand: { "@type": "Brand", name: BRAND },
    offers: {
      "@type": "Offer",
      url: p.url,
      priceCurrency: "UZS",
      price: p.price,
      priceValidUntil,
      availability,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(a: {
  headline: string;
  description: string;
  image: string | null;
  datePublished: string;
  url: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    ...(a.image ? { image: a.image } : {}),
    datePublished: a.datePublished,
    inLanguage: a.locale === "ru" ? "ru-RU" : "uz-UZ",
    mainEntityOfPage: a.url,
    author: { "@type": "Organization", name: BRAND },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
