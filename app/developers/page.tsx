import { SectionHeading } from "@/components/shared/section-heading";
import { DeveloperCard } from "@/features/developers/developer-card";
import { getDevelopers } from "@/features/developers/queries";

export default async function DevelopersPage() {
  const developers = await getDevelopers();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Developers"
          title="Developer profiles"
          description="Explore the companies behind the projects, including verification state, website links, and their currently published developments."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {developers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>
      </div>
    </main>
  );
}
