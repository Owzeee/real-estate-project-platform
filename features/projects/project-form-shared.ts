import type {
  CompletionStage,
  ProjectCategory,
  ProjectOfferType,
  ProjectPriceMode,
  ProjectStatus,
  ProjectType,
} from "@/features/projects/types";
import type { AmenityGroupKey } from "@/features/projects/amenity-options";

export type AmenitySelectionMap = Record<AmenityGroupKey, string[]>;

export type ProjectUnitFormValue = {
  title: string;
  slug: string;
  summary: string;
  offerType: ProjectOfferType;
  priceMode: ProjectPriceMode;
  fixedPrice: string;
  minPrice: string;
  maxPrice: string;
  monthlyRent: string;
  areaSqm: string;
  rooms: string;
  availableFrom: string;
  minimumStayMonths: string;
  maximumStayMonths: string;
  imageUrl: string;
  galleryUrls: string;
  amenities: AmenitySelectionMap;
  beds: string;
};

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
  priceMode: ProjectPriceMode;
  fixedPrice: string;
  minPrice: string;
  maxPrice: string;
  rentPrice: string;
  latitude: string;
  longitude: string;
  offerType: ProjectOfferType;
  category: ProjectCategory;
  projectType: ProjectType;
  completionStage: CompletionStage;
  status: ProjectStatus;
  imageUrls: string;
  videoUrls: string;
  brochureUrls: string;
  tour3dUrls: string;
  amenities: AmenitySelectionMap;
  units: ProjectUnitFormValue[];
};

export const emptyAmenitySelectionMap: AmenitySelectionMap = {
  essentials: [],
  kitchen: [],
  bedroom: [],
  bathroom: [],
  other: [],
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

export const projectOfferTypes = ["sale", "rent"] as const;
export const projectPriceModes = ["fixed", "range", "contact"] as const;

export const projectCategories = [
  "residential",
  "commercial",
  "office",
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
  priceMode: "fixed",
  fixedPrice: "",
  minPrice: "",
  maxPrice: "",
  rentPrice: "",
  latitude: "",
  longitude: "",
  offerType: "sale",
  category: "residential",
  projectType: "apartment",
  completionStage: "pre_launch",
  status: "draft",
  imageUrls: "",
  videoUrls: "",
  brochureUrls: "",
  tour3dUrls: "",
  amenities: emptyAmenitySelectionMap,
  units: [],
};
