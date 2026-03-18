import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { saveDeveloperProfile } from "@/features/developers/actions";
import { DeveloperProfileForm } from "@/features/developers/developer-profile-form";
import { getDeveloperById } from "@/features/developers/queries";

type EditDeveloperProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDeveloperProfilePage({
  params,
}: EditDeveloperProfilePageProps) {
  const { id } = await params;
  const developer = await getDeveloperById(id);

  if (!developer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title={`Edit ${developer.companyName}`}
            description="Keep the public-facing company profile current across project cards, developer pages, and admin review surfaces."
          />
          <Link
            href="/developer/profiles"
            className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          >
            Back to profiles
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)] sm:p-10">
          <DeveloperProfileForm action={saveDeveloperProfile} developer={developer} />
        </section>
      </div>
    </main>
  );
}
