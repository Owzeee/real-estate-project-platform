import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "leaflet/dist/leaflet.css";

import { AnalyticsTracker } from "@/components/shared/analytics-tracker";
import { SiteHeader } from "@/components/shared/site-header";
import { ProjectsStoreProvider } from "@/features/projects/client-store";
import { ProjectsUtilityTray } from "@/features/projects/projects-utility-tray";
import { getCurrentLocale } from "@/lib/i18n-server";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getSiteUrl,
} from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif-alt",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Immo Neuf | Immobilier Neuf à Abidjan et en Côte d'Ivoire",
    template: "%s | Immo Neuf",
  },
  description:
    "Plateforme immobilière pour découvrir des programmes neufs, terrains, bureaux et projets d'investissement à Abidjan et en Côte d'Ivoire.",
  applicationName: "Immo Neuf",
  keywords: [
    "immobilier Abidjan",
    "immobilier Côte d'Ivoire",
    "programme immobilier Abidjan",
    "appartement neuf Abidjan",
    "terrain à vendre Abidjan",
    "bureaux à louer Abidjan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Immo Neuf | Immobilier Neuf à Abidjan et en Côte d'Ivoire",
    description:
      "Découvrez des projets immobiliers, terrains, bureaux et programmes neufs en Côte d'Ivoire.",
    url: "/",
    siteName: "Immo Neuf",
    locale: "fr_CI",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Immo Neuf | Immobilier Neuf à Abidjan et en Côte d'Ivoire",
    description:
      "Découvrez des projets immobiliers, terrains, bureaux et programmes neufs en Côte d'Ivoire.",
    images: ["/twitter-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang={locale === "fr" ? "fr-CI" : "en"}
      className={`${geist.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable}`}
    >
      <body className="font-sans antialiased">
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebsiteJsonLd()),
          }}
        />
        <ProjectsStoreProvider>
          <AnalyticsTracker />
          <SiteHeader />
          {children}
          <ProjectsUtilityTray />
        </ProjectsStoreProvider>
      </body>
    </html>
  );
}
