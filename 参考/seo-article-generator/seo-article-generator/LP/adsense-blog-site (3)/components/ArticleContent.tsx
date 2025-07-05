import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, Eye, Tag, Share2 } from "lucide-react"

interface ArticleProps {
  article: {
    title: string
    content: string
    publishedAt: string
    author: {
      name: string
      avatar: string
      bio: string
    }
    category: string
    tags: string[]
    image: string
    readTime: string
    views: string
  }
}

export default function ArticleContent({ article }: ArticleProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      プログラミング: "from-blue-500 to-blue-600",
      ガジェット: "from-purple-500 to-purple-600",
      レビュー: "from-green-500 to-green-600",
      AI・機械学習: "from-orange-500 to-orange-600",
      Web開発: "from-pink-500 to-pink-600",
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <article className="glass-effect rounded-2xl overflow-hidden">
      {/* アイキャッチ画像 */}
      <div className="relative h-64 md:h-80 w-full">
        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span
            className={`bg-gradient-to-r ${getCategoryColor(article.category)} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}
          >
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* 記事メタ情報 */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-blue-500" />
            {article.publishedAt}
          </div>
          <div className="flex items-center">
            <User size={16} className="mr-2 text-purple-500" />
            {article.author.name}
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-green-500" />
            {article.readTime}
          </div>
          <div className="flex items-center">
            <Eye size={16} className="mr-2 text-orange-500" />
            {article.views}
          </div>
        </div>

        {/* 記事タイトル */}
        <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-800 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* シェアボタン */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">シェア:</span>
          <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200">
            <Share2 size={16} />
          </button>
          <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors duration-200">
            <Share2 size={16} />
          </button>
          <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200">
            <Share2 size={16} />
          </button>
        </div>

        {/* 記事本文 */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-800 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-ul:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* タグ */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={16} className="text-gray-500 mr-2" />
            {article.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/tag/${tag.toLowerCase()}`}
                className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* 著者情報 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-start space-x-4">
            <Image
              src={article.author.avatar || "/placeholder.svg"}
              alt={article.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{article.author.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{article.author.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
