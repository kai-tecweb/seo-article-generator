import type { Metadata } from "next"
import ArticleContent from "@/components/ArticleContent"
import ArticleSidebar from "@/components/ArticleSidebar"
import RelatedArticles from "@/components/RelatedArticles"

// 実際のCMSからデータを取得する関数（例）
async function getArticleData(slug: string) {
  // CMSやAPIからデータを取得
  return {
    title: "Next.js 14の新機能を徹底解説 - App Routerの進化とパフォーマンス向上",
    excerpt:
      "Next.js 14がリリースされ、多くの新機能と改善が追加されました。特にApp Routerの安定化とパフォーマンスの向上は注目すべき点です。",
    content: `
      <p>Next.js 14が正式にリリースされ、開発者コミュニティに大きな話題を呼んでいます。今回のアップデートでは、特にApp Routerの安定化とパフォーマンスの大幅な向上が注目されています。</p>
      
      <h2>主要な新機能</h2>
      <p>Next.js 14では以下の主要な機能が追加・改善されました：</p>
      <ul>
        <li>App Routerの安定化とパフォーマンス向上</li>
        <li>Server Actionsの正式サポート</li>
        <li>Partial Prerenderingの実験的サポート</li>
        <li>Next.js Learn の新しいコース</li>
      </ul>

      <h2>App Routerの進化</h2>
      <p>App Routerは Next.js 13 で導入された新しいルーティングシステムですが、Next.js 14 ではさらに安定性とパフォーマンスが向上しています。</p>
      
      <h3>パフォーマンスの改善</h3>
      <p>特に注目すべきは、ローカル開発環境でのパフォーマンス向上です。大規模なアプリケーションでも、より高速な開発体験を提供します。</p>

      <h2>Server Actionsの正式サポート</h2>
      <p>Server Actionsが実験的機能から正式機能に昇格しました。これにより、フォームの処理やデータの更新がより簡単になります。</p>

      <pre><code>// Server Action の例
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
  
  // データベースに保存
  await db.post.create({
    data: { title, content }
  })
}</code></pre>

      <h2>まとめ</h2>
      <p>Next.js 14は、開発者体験の向上とパフォーマンスの改善に重点を置いたアップデートです。特にApp Routerを使用している開発者にとっては、大きなメリットがあります。</p>
    `,
    publishedAt: "2024-01-15",
    author: {
      name: "田中太郎",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "フロントエンド開発者として10年以上の経験を持つ。React、Next.jsを中心とした技術記事を執筆。",
    },
    category: "プログラミング",
    tags: ["Next.js", "React", "Web開発"],
    image: "/placeholder.svg?height=400&width=800",
    readTime: "8分",
    views: "2.1k",
  }
}

async function getRelatedArticles() {
  return [
    {
      title: "React Server Componentsの基本と実践",
      image: "/placeholder.svg?height=200&width=300",
      href: "/article/react-server-components",
      publishedAt: "2024-01-08",
    },
    {
      title: "TypeScript 5.3の新機能解説",
      image: "/placeholder.svg?height=200&width=300",
      href: "/article/typescript-5-3-features",
      publishedAt: "2024-01-03",
    },
    {
      title: "2024年注目のプログラミング言語トップ5",
      image: "/placeholder.svg?height=200&width=300",
      href: "/article/programming-languages-2024",
      publishedAt: "2024-01-10",
    },
  ]
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleData(params.slug)

  return {
    title: `${article.title} | TechVibe`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: "article",
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug)
  const relatedArticles = await getRelatedArticles()

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-7">
          <ArticleContent article={article} />
          <RelatedArticles articles={relatedArticles} />
        </div>

        {/* サイドバー */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <ArticleSidebar author={article.author} />
          </div>
        </div>
      </div>
    </div>
  )
}
