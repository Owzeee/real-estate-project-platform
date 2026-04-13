"use client";

import { useActionState } from "react";

import {
  submitInquiry,
  type InquiryActionState,
} from "@/features/inquiries/actions";
import { getTranslations, type SiteLocale } from "@/lib/i18n";

const initialState: InquiryActionState = {
  status: "idle",
  message: null,
};

type InquiryFormProps = {
  projectId: string;
  locale?: SiteLocale;
};

export function InquiryForm({ projectId, locale = "fr" }: InquiryFormProps) {
  const t = getTranslations(locale);
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div>
        <label htmlFor="fullName" className="field-label">
          {t.inquiry.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">
          {t.inquiry.phone}
        </label>
        <input
          id="phone"
          name="phone"
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="message" className="field-label">
          {t.inquiry.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="field-input min-h-32 resize-y"
          placeholder={t.inquiry.placeholder}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t.inquiry.sending : t.inquiry.submit}
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
