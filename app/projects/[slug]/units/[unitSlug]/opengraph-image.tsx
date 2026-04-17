import { ImageResponse } from "next/og";

import { getProjectUnitBySlug } from "@/features/projects/presentation";
import { getProjectBySlug } from "@/features/projects/queries";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type UnitOgImageProps = {
  params: Promise<{
    slug: string;
    unitSlug: string;
  }>;
};

export default async function UnitOpenGraphImage({ params }: UnitOgImageProps) {
  const { slug, unitSlug } = await params;
  const project = await getProjectBySlug(slug);
  const unit = project ? getProjectUnitBySlug(project, unitSlug) : null;

  const title = unit?.title ?? "Bien immobilier";
  const subtitle = project ? `${project.title} • ${project.location}` : "Immo Neuf";
  const backgroundImage = unit?.imageUrl ?? project?.heroMediaUrl ?? null;

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
              backgroundImage: `linear-gradient(rgba(23,20,18,0.34), rgba(23,20,18,0.56)), url(${backgroundImage})`,
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
                ? "linear-gradient(90deg, rgba(17,14,12,0.8) 0%, rgba(17,14,12,0.5) 60%, rgba(17,14,12,0.2) 100%)"
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
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: backgroundImage ? "#ead9bd" : "#8d6847",
            }}
          >
            Detail du bien
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "820px" }}>
            <div style={{ fontSize: "68px", lineHeight: 1.02, fontWeight: 700 }}>
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
