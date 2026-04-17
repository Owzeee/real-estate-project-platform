"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  signInAction,
  signUpAction,
} from "@/features/auth/actions";
import { authInitialState, type AuthActionState } from "@/features/auth/state";

type AuthFormProps = {
  mode: "login" | "signup";
  next?: string;
};

export function AuthForm({ mode, next }: AuthFormProps) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    action,
    authInitialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {mode === "signup" ? (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Full name
            </label>
            <input
              name="fullName"
              required
              className="w-full border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Account type
            </label>
            <select
              name="role"
              defaultValue="buyer"
              className="w-full border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="buyer">Buyer</option>
              <option value="developer">Developer</option>
            </select>
          </div>
        </>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? mode === "login"
            ? "Signing in..."
            : "Creating account..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-amber-800" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <p className="text-sm text-[var(--muted-foreground)]">
        {mode === "login" ? "Need an account? " : "Already registered? "}
        <Link
          href={mode === "login" ? "/auth/signup" : "/auth/login"}
          className="font-semibold text-stone-950 underline decoration-[var(--border)] underline-offset-4"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
