import { redirect } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { createDeveloperProfile } from "@/features/developers/actions";
import { DeveloperProfileForm } from "@/features/developers/developer-profile-form";
import { getCurrentAuth, requireAuthenticatedUser } from "@/lib/auth";

export default async function DeveloperOnboardingPage() {
  const auth = await requireAuthenticatedUser();

  if (auth.profile.role !== "developer") {
    redirect("/");
  }

  const current = await getCurrentAuth();

  if (current.developerProfile) {
    redirect("/developer/projects");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Developer Setup"
          title="Create your developer profile"
          description="This profile connects your account to the projects you publish in the marketplace."
        />
        <section className="mt-10 border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
          <DeveloperProfileForm
            action={createDeveloperProfile}
            developer={{
              id: "",
              userId: auth.user.id,
              companyName: auth.profile.fullName ?? "",
              slug: "",
              description: null,
              websiteUrl: null,
              logoUrl: null,
              isVerified: false,
            }}
          />
        </section>
      </div>
    </main>
  );
}
