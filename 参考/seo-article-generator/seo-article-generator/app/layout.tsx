import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SEO記事自動生成ツール",
  description: "AIを活用してSEOに強い記事を自動生成し、WordPressに投稿するツール",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Google AdSenseのクライアントIDを環境変数から取得
  const googleAdsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-YOUR_ADSENSE_ID"

  return (
    <html lang="ja">
      <head>
        {/* Google AdSenseのスクリプトをheadに挿入 */}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClientId}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
