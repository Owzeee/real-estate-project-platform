"use server";

import { revalidatePath } from "next/cache";

import { type DeveloperProfileActionState } from "@/features/developers/state";
import { requireAuthenticatedUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function saveDeveloperProfile(
  _previousState: DeveloperProfileActionState,
  formData: FormData,
): Promise<DeveloperProfileActionState> {
  const { user, profile } = await requireAuthenticatedUser();

  if (profile.role !== "developer") {
    return {
      status: "error",
      message: "Only developer accounts can create developer profiles.",
    };
  }

  const companyName = formData.get("companyName")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const websiteUrl = formData.get("websiteUrl")?.toString().trim() || null;
  const logoUrl = formData.get("logoUrl")?.toString().trim() || null;

  if (!companyName || !slug) {
    return {
      status: "error",
      message: "Company name and slug are required.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase is not configured.",
    };
  }

  const { error } = await supabase.from("developer_profiles").upsert(
    {
      user_id: user.id,
      company_name: companyName,
      slug,
      description,
      website_url: websiteUrl,
      logo_url: logoUrl,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/developer/projects");
  revalidatePath("/developer/onboarding");

  return {
    status: "success",
    message: "Developer profile saved successfully.",
  };
}
