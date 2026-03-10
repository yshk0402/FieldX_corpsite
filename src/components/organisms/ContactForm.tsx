"use client";

import { useState } from "react";
import { z } from "zod";

const inquiryTypeOptions = [
  { value: "project", label: "導入・ご相談" },
  { value: "partnership", label: "協業・パートナーシップ" },
  { value: "media", label: "取材・登壇" },
  { value: "other", label: "その他" }
] as const;

const contactFormSchema = z.object({
  company: z.string().trim().max(120, "会社名は120文字以内で入力してください。").optional(),
  name: z.string().trim().min(1, "お名前を入力してください。").max(80, "お名前は80文字以内で入力してください。"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください。")
    .email("有効なメールアドレスを入力してください。"),
  inquiryType: z.enum(inquiryTypeOptions.map((option) => option.value) as [string, ...string[]], {
    errorMap: () => ({ message: "お問い合わせ種別を選択してください。" })
  }),
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
  name: "",
  email: "",
  inquiryType: inquiryTypeOptions[0].value,
  message: ""
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactFieldName, string>>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: ContactFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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
        body: JSON.stringify(result.data)
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatusMessage(payload.message ?? "送信に失敗しました。");
        return;
      }

      setValues(initialValues);
      setStatusMessage("送信が完了しました。受付確認メールを送付しています。");
    } catch {
      setStatusMessage("送信に失敗しました。通信環境を確認して再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fx-contact-form-block">
      <form className="fx-contact-form" onSubmit={handleSubmit} noValidate>
        <div className="fx-contact-form-grid">
          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-company">
              会社名
            </label>
            <input
              id="contact-company"
              name="company"
              className="fx-contact-input"
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

          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-name">
              お名前<span className="fx-contact-required">必須</span>
            </label>
            <input
              id="contact-name"
              name="name"
              className="fx-contact-input"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) => handleChange("name", event.target.value)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              aria-invalid={errors.name ? "true" : undefined}
            />
            {errors.name ? (
              <p id="contact-name-error" className="fx-contact-error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="fx-contact-field">
            <label className="fx-contact-label" htmlFor="contact-email">
              メールアドレス<span className="fx-contact-required">必須</span>
            </label>
            <input
              id="contact-email"
              name="email"
              className="fx-contact-input"
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
            <label className="fx-contact-label" htmlFor="contact-type">
              お問い合わせ種別<span className="fx-contact-required">必須</span>
            </label>
            <select
              id="contact-type"
              name="inquiryType"
              className="fx-contact-input fx-contact-select"
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
            {errors.inquiryType ? (
              <p id="contact-type-error" className="fx-contact-error" role="alert">
                {errors.inquiryType}
              </p>
            ) : null}
          </div>
        </div>

        <div className="fx-contact-field">
          <label className="fx-contact-label" htmlFor="contact-message">
            お問い合わせ内容<span className="fx-contact-required">必須</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="fx-contact-input fx-contact-textarea"
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
            メールソフトを使わず直接連絡する場合:
            {" "}
            <a href="mailto:hello@fieldx.site">hello@fieldx.site</a>
          </p>
        </div>

        <p className="fx-contact-status" aria-live="polite">
          {statusMessage}
        </p>
      </form>
    </div>
  );
}
