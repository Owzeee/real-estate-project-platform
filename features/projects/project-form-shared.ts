import type {
  CompletionStage,
  ProjectStatus,
  ProjectType,
} from "@/features/projects/types";

export type DeveloperOption = {
  id: string;
  companyName: string;
};

export type ProjectFormValues = {
  developerProfileId: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  country: string;
  currencyCode: string;
  minPrice: string;
  maxPrice: string;
  latitude: string;
  longitude: string;
  projectType: ProjectType;
  completionStage: CompletionStage;
  status: ProjectStatus;
  imageUrls: string;
  videoUrls: string;
  brochureUrls: string;
  tour3dUrls: string;
};

export const projectTypes = [
  "apartment",
  "villa",
  "townhouse",
  "mixed_use",
  "commercial",
  "land",
] as const;

export const completionStages = [
  "pre_launch",
  "under_construction",
  "ready",
  "completed",
] as const;

export const projectStatuses = [
  "draft",
  "active",
  "sold_out",
  "archived",
] as const;

export const emptyProjectFormValues: ProjectFormValues = {
  developerProfileId: "",
  title: "",
  slug: "",
  description: "",
  location: "",
  city: "",
  country: "",
  currencyCode: "USD",
  minPrice: "",
  maxPrice: "",
  latitude: "",
  longitude: "",
  projectType: "apartment",
  completionStage: "pre_launch",
  status: "draft",
  imageUrls: "",
  videoUrls: "",
  brochureUrls: "",
  tour3dUrls: "",
};
