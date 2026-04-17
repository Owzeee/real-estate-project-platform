"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";

import {
  submitInquiry,
  type InquiryActionState,
} from "@/features/inquiries/actions";
import { getTranslations, type SiteLocale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

const initialState: InquiryActionState = {
  status: "idle",
  message: null,
};

type InquiryFormProps = {
  projectId: string;
  propertyOptions?: Array<{
    value: string;
    label: string;
  }>;
  locale?: SiteLocale;
};

export function InquiryForm({
  projectId,
  propertyOptions = [],
  locale = "fr",
}: InquiryFormProps) {
  const t = getTranslations(locale);
  const startedRef = useRef(false);
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("inquiry_submitted", {
        project_id: projectId,
        property_option_count: propertyOptions.length,
        status: state.status,
      });
    }

    if (state.status === "error" && state.message) {
      trackEvent("inquiry_submission_failed", {
        project_id: projectId,
        property_option_count: propertyOptions.length,
        status: state.status,
        message: state.message,
      });
    }
  }, [projectId, propertyOptions.length, state.message, state.status]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      onFocus={() => {
        if (startedRef.current) {
          return;
        }

        startedRef.current = true;
        trackEvent("inquiry_started", {
          project_id: projectId,
          property_option_count: propertyOptions.length,
        });
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <div>
        <label htmlFor="propertyLabel" className="field-label">
          {t.inquiry.property}
        </label>
        <select
          id="propertyLabel"
          name="propertyLabel"
          className="field-input"
          defaultValue=""
          onChange={(event) =>
            trackEvent("inquiry_property_selected", {
              project_id: projectId,
              selected_property_label: event.target.value || "whole_project",
            })
          }
        >
          <option value="">{t.inquiry.wholeProject}</option>
          {propertyOptions.map((option) => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
