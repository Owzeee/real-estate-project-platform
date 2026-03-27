import type { ProjectDetail, ProjectSummary } from "@/features/projects/types";

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatProjectTypeLabel(projectType: ProjectSummary["projectType"]) {
  return titleCase(projectType);
}

export function formatCompletionStageLabel(
  completionStage: ProjectSummary["completionStage"],
) {
  return titleCase(completionStage);
}

export function formatStatusLabel(status: ProjectSummary["status"]) {
  return titleCase(status);
}

export function buildMapEmbedUrl(project: Pick<ProjectSummary, "latitude" | "longitude">) {
  if (project.latitude == null || project.longitude == null) {
    return null;
  }

  const minLon = project.longitude - 0.08;
  const maxLon = project.longitude + 0.08;
  const minLat = project.latitude - 0.05;
  const maxLat = project.latitude + 0.05;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${project.latitude}%2C${project.longitude}`;
}

export function getProjectHighlights(project: ProjectDetail) {
  const highlights = [
    "Admin-curated inventory",
    `${formatProjectTypeLabel(project.projectType)} opportunity`,
    `${formatCompletionStageLabel(project.completionStage)} delivery phase`,
  ];

  if (project.isFeatured) {
    highlights.push("Featured marketplace placement");
  }

  if (project.media.some((item) => item.mediaType === "tour_3d")) {
    highlights.push("Interactive 3D walkthrough");
  }

  if (project.media.some((item) => item.mediaType === "brochure")) {
    highlights.push("Downloadable brochure pack");
  }

  return highlights.slice(0, 5);
}

export function getProjectAmenities(project: ProjectDetail) {
  const byType: Record<ProjectSummary["projectType"], string[]> = {
    apartment: [
      "Concierge arrival lobby",
      "Resident wellness and fitness spaces",
      "Sky lounge and social terraces",
      "Managed parking and drop-off",
    ],
    villa: [
      "Private landscaped plots",
      "Clubhouse and family leisure areas",
      "Gated access with security control",
      "Low-density internal streets",
    ],
    townhouse: [
      "Walkable community streets",
      "Pocket parks and family zones",
      "Resident clubhouse access",
      "Integrated parking courts",
    ],
    mixed_use: [
      "Retail frontage and plaza spaces",
      "Multiple entry experiences",
      "Flexible commercial activation",
      "Public realm-led circulation",
    ],
    commercial: [
      "Grade-A lobby and reception",
      "High-visibility frontage",
      "Tenant-ready servicing strategy",
      "Flexible office floorplates",
    ],
    land: [
      "Strategic masterplan positioning",
      "Road-linked access potential",
      "Long-hold development optionality",
      "Investment-ready parcel structure",
    ],
  };

  return byType[project.projectType];
}

export function getProjectNarrative(project: ProjectDetail) {
  const opening = `${project.title} is positioned in ${project.location} and is presented as a managed project opportunity rather than an open listing.`;
  const delivery =
    project.completionStage === "pre_launch"
      ? "The current phase is focused on early buyer capture, launch visibility, and structured presentation assets."
      : project.completionStage === "under_construction"
        ? "The current phase emphasizes construction progress, confidence-building media, and inquiry capture for qualified buyers."
        : project.completionStage === "ready"
          ? "The current phase emphasizes immediate decision-making, walkthrough requests, and rapid buyer follow-up."
          : "The project presentation is optimized for credibility, full asset access, and mature demand capture.";

  return `${opening} ${delivery}`;
}
