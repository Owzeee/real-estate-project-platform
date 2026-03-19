import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/auth-form";
import { getCurrentAuth } from "@/lib/auth";

export default async function SignupPage() {
  const auth = await getCurrentAuth();
  if (auth.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-transparent px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
        <section className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(198,154,91,0.18),rgba(141,104,71,0.12))] p-8 shadow-[0_30px_80px_rgba(32,28,25,0.08)] sm:p-10">
          <p className="inline-flex rounded-full bg-[rgba(198,154,91,0.14)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Join The Platform
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-stone-950">
            Create your marketplace account
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted-foreground)]">
            Register as a buyer to explore projects or as a developer to onboard your company and start publishing real estate developments.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-8 shadow-[0_24px_70px_rgba(32,28,25,0.08)] sm:p-10">
          <h2 className="font-display text-4xl font-bold tracking-tight text-stone-950">
            Create account
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Register as a buyer or developer to use the marketplace.
          </p>
          <div className="mt-8">
            <AuthForm mode="signup" />
          </div>
        </section>
      </div>
    </main>
  );
}
