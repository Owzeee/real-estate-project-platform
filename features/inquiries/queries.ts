import { cache } from "react";

import { createAdminSupabaseClient, hasServiceRoleEnv } from "@/lib/supabase/server";

export type InquiryRecord = {
  id: string;
  projectId: string;
  developerProfileId: string;
  developerName: string;
  projectTitle: string;
  propertyLabel: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: string;
};

type InquiryRow = {
  id: string;
  project_id: string;
  property_label: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: InquiryRecord["status"];
  created_at: string;
  projects:
    | {
        title: string;
        developer_profile_id: string;
        developer_profiles:
          | {
              company_name: string;
            }
          | {
              company_name: string;
            }[]
          | null;
      }
    | {
        title: string;
        developer_profile_id: string;
        developer_profiles:
          | {
              company_name: string;
            }
          | {
              company_name: string;
            }[]
          | null;
      }[]
    | null;
};

function mapInquiry(item: InquiryRow): InquiryRecord {
  const relatedProject = Array.isArray(item.projects)
    ? item.projects[0]
    : item.projects;
  const relatedDeveloper = Array.isArray(relatedProject?.developer_profiles)
    ? relatedProject?.developer_profiles[0]
    : relatedProject?.developer_profiles;

  return {
    id: item.id,
    projectId: item.project_id,
    developerProfileId: relatedProject?.developer_profile_id ?? "",
    developerName: relatedDeveloper?.company_name ?? "Developer",
    projectTitle: relatedProject?.title ?? "Unknown project",
    propertyLabel: item.property_label,
    fullName: item.full_name,
    email: item.email,
    phone: item.phone,
    message: item.message,
    status: item.status,
    createdAt: item.created_at,
  };
}

async function fetchInquiries(developerProfileId?: string) {
  if (!hasServiceRoleEnv()) {
    return [] as InquiryRecord[];
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [] as InquiryRecord[];
  }

  let query = supabase
    .from("inquiries")
    .select(
      `
        id,
        project_id,
        property_label,
        full_name,
        email,
        phone,
        message,
        status,
        created_at,
        projects!inner (
          title,
          developer_profile_id,
          developer_profiles (
            company_name
          )
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (developerProfileId) {
    query = query.eq("projects.developer_profile_id", developerProfileId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [] as InquiryRecord[];
  }

  return (data as InquiryRow[]).map(mapInquiry);
}

export const getInquiries = cache(async () => {
  return fetchInquiries();
});

export const getInquiriesForDeveloper = cache(async (developerProfileId: string) => {
  return fetchInquiries(developerProfileId);
});
