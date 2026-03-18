import { SectionHeading } from "@/components/shared/section-heading";
import { toggleDeveloperVerification } from "@/features/developers/actions";
import { getDevelopersWithAllProjects } from "@/features/developers/queries";

export default async function AdminDevelopersPage() {
  const developers = await getDevelopersWithAllProjects();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Admin"
          title="Developer verification"
          description="Verify marketplace participants before projects go live and keep admin review of company profiles in one place."
        />

        <div className="mt-10 grid gap-6">
          {developers.map((developer) => (
            <article
              key={developer.id}
              className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {developer.companyName}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {developer.projects.length} projects • {developer.slug}
                  </p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                    {developer.description ?? "No company description added yet."}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    developer.isVerified
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-amber-100 text-amber-950"
                  }`}
                >
                  {developer.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <form
                  action={toggleDeveloperVerification.bind(
                    null,
                    developer.id,
                    !developer.isVerified,
                  )}
                >
                  <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900">
                    {developer.isVerified ? "Remove verification" : "Verify developer"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
