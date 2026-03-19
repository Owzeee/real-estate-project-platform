import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/auth-form";
import { getCurrentAuth } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const auth = await getCurrentAuth();
  if (auth.user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-transparent px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
        <section className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(141,104,71,0.94),rgba(32,28,25,0.98))] p-8 text-white shadow-[0_40px_100px_rgba(32,28,25,0.22)] sm:p-10">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
            Secure Access
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight">
            Sign in to your marketplace workspace
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
            Access your developer dashboard, review project submissions, or manage admin moderation from one premium workspace.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-8 shadow-[0_24px_70px_rgba(32,28,25,0.08)] sm:p-10">
          <h2 className="font-display text-4xl font-bold tracking-tight text-stone-950">
            Sign in
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Access your marketplace account and continue where you left off.
          </p>
          <div className="mt-8">
            <AuthForm mode="login" next={params?.next} />
          </div>
        </section>
      </div>
    </main>
  );
}
