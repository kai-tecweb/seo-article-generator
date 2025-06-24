"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { markdownToHtml } from "@/lib/markdown-to-html"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import YahooTrendingSelector from "@/components/yahoo-trending-selector"

// 投稿履歴の型定義
type PostHistoryEntry = {
  title: string
  topic: string
  url: string
  date: string
}

// Notion接続テスト結果の型定義
type NotionTestResult = {
  success: boolean
  message?: string
  error?: string
  data?: {
    entriesCount: number
    sampleEntries: PostHistoryEntry[]
    tokenInfo: {
      prefix: string
      length: number
      isValid: boolean
      type: string
    }
    databaseInfo: {
      title: string
      id: string
      properties: string[]
    }
  }
  details?: any
  guidance?: string
}

interface OpenAITestResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    testResponse: string
    model: string
    apiKeyValid: boolean
    keyInfo: {
      prefix: string
      length: number
    }
  }
  details?: any
  guidance?: string
}

// テンプレート設定の型定義
type TemplateSettings = {
  customIntroText: string
  customCtaText: string
  customOutroText: string
  introPosition: "start" | "after_h1" | "before_first_h2"
  ctaPosition: "after_h2_every_n" | "end_of_article" | "before_outro"
  outroPosition: "end_of_article"
  ctaH2Interval: number
}

const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  customIntroText: "【この記事のポイント】\nAI時代を生き抜くための情報をお届けします。\n",
  customCtaText: "▼今すぐチェック！無料AI活用ガイドはこちら → https://example.com/download",
  customOutroText: "最後まで読んでいただきありがとうございました。ぜひシェアやコメントもお願いします！",
  introPosition: "after_h1",
  ctaPosition: "after_h2_every_n",
  outroPosition: "end_of_article",
  ctaH2Interval: 2,
}

// SEOチェック結果の型定義
type SeoCheckResult = {
  headingCount: number
  keywordDensity: {
    keyword: string
    count: number
    density: string
  }
  hasMetaDescription: boolean
  hasInternalLinks: boolean
  hasExternalLinks: boolean
}

// WordPressカテゴリ・タグの型定義
type WPTerm = {
  id: number
  name: string
}

