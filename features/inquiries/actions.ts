"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin, requireDeveloper } from "@/lib/auth";
import { createAdminSupabaseClient, hasServiceRoleEnv } from "@/lib/supabase/server";

export type InquiryActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function submitInquiry(
  _previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const projectId = formData.get("projectId")?.toString().trim();
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;
  const message = formData.get("message")?.toString().trim() || null;

  if (!projectId || !fullName || !email) {
    return {
      status: "error",
      message: "Project, full name, and email are required.",
    };
  }

  if (!hasServiceRoleEnv()) {
    return {
      status: "error",
      message:
        "Supabase environment variables are not configured yet. Add them before saving live inquiries.",
    };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase client is unavailable.",
    };
  }

  const { error } = await supabase.from("inquiries").insert({
    project_id: projectId,
    full_name: fullName,
    email,
    phone,
    message,
  });

  if (error) {
    return {
      status: "error",
      message: "Failed to submit inquiry. Check your table and RLS setup.",
    };
  }

  return {
    status: "success",
    message: "Inquiry submitted successfully.",
  };
}

export async function updateInquiryStatus(
  inquiryId: string,
  nextStatus: "new" | "contacted" | "qualified" | "closed",
) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);

  revalidatePath("/admin/inquiries");
}

export async function updateDeveloperInquiryStatus(
  developerProfileId: string,
  inquiryId: string,
  nextStatus: "new" | "contacted" | "qualified" | "closed",
) {
  const auth = await requireDeveloper();

  if (auth.developerProfile.id !== developerProfileId) {
    return;
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data } = await supabase
    .from("inquiries")
    .select(
      `
        id,
        projects!inner (
          developer_profile_id
        )
      `,
    )
    .eq("id", inquiryId)
    .maybeSingle();

  const relatedProject = Array.isArray(data?.projects)
    ? data.projects[0]
    : data?.projects;

  if (relatedProject?.developer_profile_id !== developerProfileId) {
    return;
  }

  await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);

  revalidatePath("/developer/inquiries");
  revalidatePath("/admin/inquiries");
}
