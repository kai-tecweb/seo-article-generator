import Link from "next/link"
import { Mail, Twitter, Github, Linkedin, Heart, Zap } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%23ffffff'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* ブランド情報 */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                  <Zap className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-display">TechVibe</h3>
                  <p className="text-blue-200 text-sm">未来を創るテクノロジーメディア</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けする次世代テックメディア。
                開発者とクリエイターのためのインスピレーションを提供します。
              </p>

              {/* ソーシャルリンク */}
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "/contact", label: "Contact" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group"
                    aria-label={social.label}
                  >
                    {social.icon && <social.icon className="text-white group-hover:text-blue-200" size={20} />}
                  </Link>
                ))}
              </div>
            </div>

            {/* カテゴリリンク */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 font-display">カテゴリ</h4>
              <ul className="space-y-3">
                {[
                  { name: "プログラミング", href: "/category/programming" },
                  { name: "ガジェット", href: "/category/gadget" },
                  { name: "レビュー", href: "/category/review" },
                  { name: "AI・機械学習", href: "/category/ai" },
                  { name: "Web開発", href: "/category/web" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* サイト情報 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 font-display">サイト情報</h4>
              <ul className="space-y-3">
                {[
                  { name: "お問い合わせ", href: "/contact" },
                  { name: "プライバシーポリシー", href: "/privacy-policy" },
                  { name: "利用規約", href: "/terms" },
                  { name: "サイトマップ", href: "/sitemap" },
                  { name: "RSS", href: "/rss.xml" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ボーダーライン */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* コピーライト */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <span>© {currentYear} TechVibe. All rights reserved.</span>
              <Heart className="text-red-400 mx-2 animate-pulse" size={16} />
              <span>Made with passion</span>
            </div>
            <div className="text-gray-400">Powered by Next.js & Tailwind CSS</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
