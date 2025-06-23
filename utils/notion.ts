import { Client } from "@notionhq/client"

export async function fetchNotionHistory() {
  const notionApiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  // デバッグ用のログ出力
  console.log("Environment variables check:")
  console.log("NOTION_API_KEY exists:", !!notionApiKey)
  console.log("NOTION_DATABASE_ID exists:", !!databaseId)
  console.log("NOTION_API_KEY length:", notionApiKey?.length || 0)
  console.log("NOTION_DATABASE_ID length:", databaseId?.length || 0)

  if (!notionApiKey || !databaseId) {
    const errorMessage = `Notion APIキーまたはデータベースIDが未設定です。API Key: ${!!notionApiKey}, Database ID: ${!!databaseId}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Notion APIトークンの形式を検証
  const isValidToken = notionApiKey.startsWith("secret_") || notionApiKey.startsWith("ntn_")

  if (!isValidToken) {
    throw new Error(
      `無効なNotion APIトークン形式です。正しいトークンは 'secret_' または 'ntn_' で始まる必要があります。

現在のトークン: ${notionApiKey.substring(0, 15)}...

正しいトークンの取得方法:
1. https://www.notion.so/my-integrations にアクセス
2. 「New integration」をクリック
3. 統合名を入力してワークスペースを選択
4. 「Submit」をクリック
5. 「Internal Integration Token」をコピー
6. データベースページで「Share」→統合を選択してアクセス権を付与`,
    )
  }

  if (notionApiKey.length < 30) {
    throw new Error(
      `Notion APIトークンが短すぎます。正しいトークンは通常30文字以上です。現在の長さ: ${notionApiKey.length}文字`,
    )
  }

  try {
    // Notionクライアントを関数内で初期化
    const notion = new Client({ auth: notionApiKey })

    console.log("Querying Notion database...")

    // まずデータベース情報を取得してアクセス権限を確認
    try {
      const databaseInfo = await notion.databases.retrieve({ database_id: databaseId })
      console.log("Database retrieved successfully:", databaseInfo.title)
    } catch (dbError: any) {
      console.error("Database retrieval error:", dbError)
      if (dbError.code === "object_not_found") {
        throw new Error(`指定されたNotionデータベースが見つからないか、アクセス権限がありません。

データベースID: ${databaseId}

解決方法:
1. データベースIDが正しいか確認してください
2. データベースページで「Share」をクリック
3. 作成した統合を選択してアクセス権を付与してください
4. データベースIDはURLの最後の部分です（例: notion.so/your-database-id）`)
      }
      throw dbError
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "投稿日", direction: "descending" }],
      page_size: 20,
    })

    console.log("Notion query successful, results count:", response.results.length)

    const entries = response.results.map((page: any) => {
      const properties = page.properties
      return {
        title: properties["タイトル"]?.title?.[0]?.plain_text || "(無題)",
        topic: properties["トピック"]?.rich_text?.[0]?.plain_text || "",
        url: properties["URL"]?.url || "",
        date: properties["投稿日"]?.date?.start || new Date().toISOString(),
      }
    })

    return entries
  } catch (error: any) {
    console.error("Notion API error:", error)

    // より具体的なエラーメッセージを提供
    if (error.code === "unauthorized") {
      throw new Error(`Notion APIトークンが無効です。

エラーコード: ${error.code}
現在のトークン形式: ${notionApiKey.substring(0, 15)}...

解決方法:
1. https://www.notion.so/my-integrations で新しい統合を作成
2. 「Internal Integration Token」をコピー（secret_ または ntn_ で始まる）
3. 環境変数 NOTION_API_KEY に設定
4. データベースに統合のアクセス権を付与`)
    }

    if (error.code === "object_not_found") {
      throw new Error(`指定されたNotionデータベースが見つかりません。

データベースID: ${databaseId}
エラーコード: ${error.code}

解決方法:
1. データベースIDが正しいか確認
2. データベースに統合のアクセス権を付与
3. データベースが削除されていないか確認`)
    }

    if (error.code === "validation_error") {
      throw new Error(`Notion APIリクエストの形式が無効です。

エラーコード: ${error.code}
詳細: ${error.message}

データベースのプロパティ設定を確認してください:
- タイトル（title型）
- トピック（rich_text型）
- URL（url型）
- 投稿日（date型）`)
    }

    // その他のエラー
    throw new Error(`Notion履歴の取得中にエラーが発生しました。

エラーコード: ${error.code || "不明"}
エラーメッセージ: ${error.message || "不明なエラー"}

トークン形式: ${notionApiKey.substring(0, 15)}...
データベースID: ${databaseId}`)
  }
}
