import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Estate Project Marketplace",
  description:
    "MVP foundation for a billboard-style real estate development marketplace built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
