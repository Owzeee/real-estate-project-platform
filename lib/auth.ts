import { cache } from "react";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "developer" | "buyer";

export type CurrentProfile = {
  id: string;
  email: string | null;
  role: AppRole;
  fullName: string | null;
};

export type CurrentDeveloperProfile = {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
};

type AuthState = Awaited<ReturnType<typeof getCurrentAuth>>;
type AuthenticatedAuthState = AuthState & {
  user: NonNullable<AuthState["user"]>;
  profile: NonNullable<AuthState["profile"]>;
};

export const getCurrentAuth = cache(async () => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      user: null,
      profile: null,
      developerProfile: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      developerProfile: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const typedProfile = profile
    ? {
        id: profile.id,
        email: profile.email,
        role: profile.role as AppRole,
        fullName: profile.full_name,
      }
    : null;

  const { data: developerProfile } = await supabase
    .from("developer_profiles")
    .select("id, user_id, company_name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    profile: typedProfile,
    developerProfile: developerProfile
      ? {
          id: developerProfile.id,
          userId: developerProfile.user_id,
          companyName: developerProfile.company_name,
          slug: developerProfile.slug,
        }
      : null,
  };
});

export async function requireAuthenticatedUser() {
  const auth = await getCurrentAuth();

  if (!auth.user || !auth.profile) {
    redirect("/auth/login");
  }

  return auth as AuthenticatedAuthState;
}

export async function requireAdmin() {
  const auth = await requireAuthenticatedUser();

  if (auth.profile.role !== "admin") {
    redirect("/");
  }

  return auth;
}

export async function requireDeveloper() {
  const auth = await requireAuthenticatedUser();

  if (auth.profile.role !== "developer") {
    redirect("/");
  }

  if (!auth.developerProfile) {
    redirect("/developer/onboarding");
  }

  return auth as AuthenticatedAuthState & {
    developerProfile: CurrentDeveloperProfile;
  };
}

export async function requireDeveloperOrAdminAccess(
  developerProfileId: string,
) {
  const auth = await requireAuthenticatedUser();

  if (auth.profile.role === "admin") {
    return auth;
  }

  if (
    auth.profile.role !== "developer" ||
    !auth.developerProfile ||
    auth.developerProfile.id !== developerProfileId
  ) {
    redirect("/");
  }

  return auth;
}