export default function ArticleGeneratorPage() {
  const [activeTab, setActiveTab] = useState("article-generation") // アクティブなタブを管理

  const [topic, setTopic] = useState("")
  const [article, setArticle] = useState("") // AI生成 + カスタムテキスト挿入後の記事（編集可能）
  const [editedArticle, setEditedArticle] = useState("") // ユーザーが編集中の記事
  const [previewHtml, setPreviewHtml] = useState("")
  const [articleTitle, setArticleTitle] = useState("")
  const [wordpressPostUrl, setWordpressPostUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState("")
  const [notionSaveMessage, setNotionSaveMessage] = useState<string | null>(null)
  const [notionPageUrl, setNotionPageUrl] = useState<string | null>(null)

  // WordPress投稿用のカテゴリとタグのステート
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [tagIds, setTagIds] = useState<number[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const [postStatus, setPostStatus] = useState<"publish" | "draft">("publish")

  // WordPressカテゴリとタグの選択肢用ステート
  const [wordpressCategories, setWordPressCategories] = useState<WPTerm[]>([])
  const [wordpressTags, setWordPressTags] = useState<WPTerm[]>([])
  const [isLoadingWPTerms, setIsLoadingWPTerms] = useState(false)
  const [wpTermsError, setWpTermsError] = useState("")

  // 投稿履歴のステート
  const [postHistory, setPostHistory] = useState<PostHistoryEntry[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Notion接続テスト用のステート
  const [isTestingNotion, setIsTestingNotion] = useState(false)
  const [notionTestResult, setNotionTestResult] = useState<NotionTestResult | null>(null)

  // OpenAI接続テスト用のステート
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false)
  const [openaiTestResult, setOpenaiTestResult] = useState<OpenAITestResponse | null>(null)

  // スケジューラー用のステート
  const [scheduledTime, setScheduledTime] = useState("10:30")
  const [scheduledTopic, setScheduledTopic] = useState("")
  const [scheduleRunning, setScheduleRunning] = useState(false)
  const scheduleIntervalId = useRef<NodeJS.Timeout | null>(null)
  const [schedulerMessage, setSchedulerMessage] = useState("")

  // アウトライン生成用のステート
  const [outlineTopic, setOutlineTopic] = useState("")
  const [outlineResult, setOutlineResult] = useState("")
  const [isLoadingOutline, setIsLoadingOutline] = useState(false)
  const [outlineError, setOutlineError] = useState("")

  // 画像挿入機能のステート
  const [includeImage, setIncludeImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // 広告タイプ選択とカスタム広告タグのステート
  const [adType, setAdType] = useState<string>("google")
  const [customAdTag, setCustomAdTag] = useState<string>("")

  // テンプレート設定のステート
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(DEFAULT_TEMPLATE_SETTINGS)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default") // 'default' or 'custom' or saved template name

  // 記事要約・SNSハイライト生成用のステート
  const [articleBody, setArticleBody] = useState("") // 記事本文
  const [generatedSummary, setGeneratedSummary] = useState("") // 要約
  const [generatedSnsHighlights, setGeneratedSnsHighlights] = useState<string[]>([]) // SNSハイライト
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summarizeError, setSummarizeError] = useState("")

  // SEOチェック用のステート
  const [seoCheckArticleContent, setSeoCheckArticleContent] = useState("")
  const [seoCheckResult, setSeoCheckResult] = useState<SeoCheckResult | null>(null)
  const [isCheckingSeo, setIsCheckingSeo] = useState(false)
  const [seoCheckError, setSeoCheckError] = useState("")

  // 外部サービス投稿用のステート
  const [postPlatform, setPostPlatform] = useState<string>("note")
  const [postToServiceTitle, setPostToServiceTitle] = useState("")
  const [postToServiceContent, setPostToServiceContent] = useState("")
  const [isPostingToService, setIsPostingToService] = useState(false)
  const [servicePostMessage, setServicePostMessage] = useState<string | null>(null)
  const [servicePostUrl, setServicePostUrl] = useState<string | null>(null)
  const [servicePostError, setServicePostError] = useState("")

  // SNS投稿用のステート
  const [snsPostTweet, setSnsPostTweet] = useState("")
  const [snsPostImageUrl, setSnsPostImageUrl] = useState<string | null>(null)
  const [isPostingToX, setIsPostingToX] = useState(false)
  const [xPostMessage, setXPostMessage] = useState<string | null>(null)
  const [xPostUrl, setXPostUrl] = useState<string | null>(null)
  const [xPostError, setXPostError] = useState("")

  // MEO投稿用のステート
  const [meoPostTitle, setMeoPostTitle] = useState("")
  const [meoPostContent, setMeoPostContent] = useState("")
  const [meoPostPhotoUrl, setMeoPostPhotoUrl] = useState<string | null>(null)
  const [isPostingToGbp, setIsPostingToGbp] = useState(false)
  const [gbpPostMessage, setGbpPostMessage] = useState<string | null>(null)
  const [gbpPostUrl, setGbpPostUrl] = useState<string | null>(null)
  const [gbpPostError, setGbpPostError] = useState("")

  // アフィリエイト設定のステート
  const [affiliateTag, setAffiliateTag] = useState("")
  const [affiliateInsertPosition, setAffiliateInsertPosition] = useState<"start" | "middle" | "end" | null>(null)
  const [affiliateH2Interval, setAffiliateH2Interval] = useState<number>(2) // デフォルトは2つ目のH2ごと

  // Google AdSenseのクライアントIDとスロットIDを環境変数から取得
  const googleAdsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-YOUR_ADSENSE_ID"
  const googleAdsenseSlotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID || "YOUR_AD_SLOT_ID"

  // Notion接続テスト関数
  const handleTestNotionConnection = async () => {
    setIsTestingNotion(true)
    setNotionTestResult(null)

    try {
      console.log("Notion接続テストを開始...")
      const response = await fetch("/api/test-notion-connection", { method: "POST" })
      const result: NotionTestResult = await response.json()

      console.log("テスト結果:", result)
      setNotionTestResult(result)

      if (result.success) {
        console.log("✅ Notion接続テスト成功")
      } else {
        console.log("❌ Notion接続テスト失敗:", result.error)
      }
    } catch (err: any) {
      console.error("テスト実行エラー:", err)
      setNotionTestResult({
        success: false,
        error: `テスト実行中にエラーが発生しました: ${err.message}`,
        details: { errorType: err.constructor.name },
      })
    } finally {
      setIsTestingNotion(false)
    }
  }

  // OpenAI接続テスト関数
  const handleTestOpenAIConnection = async () => {
    setIsTestingOpenAI(true)
    setOpenaiTestResult(null)

    try {
      console.log("OpenAI接続テストを開始...")
      const response = await fetch("/api/test-openai-connection", { method: "POST" })
      const result: OpenAITestResponse = await response.json()

      console.log("OpenAIテスト結果:", result)
      setOpenaiTestResult(result)

      if (result.success) {
        console.log("✅ OpenAI接続テスト成功")
      } else {
        console.log("❌ OpenAI接続テスト失敗:", result.error)
      }
    } catch (err: any) {
      console.error("OpenAIテスト実行エラー:", err)
      setOpenaiTestResult({
        success: false,
        error: `テスト実行中にエラーが発生しました: ${err.message}`,
        details: { errorType: err.constructor.name },
      })
    } finally {
      setIsTestingOpenAI(false)
    }
  }

  // WordPressカテゴリとタグの取得関数
  const fetchWordPressTerms = async () => {
    setIsLoadingWPTerms(true)
    setWpTermsError("")
    try {
      const response = await fetch("/api/get-wordpress-terms", { method: "POST" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "WordPressのカテゴリとタグの取得に失敗しました。")
      }
      const data = await response.json()
      setWordPressCategories(data.categories)
      setWordPressTags(data.tags)
    } catch (err: any) {
      setWpTermsError(`WordPressターム取得エラー: ${err.message}`)
      console.error("WordPressターム取得エラー:", err)
    } finally {
      setIsLoadingWPTerms(false)
    }
  }

  // テンプレート設定をlocalStorageから読み込む
  useEffect(() => {
    try {
      const storedTemplateSettings = localStorage.getItem("templateSettings")
      if (storedTemplateSettings) {
        setTemplateSettings(JSON.parse(storedTemplateSettings))
        setSelectedTemplate("custom") // カスタム設定が読み込まれたら選択状態にする
      }
      const storedAdType = localStorage.getItem("adType")
      if (storedAdType) setAdType(storedAdType)
      const storedCustomAdTag = localStorage.getItem("customAdTag")
      if (storedCustomAdTag) setCustomAdTag(storedCustomAdTag)
      const storedPostStatus = localStorage.getItem("postStatus")
      if (storedPostStatus === "publish" || storedPostStatus === "draft") {
        setPostStatus(storedPostStatus)
      }
      // アフィリエイト設定の読み込み
      const storedAffiliateTag = localStorage.getItem("affiliateTag")
      if (storedAffiliateTag) setAffiliateTag(storedAffiliateTag)
      const storedAffiliateInsertPosition = localStorage.getItem("affiliateInsertPosition")
      if (
        storedAffiliateInsertPosition === "start" ||
        storedAffiliateInsertPosition === "middle" ||
        storedAffiliateInsertPosition === "end"
      ) {
        setAffiliateInsertPosition(storedAffiliateInsertPosition)
      }
      const storedAffiliateH2Interval = localStorage.getItem("affiliateH2Interval")
      if (storedAffiliateH2Interval) setAffiliateH2Interval(Number.parseInt(storedAffiliateH2Interval, 10))

      // 要約・SNSハイライトのローカルストレージからの読み込み
      const storedSummary = localStorage.getItem("generatedSummary")
      if (storedSummary) setGeneratedSummary(storedSummary)
      const storedSnsHighlights = localStorage.getItem("generatedSnsHighlights")
      if (storedSnsHighlights) setGeneratedSnsHighlights(JSON.parse(storedSnsHighlights))
    } catch (e) {
      console.error("Failed to load settings from localStorage", e)
    }
  }, [])

  // テンプレート設定をlocalStorageに保存する関数
  useEffect(() => {
    try {
      localStorage.setItem("templateSettings", JSON.stringify(templateSettings))
      localStorage.setItem("adType", adType)
      localStorage.setItem("customAdTag", customAdTag)
      localStorage.setItem("postStatus", postStatus)
      // アフィリエイト設定の保存
      localStorage.setItem("affiliateTag", affiliateTag)
      localStorage.setItem("affiliateInsertPosition", affiliateInsertPosition || "")
      localStorage.setItem("affiliateH2Interval", affiliateH2Interval.toString())
    } catch (e) {
      console.error("Failed to save settings to localStorage", e)
    }
  }, [templateSettings, adType, customAdTag, postStatus, affiliateTag, affiliateInsertPosition, affiliateH2Interval])

  // articleが更新されたらeditedArticleを更新
  useEffect(() => {
    setEditedArticle(article)
    // 外部サービス投稿タブのタイトルとコンテンツも更新
    setPostToServiceTitle(articleTitle)
    setPostToServiceContent(article)
    // SNS投稿タブの画像URLも更新
    setSnsPostImageUrl(generatedImageUrl)
    // MEO投稿タブのタイトルと写真URLも更新
    setMeoPostTitle(articleTitle)
    setMeoPostPhotoUrl(generatedImageUrl)
  }, [article, articleTitle, generatedImageUrl])

  // generatedSnsHighlightsが更新されたらSNS投稿タブの投稿文を更新
  useEffect(() => {
    if (generatedSnsHighlights.length > 0) {
      setSnsPostTweet(generatedSnsHighlights[0]) // 最初のハイライトをSNS投稿文として設定
    }
  }, [generatedSnsHighlights])

  // editedArticleまたは画像URLが変更されたらHTMLプレビューを再生成
  useEffect(() => {
    const generatePreview = async () => {
      if (editedArticle) {
        let prefixHtml = ""
        if (generatedImageUrl) {
          prefixHtml += `
<div style="text-align: center;">
<img src="${generatedImageUrl}" alt="${articleTitle || topic}に関する画像" style="max-width: 600px; height: auto; display: block; margin: 0 auto;">
</div>
`
        }

        const finalMarkdownWithPrefix = prefixHtml + editedArticle
        const html = await markdownToHtml(
          finalMarkdownWithPrefix,
          googleAdsenseClientId,
          googleAdsenseSlotId,
          affiliateTag, // 新しいパラメータ
          affiliateInsertPosition, // 新しいパラメータ
          affiliateH2Interval, // 新しいパラメータ
        )
        setPreviewHtml(html)
      } else {
        setPreviewHtml("")
      }
    }
    generatePreview()
  }, [
    editedArticle,
    generatedImageUrl,
    articleTitle,
    topic,
    googleAdsenseClientId,
    googleAdsenseSlotId,
    affiliateTag, // 依存関係に追加
    affiliateInsertPosition, // 依存関係に追加
    affiliateH2Interval, // 依存関係に追加
  ])

  // コンポーネントマウント時にNotionとWordPressから履歴/タームを読み込む
  useEffect(() => {
    const fetchData = async () => {
      // Notion履歴の取得
      setIsLoadingHistory(true)
      try {
        console.log("Fetching Notion history...")
        const response = await fetch("/api/get-notion-history", { method: "POST" })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API response error:", errorData)
          throw new Error(errorData.error || "履歴取得に失敗しました")
        }

        const data = await response.json()
        console.log("Received history data:", data)
        setPostHistory(data.entries || [])
        setError("") // エラーをクリア
      } catch (err: any) {
        console.error("履歴取得エラー:", err)
        setError(`履歴の読み込み中にエラーが発生しました: ${err.message}`)
        // エラーが発生した場合は空の配列を設定
        setPostHistory([])
      } finally {
        setIsLoadingHistory(false)
      }

      // WordPressカテゴリとタグの取得
      await fetchWordPressTerms()
    }

    fetchData()

    return () => {
      if (scheduleIntervalId.current) {
        clearInterval(scheduleIntervalId.current)
      }
    }
  }, [])

  // タグID入力の変更ハンドラ
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)
    const ids = value
      .split(",")
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))
    setTagIds(ids)
  }

  // カスタムテキストを記事に挿入するヘルパー関数
  const insertCustomText = useCallback(
    (rawMarkdown: string): string => {
      // undefinedまたはnullチェックを追加
      if (!rawMarkdown || typeof rawMarkdown !== 'string') {
        console.warn('insertCustomText: rawMarkdown is not a valid string:', rawMarkdown)
        return rawMarkdown || ''
      }

      let resultMarkdown = rawMarkdown

      // 1. 冒頭文の挿入
      if (templateSettings.customIntroText.trim()) {
        if (templateSettings.introPosition === "start") {
          resultMarkdown = `${templateSettings.customIntroText}\n\n${resultMarkdown}`
        } else if (templateSettings.introPosition === "after_h1") {
          resultMarkdown = resultMarkdown.replace(
            /^(# .+?\n+)/,
            (match) => `${match}\n\n${templateSettings.customIntroText}\n\n`,
          )
        } else if (templateSettings.introPosition === "before_first_h2") {
          resultMarkdown = resultMarkdown.replace(
            /(^|\n)(## .+?)/,
            (match) => `${templateSettings.customIntroText}\n\n${match}`,
          )
        }
      }

      // 2. CTA文の挿入
      if (templateSettings.customCtaText.trim()) {
        if (templateSettings.ctaPosition === "end_of_article") {
          resultMarkdown = `${resultMarkdown}\n\n${templateSettings.customCtaText}`
        } else if (templateSettings.ctaPosition === "before_outro") {
          // 締め文の前に挿入 (締め文が挿入されることを前提)
          // これは締め文の挿入後に処理する必要があるため、ここではスキップし、後で処理するか、
          // 締め文の挿入ロジックと統合する必要がある。今回はシンプルに末尾かH2後のみとする。
        } else if (templateSettings.ctaPosition === "after_h2_every_n") {
          let h2Count = 0
          resultMarkdown = resultMarkdown.replace(/(^|\n)(## .+?)/g, (match, p1, p2) => {
            h2Count++
            if (h2Count % templateSettings.ctaH2Interval === 0) {
              return `${match}\n\n${templateSettings.customCtaText}\n\n`
            }
            return match
          })
        }
      }

      // 3. 締め文の挿入 (常に末尾に挿入されることを想定)
      if (templateSettings.customOutroText.trim() && templateSettings.outroPosition === "end_of_article") {
        resultMarkdown = `${resultMarkdown}\n\n${templateSettings.customOutroText}`
      }

      return resultMarkdown
    },
    [templateSettings],
  )

  const handleGenerateArticle = async () => {
    if (!topic.trim()) {
      setError("記事のトピックを入力してください。")
      return
    }
    setIsGenerating(true)
    setIsGeneratingImage(false)
    setArticle("")
    setEditedArticle("")
    setArticleTitle("")
    setWordpressPostUrl(null)
    setGeneratedImageUrl(null)
    setError("")
    setNotionSaveMessage(null)
    setNotionPageUrl(null)

    try {
      let imageUrl: string | null = null
      if (includeImage) {
        setIsGeneratingImage(true)
        try {
          const imageResponse = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topic }),
          })
          if (!imageResponse.ok) {
            const errorData = await imageResponse.json()
            throw new Error(errorData.error || "画像の生成に失敗しました。")
          }
          const imageData = await imageResponse.json()
          imageUrl = imageData.imageUrl
          setGeneratedImageUrl(imageUrl)
        } catch (imgErr: any) {
          setError(`画像生成エラー: ${imgErr.message}`)
        } finally {
          setIsGeneratingImage(false)
        }
      }

      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "記事の生成に失敗しました。")
      }

      const data = await response.json()
      console.log("記事生成APIレスポンス:", data)
      
      // data.articleまたはdata.contentを確認
      const rawGeneratedArticle = data.article || data.content || ""
      
      if (!rawGeneratedArticle || typeof rawGeneratedArticle !== 'string') {
        console.error("記事データが無効です:", data)
        throw new Error("記事の生成に失敗しました。レスポンスに有効な記事データがありません。")
      }

      // カスタムテキストを挿入
      const articleWithCustomTexts = insertCustomText(rawGeneratedArticle)

      setArticle(articleWithCustomTexts) // 編集可能な記事として設定
      setArticleTitle(data.title || `${topic}について`)
      setActiveTab("article-preview-edit") // 記事生成後、プレビュー・編集タブに遷移
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePostToWordPress = async (
    titleToPost: string,
    markdownContentToPost: string,
    topicUsed: string,
    imageUrlToPost: string | null,
  ) => {
    if (!markdownContentToPost.trim()) {
      setError("投稿する記事の内容がありません。")
      return false
    }
    if (!titleToPost.trim()) {
      setError("記事のタイトルがありません。")
      return false
    }

    setIsPosting(true)
    setWordpressPostUrl(null)
    setError("")
    setNotionSaveMessage(null)
    setNotionPageUrl(null)

    try {
      let finalContentHtml = ""
      let prefixHtml = ""
      if (imageUrlToPost) {
        prefixHtml += `
<div style="text-align: center;">
<img src="${imageUrlToPost}" alt="${titleToPost || topicUsed}に関する画像" style="max-width: 600px; height: auto; display: block; margin: 0 auto;">
</div>
`
      }

      // 広告はmarkdownToHtml内で処理されるため、ここではカスタム広告タグのみを考慮
      finalContentHtml = await markdownToHtml(
        prefixHtml + markdownContentToPost,
        googleAdsenseClientId,
        googleAdsenseSlotId,
        affiliateTag, // 新しいパラメータ
        affiliateInsertPosition, // 新しいパラメータ
        affiliateH2Interval, // 新しいパラメータ
      )

      const response = await fetch("/api/post-to-wordpress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleToPost,
          content: finalContentHtml,
          categoryId: categoryId,
          tagIds: tagIds,
          status: postStatus,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "WordPressへの投稿に失敗しました。")
      }

      const data = await response.json()
      const newPostUrl = data.wordpressPostUrl
      setWordpressPostUrl(newPostUrl)

      // Notionに履歴を保存する処理
      try {
        const notionResponse = await fetch("/api/save-to-notion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: titleToPost,
            topic: topicUsed,
            url: newPostUrl,
            tags: tagIds.map(String),
            categoryId: categoryId ?? 0,
            status: postStatus,
          }),
        })

        if (!notionResponse.ok) {
          const errorData = await notionResponse.json()
          throw new Error(errorData.error || "Notionへの保存に失敗しました。")
        }
        const notionData = await notionResponse.json()
        setNotionSaveMessage("Notionに履歴を保存しました！")
        setNotionPageUrl(notionData.pageUrl)

        // Notion保存成功後、履歴を再フェッチしてUIを更新
        const fetchResponse = await fetch("/api/get-notion-history", { method: "POST" })
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json()
          setPostHistory(fetchData.entries || [])
        }
      } catch (notionError: any) {
        console.error("Notion保存エラー:", notionError)
        setNotionSaveMessage(`Notion保存エラー: ${notionError.message}`)
      }

      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsPosting(false)
    }
  }

  // 履歴をクリアするハンドラ
  const handleClearHistory = async () => {
    if (window.confirm("本当に投稿履歴をすべてクリアしますか？（Notionのデータは削除されません）")) {
      setPostHistory([])
    }
  }

  // 履歴を再読み込みするハンドラ
  const handleRefreshHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch("/api/get-notion-history", { method: "POST" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "履歴取得に失敗しました")
      }
      const data = await response.json()
      setPostHistory(data.entries || [])
      setError("")
    } catch (err: any) {
      console.error("履歴再読み込みエラー:", err)
      setError(`履歴の再読み込み中にエラーが発生しました: ${err.message}`)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // スケジューラーの開始
  const startScheduler = () => {
    if (!scheduledTopic.trim()) {
      setSchedulerMessage("スケジュールするトピックを入力してください。")
      return
    }
    if (scheduleRunning) {
      setSchedulerMessage("スケジューラーは既に実行中です。")
      return
    }

    setScheduleRunning(true)
    setSchedulerMessage(`スケジューラーを開始しました。毎日 ${scheduledTime} に記事を生成・投稿します。`)

    scheduleIntervalId.current = setInterval(async () => {
      const now = new Date()
      const currentTime = now.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false })

      if (currentTime === scheduledTime) {
        setSchedulerMessage(`${scheduledTime} になりました。記事生成と投稿を開始します...`)
        try {
          let scheduledImageUrl: string | null = null
          if (includeImage) {
            try {
              const imageResponse = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: scheduledTopic }),
              })
              if (!imageResponse.ok) {
                const errorData = await imageResponse.json()
                throw new Error(errorData.error || "画像の生成に失敗しました。")
              }
              const imageData = await imageResponse.json()
              scheduledImageUrl = imageData.imageUrl
            } catch (imgErr: any) {
              console.error(`スケジュール画像生成エラー: ${imgErr.message}`)
              setSchedulerMessage(`スケジュール画像生成エラー: ${imgErr.message}`)
            }
          }

          const generateResponse = await fetch("/api/generate-article", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: scheduledTopic }),
          })

          if (!generateResponse.ok) {
            const errorData = await generateResponse.json()
            throw new Error(errorData.error || "記事の生成に失敗しました。")
          }

          const generateData = await generateResponse.json()
          const rawGeneratedArticle = generateData.article
          const generatedArticleTitle = generateData.title

          // スケジュール実行時もカスタムテキストを挿入
          const formattedScheduledArticleMarkdown = insertCustomText(rawGeneratedArticle)

          setSchedulerMessage("記事を生成しました。WordPressに投稿します...")

          const postSuccess = await handlePostToWordPress(
            generatedArticleTitle,
            formattedScheduledArticleMarkdown,
            scheduledTopic,
            scheduledImageUrl,
          )

          if (postSuccess) {
            setSchedulerMessage(`${scheduledTime} の記事生成と投稿が完了しました！`)
          } else {
            setSchedulerMessage(`${scheduledTime} のWordPress投稿に失敗しました。`)
          }
        } catch (err: any) {
          setSchedulerMessage(`スケジューラー実行中にエラーが発生しました: ${err.message}`)
          console.error("Scheduler error:", err)
        }
      }
    }, 60 * 1000)
  }

  // スケジューラーの停止
  const stopScheduler = () => {
    if (scheduleIntervalId.current) {
      clearInterval(scheduleIntervalId.current)
      scheduleIntervalId.current = null
    }
    setScheduleRunning(false)
    setSchedulerMessage("スケジューラーを停止しました。")
  }

  // アウトライン生成ハンドラ
  const handleGenerateOutline = async () => {
    if (!outlineTopic.trim()) {
      setOutlineError("アウトラインのトピックを入力してください。")
      return
    }
    setIsLoadingOutline(true)
    setOutlineResult("")
    setOutlineError("")

    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: outlineTopic }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "アウトラインの生成に失敗しました。")
      }

      const data = await response.json()
      setOutlineResult(data.outline)
    } catch (err: any) {
      setOutlineError(err.message)
    } finally {
      setIsLoadingOutline(false)
    }
  }

  // 要約・SNSハイライト生成ハンドラ
  const handleGenerateSummary = async () => {
    if (!articleBody.trim()) {
      setSummarizeError("記事本文を入力してください。")
      return
    }
    setIsSummarizing(true)
    setGeneratedSummary("")
    setGeneratedSnsHighlights([])
    setSummarizeError("")

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: articleBody }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "要約の生成に失敗しました。")
      }

      const data = await response.json()
      setGeneratedSummary(data.summary)
      setGeneratedSnsHighlights(data.snsHighlights || [])
    } catch (err: any) {
      setSummarizeError(err.message)
    } finally {
      setIsSummarizing(false)
    }
  }

  // SEOチェックハンドラ
  const handleCheckSeo = async () => {
    if (!seoCheckArticleContent.trim()) {
      setSeoCheckError("記事本文を入力してください。")
      return
    }
    setIsCheckingSeo(true)
    setSeoCheckResult(null)
    setSeoCheckError("")

    try {
      const response = await fetch("/api/check-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleContent: seoCheckArticleContent }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "SEOチェックに失敗しました。")
      }

      const data: SeoCheckResult = await response.json()
      setSeoCheckResult(data)
    } catch (err: any) {
      setSeoCheckError(err.message)
    } finally {
      setIsCheckingSeo(false)
    }
  }

  // 外部サービス投稿ハンドラ
  const handlePostToService = async () => {
    if (!postToServiceTitle.trim() || !postToServiceContent.trim()) {
      setServicePostError("タイトルとコンテンツを入力してください。")
      return
    }
    setIsPostingToService(true)
    setServicePostMessage(null)
    setServicePostUrl(null)
    setServicePostError("")

    try {
      const response = await fetch("/api/post-to-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: postPlatform,
          title: postToServiceTitle,
          content: postToServiceContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "外部サービスへの投稿に失敗しました。")
      }

      const data = await response.json()
      setServicePostMessage(data.message)
      setServicePostUrl(data.url)
    } catch (err: any) {
      setServicePostError(err.message)
    } finally {
      setIsPostingToService(false)
    }
  }

  // X投稿ハンドラ
  const handlePostToX = async () => {
    if (!snsPostTweet.trim()) {
      setXPostError("投稿文を入力してください。")
      return
    }
    if (snsPostTweet.length > 140) {
      setXPostError("投稿文は140文字以内にしてください。")
      return
    }

    setIsPostingToX(true)
    setXPostMessage(null)
    setXPostUrl(null)
    setXPostError("")

    try {
      const response = await fetch("/api/post-to-x", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tweet: snsPostTweet,
          imageUrl: snsPostImageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Xへの投稿に失敗しました。")
      }

      const data = await response.json()
      setXPostMessage(data.message)
      setXPostUrl(data.url)
    } catch (err: any) {
      setXPostError(err.message)
    } finally {
      setIsPostingToX(false)
    }
  }

  // MEO投稿ハンドラ
  const handlePostToGbp = async () => {
    if (!meoPostTitle.trim() || !meoPostContent.trim()) {
      setGbpPostError("タイトルと内容を入力してください。")
      return
    }

    setIsPostingToGbp(true)
    setGbpPostMessage(null)
    setGbpPostUrl(null)
    setGbpPostError("")

    try {
      const response = await fetch("/api/post-to-gbp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: meoPostTitle,
          content: meoPostContent,
          photoUrl: meoPostPhotoUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Googleビジネスプロフィールへの投稿に失敗しました。")
      }

      const data = await response.json()
      setGbpPostMessage(data.message)
      setGbpPostUrl(data.url)
    } catch (err: any) {
      setGbpPostError(err.message)
    } finally {
      setIsPostingToGbp(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
      {/* ナビゲーションヘッダー */}
      <div className="w-full max-w-6xl mb-6">
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-900">SEO記事生成システム</h1>
          <div className="flex gap-3">
            <Link href="/article-generator">
              <Button variant="default" size="lg">
                📝 新しい記事を生成
              </Button>
            </Link>
            <Link href="/ad-management">
              <Button variant="default" size="lg" className="bg-orange-600 hover:bg-orange-700">
                🎯 広告管理
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="default" size="lg">
                📋 テンプレート記事生成
              </Button>
            </Link>
            <Link href="/quality-evaluation">
              <Button variant="default" size="lg">
                🔍 記事品質評価
              </Button>
            </Link>
            <Link href="/quality-evaluation?tab=google-quality">
              <Button variant="outline" size="lg">
                🎯 Google品質評価
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                📊 ダッシュボード
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
        <TabsList className="flex flex-wrap justify-center gap-2 mb-6">
          <TabsTrigger value="keyword-settings">キーワード設定</TabsTrigger>
          <TabsTrigger value="outline">構成提案</TabsTrigger>
          <TabsTrigger value="template-settings">テンプレート設定</TabsTrigger>
          <TabsTrigger value="article-generation">記事生成</TabsTrigger>
          <TabsTrigger value="article-preview-edit">記事確認・編集</TabsTrigger> {/* 新しいタブ */}
          <TabsTrigger value="summary-highlight-generation">記事要約</TabsTrigger>
          <TabsTrigger value="seo-check">SEOチェック</TabsTrigger>
          <TabsTrigger value="external-post">外部サービス投稿</TabsTrigger>
          <TabsTrigger value="sns-post">SNS投稿</TabsTrigger>
          <TabsTrigger value="meo-post">MEO投稿</TabsTrigger>
          <TabsTrigger value="affiliate-settings">アフィリエイト設定</TabsTrigger>
          <TabsTrigger value="schedule">スケジュール</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="keyword-settings">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">キーワード設定</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-center text-gray-600">ここにキーワード設定に関するUIを追加します。</p>
              <div className="space-y-2">
                <Label htmlFor="keywords">主要キーワード</Label>
                <Textarea id="keywords" placeholder="例: Next.js, SEO, AI" rows={3} />
              </div>
              <Button className="w-full">キーワードを保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outline">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">記事構成の提案</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="outlineTopic">アウトラインのトピック</Label>
                <Textarea
                  id="outlineTopic"
                  placeholder="例: AIを活用したコンテンツマーケティングの未来"
                  value={outlineTopic}
                  onChange={(e) => setOutlineTopic(e.target.value)}
                  rows={4}
                  disabled={isLoadingOutline}
                />
                <p className="text-sm text-gray-500">記事の構成を提案してほしいトピックを入力してください。</p>
              </div>
              <Button onClick={handleGenerateOutline} className="w-full" disabled={isLoadingOutline}>
                {isLoadingOutline ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    構成を提案中...
                  </>
                ) : (
                  "構成を提案する"
                )}
              </Button>
              {outlineError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {outlineError}
                </div>
              )}
              {outlineResult && (
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-semibold">提案された構成</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Textarea
                      value={outlineResult}
                      rows={15}
                      readOnly
                      className="w-full p-4 border rounded-md bg-gray-50 font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      この構成を参考に、記事生成タブで記事を作成してください。
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* テンプレート設定タブ */}
        <TabsContent value="template-settings">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">テンプレート設定</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                記事の冒頭文、CTA文、締め文をカスタマイズし、挿入位置を設定できます。
              </p>

              {/* テンプレート選択ドロップダウン (簡易版) */}
              <div className="space-y-2">
                <Label htmlFor="templateSelect">テンプレート選択</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="templateSelect">
                    <SelectValue placeholder="テンプレートを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">デフォルト</SelectItem>
                    <SelectItem value="custom">カスタム設定</SelectItem>
                    {/* 将来的に保存したテンプレートをここに追加 */}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">デフォルト設定に戻すか、現在のカスタム設定を使用します。</p>
              </div>

              {/* 冒頭文 */}
              <div className="space-y-2">
                <Label htmlFor="introText">冒頭文（リード文）</Label>
                <Textarea
                  id="introText"
                  placeholder={DEFAULT_TEMPLATE_SETTINGS.customIntroText}
                  value={templateSettings.customIntroText}
                  onChange={(e) => setTemplateSettings((prev) => ({ ...prev, customIntroText: e.target.value }))}
                  rows={3}
                />
                <Select
                  value={templateSettings.introPosition}
                  onValueChange={(value) =>
                    setTemplateSettings((prev) => ({
                      ...prev,
                      introPosition: value as TemplateSettings["introPosition"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="挿入位置を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">記事の先頭</SelectItem>
                    <SelectItem value="after_h1">H1タグ直後</SelectItem>
                    <SelectItem value="before_first_h2">最初のH2タグ直前</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CTA文 */}
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA文（行動喚起）</Label>
                <Textarea
                  id="ctaText"
                  placeholder={DEFAULT_TEMPLATE_SETTINGS.customCtaText}
                  value={templateSettings.customCtaText}
                  onChange={(e) => setTemplateSettings((prev) => ({ ...prev, customCtaText: e.target.value }))}
                  rows={3}
                />
                <Select
                  value={templateSettings.ctaPosition}
                  onValueChange={(value) =>
                    setTemplateSettings((prev) => ({
                      ...prev,
                      ctaPosition: value as TemplateSettings["ctaPosition"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="挿入位置を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after_h2_every_n">H2タグごと</SelectItem>
                    <SelectItem value="end_of_article">記事の末尾</SelectItem>
                  </SelectContent>
                </Select>
                {templateSettings.ctaPosition === "after_h2_every_n" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Label htmlFor="ctaH2Interval">H2タグごと（N番目）</Label>
                    <Input
                      id="ctaH2Interval"
                      type="number"
                      min="1"
                      value={templateSettings.ctaH2Interval}
                      onChange={(e) =>
                        setTemplateSettings((prev) => ({
                          ...prev,
                          ctaH2Interval: Number.parseInt(e.target.value, 10) || 1,
                        }))
                      }
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              {/* 締め文 */}
              <div className="space-y-2">
                <Label htmlFor="outroText">締め文（クロージング）</Label>
                <Textarea
                  id="outroText"
                  placeholder={DEFAULT_TEMPLATE_SETTINGS.customOutroText}
                  value={templateSettings.customOutroText}
                  onChange={(e) => setTemplateSettings((prev) => ({ ...prev, customOutroText: e.target.value }))}
                  rows={3}
                />
                <Select
                  value={templateSettings.outroPosition}
                  onValueChange={(value) =>
                    setTemplateSettings((prev) => ({
                      ...prev,
                      outroPosition: value as TemplateSettings["outroPosition"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="挿入位置を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end_of_article">記事の末尾</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  // localStorageに保存はuseEffectで自動的に行われる
                  alert("テンプレート設定を保存しました！")
                }}
                className="w-full"
              >
                設定を保存
              </Button>
              <Button
                onClick={() => {
                  setTemplateSettings(DEFAULT_TEMPLATE_SETTINGS)
                  setSelectedTemplate("default")
                  alert("デフォルト設定を適用しました！")
                }}
                variant="outline"
                className="w-full"
              >
                デフォルトに戻す
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="article-generation">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">SEO記事自動生成ツール</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">記事のトピックとキーワード</Label>
                <Textarea
                  id="topic"
                  placeholder="例: Next.jsの最新機能とSEO対策、AIを活用したコンテンツマーケティング"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={4}
                  disabled={isGenerating || isPosting || isGeneratingImage}
                />
                <p className="text-sm text-gray-500">
                  生成したい記事のトピックや含めたいキーワードを具体的に入力してください。
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="includeImage"
                  checked={includeImage}
                  onCheckedChange={(checked) => setIncludeImage(Boolean(checked))}
                  disabled={isGenerating || isPosting || isGeneratingImage}
                />
                <Label htmlFor="includeImage">記事の先頭にAI生成画像を挿入する</Label>
              </div>
              <Button
                onClick={handleGenerateArticle}
                className="w-full"
                disabled={isGenerating || isPosting || isGeneratingImage}
              >
                {isGenerating || isGeneratingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isGeneratingImage ? "画像を生成中..." : "記事を生成中..."}
                  </>
                ) : (
                  "記事を生成"
                )}
              </Button>
              {error && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {error}
                </div>
              )}

              {/* Yahoo!急上昇ワード統合セクション */}
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold mb-2">🚀 Yahoo!急上昇ワード</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Yahoo! JAPANの急上昇ワードを参考に、今話題の記事を生成してみましょう。
                </p>
                <YahooTrendingSelector
                  onSelect={(selectedWord) => {
                    setTopic(selectedWord)
                    setActiveTab("article-generation")
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 記事確認・編集タブ */}
        <TabsContent value="article-preview-edit">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">記事確認・編集</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {article && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="articleTitleEdit">記事タイトル</Label>
                    <Input
                      id="articleTitleEdit"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      disabled={isPosting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editedArticle">記事本文（Markdownで編集）</Label>
                    <Textarea
                      id="editedArticle"
                      value={editedArticle}
                      onChange={(e) => setEditedArticle(e.target.value)}
                      rows={20}
                      className="w-full p-4 border rounded-md bg-gray-50 font-mono text-sm mb-4"
                    />
                  </div>
                  <Label>HTMLプレビュー</Label>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-gray-50">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </ScrollArea>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">カテゴリ</Label>
                      {isLoadingWPTerms ? (
                        <div className="flex items-center text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          カテゴリを読み込み中...
                        </div>
                      ) : wpTermsError ? (
                        <div className="text-red-500 text-sm">{wpTermsError}</div>
                      ) : (
                        <Select
                          value={categoryId !== null ? String(categoryId) : ""}
                          onValueChange={(value) => setCategoryId(Number.parseInt(value, 10))}
                          disabled={isPosting}
                        >
                          <SelectTrigger id="categoryId">
                            <SelectValue placeholder="カテゴリを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {wordpressCategories.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <p className="text-sm text-gray-500">WordPressのカテゴリを選択してください。</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagIds">タグID (カンマ区切り)</Label>
                      <Input
                        id="tagIds"
                        type="text"
                        placeholder="例: 3,5,8"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        disabled={isPosting}
                      />
                      {isLoadingWPTerms ? (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          タグを読み込み中...
                        </div>
                      ) : wpTermsError ? (
                        <div className="text-red-500 text-sm">{wpTermsError}</div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          利用可能なタグ:{" "}
                          {wordpressTags.length > 0
                            ? wordpressTags.map((tag) => tag.name).join(", ")
                            : "タグがありません"}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">WordPressのタグIDをカンマ区切りで入力してください。</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postStatus">投稿ステータス</Label>
                      <select
                        id="postStatus"
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as "publish" | "draft")}
                        className="w-full border rounded px-3 py-2"
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        WordPressに投稿中...
                      </>
                    ) : (
                      "WordPressに投稿する"
                    )}
                  </Button>
                  {wordpressPostUrl && (
                    <div className="mt-4 text-center">
                      <p className="text-green-600 font-medium">記事がWordPressに投稿されました！</p>
                      <Link
                        href={wordpressPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        WordPressで記事を見る
                      </Link>
                    </div>
                  )}
                  {notionSaveMessage && (
                    <div
                      className={`mt-2 text-center text-sm ${
                        notionSaveMessage.startsWith("Notion保存エラー") ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {notionSaveMessage}
                    </div>
                  )}
                  {notionPageUrl && (
                    <div className="mt-2 text-center text-sm">
                      <Link
                        href={notionPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Notionで記事を見る
                      </Link>
                    </div>
                  )}
                  <Button onClick={() => setActiveTab("article-generation")} variant="outline" className="w-full mt-4">
                    記事生成に戻る
                  </Button>
                </>
              )}
              {!article && (
                <p className="text-center text-gray-600">
                  「記事生成」タブで記事を生成すると、ここに内容が表示されます。
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 記事要約・SNS向けハイライト生成タブ */}
        <TabsContent value="summary-highlight-generation">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">記事要約・SNS向けハイライト生成</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="articleBody">記事本文</Label>
                <Textarea
                  id="articleBody"
                  name="articleBody"
                  placeholder="ここに記事本文を貼り付けてください"
                  value={articleBody}
                  onChange={(e) => setArticleBody(e.target.value)}
                  rows={15}
                  disabled={isSummarizing}
                />
                <p className="text-sm text-gray-500">
                  要約、ハイライト、SNS投稿例を生成したい記事の本文を入力してください。
                </p>
              </div>
              <Button onClick={handleGenerateSummary} className="w-full" disabled={isSummarizing}>
                {isSummarizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    要約とSNSハイライトを生成中...
                  </>
                ) : (
                  "要約とSNSハイライトを生成する"
                )}
              </Button>
              {summarizeError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {summarizeError}
                </div>
              )}
              {(generatedSummary || generatedSnsHighlights.length > 0) && (
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-semibold">生成結果</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="summary">要約（300文字以内）</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={generatedSummary}
                        onChange={(e) => setGeneratedSummary(e.target.value)}
                        rows={5}
                        maxLength={300}
                        className="w-full p-2 border rounded-md bg-gray-50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="snsHighlights">SNSハイライト（3件まで、各100文字以内）</Label>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Textarea
                          key={index}
                          id={`snsHighlight-${index + 1}`}
                          name={`snsHighlight-${index + 1}`}
                          value={generatedSnsHighlights[index] || ""}
                          onChange={(e) => {
                            const newHighlights = [...generatedSnsHighlights]
                            newHighlights[index] = e.target.value
                            setGeneratedSnsHighlights(newHighlights)
                          }}
                          rows={2}
                          maxLength={100}
                          className="w-full p-2 border rounded-md bg-gray-50 text-sm mb-2"
                          placeholder={`SNSハイライト ${index + 1}`}
                        />
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        localStorage.setItem("generatedSummary", generatedSummary)
                        localStorage.setItem("generatedSnsHighlights", JSON.stringify(generatedSnsHighlights))
                        alert("要約とSNSハイライトを保存しました！")
                      }}
                      className="w-full"
                    >
                      保存する
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEOチェックタブ */}
        <TabsContent value="seo-check">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">SEOチェック</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seoCheckArticleContent">記事本文</Label>
                <Textarea
                  id="seoCheckArticleContent"
                  name="articleContent"
                  placeholder="SEOチェックを行いたい記事の本文をここに入力してください。"
                  value={seoCheckArticleContent}
                  onChange={(e) => setSeoCheckArticleContent(e.target.value)}
                  rows={15}
                  disabled={isCheckingSeo}
                />
                <p className="text-sm text-gray-500">
                  入力された記事本文に対して、基本的なSEO観点でのチェックを行います。
                </p>
              </div>
              <Button onClick={handleCheckSeo} className="w-full" disabled={isCheckingSeo}>
                {isCheckingSeo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SEOチェック実行中...
                  </>
                ) : (
                  "SEOチェック実行"
                )}
              </Button>
              {seoCheckError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {seoCheckError}
                </div>
              )}
              {seoCheckResult && (
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-semibold">SEOチェック結果</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>見出し数:</Label>
                      <span className="font-medium">{seoCheckResult.headingCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>キーワード「{seoCheckResult.keywordDensity.keyword}」出現数:</Label>
                      <span className="font-medium">{seoCheckResult.keywordDensity.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>キーワード「{seoCheckResult.keywordDensity.keyword}」密度:</Label>
                      <span className="font-medium">{seoCheckResult.keywordDensity.density}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>メタディスクリプションの有無:</Label>
                      <span className="font-medium">
                        {seoCheckResult.hasMetaDescription ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>内部リンクの有無:</Label>
                      <span className="font-medium">
                        {seoCheckResult.hasInternalLinks ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>外部リンクの有無:</Label>
                      <span className="font-medium">
                        {seoCheckResult.hasExternalLinks ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      ※メタディスクリプションとリンクの有無は、Markdown本文からの簡易的なチェックです。
                      <br />
                      正確なチェックには、HTML変換後のDOM解析やURLのドメイン判定が必要です。
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外部サービス投稿タブ */}
        <TabsContent value="external-post">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">外部サービス投稿</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                生成された記事をnoteやInstaNoteなどの外部メディアに投稿できます。
              </p>
              <div className="space-y-2">
                <Label htmlFor="platform">投稿対象メディア</Label>
                <Select value={postPlatform} onValueChange={setPostPlatform} disabled={isPostingToService}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="メディアを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">note</SelectItem>
                    <SelectItem value="in">InstaNote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postToServiceTitle">記事タイトル</Label>
                <Input
                  id="postToServiceTitle"
                  placeholder="記事のタイトル"
                  value={postToServiceTitle}
                  onChange={(e) => setPostToServiceTitle(e.target.value)}
                  disabled={isPostingToService}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postToServiceContent">記事本文</Label>
                <Textarea
                  id="postToServiceContent"
                  placeholder="記事の本文"
                  value={postToServiceContent}
                  onChange={(e) => setPostToServiceContent(e.target.value)}
                  rows={15}
                  disabled={isPostingToService}
                />
              </div>
              <Button onClick={handlePostToService} className="w-full" disabled={isPostingToService}>
                {isPostingToService ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    投稿中...
                  </>
                ) : (
                  "投稿する"
                )}
              </Button>
              {servicePostError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {servicePostError}
                </div>
              )}
              {servicePostMessage && (
                <div className="mt-4 text-center">
                  <p className="text-green-600 font-medium">{servicePostMessage}</p>
                  {servicePostUrl && (
                    <Link
                      href={servicePostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      投稿された記事を見る
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SNS投稿タブ */}
        <TabsContent value="sns-post">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">SNS投稿</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">生成された記事の要約や画像をX（Twitter）に投稿できます。</p>
              <div className="space-y-2">
                <Label htmlFor="snsPostTweet">投稿文（140文字以内）</Label>
                <Textarea
                  id="snsPostTweet"
                  placeholder="記事のポイントを簡潔にまとめましょう。#AI #SEO"
                  value={snsPostTweet}
                  onChange={(e) => setSnsPostTweet(e.target.value)}
                  rows={3}
                  maxLength={140}
                  disabled={isPostingToX}
                />
                <p className="text-sm text-gray-500 text-right">{snsPostTweet.length}/140</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="snsPostImageUrl">投稿画像URL（任意）</Label>
                <Input
                  id="snsPostImageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={snsPostImageUrl || ""}
                  onChange={(e) => setSnsPostImageUrl(e.target.value)}
                  disabled={isPostingToX}
                />
                <p className="text-sm text-gray-500">記事生成時に生成された画像URLが自動で入力されます。</p>
                {snsPostImageUrl && (
                  <div className="mt-2">
                    <img
                      src={snsPostImageUrl || "/placeholder.svg"}
                      alt="投稿画像プレビュー"
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              <Button onClick={handlePostToX} className="w-full" disabled={isPostingToX || snsPostTweet.length > 140}>
                {isPostingToX ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Xに投稿中...
                  </>
                ) : (
                  "Xに投稿"
                )}
              </Button>
              {xPostError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {xPostError}
                </div>
              )}
              {xPostMessage && (
                <div className="mt-4 text-center">
                  <p className="text-green-600 font-medium">{xPostMessage}</p>
                  {xPostUrl && (
                    <Link
                      href={xPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Xで投稿を見る
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MEO投稿タブ */}
        <TabsContent value="meo-post">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">MEO投稿</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                Googleビジネスプロフィールに店舗のお知らせやブログ的な投稿ができます。
              </p>
              <div className="space-y-2">
                <Label htmlFor="meoPostTitle">投稿タイトル</Label>
                <Input
                  id="meoPostTitle"
                  placeholder="新メニュー開始！"
                  value={meoPostTitle}
                  onChange={(e) => setMeoPostTitle(e.target.value)}
                  disabled={isPostingToGbp}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meoPostContent">投稿内容</Label>
                <Textarea
                  id="meoPostContent"
                  placeholder="本日より新メニューを提供開始しました。詳細は店舗で！"
                  value={meoPostContent}
                  onChange={(e) => setMeoPostContent(e.target.value)}
                  rows={8}
                  disabled={isPostingToGbp}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meoPostPhotoUrl">写真URL（任意）</Label>
                <Input
                  id="meoPostPhotoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={meoPostPhotoUrl || ""}
                  onChange={(e) => setMeoPostPhotoUrl(e.target.value)}
                  disabled={isPostingToGbp}
                />
                <p className="text-sm text-gray-500">記事生成時に生成された画像URLが自動で入力されます。</p>
                {meoPostPhotoUrl && (
                  <div className="mt-2">
                    <img
                      src={meoPostPhotoUrl || "/placeholder.svg"}
                      alt="投稿写真プレビュー"
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              <Button onClick={handlePostToGbp} className="w-full" disabled={isPostingToGbp}>
                {isPostingToGbp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Googleに投稿中...
                  </>
                ) : (
                  "Googleに投稿"
                )}
              </Button>
              {gbpPostError && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {gbpPostError}
                </div>
              )}
              {gbpPostMessage && (
                <div className="mt-4 text-center">
                  <p className="text-green-600 font-medium">{gbpPostMessage}</p>
                  {gbpPostUrl && (
                    <Link
                      href={gbpPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Googleで投稿を見る
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate-settings">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">アフィリエイト設定</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                生成記事の中にアフィリエイト広告を自動で差し込む設定を行います。
              </p>
              <div className="space-y-2">
                <Label htmlFor="affiliateTag">アフィリエイトタグ（HTML）</Label>
                <Textarea
                  id="affiliateTag"
                  placeholder={`<iframe src="..." width="..." height="..." frameborder="0" scrolling="no"></iframe>`}
                  value={affiliateTag}
                  onChange={(e) => setAffiliateTag(e.target.value)}
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  広告プロバイダーから提供されたHTMLタグをそのまま貼り付けてください。
                </p>
              </div>
              <div className="space-y-2">
                <Label>挿入箇所選択</Label>
                <RadioGroup
                  value={affiliateInsertPosition || ""}
                  onValueChange={(value: "start" | "middle" | "end") => setAffiliateInsertPosition(value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="start" id="insert-start" />
                    <Label htmlFor="insert-start">記事冒頭</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="middle" id="insert-middle" />
                    <Label htmlFor="insert-middle">記事中（H2タグごと）</Label>
                  </div>
                  {affiliateInsertPosition === "middle" && (
                    <div className="flex items-center space-x-2 ml-6 mt-1">
                      <Label htmlFor="affiliateH2Interval">H2タグごと（N番目）</Label>
                      <Input
                        id="affiliateH2Interval"
                        type="number"
                        min="1"
                        value={affiliateH2Interval}
                        onChange={(e) => setAffiliateH2Interval(Number.parseInt(e.target.value, 10) || 1)}
                        className="w-20"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end" id="insert-end" />
                    <Label htmlFor="insert-end">記事末尾</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={() => {
                  alert("アフィリエイト設定を保存しました！")
                }}
                className="w-full"
              >
                設定を保存
              </Button>

              {affiliateTag && (
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-semibold">アフィリエイト広告プレビュー</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      現在の記事とアフィリエイト広告が挿入された状態のプレビューです。
                    </p>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-gray-50">
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">記事自動投稿スケジューラー</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-center text-gray-600">
                指定した時刻に記事を自動生成し、WordPressに投稿します。
                <br />
                ※この機能はブラウザが閉じている間やスリープ中は動作しません。
              </p>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">投稿時刻</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  disabled={scheduleRunning}
                />
                <p className="text-sm text-gray-500">毎日この時刻に記事が生成・投稿されます。</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTopic">スケジュールする記事のトピック</Label>
                <Textarea
                  id="scheduledTopic"
                  placeholder="例: 今日のAIニュースのまとめ、最新のWeb開発トレンド"
                  value={scheduledTopic}
                  onChange={(e) => setScheduledTopic(e.target.value)}
                  rows={4}
                  disabled={scheduleRunning}
                />
                <p className="text-sm text-gray-500">スケジュール実行時にこのトピックで記事が生成されます。</p>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="includeImageSchedule"
                  checked={includeImage}
                  onCheckedChange={(checked) => setIncludeImage(Boolean(checked))}
                  disabled={scheduleRunning}
                />
                <Label htmlFor="includeImageSchedule">記事の先頭にAI生成画像を挿入する</Label>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={startScheduler}
                  className="flex-1"
                  disabled={scheduleRunning || !scheduledTopic.trim()}
                >
                  {scheduleRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      スケジュール実行中
                    </>
                  ) : (
                    "スケジュールを開始"
                  )}
                </Button>
                <Button onClick={stopScheduler} className="flex-1" variant="outline" disabled={!scheduleRunning}>
                  停止
                </Button>
              </div>
              {schedulerMessage && (
                <div className={`text-sm text-center ${scheduleRunning ? "text-blue-600" : "text-gray-600"}`}>
                  {schedulerMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-center">設定</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-center text-gray-600">ここにアプリケーション全体の設定に関するUIを追加します。</p>

              {/* Notion接続テストセクション */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Notion API接続テスト</h3>
                  <Button onClick={handleTestNotionConnection} variant="outline" size="sm" disabled={isTestingNotion}>
                    {isTestingNotion ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        テスト中...
                      </>
                    ) : (
                      "接続テスト"
                    )}
                  </Button>
                </div>

                {notionTestResult && (
                  <div
                    className={`p-3 rounded-md ${
                      notionTestResult.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {notionTestResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${notionTestResult.success ? "text-green-800" : "text-red-800"}`}>
                        {notionTestResult.success ? "接続成功" : "接続失敗"}
                      </span>
                    </div>

                    {notionTestResult.success && notionTestResult.data && (
                      <div className="text-sm text-green-700 space-y-1">
                        <p>✅ 取得したエントリ数: {notionTestResult.data.entriesCount}件</p>
                        <p>
                          ✅ トークン形式: {notionTestResult.data.tokenInfo.prefix}... (
                          {notionTestResult.data.tokenInfo.length}文字, タイプ: {notionTestResult.data.tokenInfo.type})
                        </p>
                        <p>
                          ✅ データベース: {notionTestResult.data.databaseInfo.title} (ID:{" "}
                          {notionTestResult.data.databaseInfo.id.substring(0, 8)}...)
                        </p>
                        {notionTestResult.data.sampleEntries.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">サンプルエントリ:</p>
                            <ul className="list-disc list-inside ml-2">
                              {notionTestResult.data.sampleEntries.map((entry, index) => (
                                <li key={index} className="truncate">
                                  {entry.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {!notionTestResult.success && (
                      <div className="text-sm text-red-700">
                        <p className="font-medium">エラー: {notionTestResult.error}</p>
                        {notionTestResult.guidance && (
                          <div className="mt-2 text-xs bg-red-100 p-2 rounded">
                            <p className="font-medium">解決のヒント:</p>
                            <pre className="whitespace-pre-wrap">{notionTestResult.guidance}</pre>
                          </div>
                        )}
                        {notionTestResult.details && (
                          <div className="mt-2 text-xs">
                            <p>詳細情報:</p>
                            <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(notionTestResult.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* OpenAI接続テストセクション */}
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">OpenAI API接続テスト</h3>
                  <Button onClick={handleTestOpenAIConnection} variant="outline" size="sm" disabled={isTestingOpenAI}>
                    {isTestingOpenAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        テスト中...
                      </>
                    ) : (
                      "接続テスト"
                    )}
                  </Button>
                </div>

                {openaiTestResult && (
                  <div
                    className={`p-3 rounded-md ${
                      openaiTestResult.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {openaiTestResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${openaiTestResult.success ? "text-green-800" : "text-red-800"}`}>
                        {openaiTestResult.success ? "接続成功" : "接続失敗"}
                      </span>
                    </div>

                    {openaiTestResult.success && openaiTestResult.data && (
                      <div className="text-sm text-green-700 space-y-1">
                        <p>✅ モデル: {openaiTestResult.data.model}</p>
                        <p>✅ APIキー: {openaiTestResult.data.keyInfo.prefix}... ({openaiTestResult.data.keyInfo.length}文字)</p>
                        <div className="bg-green-100 p-2 rounded mt-2">
                          <p className="font-medium">テスト応答:</p>
                          <p className="text-green-800">{openaiTestResult.data.testResponse}</p>
                        </div>
                      </div>
                    )}

                    {!openaiTestResult.success && (
                      <div className="text-sm text-red-700">
                        <p className="font-medium">エラー: {openaiTestResult.error}</p>
                        {openaiTestResult.guidance && (
                          <div className="mt-2 text-xs bg-red-100 p-2 rounded">
                            <p className="font-medium">解決のヒント:</p>
                            <pre className="whitespace-pre-wrap">{openaiTestResult.guidance}</pre>
                          </div>
                        )}
                        {openaiTestResult.details && (
                          <div className="mt-2 text-xs">
                            <p>詳細情報:</p>
                            <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(openaiTestResult.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI APIキー</Label>
                <Textarea id="openai-key" placeholder="sk-..." rows={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wordpress-url">WordPress URL</Label>
                <Textarea id="wordpress-url" placeholder="https://your-site.com" rows={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fal-ai-key">Fal AI APIキー</Label>
                <Textarea id="fal-ai-key" placeholder="sk-..." rows={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-adsense-client-id">Google AdSense クライアントID</Label>
                <Input id="google-adsense-client-id" placeholder="ca-pub-..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-adsense-slot-id">Google AdSense スロットID</Label>
                <Input id="google-adsense-slot-id" placeholder="1234567890" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adType">広告タイプ</Label>
                <select
                  id="adType"
                  value={adType}
                  onChange={(e) => setAdType(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="google">Google広告</option>
                  <option value="custom">カスタム広告</option>
                </select>
              </div>

              {adType === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customAdTag">広告タグ（HTML可）</Label>
                  <Textarea
                    id="customAdTag"
                    value={customAdTag}
                    onChange={(e) => setCustomAdTag(e.target.value)}
                    rows={4}
                    placeholder={`<script src="..."></script>`}
                  />
                  <p className="text-sm text-gray-500">挿入したい広告タグを入力してください。</p>
                </div>
              )}

              <Button className="w-full">設定を保存</Button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">過去の投稿履歴</h3>
                  <Button onClick={handleRefreshHistory} variant="outline" size="sm" disabled={isLoadingHistory}>
                    {isLoadingHistory ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        読み込み中...
                      </>
                    ) : (
                      "再読み込み"
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
                    <p className="font-medium">エラーが発生しました:</p>
                    <p>{error}</p>
                    <div className="mt-3 p-3 bg-blue-50 rounded-md text-blue-800">
                      <p className="font-medium">Notion API トークンの取得方法:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                        <li>
                          <a
                            href="https://www.notion.so/my-integrations"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Notion Integrations
                          </a>{" "}
                          にアクセス
                        </li>
                        <li>「New integration」をクリック</li>
                        <li>統合の名前を入力し、ワークスペースを選択</li>
                        <li>「Submit」をクリック</li>
                        <li>「Internal Integration Token」をコピー（secret_またはntn_で始まる長いトークン）</li>
                        <li>データベースページで「Share」→統合を選択してアクセス権を付与</li>
                      </ol>
                    </div>
                  </div>
                )}

                {isLoadingHistory ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">履歴を読み込み中...</p>
                  </div>
                ) : postHistory.length === 0 ? (
                  <p className="text-gray-500">まだ投稿履歴はありません。</p>
                ) : (
                  <>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      <ul className="space-y-2">
                        {postHistory.map((entry, index) => (
                          <li key={index} className="border-b pb-2 last:border-b-0">
                            <p className="font-medium">{entry.title}</p>
                            <p className="text-sm text-gray-600">トピック: {entry.topic}</p>
                            <p className="text-sm text-gray-600">
                              日時: {entry.date ? new Date(entry.date).toLocaleString() : "不明"}
                            </p>
                            {entry.url && (
                              <Link
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                記事を見る
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                    <Button variant="outline" onClick={handleClearHistory} className="w-full mt-4">
                      履歴をクリア
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Google品質評価機能の紹介 */}
      <div className="mt-12 w-full max-w-4xl">
        <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
              🎯 Google品質ガイドライン評価
            </CardTitle>
            <p className="text-red-700">
              Googleに嫌われない記事を書くための品質チェック機能
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-800">📊 8つのチェック項目</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">オリジナリティ（テンプレ感の回避）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">ユーザーへの有益性（検索意図との適合）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">剽窃・再構成の有無</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">キーワード詰め込みの回避</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">出典・根拠の提示</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">E-E-A-T（経験・専門性・権威性・信頼性）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">コンテンツの厚み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">自動投稿傾向の回避</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-800">✅ 3段階判定システム</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">OK</span>
                    </div>
                    <p className="text-sm text-green-700">品質基準をクリア</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">要改善</span>
                    </div>
                    <p className="text-sm text-yellow-700">改善の余地あり</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-800">NG</span>
                    </div>
                    <p className="text-sm text-red-700">重大な問題あり</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <Link href="/quality-evaluation?tab=google-quality">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  🎯 Google品質評価を始める
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
