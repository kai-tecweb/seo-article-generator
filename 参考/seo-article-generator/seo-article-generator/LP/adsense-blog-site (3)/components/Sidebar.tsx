import Link from "next/link"
import { Calendar, TrendingUp, Tag, Star, ArrowRight } from "lucide-react"

export default function Sidebar() {
  const categories = [
    { name: "プログラミング", count: 15, href: "/category/programming", color: "from-blue-500 to-blue-600" },
    { name: "ガジェット", count: 12, href: "/category/gadget", color: "from-purple-500 to-purple-600" },
    { name: "レビュー", count: 8, href: "/category/review", color: "from-green-500 to-green-600" },
    { name: "AI・機械学習", count: 6, href: "/category/ai", color: "from-orange-500 to-orange-600" },
    { name: "Web開発", count: 10, href: "/category/web", color: "from-pink-500 to-pink-600" },
  ]

  const popularPosts = [
    {
      title: "Next.js 14の新機能を徹底解説",
      date: "2024-01-15",
      href: "/article/nextjs-14-features",
      views: "2.1k",
    },
    {
      title: "ChatGPTを活用した開発効率化テクニック",
      date: "2024-01-12",
      href: "/article/chatgpt-development",
      views: "1.8k",
    },
    {
      title: "2024年注目のプログラミング言語トップ5",
      date: "2024-01-10",
      href: "/article/programming-languages-2024",
      views: "1.5k",
    },
    {
      title: "React Server Componentsの基本と実践",
      date: "2024-01-08",
      href: "/article/react-server-components",
      views: "1.3k",
    },
  ]

  return (
    <aside className="space-y-8">
      {/* プレミアム広告スペース */}
      <div className="glass-effect rounded-2xl p-6 border border-gradient-to-r from-blue-200 to-purple-200">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-64 flex flex-col items-center justify-center text-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 animate-pulse"></div>
          <Star className="text-yellow-500 mb-2 animate-float" size={32} />
          <span className="text-sm font-medium relative z-10">Premium Ad Space</span>
          <span className="text-xs text-gray-500 relative z-10">(300x250)</span>
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
            <Tag className="text-white" size={18} />
          </div>
          カテゴリ
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.href}
                className="group flex justify-between items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color} mr-3 group-hover:scale-110 transition-transform duration-300`}
                  ></div>
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                    {category.count}
                  </span>
                  <ArrowRight
                    className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300"
                    size={14}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 人気記事 */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
            <TrendingUp className="text-white" size={18} />
          </div>
          人気記事
        </h3>
        <ul className="space-y-4">
          {popularPosts.map((post, index) => (
            <li key={index} className="group">
              <Link href={post.href} className="block">
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-2 transition-colors duration-300">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {post.date}
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{post.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* セカンダリ広告スペース */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl h-64 flex items-center justify-center text-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-blue-100/30 animate-pulse"></div>
          <div className="text-center relative z-10">
            <div className="text-sm font-medium mb-1">Secondary Ad Space</div>
            <div className="text-xs text-gray-500">(300x250)</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
