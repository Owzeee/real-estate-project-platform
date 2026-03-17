import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/auth-form";
import { getCurrentAuth } from "@/lib/auth";

export default async function SignupPage() {
  const auth = await getCurrentAuth();
  if (auth.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-md rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
          Create account
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Register as a buyer or developer to use the marketplace.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}
