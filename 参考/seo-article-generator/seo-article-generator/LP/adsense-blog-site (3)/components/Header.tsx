"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Search, Zap } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "プログラミング", href: "/category/programming" },
    { name: "ガジェット", href: "/category/gadget" },
    { name: "レビュー", href: "/category/review" },
    { name: "お問い合わせ", href: "/contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-lg" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* AdSense広告スロット（ヘッダー上部） */}
      <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 py-3 border-b border-blue-100/50">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg h-16 flex items-center justify-center text-gray-600 text-sm font-medium">
            <span className="animate-pulse">Premium Ad Space (728x90)</span>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* ロゴ */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display gradient-text">TechVibe</div>
                <div className="text-xs text-gray-500 -mt-1">未来を創るメディア</div>
              </div>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-full hover:bg-blue-50 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* 検索とメニューボタン */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300">
              <Search size={20} />
            </button>

            <button
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
