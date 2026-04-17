import { ImageResponse } from "next/og";

import { getProjectBySlug } from "@/features/projects/queries";
import { formatProjectTypeLabel } from "@/features/projects/presentation";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ProjectOgImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectOpenGraphImage({
  params,
}: ProjectOgImageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = project?.title ?? "Projet immobilier";
  const subtitle = project
    ? `${project.location} • ${project.developerName}`
    : "Immo Neuf";
  const eyebrow = project
    ? `${project.offerType === "rent" ? "Location" : "Vente"} • ${formatProjectTypeLabel(project.projectType, "fr")}`
    : "Immo Neuf";
  const backgroundImage = project?.heroMediaUrl ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #f7f1e4 0%, #ead9bd 48%, #8d6847 100%)",
          color: "#171412",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {backgroundImage ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(23,20,18,0.28), rgba(23,20,18,0.48)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              backgroundImage
                ? "linear-gradient(90deg, rgba(17,14,12,0.78) 0%, rgba(17,14,12,0.48) 56%, rgba(17,14,12,0.18) 100%)"
                : "linear-gradient(135deg, rgba(255,252,247,0.9) 0%, rgba(255,248,238,0.82) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            padding: "64px",
            color: backgroundImage ? "#fff8ef" : "#171412",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                height: "72px",
                width: "72px",
                alignItems: "center",
                justifyContent: "center",
                background: "#8d6847",
                color: "#f8f4ed",
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              RE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  fontSize: "22px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: backgroundImage ? "#ead9bd" : "#8d6847",
                }}
              >
                {eyebrow}
              </div>
              <div style={{ fontSize: "24px", color: backgroundImage ? "#f5e9d8" : "#4f473f" }}>
                Immo Neuf
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "820px" }}>
            <div style={{ fontSize: "72px", lineHeight: 1.02, fontWeight: 700 }}>
              {title}
            </div>
            <div style={{ fontSize: "28px", lineHeight: 1.35, color: backgroundImage ? "#f7efe6" : "#4f473f" }}>
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
