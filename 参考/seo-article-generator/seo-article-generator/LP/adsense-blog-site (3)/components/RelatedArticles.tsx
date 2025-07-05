import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"

interface RelatedArticle {
  title: string
  image: string
  href: string
  publishedAt: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="mt-12">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold font-display text-gray-800">関連記事</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full ml-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link key={index} href={article.href} className="group">
            <article className="glass-effect rounded-xl overflow-hidden card-hover">
              <div className="relative h-40 w-full">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-2 transition-colors duration-200">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {article.publishedAt}
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform duration-200"
                  />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
