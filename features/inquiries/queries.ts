import { cache } from "react";

import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type InquiryRecord = {
  id: string;
  projectId: string;
  projectTitle: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: string;
};

export const getInquiries = cache(async () => {
  if (!hasSupabaseEnv()) {
    return [] as InquiryRecord[];
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return [] as InquiryRecord[];
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
        id,
        project_id,
        full_name,
        email,
        phone,
        message,
        status,
        created_at,
        projects (
          title
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as InquiryRecord[];
  }

  return data.map((item) => {
    const relatedProject = item.projects as { title: string } | { title: string }[] | null;

    return ({
    id: item.id,
    projectId: item.project_id,
    projectTitle: Array.isArray(relatedProject)
      ? relatedProject[0]?.title ?? "Unknown project"
      : relatedProject?.title ?? "Unknown project",
    fullName: item.full_name,
    email: item.email,
    phone: item.phone,
    message: item.message,
    status: item.status,
    createdAt: item.created_at,
    });
  }) satisfies InquiryRecord[];
});
