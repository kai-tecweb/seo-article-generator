import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TechVibe - 未来を創るテクノロジーメディア",
  description: "最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けする次世代テックメディア",
  keywords: "テクノロジー, プログラミング, ガジェット, AI, Web開発, デザイン",
  authors: [{ name: "TechVibe編集部" }],
  openGraph: {
    title: "TechVibe - 未来を創るテクノロジーメディア",
    description: "最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けする次世代テックメディア",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* AdSense広告コード挿入用スロット */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
