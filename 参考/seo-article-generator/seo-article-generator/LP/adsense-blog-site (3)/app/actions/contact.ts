"use server"

import { z } from "zod"

// バリデーションスキーマ
const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(100, "お名前は100文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  company: z.string().max(100, "会社名は100文字以内で入力してください").optional(),
  subject: z.string().min(1, "お問い合わせ種別を選択してください"),
  message: z
    .string()
    .min(10, "メッセージは10文字以上で入力してください")
    .max(2000, "メッセージは2000文字以内で入力してください"),
  newsletter: z.boolean().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
  try {
    // バリデーション
    const validatedData = contactSchema.parse(data)

    // 実際のメール送信処理（例：Nodemailer、SendGrid、Resendなど）
    // ここでは簡単な例を示します
    await sendEmail(validatedData)

    // データベースに保存（オプション）
    // await saveToDatabase(validatedData)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // バリデーションエラー
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors }
    }

    console.error("Contact form submission error:", error)
    return { success: false, error: "送信中にエラーが発生しました" }
  }
}

async function sendEmail(data: ContactFormData) {
  // 実際のメール送信処理
  // 例：Nodemailer、SendGrid、Resend等を使用

  const subjectMap = {
    general: "一般的なお問い合わせ",
    technical: "技術的な質問",
    collaboration: "取材・コラボレーション依頼",
    advertising: "広告掲載について",
    partnership: "パートナーシップ",
    other: "その他",
  }

  const emailContent = {
    to: "contact@techvibe.jp", // 受信用メールアドレス
    from: "noreply@techvibe.jp", // 送信用メールアドレス
    subject: `【TechVibe】${subjectMap[data.subject as keyof typeof subjectMap] || "お問い合わせ"}`,
    html: `
      <h2>新しいお問い合わせが届きました</h2>
      <p><strong>お名前:</strong> ${data.name}</p>
      <p><strong>メールアドレス:</strong> ${data.email}</p>
      ${data.company ? `<p><strong>会社名:</strong> ${data.company}</p>` : ""}
      <p><strong>お問い合わせ種別:</strong> ${subjectMap[data.subject as keyof typeof subjectMap]}</p>
      <p><strong>ニュースレター購読:</strong> ${data.newsletter ? "希望する" : "希望しない"}</p>
      <p><strong>メッセージ:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.message.replace(/\n/g, "<br>")}
      </div>
    `,
  }

  // 自動返信メール
  const autoReplyContent = {
    to: data.email,
    from: "noreply@techvibe.jp",
    subject: "【TechVibe】お問い合わせありがとうございます",
    html: `
      <h2>お問い合わせありがとうございます</h2>
      <p>${data.name} 様</p>
      <p>この度は、TechVibeにお問い合わせいただき、誠にありがとうございます。</p>
      <p>内容を確認の上、2-3営業日以内にご連絡いたします。</p>
      <p>今しばらくお待ちください。</p>
      <hr>
      <p><strong>お問い合わせ内容:</strong></p>
      <p><strong>種別:</strong> ${subjectMap[data.subject as keyof typeof subjectMap]}</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.message.replace(/\n/g, "<br>")}
      </div>
      <hr>
      <p>TechVibe編集部</p>
      <p>https://techvibe.jp</p>
    `,
  }

  // 実際のメール送信処理をここに実装
  // 例：
  // await transporter.sendMail(emailContent)
  // await transporter.sendMail(autoReplyContent)

  console.log("Email would be sent:", emailContent)
  console.log("Auto-reply would be sent:", autoReplyContent)

  // 開発環境では実際に送信せず、ログ出力のみ
  return Promise.resolve()
}
