import { ImageResponse } from "next/og";

import { getDeveloperBySlug } from "@/features/developers/queries";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type DeveloperOgImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DeveloperOpenGraphImage({
  params,
}: DeveloperOgImageProps) {
  const { slug } = await params;
  const developer = await getDeveloperBySlug(slug);

  const title = developer?.companyName ?? "Promoteur immobilier";
  const subtitle = developer
    ? `${developer.projects.length} projets publies`
    : "Immo Neuf";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #f8f3e8 0%, #efe2cb 44%, #9a744f 100%)",
          padding: "72px",
          color: "#171412",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            border: "1px solid rgba(141,104,71,0.22)",
            background: "rgba(255,252,247,0.84)",
            padding: "56px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "760px" }}>
            <div
              style={{
                fontSize: "22px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8d6847",
              }}
            >
              Profil promoteur
            </div>
            <div style={{ fontSize: "72px", lineHeight: 1.02, fontWeight: 700 }}>
              {title}
            </div>
            <div style={{ fontSize: "28px", lineHeight: 1.35, color: "#4f473f" }}>
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "220px",
              height: "220px",
              background: "#8d6847",
              color: "#f8f4ed",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            RE
          </div>
        </div>
      </div>
    ),
    size,
  );
}
