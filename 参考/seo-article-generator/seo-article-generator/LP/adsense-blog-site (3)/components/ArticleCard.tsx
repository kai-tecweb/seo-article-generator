import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye, ArrowRight, Clock } from "lucide-react"

interface ArticleCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  image: string
  href: string
  readTime?: string
  views?: string
}

export default function ArticleCard({
  title,
  excerpt,
  date,
  author,
  category,
  image,
  href,
  readTime = "5分",
  views = "1.2k",
}: ArticleCardProps) {
  const getCategoryColor = (cat: string) => {
    const colors = {
      プログラミング: "from-blue-500 to-blue-600",
      ガジェット: "from-purple-500 to-purple-600",
      レビュー: "from-green-500 to-green-600",
      AI・機械学習: "from-orange-500 to-orange-600",
      Web開発: "from-pink-500 to-pink-600",
    }
    return colors[cat as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <article className="group glass-effect rounded-2xl overflow-hidden card-hover border border-white/50">
      <Link href={href}>
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg?height=400&width=600"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4">
            <span
              className={`bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg`}
            >
              {category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={href}>
          <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:gradient-text transition-all duration-300 line-clamp-2 font-display leading-tight">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{excerpt}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-blue-500" />
              {date}
            </div>
            <div className="flex items-center">
              <User size={14} className="mr-1.5 text-purple-500" />
              {author}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              {readTime}
            </div>
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              {views}
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center text-blue-600 hover:text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-all duration-300"
          >
            続きを読む
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}
