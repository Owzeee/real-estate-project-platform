import type { Metadata } from "next";

const fallbackSiteUrl = "https://immoneuf.ci";

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  try {
    return new URL(envUrl || fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function buildMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
}) {
  const canonical = absoluteUrl(input.path ?? "/");
  const images = input.image ? [input.image] : undefined;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "Immo Neuf",
      locale: "fr_CI",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images,
    },
  } satisfies Metadata;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Immo Neuf",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.ico"),
    areaServed: ["CI", "Abidjan", "Côte d'Ivoire"],
    knowsAbout: [
      "Immobilier neuf en Côte d'Ivoire",
      "Programmes immobiliers à Abidjan",
      "Terrains à vendre à Abidjan",
      "Bureaux et commerces en Côte d'Ivoire",
    ],
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Immo Neuf",
    url: absoluteUrl("/"),
    inLanguage: "fr-CI",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/projects")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
