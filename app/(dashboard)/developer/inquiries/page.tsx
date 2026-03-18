import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopers } from "@/features/developers/queries";
import { updateDeveloperInquiryStatus } from "@/features/inquiries/actions";
import { getInquiries, getInquiriesForDeveloper } from "@/features/inquiries/queries";

type DeveloperInquiriesPageProps = {
  searchParams?: Promise<{
    developerId?: string;
  }>;
};

export default async function DeveloperInquiriesPage({
  searchParams,
}: DeveloperInquiriesPageProps) {
  const params = (await searchParams) ?? {};
  const [developers, allInquiries, scopedInquiries] = await Promise.all([
    getDevelopers(),
    getInquiries(),
    params.developerId ? getInquiriesForDeveloper(params.developerId) : Promise.resolve(null),
  ]);

  const inquiries = scopedInquiries ?? allInquiries;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Developer Inbox"
          title="Project inquiries"
          description="Track buyer leads by developer profile and move them through a simple follow-up workflow without leaving the dashboard."
        />

        <form className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)] md:flex-row md:items-end">
          <div className="w-full max-w-xl">
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Filter by developer profile
            </label>
            <select
              name="developerId"
              defaultValue={params.developerId}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
            >
              <option value="">All developers</option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.companyName}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            Apply filter
          </button>
        </form>

        <div className="mt-10 grid gap-6">
          {inquiries.length === 0 ? (
            <article className="rounded-[2rem] border border-stone-900/10 bg-white p-8 text-sm text-stone-600 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
              No inquiries match the current developer filter.
            </article>
          ) : null}

          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {inquiry.developerName} • {inquiry.projectTitle}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                    {inquiry.fullName}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {inquiry.email}
                    {inquiry.phone ? ` • ${inquiry.phone}` : ""}
                  </p>
                  {inquiry.message ? (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                      {inquiry.message}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-950">
                  {inquiry.status}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {(["new", "contacted", "qualified", "closed"] as const).map(
                  (status) => (
                    <form
                      key={status}
                      action={updateDeveloperInquiryStatus.bind(
                        null,
                        inquiry.developerProfileId,
                        inquiry.id,
                        status,
                      )}
                    >
                      <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900">
                        Mark {status}
                      </button>
                    </form>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
