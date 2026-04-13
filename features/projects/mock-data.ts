import type { DeveloperDetail } from "@/features/developers/types";
import { normalizeVirtualTourUrl } from "@/features/projects/presentation";
import type {
  ProjectDetail,
  ProjectMedia,
  ProjectSummary,
  ProjectUnit,
  ProjectUnitAmenityGroup,
} from "@/features/projects/types";

const image = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1600&q=80`;

const brochureUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const sampleVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
const sampleTourUrl = "https://my.matterport.com/models/25B7rViqy4M";

function makeCompanyLogo(monogram: string, background: string, foreground = "#fffaf2") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#201c19" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="56" fill="url(#g)" />
      <circle cx="120" cy="120" r="78" fill="rgba(255,250,242,0.08)" />
      <text x="120" y="136" text-anchor="middle" font-family="Georgia, serif" font-size="78" font-weight="700" fill="${foreground}">
        ${monogram}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const novastoneLogo = makeCompanyLogo("N", "#8d6847");
const redcliffLogo = makeCompanyLogo("R", "#6f4d36");
const bluecrestLogo = makeCompanyLogo("B", "#32506e");
const verdeLogo = makeCompanyLogo("V", "#4c6b47");
const summitLogo = makeCompanyLogo("S", "#5a4a65");

const developerLogoById: Record<string, string | null> = {
  "dev-novastone": novastoneLogo,
  "dev-redcliff": redcliffLogo,
  "dev-bluecrest": bluecrestLogo,
  "dev-verde": verdeLogo,
  "dev-summit": summitLogo,
};

function makeMedia(
  projectId: string,
  items: Array<{
    mediaType: ProjectMedia["mediaType"];
    fileUrl: string;
    title: string;
    thumbnailUrl?: string | null;
  }>,
): ProjectMedia[] {
  return items.map((item, index) => ({
    id: `${projectId}-media-${index + 1}`,
    projectId,
    mediaType: item.mediaType,
    fileUrl: item.fileUrl,
    thumbnailUrl: item.thumbnailUrl ?? (item.mediaType === "image" ? item.fileUrl : null),
    title: item.title,
    sortOrder: index,
  }));
}

function makeGallery(title: string, urls: string[]) {
  return urls.map((src, index) => ({
    src,
    alt: `${title} image ${index + 1}`,
  }));
}

function makeAvailabilityMonths() {
  return [
    { label: "Mar 2026", status: "limited" as const },
    { label: "Apr 2026", status: "available" as const },
    { label: "May 2026", status: "available" as const },
    { label: "Jun 2026", status: "available" as const },
    { label: "Jul 2026", status: "available" as const },
    { label: "Aug 2026", status: "available" as const },
    { label: "Sep 2026", status: "available" as const },
    { label: "Oct 2026", status: "available" as const },
    { label: "Nov 2026", status: "available" as const },
    { label: "Dec 2026", status: "available" as const },
    { label: "Jan 2027", status: "available" as const },
    { label: "Feb 2027", status: "available" as const },
  ];
}

const residentialProjectAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Building",
    items: ["Security cameras", "Concierge", "Covered parking", "Smart access"],
  },
  {
    title: "Lifestyle",
    items: ["Pool", "Terrace", "Coworking lounge", "Resident cinema"],
  },
  {
    title: "Wellness",
    items: ["Gym", "Spa suites", "Yoga studio", "Sauna"],
  },
  {
    title: "Services",
    items: ["Valet", "Parcel room", "Housekeeping desk", "Pet wash station"],
  },
];

const villaProjectAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Community",
    items: ["Gated security", "Private clubhouse", "Jogging track", "Landscape parks"],
  },
  {
    title: "Outdoor",
    items: ["Pool deck", "Garden terraces", "Kids play zone", "Outdoor lounge"],
  },
  {
    title: "Services",
    items: ["Community management", "Visitor parking", "Security patrol", "Maintenance team"],
  },
];

const mixedUseProjectAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Access",
    items: ["Security cameras", "Managed parking", "Reception lobby", "Loading access"],
  },
  {
    title: "Public realm",
    items: ["Retail boulevard", "Coworking lounge", "Rooftop terrace", "Event plaza"],
  },
  {
    title: "Business",
    items: ["Meeting suites", "Business center", "Concierge desk", "Smart building controls"],
  },
];

const officeProjectAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Operations",
    items: ["Access control", "Security cameras", "Reception", "Managed parking"],
  },
  {
    title: "Tenant perks",
    items: ["Executive lounge", "Meeting suites", "Roof terrace", "Wellness studio"],
  },
  {
    title: "Infrastructure",
    items: ["Backup power", "High speed fiber", "Service elevators", "Valet drop-off"],
  },
];

const landProjectAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Infrastructure",
    items: ["Road access", "Utilities corridor", "Stormwater planning", "Street lighting"],
  },
  {
    title: "Planning",
    items: ["Approved masterplan", "Subdivision readiness", "Flexible plot ratios", "Corner plot options"],
  },
  {
    title: "Access",
    items: ["Gated entry", "Landscaped boulevard", "Service route", "Visitor parking"],
  },
];

const landUnitAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Plot features",
    items: ["Corner orientation", "Wide frontage", "Utility connection point", "Build-ready boundary"],
  },
  {
    title: "Delivery",
    items: ["Serviced roads", "Drainage installed", "Street lighting", "Landscape edge treatment"],
  },
  {
    title: "Investment",
    items: ["Flexible design brief", "Long-hold potential", "Phased build option", "Developer support desk"],
  },
];

const apartmentAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Essentials",
    items: ["WiFi", "TV", "Air conditioning", "Washing machine"],
  },
  {
    title: "Kitchen",
    items: ["Dishwasher", "Coffee machine", "Oven", "Refrigerator"],
  },
  {
    title: "Bedroom",
    items: ["Bed linens", "Blackout curtains", "Wardrobe", "Bedside lamps"],
  },
  {
    title: "Bathroom",
    items: ["Walk-in shower", "Bathtub", "Towels", "Storage vanity"],
  },
  {
    title: "Other",
    items: ["Balcony", "Workspace desk", "Smart lock", "Housekeeping option"],
  },
];

const townhouseAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Essentials",
    items: ["WiFi", "Air conditioning", "Laundry room", "Smart controls"],
  },
  {
    title: "Kitchen",
    items: ["Dishwasher", "Cooktop", "Island kitchen", "Freezer"],
  },
  {
    title: "Bedroom",
    items: ["Walk-in wardrobe", "Bed linens", "Blackout curtains", "Storage drawers"],
  },
  {
    title: "Bathroom",
    items: ["Rain shower", "Bathtub", "Guest powder room", "Double vanity"],
  },
  {
    title: "Outdoor",
    items: ["Private terrace", "Garden patio", "Barbecue point", "Parking bay"],
  },
];

const officeUnitAmenities: ProjectUnitAmenityGroup[] = [
  {
    title: "Essentials",
    items: ["High-speed internet", "Access cards", "Task lighting", "Central cooling"],
  },
  {
    title: "Work setup",
    items: ["Meeting room", "Phone booth", "Reception desk", "Storage wall"],
  },
  {
    title: "Pantry",
    items: ["Coffee station", "Dishwasher", "Refrigerator", "Microwave"],
  },
  {
    title: "Other",
    items: ["Private terrace", "Server closet", "Visitor seating", "Branding zone"],
  },
];

function makeUnit(
  projectId: string,
  slug: string,
  input: {
    title: string;
    summary: string;
    offerType?: ProjectUnit["offerType"];
    priceMode?: ProjectUnit["priceMode"];
    fixedPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    monthlyRent?: number;
    currencyCode: string;
    areaSqm: number;
    rooms: number;
    galleryUrls: string[];
    amenityGroups: ProjectUnitAmenityGroup[];
    beds: ProjectUnit["beds"];
    minimumStayMonths?: number;
    maximumStayMonths?: number;
    availableFrom: string;
    sortOrder: number;
  },
): ProjectUnit {
  return {
    id: `${projectId}-${slug}`,
    projectId,
    title: input.title,
    slug,
    summary: input.summary,
    offerType: input.offerType ?? "sale",
    priceMode: input.priceMode ?? "fixed",
    fixedPrice:
      input.offerType === "rent"
        ? null
        : (input.fixedPrice ?? input.minPrice ?? null),
    minPrice:
      input.offerType === "rent"
        ? null
        : (input.priceMode === "range"
            ? (input.minPrice ?? null)
            : (input.fixedPrice ?? input.minPrice ?? null)),
    maxPrice:
      input.offerType === "rent"
        ? null
        : (input.priceMode === "range" ? (input.maxPrice ?? null) : null),
    monthlyRent: input.offerType === "rent" ? (input.monthlyRent ?? null) : null,
    currencyCode: input.currencyCode,
    areaSqm: input.areaSqm,
    rooms: input.rooms,
    imageUrl: input.galleryUrls[0] ?? null,
    gallery: makeGallery(input.title, input.galleryUrls),
    amenityGroups: input.amenityGroups,
    beds: input.beds,
    minimumStayMonths: input.minimumStayMonths ?? null,
    maximumStayMonths: input.maximumStayMonths ?? null,
    availableFrom: input.availableFrom,
    availabilityMonths: makeAvailabilityMonths(),
    sortOrder: input.sortOrder,
  };
}

export const mockProjects: ProjectDetail[] = [
  {
    id: "project-aurora",
    developerProfileId: "dev-novastone",
    developerName: "Novastone Developments",
    developerSlug: "novastone-developments",
    developerLogoUrl: novastoneLogo,
    title: "Aurora Residences",
    slug: "aurora-residences",
    description:
      "A waterfront residential address designed around panoramic marina views, a private wellness floor, and hotel-grade resident services.",
    location: "Dubai Marina, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    minPrice: 420000,
    maxPrice: 1350000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "range",
    category: "residential",
    projectType: "apartment",
    completionStage: "under_construction",
    isFeatured: true,
    hasVirtualTour: true,
    latitude: 25.0804,
    longitude: 55.1403,
    heroMediaUrl: image("photo-1460317442991-0ec209397118"),
    media: makeMedia("project-aurora", [
      {
        mediaType: "image",
        fileUrl: image("photo-1460317442991-0ec209397118"),
        title: "Marina facade",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1494526585095-c41746248156"),
        title: "Lobby lounge",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1505693416388-ac5ce068fe85"),
        title: "Skyline living room",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1502672260266-1c1ef2d93688"),
        title: "Bedroom suite",
      },
      {
        mediaType: "brochure",
        fileUrl: brochureUrl,
        title: "Investment brochure",
      },
      {
        mediaType: "video",
        fileUrl: sampleVideoUrl,
        title: "Launch film",
      },
      {
        mediaType: "tour_3d",
        fileUrl: sampleTourUrl,
        title: "3D walkthrough",
      },
    ]),
    amenityGroups: residentialProjectAmenities,
    units: [
      makeUnit("project-aurora", "marina-one-bedroom", {
        title: "1-bedroom marina suite",
        summary:
          "A compact waterfront residence with hotel-style finishes, a balcony facing the marina, and a dedicated remote-work corner.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 485000,
        currencyCode: "USD",
        areaSqm: 78,
        rooms: 2,
        galleryUrls: [
          image("photo-1494526585095-c41746248156"),
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1502672260266-1c1ef2d93688"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [{ label: "1 King bed", roomLabel: "Bedroom" }],
        minimumStayMonths: 6,
        maximumStayMonths: 12,
        availableFrom: "2026-03-27",
        sortOrder: 0,
      }),
      makeUnit("project-aurora", "marina-family-two-bedroom", {
        title: "2-bedroom family residence",
        summary:
          "A wider corner layout with marina views, a dining bay, and a family-friendly split bedroom arrangement.",
        offerType: "sale",
        priceMode: "range",
        minPrice: 690000,
        maxPrice: 760000,
        currencyCode: "USD",
        areaSqm: 124,
        rooms: 3,
        galleryUrls: [
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1494526585095-c41746248156"),
          image("photo-1484154218962-a197022b5858"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "2 Single beds", roomLabel: "Bedroom 2" },
        ],
        minimumStayMonths: 6,
        maximumStayMonths: 18,
        availableFrom: "2026-04-15",
        sortOrder: 1,
      }),
      makeUnit("project-aurora", "aurora-sky-penthouse", {
        title: "3-bedroom sky penthouse",
        summary:
          "A premium penthouse tier with an entertainer terrace, show kitchen, and full-height glazing across the living area.",
        offerType: "sale",
        priceMode: "contact",
        currencyCode: "USD",
        areaSqm: 241,
        rooms: 5,
        galleryUrls: [
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1494526585095-c41746248156"),
          image("photo-1513694203232-719a280e022f"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
          { label: "2 Single beds", roomLabel: "Bedroom 3" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-05-01",
        sortOrder: 2,
      }),
    ],
  },
  {
    id: "project-canyon",
    developerProfileId: "dev-redcliff",
    developerName: "Redcliff Urban",
    developerSlug: "redcliff-urban",
    developerLogoUrl: redcliffLogo,
    title: "Canyon Square",
    slug: "canyon-square",
    description:
      "A mixed-use district combining premium apartments, boutique retail frontage, and a public plaza built for high footfall urban living.",
    location: "Riyadh North, Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    minPrice: 310000,
    maxPrice: 2200000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "contact",
    category: "commercial",
    projectType: "mixed_use",
    completionStage: "pre_launch",
    isFeatured: true,
    hasVirtualTour: true,
    latitude: 24.822,
    longitude: 46.643,
    heroMediaUrl: image("photo-1511818966892-d7d671e672a2"),
    media: makeMedia("project-canyon", [
      {
        mediaType: "image",
        fileUrl: image("photo-1511818966892-d7d671e672a2"),
        title: "District skyline",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1486406146926-c627a92ad1ab"),
        title: "Commercial frontage",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1494526585095-c41746248156"),
        title: "Private club lounge",
      },
      {
        mediaType: "video",
        fileUrl: sampleVideoUrl,
        title: "District teaser video",
      },
      {
        mediaType: "tour_3d",
        fileUrl: "https://360.virtual3dscan.ch/tour/wohnung-eg-02-3-5-zimmer",
        title: "Retail promenade 3D tour",
      },
    ]),
    amenityGroups: mixedUseProjectAmenities,
    units: [
      makeUnit("project-canyon", "boulevard-residence", {
        title: "Boulevard residence",
        summary:
          "A city-facing apartment with a hospitality lobby, direct plaza access, and a flexible den for work or guest use.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 352000,
        currencyCode: "USD",
        areaSqm: 82,
        rooms: 2,
        galleryUrls: [
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1494526585095-c41746248156"),
          image("photo-1484154218962-a197022b5858"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [{ label: "1 Double bed", roomLabel: "Bedroom" }],
        minimumStayMonths: 6,
        maximumStayMonths: 12,
        availableFrom: "2026-03-27",
        sortOrder: 0,
      }),
      makeUnit("project-canyon", "retail-showroom-suite", {
        title: "Retail showroom suite",
        summary:
          "A flagship ground-floor commercial unit with dual frontage, full-height display glazing, and direct loading access.",
        offerType: "rent",
        monthlyRent: 4450,
        currencyCode: "USD",
        areaSqm: 136,
        rooms: 3,
        galleryUrls: [
          image("photo-1486406146926-c627a92ad1ab"),
          image("photo-1511818966892-d7d671e672a2"),
          image("photo-1497366754035-f200968a6e72"),
        ],
        amenityGroups: officeUnitAmenities,
        beds: [{ label: "1 Executive office", roomLabel: "Private suite" }],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-05-10",
        sortOrder: 1,
      }),
      makeUnit("project-canyon", "corner-loft-collection", {
        title: "Corner loft collection",
        summary:
          "A taller duplex-style plan overlooking the plaza with an oversized terrace, two living zones, and premium finish upgrades.",
        offerType: "sale",
        priceMode: "contact",
        currencyCode: "USD",
        areaSqm: 149,
        rooms: 4,
        galleryUrls: [
          image("photo-1494526585095-c41746248156"),
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1513694203232-719a280e022f"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-06-01",
        sortOrder: 2,
      }),
    ],
  },
  {
    id: "project-serene",
    developerProfileId: "dev-novastone",
    developerName: "Novastone Developments",
    developerSlug: "novastone-developments",
    developerLogoUrl: novastoneLogo,
    title: "Serene Villas",
    slug: "serene-villas",
    description:
      "A gated villa community built around landscaped boulevards, private plots, and a resort-style leisure program.",
    location: "New Cairo, Cairo",
    city: "Cairo",
    country: "Egypt",
    minPrice: 580000,
    maxPrice: 990000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "fixed",
    category: "residential",
    projectType: "villa",
    completionStage: "ready",
    isFeatured: false,
    hasVirtualTour: true,
    latitude: 30.0156,
    longitude: 31.4913,
    heroMediaUrl: image("photo-1505693416388-ac5ce068fe85"),
    media: makeMedia("project-serene", [
      {
        mediaType: "image",
        fileUrl: image("photo-1505693416388-ac5ce068fe85"),
        title: "Show villa exterior",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1600585154340-be6161a56a0c"),
        title: "Garden frontage",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1512917774080-9991f1c4c750"),
        title: "Double-height family room",
      },
      {
        mediaType: "brochure",
        fileUrl: brochureUrl,
        title: "Community brochure",
      },
      {
        mediaType: "tour_3d",
        fileUrl: "https://360.virtual3dscan.ch/tour/wohnung-ug-01-2-5-zimmer",
        title: "Show villa virtual tour",
      },
    ]),
    amenityGroups: villaProjectAmenities,
    units: [
      makeUnit("project-serene", "garden-villa-a", {
        title: "Garden villa A",
        summary:
          "A family villa with a pool-ready back garden, two living rooms, and a ground-floor guest suite.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 940000,
        currencyCode: "USD",
        areaSqm: 312,
        rooms: 5,
        galleryUrls: [
          image("photo-1600585154340-be6161a56a0c"),
          image("photo-1512917774080-9991f1c4c750"),
          image("photo-1505693416388-ac5ce068fe85"),
        ],
        amenityGroups: townhouseAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
          { label: "2 Single beds", roomLabel: "Bedroom 3" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-04-01",
        sortOrder: 0,
      }),
      makeUnit("project-serene", "courtyard-villa-b", {
        title: "Courtyard villa B",
        summary:
          "A courtyard-focused layout with a shaded outdoor dining zone, family lounge, and upper-level study retreat.",
        offerType: "sale",
        priceMode: "range",
        minPrice: 1010000,
        maxPrice: 1125000,
        currencyCode: "USD",
        areaSqm: 356,
        rooms: 6,
        galleryUrls: [
          image("photo-1512917774080-9991f1c4c750"),
          image("photo-1600585154340-be6161a56a0c"),
          image("photo-1505693416388-ac5ce068fe85"),
        ],
        amenityGroups: townhouseAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
          { label: "2 Single beds", roomLabel: "Bedroom 3" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-05-20",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "project-oceanic",
    developerProfileId: "dev-bluecrest",
    developerName: "Bluecrest Estates",
    developerSlug: "bluecrest-estates",
    developerLogoUrl: bluecrestLogo,
    title: "Oceanic Crest",
    slug: "oceanic-crest",
    description:
      "A branded coastal apartment tower with panoramic sea views, private lounges, and hospitality-led amenities for global buyers.",
    location: "Jumeirah Beach, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    minPrice: 690000,
    maxPrice: 3100000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "fixed",
    category: "residential",
    projectType: "apartment",
    completionStage: "pre_launch",
    isFeatured: true,
    hasVirtualTour: true,
    latitude: 25.2033,
    longitude: 55.2692,
    heroMediaUrl: image("photo-1449844908441-8829872d2607"),
    media: makeMedia("project-oceanic", [
      {
        mediaType: "image",
        fileUrl: image("photo-1449844908441-8829872d2607"),
        title: "Sea-facing facade",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1505693416388-ac5ce068fe85"),
        title: "Sea view residence",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1494526585095-c41746248156"),
        title: "Residents lounge",
      },
      {
        mediaType: "video",
        fileUrl: sampleVideoUrl,
        title: "Brand film",
      },
      {
        mediaType: "tour_3d",
        fileUrl: "https://360.virtual3dscan.ch/tour/wohnung-ug-02-2-5-zimmer",
        title: "Signature residence 3D tour",
      },
    ]),
    amenityGroups: residentialProjectAmenities,
    units: [
      makeUnit("project-oceanic", "sea-view-residence", {
        title: "Sea-view residence",
        summary:
          "A full-height glass apartment with a sunrise-facing balcony and a premium kitchen package for end users or holiday investors.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 820000,
        currencyCode: "USD",
        areaSqm: 96,
        rooms: 3,
        galleryUrls: [
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1494526585095-c41746248156"),
          image("photo-1449844908441-8829872d2607"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Sofa bed", roomLabel: "Media room" },
        ],
        minimumStayMonths: 6,
        maximumStayMonths: 18,
        availableFrom: "2026-04-12",
        sortOrder: 0,
      }),
      makeUnit("project-oceanic", "signature-corner-suite", {
        title: "Signature corner suite",
        summary:
          "A premium corner plan with wraparound glazing, an ocean-facing terrace, and an upgraded marble kitchen palette.",
        offerType: "sale",
        priceMode: "range",
        minPrice: 1280000,
        maxPrice: 1510000,
        currencyCode: "USD",
        areaSqm: 142,
        rooms: 4,
        galleryUrls: [
          image("photo-1494526585095-c41746248156"),
          image("photo-1505693416388-ac5ce068fe85"),
          image("photo-1513694203232-719a280e022f"),
        ],
        amenityGroups: apartmentAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-06-01",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "project-orchid",
    developerProfileId: "dev-verde",
    developerName: "Verde Habitat",
    developerSlug: "verde-habitat",
    developerLogoUrl: verdeLogo,
    title: "Orchid Park Residences",
    slug: "orchid-park-residences",
    description:
      "A green-led townhouse development focused on family living, walkable streets, and low-density planning with strong landscaping identity.",
    location: "Mohammed Bin Rashid City, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    minPrice: 760000,
    maxPrice: 1490000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "range",
    category: "residential",
    projectType: "townhouse",
    completionStage: "under_construction",
    isFeatured: false,
    hasVirtualTour: false,
    latitude: 25.1251,
    longitude: 55.2462,
    heroMediaUrl: image("photo-1600585154340-be6161a56a0c"),
    media: makeMedia("project-orchid", [
      {
        mediaType: "image",
        fileUrl: image("photo-1600585154340-be6161a56a0c"),
        title: "Community street view",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1512917774080-9991f1c4c750"),
        title: "Townhouse interior",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1505693416388-ac5ce068fe85"),
        title: "Clubhouse lounge",
      },
      {
        mediaType: "brochure",
        fileUrl: brochureUrl,
        title: "Townhouse plans",
      },
    ]),
    amenityGroups: villaProjectAmenities,
    units: [
      makeUnit("project-orchid", "park-facing-townhouse", {
        title: "Park-facing townhouse",
        summary:
          "A family-oriented townhouse with direct park frontage, a shaded terrace, and a central kitchen island for daily living.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 905000,
        currencyCode: "USD",
        areaSqm: 198,
        rooms: 4,
        galleryUrls: [
          image("photo-1600585154340-be6161a56a0c"),
          image("photo-1512917774080-9991f1c4c750"),
          image("photo-1505693416388-ac5ce068fe85"),
        ],
        amenityGroups: townhouseAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
          { label: "2 Single beds", roomLabel: "Bedroom 3" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-04-20",
        sortOrder: 0,
      }),
      makeUnit("project-orchid", "corner-garden-home", {
        title: "Corner garden home",
        summary:
          "A wider townhouse plan on a corner parcel with larger glazing, a side garden, and a family lounge upstairs.",
        offerType: "sale",
        priceMode: "range",
        minPrice: 1090000,
        maxPrice: 1215000,
        currencyCode: "USD",
        areaSqm: 232,
        rooms: 5,
        galleryUrls: [
          image("photo-1512917774080-9991f1c4c750"),
          image("photo-1600585154340-be6161a56a0c"),
          image("photo-1513694203232-719a280e022f"),
        ],
        amenityGroups: townhouseAmenities,
        beds: [
          { label: "1 King bed", roomLabel: "Primary bedroom" },
          { label: "1 Queen bed", roomLabel: "Bedroom 2" },
          { label: "2 Single beds", roomLabel: "Bedroom 3" },
        ],
        minimumStayMonths: 12,
        maximumStayMonths: 24,
        availableFrom: "2026-06-10",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "project-harbor",
    developerProfileId: "dev-summit",
    developerName: "Summit Harbour Group",
    developerSlug: "summit-harbour-group",
    developerLogoUrl: summitLogo,
    title: "Harbor Exchange",
    slug: "harbor-exchange",
    description:
      "A premium commercial and office destination positioned for institutional tenants, waterfront retail, and long-term visibility.",
    location: "Doha Waterfront, Doha",
    city: "Doha",
    country: "Qatar",
    minPrice: 980000,
    maxPrice: 5400000,
    rentPrice: 6200,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "rent",
    priceMode: "fixed",
    category: "office",
    projectType: "commercial",
    completionStage: "under_construction",
    isFeatured: false,
    hasVirtualTour: true,
    latitude: 25.2854,
    longitude: 51.531,
    heroMediaUrl: image("photo-1486406146926-c627a92ad1ab"),
    media: makeMedia("project-harbor", [
      {
        mediaType: "image",
        fileUrl: image("photo-1486406146926-c627a92ad1ab"),
        title: "Waterfront office tower",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1497366754035-f200968a6e72"),
        title: "Boardroom suite",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1497366412874-3415097a27e7"),
        title: "Executive workspace",
      },
      {
        mediaType: "video",
        fileUrl: sampleVideoUrl,
        title: "Corporate launch reel",
      },
      {
        mediaType: "tour_3d",
        fileUrl: sampleTourUrl,
        title: "Office plate virtual tour",
      },
    ]),
    amenityGroups: officeProjectAmenities,
    units: [
      makeUnit("project-harbor", "executive-office-suite", {
        title: "Executive office suite",
        summary:
          "A premium fitted office with reception, boardroom, and panoramic waterfront glazing for leadership teams.",
        offerType: "rent",
        monthlyRent: 6200,
        currencyCode: "USD",
        areaSqm: 188,
        rooms: 5,
        galleryUrls: [
          image("photo-1497366754035-f200968a6e72"),
          image("photo-1497366412874-3415097a27e7"),
          image("photo-1486406146926-c627a92ad1ab"),
        ],
        amenityGroups: officeUnitAmenities,
        beds: [{ label: "1 Boardroom", roomLabel: "Meeting suite" }],
        minimumStayMonths: 12,
        maximumStayMonths: 36,
        availableFrom: "2026-05-15",
        sortOrder: 0,
      }),
      makeUnit("project-harbor", "waterfront-hq-floor", {
        title: "Waterfront HQ floor",
        summary:
          "A larger office plate configured for HQ occupancy, with a client arrival zone, executive suites, and branded front-of-house space.",
        offerType: "rent",
        monthlyRent: 12400,
        currencyCode: "USD",
        areaSqm: 426,
        rooms: 8,
        galleryUrls: [
          image("photo-1497366412874-3415097a27e7"),
          image("photo-1497366754035-f200968a6e72"),
          image("photo-1486406146926-c627a92ad1ab"),
        ],
        amenityGroups: officeUnitAmenities,
        beds: [{ label: "2 Meeting rooms", roomLabel: "Client wing" }],
        minimumStayMonths: 24,
        maximumStayMonths: 60,
        availableFrom: "2026-07-01",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "project-dunes",
    developerProfileId: "dev-verde",
    developerName: "Verde Habitat",
    developerSlug: "verde-habitat",
    developerLogoUrl: verdeLogo,
    title: "Dunes Horizon Plots",
    slug: "dunes-horizon-plots",
    description:
      "A serviced land release offering residential villa plots, boutique mixed-use corners, and investment parcels inside a masterplanned low-density district.",
    location: "Dubai South, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    minPrice: 255000,
    maxPrice: 1680000,
    rentPrice: null,
    currencyCode: "USD",
    status: "active",
    approvalStatus: "approved",
    offerType: "sale",
    priceMode: "range",
    category: "residential",
    projectType: "land",
    completionStage: "ready",
    isFeatured: false,
    hasVirtualTour: false,
    latitude: 24.8801,
    longitude: 55.1482,
    heroMediaUrl: image("photo-1500382017468-9049fed747ef"),
    media: makeMedia("project-dunes", [
      {
        mediaType: "image",
        fileUrl: image("photo-1500382017468-9049fed747ef"),
        title: "Masterplan vista",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1500530855697-b586d89ba3ee"),
        title: "Serviced boulevard",
      },
      {
        mediaType: "image",
        fileUrl: image("photo-1506744038136-46273834b3fb"),
        title: "Plot edge landscape",
      },
      {
        mediaType: "brochure",
        fileUrl: brochureUrl,
        title: "Plot allocation brochure",
      },
    ]),
    amenityGroups: landProjectAmenities,
    units: [
      makeUnit("project-dunes", "villa-plot-420", {
        title: "Villa plot 420",
        summary:
          "A family villa parcel on an internal green spine with a straightforward rectangular footprint and serviced utility edge.",
        offerType: "sale",
        priceMode: "fixed",
        fixedPrice: 255000,
        currencyCode: "USD",
        areaSqm: 420,
        rooms: 0,
        galleryUrls: [
          image("photo-1500382017468-9049fed747ef"),
          image("photo-1500530855697-b586d89ba3ee"),
          image("photo-1506744038136-46273834b3fb"),
        ],
        amenityGroups: landUnitAmenities,
        beds: [{ label: "Custom build", roomLabel: "Plot use" }],
        availableFrom: "2026-04-18",
        sortOrder: 0,
      }),
      makeUnit("project-dunes", "corner-plot-680", {
        title: "Corner plot 680",
        summary:
          "A larger corner parcel suited for a premium villa or branded townhouse cluster, with wider frontage and dual access.",
        offerType: "sale",
        priceMode: "range",
        minPrice: 420000,
        maxPrice: 495000,
        currencyCode: "USD",
        areaSqm: 680,
        rooms: 0,
        galleryUrls: [
          image("photo-1500530855697-b586d89ba3ee"),
          image("photo-1500382017468-9049fed747ef"),
          image("photo-1506744038136-46273834b3fb"),
        ],
        amenityGroups: landUnitAmenities,
        beds: [{ label: "Corner parcel", roomLabel: "Plot type" }],
        availableFrom: "2026-05-05",
        sortOrder: 1,
      }),
      makeUnit("project-dunes", "mixed-use-frontage-1100", {
        title: "Mixed-use frontage 1100",
        summary:
          "A boulevard-facing land parcel intended for low-rise mixed-use development with branded retail at grade and offices above.",
        offerType: "sale",
        priceMode: "contact",
        currencyCode: "USD",
        areaSqm: 1100,
        rooms: 0,
        galleryUrls: [
          image("photo-1506744038136-46273834b3fb"),
          image("photo-1500530855697-b586d89ba3ee"),
          image("photo-1500382017468-9049fed747ef"),
        ],
        amenityGroups: landUnitAmenities,
        beds: [{ label: "Mixed-use rights", roomLabel: "Planning type" }],
        availableFrom: "2026-06-01",
        sortOrder: 2,
      }),
    ],
  },
];

export const mockProjectSummaries: ProjectSummary[] = mockProjects.map((project) => ({
  id: project.id,
  developerProfileId: project.developerProfileId,
  developerName: project.developerName,
  developerSlug: project.developerSlug,
  developerLogoUrl: developerLogoById[project.developerProfileId] ?? null,
  title: project.title,
  slug: project.slug,
  description: project.description,
  location: project.location,
  city: project.city,
  country: project.country,
  minPrice: project.minPrice,
  maxPrice: project.maxPrice,
  rentPrice: project.rentPrice,
  currencyCode: project.currencyCode,
  status: project.status,
  approvalStatus: project.approvalStatus,
  offerType: project.offerType,
  priceMode: project.priceMode,
  category: project.category,
  projectType: project.projectType,
  completionStage: project.completionStage,
  isFeatured: project.isFeatured,
  hasVirtualTour: project.media.some(
    (item) => item.mediaType === "tour_3d" && Boolean(normalizeVirtualTourUrl(item.fileUrl)),
  ),
  latitude: project.latitude,
  longitude: project.longitude,
  heroMediaUrl: project.heroMediaUrl,
}));

export const mockDevelopers: DeveloperDetail[] = [
  {
    id: "dev-novastone",
    userId: "user-novastone",
    companyName: "Novastone Developments",
    slug: "novastone-developments",
    description:
      "A regional developer focused on premium residential communities and hospitality-led living concepts.",
    websiteUrl: "https://example.com/novastone",
    logoUrl: novastoneLogo,
    isVerified: true,
    projects: mockProjectSummaries.filter((project) => project.developerProfileId === "dev-novastone"),
  },
  {
    id: "dev-redcliff",
    userId: "user-redcliff",
    companyName: "Redcliff Urban",
    slug: "redcliff-urban",
    description:
      "A mixed-use developer focused on urban districts, commercial frontage, and public realm-led planning.",
    websiteUrl: "https://example.com/redcliff",
    logoUrl: redcliffLogo,
    isVerified: true,
    projects: mockProjectSummaries.filter((project) => project.developerProfileId === "dev-redcliff"),
  },
  {
    id: "dev-bluecrest",
    userId: "user-bluecrest",
    companyName: "Bluecrest Estates",
    slug: "bluecrest-estates",
    description:
      "A luxury coastal developer focused on branded residences and high-spec waterfront living.",
    websiteUrl: "https://example.com/bluecrest",
    logoUrl: bluecrestLogo,
    isVerified: true,
    projects: mockProjectSummaries.filter((project) => project.developerProfileId === "dev-bluecrest"),
  },
  {
    id: "dev-verde",
    userId: "user-verde",
    companyName: "Verde Habitat",
    slug: "verde-habitat",
    description:
      "A sustainability-led developer building low-density communities with strong landscaping and family-oriented planning.",
    websiteUrl: "https://example.com/verde",
    logoUrl: verdeLogo,
    isVerified: false,
    projects: mockProjectSummaries.filter((project) => project.developerProfileId === "dev-verde"),
  },
  {
    id: "dev-summit",
    userId: "user-summit",
    companyName: "Summit Harbour Group",
    slug: "summit-harbour-group",
    description:
      "A commercial-led development group specializing in premium office, waterfront retail, and landmark mixed-use projects.",
    websiteUrl: "https://example.com/summit",
    logoUrl: summitLogo,
    isVerified: true,
    projects: mockProjectSummaries.filter((project) => project.developerProfileId === "dev-summit"),
  },
];
