import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactRequestSchema = z.object({
  company: z.string().trim().max(120).optional().default(""),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  inquiryType: z.enum(["project", "partnership", "media", "other"]),
  message: z.string().trim().min(10).max(2000)
});

const inquiryTypeLabels = {
  project: "導入・ご相談",
  partnership: "協業・パートナーシップ",
  media: "取材・登壇",
  other: "その他"
} as const;

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

function getAdminMailText(input: z.infer<typeof contactRequestSchema>) {
  return [
    "Field X のお問い合わせフォームから新規送信がありました。",
    "",
    `会社名: ${input.company || "未入力"}`,
    `お名前: ${input.name}`,
    `メールアドレス: ${input.email}`,
    `お問い合わせ種別: ${inquiryTypeLabels[input.inquiryType]}`,
    "",
    "お問い合わせ内容",
    input.message
  ].join("\n");
}

function getAutoReplyText(input: z.infer<typeof contactRequestSchema>) {
  return [
    `${input.name} 様`,
    "",
    "お問い合わせありがとうございます。",
    "以下の内容で受け付けました。内容を確認のうえ、担当よりご連絡します。",
    "",
    `会社名: ${input.company || "未入力"}`,
    `お問い合わせ種別: ${inquiryTypeLabels[input.inquiryType]}`,
    "",
    "お問い合わせ内容",
    input.message,
    "",
    "株式会社Field X",
    "hello@fieldx.site"
  ].join("\n");
}

export async function POST(request: Request) {
  const parsed = contactRequestSchema.safeParse(await request.json());

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
    await transporter.sendMail({
      from,
      to: "hello@fieldx.site",
      replyTo: parsed.data.email,
      subject: adminSubject,
      text: getAdminMailText(parsed.data)
    });

    await transporter.sendMail({
      from,
      to: parsed.data.email,
      subject: replySubject,
      text: getAutoReplyText(parsed.data)
    });

    return NextResponse.json({ message: "お問い合わせを送信しました。" });
  } catch (error) {
    console.error("contact form mail send failed", error);
    return NextResponse.json(
      { message: "送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
