import type { ProjectSummary } from "@/features/projects/types";

export type DeveloperProfile = {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  isVerified: boolean;
};

export type DeveloperDetail = DeveloperProfile & {
  projects: ProjectSummary[];
};
