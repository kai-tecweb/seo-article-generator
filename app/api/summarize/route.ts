import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== 記事要約機能開始 ===")

    const { 
      articleContent,
      summaryType = "comprehensive", 
      language = "japanese",
      targetLength = 200,
      includeKeyPoints = true,
      includeSnsPost = true
    } = await req.json()

    if (!articleContent) {
      return NextResponse.json({ 
        error: "記事本文が提供されていません。" 
      }, { status: 400 })
    }

    console.log("要約パラメータ:")
    console.log("- コンテンツ長:", articleContent.length)
    console.log("- 要約タイプ:", summaryType)
    console.log("- 言語:", language)
    console.log("- 目標文字数:", targetLength)
    console.log("- キーポイント含む:", includeKeyPoints)
    console.log("- SNS投稿例含む:", includeSnsPost)

    // 要約タイプに応じたシステムプロンプト設定
    let systemPrompt = ""
    
    switch (summaryType) {
      case "short":
        systemPrompt = `あなたはプロのコンテンツエディターです。提供された記事を簡潔に要約してください。

出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事の簡潔な要約（${targetLength}文字以内）
- "keyPoints": 主要なポイント3つの配列（各ポイントは短く）
${includeSnsPost ? '- "snsPost": SNS投稿例（140文字程度、ハッシュタグ含む）' : ''}`
        break

      case "detailed":
        systemPrompt = `あなたはプロのコンテンツエディターです。提供された記事を詳細に要約してください。

出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事の詳細な要約（${targetLength}文字程度）
- "keyPoints": 主要なポイント5-7つの配列
- "structure": 記事の構造概要
${includeSnsPost ? '- "snsPost": SNS投稿例（140文字程度、ハッシュタグ含む）' : ''}`
        break

      case "bullet_points":
        systemPrompt = `あなたはプロのコンテンツエディターです。提供された記事を箇条書きで要約してください。

出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事の概要（100文字程度）
- "bulletPoints": 主要内容の箇条書き配列（8-10項目）
${includeSnsPost ? '- "snsPost": SNS投稿例（140文字程度、ハッシュタグ含む）' : ''}`
        break

      case "executive":
        systemPrompt = `あなたはビジネス向けのエグゼクティブサマリー専門家です。提供された記事をビジネス目線で要約してください。

出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": エグゼクティブサマリー（${targetLength}文字程度）
- "businessValue": ビジネス価値・影響（配列）
- "actionItems": 推奨アクション（配列）
${includeSnsPost ? '- "snsPost": ビジネス向けSNS投稿例（LinkedIn想定）' : ''}`
        break

      default: // comprehensive
        systemPrompt = `あなたはプロのコンテンツエディターです。提供された記事から包括的な要約を生成してください。

出力は必ずJSON形式で行い、以下のプロパティを含めてください:
- "summary": 記事の要約（${targetLength}文字程度、簡潔に）
- "highlights": 記事の主要なポイントを3-5つの箇条書き配列で
${includeSnsPost ? '- "snsPost": SNS（X/Twitter）投稿例テキスト（ハッシュタグ含め、140文字程度で魅力的に）' : ''}
- "tags": 関連タグ（配列、5-8個）
- "readingTime": 推定読了時間（分）`
    }

    // 言語設定の追加
    const languageInstruction = language === "japanese" 
      ? "\n\n全ての出力は自然な日本語で行ってください。専門用語は適切に説明を加えてください。"
      : "\n\nGenerate all outputs in natural English. Provide appropriate explanations for technical terms."

    const fullSystemPrompt = systemPrompt + languageInstruction

    console.log("AI要約生成中...")

    // AIによる高機能要約・分析の生成
    const { text: generatedOutput } = await generateText({
      model: openai("gpt-4"),
      system: fullSystemPrompt,
      prompt: `以下の記事本文を分析して要約してください:\n\n${articleContent}`,
      maxTokens: 1500,
      temperature: 0.3, // 要約では一貫性を重視
    })

    console.log("AI出力受信完了")

    // 生成されたJSON文字列をパース
    let parsedOutput: any
    try {
      parsedOutput = JSON.parse(generatedOutput)
    } catch (parseError) {
      console.error("AI生成出力のJSONパースエラー:", parseError)
      console.log("生の出力:", generatedOutput)
      
      // JSONパースに失敗した場合のフォールバック処理
      return NextResponse.json(
        {
          success: false,
          error: "AIからの出力形式が不正です。再試行してください。",
          rawOutput: generatedOutput.substring(0, 500) + "...", // デバッグ用
          guidance: "出力がJSON形式でない可能性があります。"
        },
        { status: 500 },
      )
    }

    // 基本的な必要プロパティが揃っているか確認
    if (!parsedOutput.summary) {
      return NextResponse.json(
        {
          success: false,
          error: "要約情報が生成されませんでした。再試行してください。",
          parsedOutput: parsedOutput, // デバッグ用
          guidance: "AIが要約を生成できませんでした。記事内容を確認してください。"
        },
        { status: 500 },
      )
    }

    // 要約分析データの追加
    const analysisData = {
      originalLength: articleContent.length,
      summaryLength: parsedOutput.summary.length,
      compressionRatio: Math.round((1 - parsedOutput.summary.length / articleContent.length) * 100),
      summaryType,
      language,
      targetLength,
      estimatedReadingTime: Math.ceil(articleContent.length / 400), // 400文字/分で計算
      generatedAt: new Date().toISOString()
    }

    console.log("要約完了:")
    console.log("- 元文字数:", analysisData.originalLength)
    console.log("- 要約文字数:", analysisData.summaryLength)
    console.log("- 圧縮率:", analysisData.compressionRatio + "%")
    console.log("- 推定読了時間:", analysisData.estimatedReadingTime + "分")

    return NextResponse.json({
      success: true,
      ...parsedOutput,
      analysis: analysisData,
      metadata: {
        model: "gpt-4",
        summaryType,
        generatedAt: analysisData.generatedAt,
        processingTime: "約3-8秒"
      }
    })
  } catch (error: any) {
    console.error("=== 記事要約エラー ===")
    console.error("エラー詳細:", error)

    // 詳細なエラー処理
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI APIの使用量制限に達しました。",
          guidance: "APIキーの使用量を確認するか、課金設定を見直してください。"
        },
        { status: 429 }
      )
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI APIキーが無効です。",
          guidance: "APIキーが正しく設定されているか確認してください。"
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "要約の生成中にエラーが発生しました。",
        guidance: `記事要約処理に失敗しました。

よくあるエラー:
- コンテンツが長すぎる: 記事の長さを確認してください（推奨: 10,000文字以内）
- APIキーエラー: OpenAI APIキーの設定を確認してください
- ネットワークエラー: インターネット接続を確認してください
- 使用量制限: OpenAI APIの使用量制限を確認してください

推奨解決方法:
1. 記事内容を短縮してみる
2. APIキーの設定を再確認
3. しばらく待ってから再試行`
      },
      { status: 500 }
    )
  }
}
