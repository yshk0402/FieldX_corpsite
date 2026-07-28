import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { saveLead } from "@/lib/leads";
import { leadCreateInputSchema } from "@/types/lead";

const inquiryTypeLabels = {
  project: "導入・ご相談",
  partnership: "協業・パートナーシップ",
  media: "取材・登壇",
  other: "その他"
} as const;

const awarenessSourceLabels = {
  x: "X",
  google: "Google",
  event: "展示会",
  ai: "AI（ChatGPT, Gemini etc...）"
} as const;

function formatAwarenessSources(input: ReturnType<typeof leadCreateInputSchema.parse>) {
  if (!input.awarenessSources?.length) {
    return "未選択";
  }

  return input.awarenessSources.map((source) => awarenessSourceLabels[source]).join(", ");
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? user;
  const fromName = process.env.CONTACT_FROM_NAME ?? "Field X";

  if (!host || !port || !user || !pass || !fromEmail) {
    return null;
  }

  return {
    host,
    port: Number(port),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
    fromEmail,
    fromName
  };
}

function getAdminMailText(input: ReturnType<typeof leadCreateInputSchema.parse>) {
  return [
    "Field X のお問い合わせフォームから新規送信がありました。",
    "",
    `会社名: ${input.company || "未入力"}`,
    `お名前: ${input.name}`,
    `メールアドレス: ${input.email}`,
    `電話番号: ${input.phone || "未入力"}`,
    `お問い合わせ種別: ${inquiryTypeLabels[input.inquiryType]}`,
    `Field Xを知ったきっかけ: ${formatAwarenessSources(input)}`,
    "",
    "お問い合わせ内容",
    input.message,
    "",
    "流入情報",
    `ページ: ${input.pagePath || "未取得"}`,
    `ページタイトル: ${input.pageTitle || "未取得"}`,
    `参照元: ${input.referrer || "直接流入または未取得"}`,
    `utm_source: ${input.utmSource || "未設定"}`,
    `utm_medium: ${input.utmMedium || "未設定"}`,
    `utm_campaign: ${input.utmCampaign || "未設定"}`,
    `utm_content: ${input.utmContent || "未設定"}`,
    `utm_term: ${input.utmTerm || "未設定"}`,
    `ga_client_id: ${input.gaClientId || "未設定"}`
  ].join("\n");
}

function getAutoReplyText(input: ReturnType<typeof leadCreateInputSchema.parse>) {
  return [
    `${input.name} 様`,
    "",
    "お問い合わせありがとうございます。",
    "以下の内容で受け付けました。内容を確認のうえ、担当よりご連絡します。",
    "",
    `会社名: ${input.company || "未入力"}`,
    `電話番号: ${input.phone || "未入力"}`,
    `お問い合わせ種別: ${inquiryTypeLabels[input.inquiryType]}`,
    `Field Xを知ったきっかけ: ${formatAwarenessSources(input)}`,
    "",
    "お問い合わせ内容",
    input.message,
    "",
    "株式会社Field X",
    "hello@fieldx.site"
  ].join("\n");
}

export async function POST(request: Request) {
  const parsed = leadCreateInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "入力内容を確認してください。" }, { status: 400 });
  }

  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    return NextResponse.json(
      { message: "メール送信設定が未完了です。環境変数を確認してください。" },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: smtpConfig.auth
  });

  const adminSubject = `【お問い合わせ】${parsed.data.name}`;
  const replySubject = "お問い合わせありがとうございます | Field X";
  const from = `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`;

  try {
    const [adminMailResult, replyMailResult, leadResult] = await Promise.allSettled([
      transporter.sendMail({
        from,
        to: "hello@fieldx.site",
        replyTo: parsed.data.email,
        subject: adminSubject,
        text: getAdminMailText(parsed.data)
      }),
      transporter.sendMail({
        from,
        to: parsed.data.email,
        subject: replySubject,
        text: getAutoReplyText(parsed.data)
      }),
      saveLead(parsed.data)
    ]);

    if (adminMailResult.status === "rejected" || replyMailResult.status === "rejected") {
      console.error("contact form mail send failed", {
        adminMailError: adminMailResult.status === "rejected" ? adminMailResult.reason : null,
        replyMailError: replyMailResult.status === "rejected" ? replyMailResult.reason : null
      });

      return NextResponse.json(
        { message: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    if (leadResult.status === "rejected") {
      console.error("lead storage failed", leadResult.reason);
    }

    return NextResponse.json({ message: "お問い合わせを送信しました。" });
  } catch (error) {
    console.error("contact form request failed", error);
    return NextResponse.json(
      { message: "送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
