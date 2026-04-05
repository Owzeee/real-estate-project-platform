import type {
  ProjectDetail,
  ProjectSummary,
  ProjectUnit as StoredProjectUnit,
} from "@/features/projects/types";

export type ProjectAmenityGroup = {
  title: string;
  items: string[];
};

export type ProjectBed = {
  label: string;
  roomLabel: string;
};

export type ProjectAvailabilityMonth = {
  label: string;
  status: "available" | "limited";
};

export type ProjectUnitView = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  priceLabel: string;
  monthlyRentLabel: string;
  areaLabel: string;
  roomsLabel: string;
  imageUrl: string | null;
  gallery: { src: string; alt: string }[];
  amenityGroups: ProjectAmenityGroup[];
  beds: ProjectBed[];
  minimumStayLabel: string;
  maximumStayLabel: string;
  availableFromLabel: string;
  availabilityMonths: ProjectAvailabilityMonth[];
};

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCurrency(currencyCode: string, value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAmenityGroups(project: ProjectDetail): ProjectAmenityGroup[] {
  const byType: Record<ProjectSummary["projectType"], ProjectAmenityGroup[]> = {
    apartment: [
      {
        title: "Essentials",
        items: ["WiFi", "TV", "Air conditioning", "Managed concierge"],
      },
      {
        title: "Kitchen",
        items: ["Dishwasher", "Stove", "Refrigerator", "Coffee machine"],
      },
      {
        title: "Bedroom",
        items: ["Bed linens", "Wardrobes", "Blackout curtains", "Bedside lamps"],
      },
      {
        title: "Bathroom",
        items: ["Walk-in shower", "Towels", "Storage vanity", "Guest powder room"],
      },
      {
        title: "Other",
        items: ["Parking", "Fitness access", "Reception lobby", "Parcel handling"],
      },
    ],
    villa: [
      {
        title: "Essentials",
        items: ["Smart home controls", "Security gate", "Private parking", "Central cooling"],
      },
      {
        title: "Kitchen",
        items: ["Show kitchen", "Family kitchen", "Dishwasher", "Freezer"],
      },
      {
        title: "Bedroom",
        items: ["Walk-in wardrobe", "Bed linens", "Private terraces", "Storage millwork"],
      },
      {
        title: "Bathroom",
        items: ["Bathtub", "Rain shower", "Double vanity", "Guest powder room"],
      },
      {
        title: "Other",
        items: ["Private garden", "Clubhouse access", "Driver room", "Landscaped plot"],
      },
    ],
    townhouse: [
      {
        title: "Essentials",
        items: ["WiFi", "Parking", "Air conditioning", "Gated entry"],
      },
      {
        title: "Kitchen",
        items: ["Dishwasher", "Cooktop", "Refrigerator", "Microwave"],
      },
      {
        title: "Bedroom",
        items: ["Built-in wardrobes", "Bed linens", "Blackout curtains", "Storage drawers"],
      },
      {
        title: "Bathroom",
        items: ["Walk-in shower", "Guest bathroom", "Towels", "Vanity storage"],
      },
      {
        title: "Other",
        items: ["Community park", "Private terrace", "Laundry room", "Resident clubhouse"],
      },
    ],
    mixed_use: [
      {
        title: "Essentials",
        items: ["WiFi", "Building reception", "Parking", "24/7 access"],
      },
      {
        title: "Kitchen",
        items: ["Built-in appliances", "Dishwasher", "Refrigerator", "Coffee station"],
      },
      {
        title: "Bedroom",
        items: ["Bed linens", "Storage closets", "Task lighting", "Acoustic glazing"],
      },
      {
        title: "Bathroom",
        items: ["Walk-in shower", "Towels", "Vanity", "Guest bathroom"],
      },
      {
        title: "Other",
        items: ["Retail plaza access", "Coworking lounge", "Fitness room", "Concierge desk"],
      },
    ],
    commercial: [
      {
        title: "Essentials",
        items: ["High-speed internet", "Reception desk", "Visitor parking", "Access control"],
      },
      {
        title: "Kitchen",
        items: ["Pantry", "Coffee station", "Dishwasher", "Refrigerator"],
      },
      {
        title: "Bedroom",
        items: ["Private office suite", "Storage wall", "Task lighting", "Acoustic treatment"],
      },
      {
        title: "Bathroom",
        items: ["Executive washroom", "Guest washroom", "Storage vanity", "Cleaning room"],
      },
      {
        title: "Other",
        items: ["Conference rooms", "Tenant lounge", "Serviced lobby", "Loading access"],
      },
    ],
    land: [
      {
        title: "Essentials",
        items: ["Road access", "Servicing strategy", "Boundary definition", "Zoning readiness"],
      },
      {
        title: "Kitchen",
        items: ["Future utility routes", "Water line planning", "Service provisions", "Power access"],
      },
      {
        title: "Bedroom",
        items: ["Flexible plot options", "Parcel depth", "Frontage strategy", "Setback planning"],
      },
      {
        title: "Bathroom",
        items: ["Drainage approach", "Stormwater strategy", "Service easements", "Municipal access"],
      },
      {
        title: "Other",
        items: ["Masterplan positioning", "Investment optionality", "Phased delivery", "Long-hold asset"],
      },
    ],
  };

  return byType[project.projectType];
}

function getBedConfig(project: ProjectDetail, rooms: number): ProjectBed[] {
  if (project.projectType === "villa" || project.projectType === "townhouse") {
    return [
      { label: "1 King bed", roomLabel: "Primary bedroom" },
      { label: "1 Queen bed", roomLabel: "Bedroom 2" },
      { label: "2 Single beds", roomLabel: "Bedroom 3" },
    ].slice(0, Math.max(1, Math.min(3, rooms - 1)));
  }

  return [
    { label: "1 Double bed", roomLabel: "Bedroom" },
    { label: "1 Sofa bed", roomLabel: "Flexible living space" },
  ].slice(0, rooms > 2 ? 2 : 1);
}

function getAvailabilityMonths(): ProjectAvailabilityMonth[] {
  return [
    { label: "Mar 2026", status: "limited" },
    { label: "Apr 2026", status: "available" },
    { label: "May 2026", status: "available" },
    { label: "Jun 2026", status: "available" },
    { label: "Jul 2026", status: "available" },
    { label: "Aug 2026", status: "available" },
    { label: "Sep 2026", status: "available" },
    { label: "Oct 2026", status: "available" },
    { label: "Nov 2026", status: "available" },
    { label: "Dec 2026", status: "available" },
    { label: "Jan 2027", status: "available" },
    { label: "Feb 2027", status: "available" },
  ];
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

export function formatOfferTypeLabel(offerType: ProjectSummary["offerType"]) {
  return offerType === "sale" ? "For Sale" : "For Rent";
}

export function formatCategoryLabel(category: ProjectSummary["category"]) {
  return titleCase(category);
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
  return getProjectAmenityGroups(project).flatMap((group) => group.items).slice(0, 6);
}

export function getProjectAmenityGroups(project: ProjectDetail) {
  return project.amenityGroups.length > 0 ? project.amenityGroups : getAmenityGroups(project);
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

function buildGeneratedProjectUnits(project: ProjectDetail): ProjectUnitView[] {
  const mediaImages = project.media.filter((item) => item.mediaType === "image");
  const imageFallback = project.heroMediaUrl ?? mediaImages[0]?.fileUrl ?? null;
  const minPrice = project.minPrice ?? 180000;
  const maxPrice = project.maxPrice ?? minPrice * 1.35;
  const areaBase =
    project.projectType === "villa"
      ? 180
      : project.projectType === "townhouse"
        ? 145
        : project.projectType === "commercial"
          ? 110
          : project.projectType === "mixed_use"
            ? 98
            : 56;
  const roomBase =
    project.projectType === "villa"
      ? 5
      : project.projectType === "townhouse"
        ? 4
        : project.projectType === "commercial"
          ? 3
          : project.projectType === "mixed_use"
            ? 3
            : 2;

  const variants = [
    { slug: "signature-residence", title: "Signature residence", priceFactor: 0.78, area: areaBase, rooms: roomBase },
    { slug: "corner-plan", title: "Corner plan", priceFactor: 0.9, area: areaBase + 18, rooms: roomBase + 1 },
    { slug: "panoramic-layout", title: "Panoramic layout", priceFactor: 1.02, area: areaBase + 34, rooms: roomBase + 1 },
    { slug: "premium-collection", title: "Premium collection", priceFactor: 1.18, area: areaBase + 52, rooms: roomBase + 2 },
  ];

  const amenityGroups = getAmenityGroups(project);

  return variants.map((variant, index) => {
    const price = Math.round(
      Math.min(maxPrice, Math.max(minPrice, minPrice * variant.priceFactor)),
    );
    const monthlyRent = Math.max(1490, Math.round(price / 180));
    const gallery = [0, 1, 2]
      .map((offset) => mediaImages[(index + offset) % Math.max(1, mediaImages.length)])
      .filter(Boolean)
      .map((item, galleryIndex) => ({
        src: item?.fileUrl ?? imageFallback ?? "",
        alt: `${variant.title} image ${galleryIndex + 1}`,
      }));

    return {
      id: `${project.id}-unit-${index + 1}`,
      slug: variant.slug,
      title: `${variant.rooms}-room ${variant.title.toLowerCase()} in ${project.title}`,
      summary:
        "A furnished, managed apartment option inside the project with buyer-ready specs, availability guidance, and unit-level details.",
      priceLabel: formatCurrency(project.currencyCode, price),
      monthlyRentLabel: `${formatCurrency(project.currencyCode, monthlyRent)} per month`,
      areaLabel: `${variant.area.toFixed(0)} m²`,
      roomsLabel: `${variant.rooms} rooms`,
      imageUrl: gallery[0]?.src ?? imageFallback,
      gallery: gallery.length > 0 ? gallery : [{ src: imageFallback ?? "", alt: variant.title }],
      amenityGroups,
      beds: getBedConfig(project, variant.rooms),
      minimumStayLabel: "6 Months",
      maximumStayLabel: "12 Months",
      availableFromLabel: "Mar 27, 2026",
      availabilityMonths: getAvailabilityMonths(),
    };
  });
}

export function getHousingExamples(project: ProjectDetail) {
  return getProjectUnits(project).map((unit) => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
    priceLabel: unit.priceLabel,
    areaLabel: unit.areaLabel,
    roomsLabel: unit.roomsLabel,
    imageUrl: unit.imageUrl,
  }));
}

export function getProjectUnitBySlug(project: ProjectDetail, unitSlug: string) {
  return getProjectUnits(project).find((unit) => unit.slug === unitSlug) ?? null;
}

function mapStoredProjectUnit(unit: StoredProjectUnit): ProjectUnitView {
  return {
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
    summary:
      unit.summary ??
      "A furnished, managed apartment option inside the project with buyer-ready specs, availability guidance, and unit-level details.",
    priceLabel: unit.monthlyRent != null ? formatCurrency(unit.currencyCode, unit.monthlyRent) : "",
    monthlyRentLabel:
      unit.monthlyRent != null
        ? `${formatCurrency(unit.currencyCode, unit.monthlyRent)} per month`
        : "",
    areaLabel: unit.areaSqm != null ? `${unit.areaSqm.toFixed(0)} m²` : "",
    roomsLabel: unit.rooms != null ? `${unit.rooms} rooms` : "",
    imageUrl: unit.imageUrl,
    gallery: unit.gallery,
    amenityGroups: unit.amenityGroups,
    beds: unit.beds,
    minimumStayLabel: unit.minimumStayMonths != null
      ? `${unit.minimumStayMonths} Months`
      : "",
    maximumStayLabel: unit.maximumStayMonths != null
      ? `${unit.maximumStayMonths} Months`
      : "",
    availableFromLabel: unit.availableFrom
      ? new Date(unit.availableFrom).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    availabilityMonths:
      unit.availabilityMonths.length > 0 ? unit.availabilityMonths : getAvailabilityMonths(),
  };
}

export function getProjectUnits(project: ProjectDetail): ProjectUnitView[] {
  if (project.units.length > 0) {
    return project.units
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapStoredProjectUnit);
  }

  return buildGeneratedProjectUnits(project);
}
