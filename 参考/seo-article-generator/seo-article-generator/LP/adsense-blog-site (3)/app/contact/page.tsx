import ContactForm from "@/components/ContactForm"
import ContactInfo from "@/components/ContactInfo"
import { Mail, Phone, Clock, MessageCircle } from "lucide-react"

export const metadata = {
  title: "お問い合わせ | TechVibe - 未来を創るテクノロジーメディア",
  description: "TechVibeへのお問い合わせはこちらから。技術的な質問、取材依頼、広告掲載など、お気軽にご連絡ください。",
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "メールでのお問い合わせ",
      description: "24時間受付中",
      value: "contact@techvibe.jp",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Phone,
      title: "お電話でのお問い合わせ",
      description: "平日 10:00-18:00",
      value: "03-1234-5678",
      color: "from-green-500 to-green-600",
    },
    {
      icon: MessageCircle,
      title: "チャットサポート",
      description: "平日 9:00-17:00",
      value: "オンラインチャット",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const responseTime = [
    { type: "一般的なお問い合わせ", time: "24時間以内" },
    { type: "技術的な質問", time: "48時間以内" },
    { type: "取材・コラボレーション", time: "3営業日以内" },
    { type: "広告掲載について", time: "24時間以内" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* ヒーローセクション */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-8 animate-slide-up">
              <Mail className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">お気軽にお問い合わせください</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 animate-slide-up">
              <span className="gradient-text">お問い合わせ</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed animate-slide-up">
              技術的な質問、取材依頼、広告掲載など
              <br className="hidden md:block" />
              どんなことでもお気軽にご相談ください
            </p>
          </div>

          {/* お問い合わせ方法 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-6 text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${method.color} mb-4`}>
                  <method.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <p className="font-medium text-gray-800">{method.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* お問い合わせフォーム */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* サイドバー情報 */}
          <div className="space-y-8">
            <ContactInfo />

            {/* 回答時間の目安 */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
                  <Clock className="text-white" size={16} />
                </div>
                回答時間の目安
              </h3>
              <ul className="space-y-3">
                {responseTime.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700 text-sm">{item.type}</span>
                    <span className="text-blue-600 font-medium text-sm">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* よくある質問 */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-display">よくある質問</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    記事の転載は可能ですか？
                    <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    事前にご連絡いただければ、条件付きで転載を許可する場合があります。詳細はお問い合わせください。
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    広告掲載の料金は？
                    <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    掲載位置やサイズによって料金が異なります。メディア資料をお送りしますので、お問い合わせください。
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    取材依頼について
                    <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    技術系の取材は積極的にお受けしています。企画内容と希望日程をお知らせください。
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
