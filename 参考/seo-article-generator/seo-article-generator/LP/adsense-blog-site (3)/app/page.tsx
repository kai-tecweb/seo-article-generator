import ArticleCard from "@/components/ArticleCard"
import Sidebar from "@/components/Sidebar"
import { Sparkles, TrendingUp, Zap, Users } from "lucide-react"

export default function Home() {
  const articles = [
    {
      title: "Next.js 14の新機能を徹底解説 - App Routerの進化とパフォーマンス向上",
      excerpt:
        "Next.js 14がリリースされ、多くの新機能と改善が追加されました。特にApp Routerの安定化とパフォーマンスの向上は注目すべき点です。この記事では、実際のコード例とともに新機能を詳しく解説します。",
      date: "2024-01-15",
      author: "田中太郎",
      category: "プログラミング",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/nextjs-14-features",
      readTime: "8分",
      views: "2.1k",
    },
    {
      title: "ChatGPTを活用した開発効率化テクニック - プログラマーのための実践ガイド",
      excerpt:
        "AI技術の進歩により、開発者の作業効率は大幅に向上しています。ChatGPTを使った具体的な開発手法から、コードレビューの自動化まで、実践的なテクニックを紹介します。",
      date: "2024-01-12",
      author: "佐藤花子",
      category: "AI・機械学習",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/chatgpt-development",
      readTime: "6分",
      views: "1.8k",
    },
    {
      title: "2024年注目のプログラミング言語トップ5 - 将来性と学習のポイント",
      excerpt:
        "技術トレンドは常に変化していますが、2024年に特に注目すべきプログラミング言語を厳選しました。各言語の特徴、将来性、学習方法について詳しく解説します。",
      date: "2024-01-10",
      author: "山田次郎",
      category: "プログラミング",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/programming-languages-2024",
      readTime: "10分",
      views: "1.5k",
    },
    {
      title: "React Server Componentsの基本と実践 - モダンReact開発の新常識",
      excerpt:
        "React Server Componentsは、Reactアプリケーションのパフォーマンスを大幅に向上させる革新的な機能です。基本概念から実装方法まで、わかりやすく解説します。",
      date: "2024-01-08",
      author: "鈴木一郎",
      category: "Web開発",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/react-server-components",
      readTime: "7分",
      views: "1.3k",
    },
    {
      title: "最新MacBook Pro M3レビュー - 開発者目線での徹底検証",
      excerpt:
        "新しいM3チップを搭載したMacBook Proを、開発者の視点から徹底的にレビューしました。パフォーマンス、バッテリー持続時間、開発環境での使用感を詳しく報告します。",
      date: "2024-01-05",
      author: "田中太郎",
      category: "ガジェット",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/macbook-pro-m3-review",
      readTime: "12分",
      views: "2.3k",
    },
    {
      title: "TypeScript 5.3の新機能解説 - 型安全性の更なる向上",
      excerpt:
        "TypeScript 5.3では、型システムの改善と新しい機能が多数追加されました。開発者にとって重要な変更点を、実際のコード例とともに詳しく解説します。",
      date: "2024-01-03",
      author: "佐藤花子",
      category: "プログラミング",
      image: "/placeholder.svg?height=400&width=600",
      href: "/article/typescript-5-3-features",
      readTime: "9分",
      views: "1.7k",
    },
  ]

  const stats = [
    { icon: Users, label: "読者数", value: "50K+", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, label: "月間PV", value: "1M+", color: "from-purple-500 to-purple-600" },
    { icon: Sparkles, label: "記事数", value: "500+", color: "from-green-500 to-green-600" },
    { icon: Zap, label: "更新頻度", value: "毎日", color: "from-orange-500 to-orange-600" },
  ]

  return (
    <div className="animate-fade-in">
      {/* ヒーローセクション */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-8 animate-slide-up">
              <Sparkles className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">未来を創るテクノロジーメディア</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 animate-slide-up">
              <span className="gradient-text">TechVibe</span>
              <br />
              <span className="text-gray-800 text-shadow">で学ぶ、創る、成長する</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-slide-up">
              最新のテクノロジー、プログラミング、ガジェット情報を
              <br className="hidden md:block" />
              美しいデザインと共にお届けする次世代メディア
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
              <button className="btn-primary">最新記事を読む</button>
              <button className="btn-secondary">カテゴリを探す</button>
            </div>

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

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-display text-gray-800">最新記事</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full ml-6"></div>
            </div>

            <div className="space-y-8">
              {articles.map((article, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>

            {/* ページネーション */}
            <div className="flex justify-center mt-16">
              <nav className="flex space-x-2">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                  1
                </button>
                <button className="px-6 py-3 glass-effect text-gray-700 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium">
                  2
                </button>
                <button className="px-6 py-3 glass-effect text-gray-700 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium">
                  3
                </button>
                <button className="px-6 py-3 glass-effect text-gray-700 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium">
                  次へ →
                </button>
              </nav>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
