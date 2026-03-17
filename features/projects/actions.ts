"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";

type ActionStatus = "idle" | "success" | "error";

export type CreateProjectActionState = {
  status: ActionStatus;
  message: string | null;
};

const initialState: CreateProjectActionState = {
  status: "idle",
  message: null,
};

export { initialState as createProjectInitialState };

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMediaList(formData: FormData, key: string) {
  return (formData.get(key)?.toString() ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createProject(
  _previousState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> {
  const developerProfileId = formData.get("developerProfileId")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const projectType = formData.get("projectType")?.toString().trim();
  const completionStage = formData.get("completionStage")?.toString().trim();
  const status = formData.get("status")?.toString().trim();
  const currencyCode =
    formData.get("currencyCode")?.toString().trim().toUpperCase() || "USD";

  if (
    !developerProfileId ||
    !title ||
    !slug ||
    !description ||
    !location ||
    !projectType ||
    !completionStage ||
    !status
  ) {
    return {
      status: "error",
      message: "Developer, title, slug, description, location, type, stage, and status are required.",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing.",
    };
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const minPrice = optionalNumber(formData, "minPrice");
  const maxPrice = optionalNumber(formData, "maxPrice");
  const latitude = optionalNumber(formData, "latitude");
  const longitude = optionalNumber(formData, "longitude");

  if (minPrice && maxPrice && minPrice > maxPrice) {
    return {
      status: "error",
      message: "Minimum price cannot be greater than maximum price.",
    };
  }

  if ((latitude === null) !== (longitude === null)) {
    return {
      status: "error",
      message: "Latitude and longitude must be provided together.",
    };
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      developer_profile_id: developerProfileId,
      title,
      slug,
      description,
      location,
      city: optionalText(formData, "city"),
      country: optionalText(formData, "country"),
      latitude,
      longitude,
      min_price: minPrice,
      max_price: maxPrice,
      currency_code: currencyCode,
      status,
      project_type: projectType,
      completion_stage: completionStage,
      approval_status: "pending",
      is_featured: false,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return {
      status: "error",
      message: projectError?.message ?? "Failed to create project.",
    };
  }

  const mediaGroups = [
    { key: "imageUrls", mediaType: "image" },
    { key: "videoUrls", mediaType: "video" },
    { key: "brochureUrls", mediaType: "brochure" },
    { key: "tour3dUrls", mediaType: "tour_3d" },
  ] as const;

  const mediaRows = mediaGroups.flatMap(({ key, mediaType }) =>
    parseMediaList(formData, key).map((fileUrl, index) => ({
      project_id: project.id,
      media_type: mediaType,
      file_url: fileUrl,
      title: null,
      thumbnail_url: null,
      sort_order: index,
    })),
  );

  if (mediaRows.length > 0) {
    const { error: mediaError } = await supabase
      .from("project_media")
      .insert(mediaRows);

    if (mediaError) {
      return {
        status: "error",
        message: mediaError.message,
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/developer/projects");

  return {
    status: "success",
    message: "Project created. It is now saved and waiting for admin approval.",
  };
}
