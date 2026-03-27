import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Playfair_Display } from "next/font/google";

import { SiteHeader } from "@/components/shared/site-header";
import { ProjectsStoreProvider } from "@/features/projects/client-store";
import { ProjectsUtilityTray } from "@/features/projects/projects-utility-tray";
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
  title: "Real Estate Project Marketplace",
  description:
    "A premium billboard-style marketplace for real estate development projects built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable}`}
    >
      <body className="font-sans antialiased">
        <ProjectsStoreProvider>
          <SiteHeader />
          {children}
          <ProjectsUtilityTray />
        </ProjectsStoreProvider>
      </body>
    </html>
  );
}
