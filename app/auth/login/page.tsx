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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-md rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Access your marketplace account and dashboard.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" next={params?.next} />
        </div>
      </div>
    </main>
  );
}
