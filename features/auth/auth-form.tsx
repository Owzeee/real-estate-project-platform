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
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Account type
            </label>
            <select
              name="role"
              defaultValue="buyer"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
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
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
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
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
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
      <p className="text-sm text-stone-600">
        {mode === "login" ? "Need an account? " : "Already registered? "}
        <Link
          href={mode === "login" ? "/auth/signup" : "/auth/login"}
          className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
