"use client";

import { useActionState } from "react";

import {
  submitInquiry,
  type InquiryActionState,
} from "@/features/inquiries/actions";

const initialState: InquiryActionState = {
  status: "idle",
  message: null,
};

type InquiryFormProps = {
  projectId: string;
};

export function InquiryForm({ projectId }: InquiryFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          placeholder="Tell the developer what you are looking for."
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending inquiry..." : "Send inquiry"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-emerald-700" : "text-amber-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
