"use client";

import { useRef, useState } from "react";
import { z } from "zod";

import {
  getAttributionContext,
  getCurrentPagePath,
  trackCtaClick,
  trackEvent
} from "@/lib/analytics";

const inquiryTypeOptions = [
  { value: "project", label: "導入・ご相談" },
  { value: "partnership", label: "協業・パートナーシップ" },
  { value: "media", label: "取材・登壇" },
  { value: "other", label: "その他" }
] as const;

const awarenessSourceOptions = [
  { value: "x", label: "X" },
  { value: "google", label: "Google" },
  { value: "event", label: "展示会" },
  { value: "ai", label: "AI（ChatGPT, Gemini etc...）" }
] as const;

const contactFormSchema = z.object({
  company: z.string().trim().max(120, "会社名は120文字以内で入力してください。").optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "姓を入力してください。")
    .max(40, "姓は40文字以内で入力してください。"),
  firstName: z
    .string()
    .trim()
    .min(1, "名を入力してください。")
    .max(40, "名は40文字以内で入力してください。"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください。")
    .email("有効なメールアドレスを入力してください。"),
  phone: z
    .string()
    .trim()
    .min(1, "電話番号を入力してください。")
    .max(30, "電話番号は30文字以内で入力してください。")
    .refine((value) => {
      const digitCount = value.replace(/\D/g, "").length;
      return digitCount >= 10 && digitCount <= 15;
    }, "有効な電話番号を入力してください。"),
  inquiryType: z.enum(inquiryTypeOptions.map((option) => option.value) as [string, ...string[]], {
    errorMap: () => ({ message: "お問い合わせ種別を選択してください。" })
  }),
  awarenessSources: z
    .array(z.enum(awarenessSourceOptions.map((option) => option.value) as [string, ...string[]]))
    .max(awarenessSourceOptions.length)
    .optional()
    .default([]),
  message: z
    .string()
    .trim()
    .min(10, "お問い合わせ内容は10文字以上で入力してください。")
    .max(2000, "お問い合わせ内容は2000文字以内で入力してください。")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;
type ContactFieldName = keyof ContactFormValues;

const initialValues: ContactFormValues = {
  company: "",
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  inquiryType: inquiryTypeOptions[0].value,
  awarenessSources: [],
  message: ""
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactFieldName, string>>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedFormStartRef = useRef(false);

  function trackFormStart() {
    if (hasTrackedFormStartRef.current) {
      return;
    }

    hasTrackedFormStartRef.current = true;
    trackEvent("contact_form_started", {
      form_id: "contact_form",
      page_path: getCurrentPagePath()
    });
  }

  function handleChange(field: ContactFieldName, value: string) {
    trackFormStart();
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatusMessage("");
  }

  function handleAwarenessSourceChange(
    source: ContactFormValues["awarenessSources"][number],
    isChecked: boolean
  ) {
    trackFormStart();
    setValues((current) => {
      const nextSources = isChecked
        ? Array.from(new Set([...current.awarenessSources, source]))
        : current.awarenessSources.filter((item) => item !== source);

      return { ...current, awarenessSources: nextSources };
    });
    setErrors((current) => ({ ...current, awarenessSources: undefined }));
    setStatusMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<Record<ContactFieldName, string>> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field as ContactFieldName]) {
          nextErrors[field as ContactFieldName] = issue.message;
        }
      }

      setErrors(nextErrors);
      setStatusMessage("入力内容を確認してください。");
      trackEvent("contact_form_submit_failed", {
        form_id: "contact_form",
        failure_stage: "validation",
        error_count: result.error.issues.length,
        page_path: getCurrentPagePath()
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatusMessage("送信しています。");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company: result.data.company,
          name: `${result.data.lastName} ${result.data.firstName}`.trim(),
          email: result.data.email,
          phone: result.data.phone,
          inquiryType: result.data.inquiryType,
          awarenessSources: result.data.awarenessSources,
          message: result.data.message,
          ...getAttributionContext()
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatusMessage(payload.message ?? "送信に失敗しました。");
        trackEvent("contact_form_submit_failed", {
          form_id: "contact_form",
          failure_stage: "api_error",
          response_status: response.status,
          page_path: getCurrentPagePath()
        });
        return;
      }

      setValues(initialValues);
      setStatusMessage("送信が完了しました。受付確認メールを送付しています。");
      trackEvent("generate_lead", {
        form_id: "contact_form",
        inquiry_type: result.data.inquiryType,
        has_company: result.data.company?.trim().length ? true : false,
        awareness_sources: result.data.awarenessSources.join(","),
        page_path: getCurrentPagePath()
      });
    } catch {
      setStatusMessage("送信に失敗しました。通信環境を確認して再度お試しください。");
      trackEvent("contact_form_submit_failed", {
        form_id: "contact_form",
        failure_stage: "network_error",
        page_path: getCurrentPagePath()
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fx-contact-form-block">
      <form
        className="fx-contact-form"
        onSubmit={handleSubmit}
        noValidate
        onFocusCapture={trackFormStart}
      >
        <div className="fx-contact-form-grid">
          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-company">
              会社名
            </label>
            <input
              id="contact-company"
              name="company"
              className="fx-contact-input"
              data-clarity-mask="true"
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={(event) => handleChange("company", event.target.value)}
              aria-describedby={errors.company ? "contact-company-error" : undefined}
              aria-invalid={errors.company ? "true" : undefined}
            />
            {errors.company ? (
              <p id="contact-company-error" className="fx-contact-error" role="alert">
                {errors.company}
              </p>
            ) : null}
          </div>

          <div className="fx-contact-name-grid">
            <div className="fx-contact-field">
              <label className="fx-contact-label" htmlFor="contact-last-name">
                姓<span className="fx-contact-required">必須</span>
              </label>
              <input
                id="contact-last-name"
                name="lastName"
                className="fx-contact-input"
                data-clarity-mask="true"
                type="text"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                aria-describedby={errors.lastName ? "contact-last-name-error" : undefined}
                aria-invalid={errors.lastName ? "true" : undefined}
              />
              {errors.lastName ? (
                <p id="contact-last-name-error" className="fx-contact-error" role="alert">
                  {errors.lastName}
                </p>
              ) : null}
            </div>

            <div className="fx-contact-field">
              <label className="fx-contact-label" htmlFor="contact-first-name">
                名<span className="fx-contact-required">必須</span>
              </label>
              <input
                id="contact-first-name"
                name="firstName"
                className="fx-contact-input"
                data-clarity-mask="true"
                type="text"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                aria-describedby={errors.firstName ? "contact-first-name-error" : undefined}
                aria-invalid={errors.firstName ? "true" : undefined}
              />
              {errors.firstName ? (
                <p id="contact-first-name-error" className="fx-contact-error" role="alert">
                  {errors.firstName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-email">
              メールアドレス<span className="fx-contact-required">必須</span>
            </label>
            <input
              id="contact-email"
              name="email"
              className="fx-contact-input"
              data-clarity-mask="true"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => handleChange("email", event.target.value)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              aria-invalid={errors.email ? "true" : undefined}
            />
            {errors.email ? (
              <p id="contact-email-error" className="fx-contact-error" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-phone">
              電話番号<span className="fx-contact-required">必須</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              className="fx-contact-input"
              data-clarity-mask="true"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="例：03-1234-5678"
              value={values.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              aria-invalid={errors.phone ? "true" : undefined}
            />
            {errors.phone ? (
              <p id="contact-phone-error" className="fx-contact-error" role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-type">
              お問い合わせ種別<span className="fx-contact-required">必須</span>
            </label>
            <span className="fx-contact-select-wrap">
              <select
                id="contact-type"
                name="inquiryType"
                className="fx-contact-input fx-contact-select"
                data-clarity-mask="true"
                value={values.inquiryType}
                onChange={(event) => handleChange("inquiryType", event.target.value)}
                aria-describedby={errors.inquiryType ? "contact-type-error" : undefined}
                aria-invalid={errors.inquiryType ? "true" : undefined}
              >
                {inquiryTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
            {errors.inquiryType ? (
              <p id="contact-type-error" className="fx-contact-error" role="alert">
                {errors.inquiryType}
              </p>
            ) : null}
          </div>
        </div>

        <fieldset className="fx-contact-field fx-contact-checkbox-field">
          <legend className="fx-contact-label">どこでField Xについて知りましたか？</legend>
          <div className="fx-contact-checkbox-grid">
            {awarenessSourceOptions.map((option) => (
              <label key={option.value} className="fx-contact-checkbox-label">
                <input
                  type="checkbox"
                  name="awarenessSources"
                  value={option.value}
                  checked={values.awarenessSources.includes(option.value)}
                  onChange={(event) =>
                    handleAwarenessSourceChange(option.value, event.target.checked)
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="fx-contact-field">
          <label className="fx-contact-label" htmlFor="contact-message">
            お問い合わせ内容<span className="fx-contact-required">必須</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="fx-contact-input fx-contact-textarea"
            data-clarity-mask="true"
            rows={8}
            value={values.message}
            onChange={(event) => handleChange("message", event.target.value)}
            aria-describedby={`contact-message-note${errors.message ? " contact-message-error" : ""}`}
            aria-invalid={errors.message ? "true" : undefined}
          />
          <p id="contact-message-note" className="fx-contact-note">
            送信後、ご入力いただいたメールアドレス宛に受付確認メールをお送りします。
          </p>
          {errors.message ? (
            <p id="contact-message-error" className="fx-contact-error" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="fx-contact-actions">
          <button type="submit" className="fx-about-cta fx-contact-submit" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
          <p className="fx-contact-direct-link">
            メールソフトを使わず直接連絡する場合:{" "}
            <a
              href="mailto:hello@fieldx.site"
              onClick={() =>
                trackCtaClick({
                  ctaId: "contact_direct_email",
                  ctaLabel: "hello@fieldx.site",
                  ctaLocation: "contact_form",
                  destinationUrl: "mailto:hello@fieldx.site"
                })
              }
            >
              hello@fieldx.site
            </a>
          </p>
        </div>

        <p className="fx-contact-status" aria-live="polite">
          {statusMessage}
        </p>
      </form>
    </div>
  );
}
