import Image from "next/image"
import Link from "next/link"
import { TrendingUp, Tag, Star, User, Mail } from "lucide-react"

interface Author {
  name: string
  avatar: string
  bio: string
}

interface ArticleSidebarProps {
  author: Author
}

export default function ArticleSidebar({ author }: ArticleSidebarProps) {
  const categories = [
    { name: "プログラミング", count: 15, href: "/category/programming", color: "from-blue-500 to-blue-600" },
    { name: "ガジェット", count: 12, href: "/category/gadget", color: "from-purple-500 to-purple-600" },
    { name: "レビュー", count: 8, href: "/category/review", color: "from-green-500 to-green-600" },
    { name: "AI・機械学習", count: 6, href: "/category/ai", color: "from-orange-500 to-orange-600" },
    { name: "Web開発", count: 10, href: "/category/web", color: "from-pink-500 to-pink-600" },
  ]

  const popularPosts = [
    {
      title: "ChatGPTを活用した開発効率化テクニック",
      href: "/article/chatgpt-development",
      date: "2024-01-12",
      views: "1.8k",
    },
    {
      title: "2024年注目のプログラミング言語トップ5",
      href: "/article/programming-languages-2024",
      date: "2024-01-10",
      views: "1.5k",
    },
    {
      title: "React Server Componentsの基本と実践",
      href: "/article/react-server-components",
      date: "2024-01-08",
      views: "1.3k",
    },
  ]

  return (
    <aside className="space-y-8">
      {/* 著者プロフィール */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
            <User className="text-white" size={16} />
          </div>
          著者プロフィール
        </h3>
        <div className="text-center">
          <Image
            src={author.avatar || "/placeholder.svg"}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full mx-auto mb-4 border-4 border-gradient-to-r from-blue-200 to-purple-200"
          />
          <h4 className="font-semibold text-gray-800 mb-2">{author.name}</h4>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{author.bio}</p>
          <button className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300">
            <Mail size={14} className="mr-2" />
            フォローする
          </button>
        </div>
      </div>

      {/* 広告スペース */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-64 flex flex-col items-center justify-center text-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 animate-pulse"></div>
          <Star className="text-yellow-500 mb-2 animate-float" size={32} />
          <span className="text-sm font-medium relative z-10">広告スペース</span>
          <span className="text-xs text-gray-500 relative z-10">(300x250)</span>
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-3">
            <Tag className="text-white" size={16} />
          </div>
          カテゴリ
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.href}
                className="group flex justify-between items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color} mr-3`}></div>
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium text-sm">{category.name}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 人気記事 */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
            <TrendingUp className="text-white" size={16} />
          </div>
          人気記事
        </h3>
        <ul className="space-y-4">
          {popularPosts.map((post, index) => (
            <li key={index}>
              <Link href={post.href} className="group block">
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 mb-1 line-clamp-2 transition-colors duration-300">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 広告スペース（下部） */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl h-64 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <div className="text-sm font-medium mb-1">広告スペース</div>
            <div className="text-xs text-gray-500">(300x250)</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
