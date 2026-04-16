import { SectionHeading } from "@/components/shared/section-heading";
import { updateInquiryStatus } from "@/features/inquiries/actions";
import { getInquiries } from "@/features/inquiries/queries";
import { requireAdmin } from "@/lib/auth";

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const inquiries = await getInquiries();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Admin"
          title="Inquiry management"
          description="Track incoming leads by project and move them through a simple qualification pipeline."
        />

        <div className="mt-10 grid gap-6">
          {inquiries.length === 0 ? (
            <article className="rounded-[2rem] border border-stone-900/10 bg-white p-8 text-sm text-stone-600 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
              No inquiries yet.
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
                    {inquiry.projectTitle}
                  </p>
                  {inquiry.propertyLabel ? (
                    <p className="mt-2 text-sm font-semibold text-stone-950">
                      Property: {inquiry.propertyLabel}
                    </p>
                  ) : null}
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
                      action={updateInquiryStatus.bind(null, inquiry.id, status)}
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
