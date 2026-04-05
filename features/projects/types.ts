export type ProjectStatus = "draft" | "active" | "sold_out" | "archived";
export type ProjectApprovalStatus = "pending" | "approved" | "rejected";
export type ProjectOfferType = "sale" | "rent";
export type ProjectPriceMode = "fixed" | "range" | "contact";
export type ProjectCategory = "residential" | "commercial" | "office";
export type ProjectType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "mixed_use"
  | "commercial"
  | "land";
export type CompletionStage =
  | "pre_launch"
  | "under_construction"
  | "ready"
  | "completed";
export type MediaType = "image" | "video" | "brochure" | "tour_3d";

export type ProjectMedia = {
  id: string;
  projectId: string;
  mediaType: MediaType;
  fileUrl: string;
  thumbnailUrl: string | null;
  title: string | null;
  sortOrder: number;
};

export type ProjectUnitAmenityGroup = {
  title: string;
  items: string[];
};

export type ProjectUnitBed = {
  label: string;
  roomLabel: string;
};

export type ProjectUnitAvailabilityMonth = {
  label: string;
  status: "available" | "limited";
};

export type ProjectUnit = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  summary: string | null;
  offerType: ProjectOfferType;
  priceMode: ProjectPriceMode;
  fixedPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  monthlyRent: number | null;
  currencyCode: string;
  areaSqm: number | null;
  rooms: number | null;
  imageUrl: string | null;
  gallery: { src: string; alt: string }[];
  amenityGroups: ProjectUnitAmenityGroup[];
  beds: ProjectUnitBed[];
  minimumStayMonths: number | null;
  maximumStayMonths: number | null;
  availableFrom: string | null;
  availabilityMonths: ProjectUnitAvailabilityMonth[];
  sortOrder: number;
};

export type ProjectSummary = {
  id: string;
  developerProfileId: string;
  developerName: string;
  developerSlug: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string | null;
  country: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  rentPrice: number | null;
  currencyCode: string;
  status: ProjectStatus;
  approvalStatus: ProjectApprovalStatus;
  offerType: ProjectOfferType;
  priceMode: ProjectPriceMode;
  category: ProjectCategory;
  projectType: ProjectType;
  completionStage: CompletionStage;
  isFeatured: boolean;
  latitude: number | null;
  longitude: number | null;
  heroMediaUrl: string | null;
};

export type ProjectDetail = ProjectSummary & {
  media: ProjectMedia[];
  units: ProjectUnit[];
  amenityGroups: ProjectUnitAmenityGroup[];
};
