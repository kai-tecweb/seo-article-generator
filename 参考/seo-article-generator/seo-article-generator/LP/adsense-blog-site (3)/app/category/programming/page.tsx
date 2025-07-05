import ArticleCard from "@/components/ArticleCard"
import Sidebar from "@/components/Sidebar"

export default function ProgrammingCategory() {
  const articles = [
    {
      title: "Next.js 14の新機能を徹底解説 - App Routerの進化とパフォーマンス向上",
      excerpt:
        "Next.js 14がリリースされ、多くの新機能と改善が追加されました。特にApp Routerの安定化とパフォーマンスの向上は注目すべき点です。",
      date: "2024-01-15",
      author: "田中太郎",
      category: "プログラミング",
      image: "/placeholder.svg?height=300&width=400",
      href: "/article/nextjs-14-features",
    },
    {
      title: "2024年注目のプログラミング言語トップ5 - 将来性と学習のポイント",
      excerpt:
        "技術トレンドは常に変化していますが、2024年に特に注目すべきプログラミング言語を厳選しました。各言語の特徴、将来性、学習方法について詳しく解説します。",
      date: "2024-01-10",
      author: "山田次郎",
      category: "プログラミング",
      image: "/placeholder.svg?height=300&width=400",
      href: "/article/programming-languages-2024",
    },
    {
      title: "TypeScript 5.3の新機能解説 - 型安全性の更なる向上",
      excerpt:
        "TypeScript 5.3では、型システムの改善と新しい機能が多数追加されました。開発者にとって重要な変更点を、実際のコード例とともに詳しく解説します。",
      date: "2024-01-03",
      author: "佐藤花子",
      category: "プログラミング",
      image: "/placeholder.svg?height=300&width=400",
      href: "/article/typescript-5-3-features",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">プログラミング</h1>
        <p className="text-gray-600">
          最新のプログラミング技術、フレームワーク、言語に関する記事をお届けします。
          実践的なコード例とともに、開発者に役立つ情報を提供しています。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-7">
          <div className="space-y-8">
            {articles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
