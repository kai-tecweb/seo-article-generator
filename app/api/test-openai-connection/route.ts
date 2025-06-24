import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST() {
  try {
    console.log("=== OpenAI API接続テスト開始 ===")

    // 環境変数の確認
    const apiKey = process.env.OPENAI_API_KEY
    console.log("OpenAI API Key存在:", !!apiKey)
    console.log("OpenAI API Key長さ:", apiKey?.length || 0)
    console.log("OpenAI API Key開始文字:", apiKey?.substring(0, 7) || "なし")

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI APIキーが設定されていません",
          guidance: `OpenAI APIキーを設定してください:

1. https://platform.openai.com/api-keys にアクセス
2. 「Create new secret key」をクリック
3. キー名を入力して「Create secret key」をクリック  
4. 生成されたキー（sk-から始まる）を.env.localファイルに設定:
   OPENAI_API_KEY=sk-your-key-here

注意: APIキーは課金が発生する可能性があります。`,
        },
        { status: 400 },
      )
    }

    // APIキー形式の検証
    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json(
        {
          success: false,
          error: "無効なAPIキー形式",
          details: {
            keyPrefix: apiKey.substring(0, 7),
            expectedPrefix: "sk-",
            keyLength: apiKey.length,
          },
          guidance: "OpenAI APIキーは'sk-'で始まる必要があります。",
        },
        { status: 400 },
      )
    }

    console.log("APIキー形式チェック: OK")

    // シンプルなテストクエリを実行
    console.log("OpenAI APIテストクエリ実行中...")
    
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: "こんにちは！これはAPIテストです。簡潔に挨拶を返してください。",
      maxTokens: 50,
    })

    console.log("OpenAI API応答:", text)
    console.log("=== OpenAI API接続テスト成功 ===")

    return NextResponse.json({
      success: true,
      message: "OpenAI API接続に成功しました",
      data: {
        testResponse: text,
        model: "gpt-3.5-turbo",
        apiKeyValid: true,
        keyInfo: {
          prefix: apiKey.substring(0, 7),
          length: apiKey.length,
        },
      },
    })

  } catch (error: any) {
    console.error("=== OpenAI API接続テスト失敗 ===")
    console.error("エラー詳細:", error)

    let errorMessage = "不明なエラーが発生しました"
    let guidance = "エラー詳細を確認してください。"

    if (error.message?.includes("Invalid API key")) {
      errorMessage = "無効なAPIキーです"
      guidance = "APIキーが正しく設定されているか確認してください。"
    } else if (error.message?.includes("insufficient_quota")) {
      errorMessage = "APIクォータが不足しています"
      guidance = "OpenAIアカウントの使用量制限に達しています。課金設定を確認してください。"
    } else if (error.message?.includes("rate_limit")) {
      errorMessage = "レート制限に達しました"
      guidance = "しばらく待ってから再度お試しください。"
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: {
          errorType: error.constructor.name,
          errorMessage: error.message,
          errorCode: error.code,
        },
        guidance,
      },
      { status: 500 },
    )
  }
}
