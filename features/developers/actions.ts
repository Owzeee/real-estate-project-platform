"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
  requireAuthenticatedUser,
  requireDeveloperOrAdminAccess,
} from "@/lib/auth";
import { createAdminSupabaseClient, hasServiceRoleEnv } from "@/lib/supabase/server";

export type DeveloperProfileActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function revalidateDeveloperPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/developers");
  revalidatePath("/developer/profiles");
  revalidatePath("/admin/developers");

  if (slug) {
    revalidatePath(`/developers/${slug}`);
  }
}

export async function createDeveloperProfile(
  _previousState: DeveloperProfileActionState,
  formData: FormData,
): Promise<DeveloperProfileActionState> {
  const auth = await requireAuthenticatedUser();
  const companyName = formData.get("companyName")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();

  if (auth.profile.role !== "developer") {
    return {
      status: "error",
      message: "Only developer accounts can create developer profiles.",
    };
  }

  if (!companyName || !slug) {
    return {
      status: "error",
      message: "Company name and slug are required.",
    };
  }

  if (!hasServiceRoleEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing.",
    };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const { data: existingDeveloperProfile } = await supabase
    .from("developer_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (existingDeveloperProfile) {
    return {
      status: "error",
      message: "This account already has a developer profile.",
    };
  }

  const { error } = await supabase.from("developer_profiles").insert({
    user_id: auth.user.id,
    company_name: companyName,
    slug,
    description: optionalText(formData, "description"),
    website_url: optionalText(formData, "websiteUrl"),
    logo_url: optionalText(formData, "logoUrl"),
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateDeveloperPaths(slug);
  redirect("/developer/projects");
}

export async function saveDeveloperProfile(
  _previousState: DeveloperProfileActionState,
  formData: FormData,
): Promise<DeveloperProfileActionState> {
  const developerId = formData.get("developerId")?.toString().trim();
  const companyName = formData.get("companyName")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();

  if (!developerId || !companyName || !slug) {
    return {
      status: "error",
      message: "Developer, company name, and slug are required.",
    };
  }

  if (!hasServiceRoleEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing.",
    };
  }

  await requireDeveloperOrAdminAccess(developerId);

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const { error } = await supabase
    .from("developer_profiles")
    .update({
      company_name: companyName,
      slug,
      description: optionalText(formData, "description"),
      website_url: optionalText(formData, "websiteUrl"),
      logo_url: optionalText(formData, "logoUrl"),
    })
    .eq("id", developerId);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateDeveloperPaths(slug);

  return {
    status: "success",
    message: "Developer profile updated successfully.",
  };
}

export async function toggleDeveloperVerification(
  developerId: string,
  isVerified: boolean,
) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data } = await supabase
    .from("developer_profiles")
    .update({ is_verified: isVerified })
    .eq("id", developerId)
    .select("slug")
    .maybeSingle();

  revalidateDeveloperPaths(data?.slug ?? undefined);
}
