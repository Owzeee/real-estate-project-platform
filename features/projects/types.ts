export type ProjectStatus = "draft" | "active" | "sold_out" | "archived";
export type ProjectApprovalStatus = "pending" | "approved" | "rejected";
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
  currencyCode: string;
  status: ProjectStatus;
  approvalStatus: ProjectApprovalStatus;
  projectType: ProjectType;
  completionStage: CompletionStage;
  isFeatured: boolean;
  latitude: number | null;
  longitude: number | null;
  heroMediaUrl: string | null;
};

export type ProjectDetail = ProjectSummary & {
  media: ProjectMedia[];
};
