"use client"

import type React from "react"

import { useState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type FormState = "idle" | "loading" | "success" | "error"

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
  newsletter: boolean
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    newsletter: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("loading")
    setErrors({})

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setFormState("success")
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          newsletter: false,
        })
      } else {
        setFormState("error")
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      setFormState("error")
      console.error("Form submission error:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (formState === "success") {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center animate-fade-in">
        <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
          <CheckCircle className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-display">送信完了</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          お問い合わせありがとうございます。
          <br />
          内容を確認の上、2-3営業日以内にご連絡いたします。
        </p>
        <button onClick={() => setFormState("idle")} className="btn-primary">
          新しいお問い合わせを送信
        </button>
      </div>
    )
  }

  return (
    <div className="glass-effect rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">お問い合わせフォーム</h2>

      {formState === "error" && !Object.keys(errors).length && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={20} />
          <p className="text-red-700 text-sm">送信中にエラーが発生しました。もう一度お試しください。</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* お名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-300"
              }`}
              placeholder="山田太郎"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-300"
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {/* 会社名・組織名 */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
            会社名・組織名
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-200"
            placeholder="株式会社テックバイブ"
          />
        </div>

        {/* お問い合わせ種別 */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
            お問い合わせ種別 <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.subject ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <option value="">選択してください</option>
            <option value="general">一般的なお問い合わせ</option>
            <option value="technical">技術的な質問</option>
            <option value="collaboration">取材・コラボレーション依頼</option>
            <option value="advertising">広告掲載について</option>
            <option value="partnership">パートナーシップ</option>
            <option value="other">その他</option>
          </select>
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        {/* メッセージ */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
              errors.message ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-300"
            }`}
            placeholder="お問い合わせ内容を詳しくお書きください..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        {/* ニュースレター購読 */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
            TechVibeのニュースレターを購読する（最新記事やお得な情報をお届けします）
          </label>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={formState === "loading"}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
        >
          {formState === "loading" ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              送信中...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              送信する
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>プライバシーについて：</strong>
          お預かりした個人情報は、お問い合わせへの回答以外には使用いたしません。 詳しくは
          <a href="/privacy-policy" className="underline hover:no-underline">
            プライバシーポリシー
          </a>
          をご確認ください。
        </p>
      </div>
    </div>
  )
}
