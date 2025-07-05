import Image from "next/image"
import { Users, Target, Award, TrendingUp, Mail, MapPin, Calendar, Globe } from "lucide-react"

export const metadata = {
  title: "会社概要 | TechVibe - 未来を創るテクノロジーメディア",
  description:
    "TechVibeの会社概要。私たちのミッション、ビジョン、チーム、そして未来のテクノロジーを伝える取り組みについてご紹介します。",
}

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "月間読者数", value: "50万人+", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, label: "月間PV", value: "100万PV+", color: "from-green-500 to-green-600" },
    { icon: Award, label: "公開記事数", value: "500記事+", color: "from-purple-500 to-purple-600" },
    { icon: Globe, label: "運営年数", value: "3年", color: "from-orange-500 to-orange-600" },
  ]

  const teamMembers = [
    {
      name: "田中太郎",
      role: "編集長・創設者",
      bio: "フロントエンド開発者として10年以上の経験を持つ。React、Next.jsを中心とした技術記事を執筆し、開発者コミュニティの発展に貢献。",
      image: "/placeholder.svg?height=200&width=200",
      expertise: ["React", "Next.js", "TypeScript", "UI/UX"],
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#",
      },
    },
    {
      name: "佐藤花子",
      role: "技術ライター",
      bio: "AI・機械学習分野の専門家。大学でコンピューターサイエンスを学び、複数のテック企業でエンジニアとして活躍後、技術ライターに転身。",
      image: "/placeholder.svg?height=200&width=200",
      expertise: ["AI/ML", "Python", "データサイエンス", "クラウド"],
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#",
      },
    },
    {
      name: "山田次郎",
      role: "デザイナー・UXライター",
      bio: "UI/UXデザインの専門家として、ユーザー中心のデザインを追求。デザインシステムの構築と、技術とデザインの架け橋となる記事を執筆。",
      image: "/placeholder.svg?height=200&width=200",
      expertise: ["UI/UX", "デザインシステム", "Figma", "プロトタイピング"],
      social: {
        twitter: "#",
        github: "#",
        linkedin: "#",
      },
    },
  ]

  const milestones = [
    {
      year: "2021",
      title: "TechVibe設立",
      description: "技術情報を分かりやすく伝えるメディアとしてスタート",
    },
    {
      year: "2022",
      title: "月間10万PV達成",
      description: "質の高いコンテンツが評価され、読者数が急成長",
    },
    {
      year: "2023",
      title: "チーム拡大",
      description: "専門性の高いライター陣を迎え、コンテンツの幅を拡大",
    },
    {
      year: "2024",
      title: "月間100万PV達成",
      description: "日本最大級のテクノロジーメディアへと成長",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "正確性",
      description: "技術情報の正確性を最優先に、専門家による厳格な監修を実施",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "アクセシビリティ",
      description: "初心者から上級者まで、すべての読者にとって理解しやすいコンテンツを提供",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      title: "革新性",
      description: "最新のテクノロジートレンドをいち早くキャッチし、未来を見据えた情報を発信",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      title: "品質",
      description: "読者の時間を大切にし、価値のある高品質なコンテンツのみを厳選して提供",
      color: "from-orange-500 to-orange-600",
    },
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
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-8 animate-slide-up">
              <Users className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">私たちについて</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 animate-slide-up">
              <span className="gradient-text">未来を創る</span>
              <br />
              <span className="text-gray-800">テクノロジーメディア</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed animate-slide-up mb-8">
              TechVibeは、最新のテクノロジー情報を分かりやすく伝え
              <br className="hidden md:block" />
              開発者とクリエイターの成長を支援するメディアです
            </p>

            {/* 統計情報 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} mb-3 animate-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 font-display">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom pb-16">
        {/* ミッション・ビジョン */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">ミッション・ビジョン</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-effect rounded-2xl p-8 card-hover">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-display">ミッション</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                テクノロジーの力で世界をより良くする人々を支援し、 複雑な技術情報を分かりやすく伝えることで、
                イノベーションの創出に貢献します。
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 card-hover">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-4">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-display">ビジョン</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                技術者とクリエイターが集まる 日本最大級のテクノロジーコミュニティを構築し、
                未来のイノベーションを生み出すプラットフォームとなります。
              </p>
            </div>
          </div>
        </section>

        {/* 私たちの価値観 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">私たちの価値観</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-6 text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${value.color} mb-4`}>
                  <value.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-3 font-display">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* チーム紹介 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">チーム紹介</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              多様な専門性を持つメンバーが、それぞれの経験と知識を活かして 質の高いコンテンツを提供しています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-6 card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4 border-4 border-gradient-to-r from-blue-200 to-purple-200"
                  />
                  <h3 className="text-xl font-bold text-gray-800 font-display">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">専門分野</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <a
                    href={member.social.twitter}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href={member.social.github}
                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 沿革 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">沿革</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* タイムライン線 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>

              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                    {milestone.year}
                  </div>
                  <div className="ml-6 glass-effect rounded-xl p-6 flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-display">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 会社情報 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">会社情報</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4 mt-1">
                      <Users className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">サイト名</h4>
                      <p className="text-gray-600">TechVibe（テックバイブ）</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-4 mt-1">
                      <Calendar className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">設立</h4>
                      <p className="text-gray-600">2021年4月</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-4 mt-1">
                      <MapPin className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">所在地</h4>
                      <p className="text-gray-600">
                        〒100-0001
                        <br />
                        東京都千代田区千代田1-1-1
                        <br />
                        テックビル 5F
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-4 mt-1">
                      <Mail className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">お問い合わせ</h4>
                      <p className="text-gray-600">contact@techvibe.jp</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg mr-4 mt-1">
                      <Globe className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">URL</h4>
                      <p className="text-gray-600">https://techvibe.jp</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mr-4 mt-1">
                      <Target className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">事業内容</h4>
                      <p className="text-gray-600">
                        テクノロジーメディア運営
                        <br />
                        技術コンテンツ制作
                        <br />
                        開発者コミュニティ支援
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">一緒に未来を創りませんか？</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              TechVibeでは、テクノロジーの力で世界をより良くしたいと考える
              ライター、エンジニア、デザイナーを募集しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Mail className="mr-2" size={16} />
                お問い合わせ
              </a>
              <a
                href="mailto:careers@techvibe.jp"
                className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <Users className="mr-2" size={16} />
                採用情報
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
