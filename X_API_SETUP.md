# X (Twitter) API連携設定ガイド

## X API v2 の取得手順

### 1. X Developer Portal にアクセス
- URL: https://developer.x.com/
- Xアカウントでログインしてください

### 2. 新しいアプリを作成
1. **「Dashboard」にアクセス**
2. **「+ Create App」をクリック**
3. **アプリ情報を入力**：
   - App name: `SEO記事生成システム`
   - Use case: `Building tools for myself or my organization`
   - Description: `AI技術を活用したSEO記事の自動生成・投稿システム`

### 3. API Keys & Tokensを取得
1. **「Keys and tokens」タブを選択**
2. **必要なキーを生成・取得**：
   - **API Key** (Consumer Key)
   - **API Key Secret** (Consumer Secret)
   - **Access Token**
   - **Access Token Secret**

### 4. API v2 アクセス権限の確認
1. **「App permissions」で権限を確認**
   - Read and Write が有効になっているか確認
2. **必要に応じて権限を更新**

## 必要な情報

以下の4つの情報を取得してください：

1. **TWITTER_API_KEY**: `XXXXXXXXXXXXXXXXXXXXXXXXX`
2. **TWITTER_API_SECRET**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
3. **TWITTER_ACCESS_TOKEN**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
4. **TWITTER_ACCESS_TOKEN_SECRET**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

## 設定完了後のテスト

APIキーを取得したら、以下のコマンドでテストできます：

```bash
curl -X POST http://localhost:3005/api/test-x-connection \
  -H "Content-Type: application/json" \
  -d '{}'
```

## X API の制限事項

### Basic Plan（無料）
- **月間投稿数**: 1,500投稿
- **API呼び出し**: 月間10,000回
- **レート制限**: 15分間に50投稿

### Pro Plan
- より多くの投稿・API呼び出しが可能
- 高度な機能にアクセス可能

## 投稿例

生成された記事の要約をXに自動投稿：

```
🤖 AI記事を公開しました！

「NotionとWordPressを活用したコンテンツ管理術」

✨ 主なポイント：
• APIによる連携方法
• Zapierを使った自動化
• 効率的なワークフロー構築

#Notion #WordPress #AI #コンテンツ管理

👉 詳細はこちら: https://kai-techweb.com/?p=1234
```

## よくある問題

### 「Forbidden」エラー
- API権限の設定を確認
- Read and Write 権限が有効か確認

### 「Unauthorized」エラー
- APIキーが正しく設定されているか確認
- Access Tokenが有効か確認

### 「Rate limit exceeded」エラー
- 投稿頻度を調整
- 15分間に50投稿の制限を超えていないか確認

## 注意事項

- APIキーは機密情報です
- 投稿内容はXの利用規約に準拠してください
- 自動投稿の頻度は適切に設定してください
