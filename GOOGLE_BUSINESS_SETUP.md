# Google Business Profile API 連携設定ガイド

## ⚠️ 重要な注意事項

### OAuth2認証が必要
Google Business Profile API は**APIキーのみでは利用できません**。OAuth2認証が必要です。

**実際のAPIレスポンス**:
```json
{
  "error": {
    "code": 401,
    "message": "API keys are not supported by this API. Expected OAuth2 access token or other authentication credentials that assert a principal.",
    "status": "UNAUTHENTICATED"
  }
}
```

### 利用可能な認証方法
1. **OAuth 2.0 Client ID** - ユーザー承認が必要
2. **Service Account** - サービス間認証
3. **Access Token** - 短期間有効なトークン

### 推奨アプローチ
このシステムでは**デモモード**での動作確認を推奨します。実際の投稿には別途OAuth実装が必要です。

## Google Business Profile API の取得手順

### 1. Google Cloud Console にアクセス
- URL: https://console.cloud.google.com/
- Googleアカウントでログインしてください

### 2. 新しいプロジェクトを作成
1. **プロジェクト選択** → **新しいプロジェクト**
2. **プロジェクト名**: `SEO記事生成システム`
3. **作成**をクリック

### 3. Business Profile Performance API を有効化
1. **APIとサービス** → **ライブラリ**
2. **「My Business Business Information API」を検索**
3. **有効にする**をクリック
4. **「My Business Posts API」も同様に有効化**

### 4. 認証情報を作成
1. **APIとサービス** → **認証情報**
2. **認証情報を作成** → **APIキー**
3. **APIキーをコピー**
4. **APIキーを制限**（推奨）:
   - API制限: My Business APIs のみ許可

### 5. OAuth 2.0 設定（高度な機能用）
1. **OAuth同意画面**を設定
2. **認証情報** → **OAuth 2.0 クライアント ID**を作成
3. **ウェブアプリケーション**を選択

## 必要な情報

### 基本設定（APIキー方式）
```bash
GOOGLE_BUSINESS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 高度な設定（OAuth 2.0）
```bash
GOOGLE_CLIENT_ID=XXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_REDIRECT_URI=http://localhost:3005/auth/google/callback
```

## Google Business Profile 設定

### 1. ビジネスプロフィールの確認
1. **Google My Business** (https://business.google.com/) にアクセス
2. ビジネス情報が正しく設定されているか確認
3. **プロフィールID**をメモ（URLから取得可能）

### 2. 管理者権限の確認
- APIを使用するアカウントがビジネスプロフィールの管理者である必要があります

## API テスト方法

### 1. 接続テスト
```bash
curl -X POST http://localhost:3005/api/test-google-business-connection \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. 投稿テスト
```bash
curl -X POST http://localhost:3005/api/post-to-gbp \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🤖 AI記事を公開しました！新しいブログ記事をチェックしてください。",
    "callToAction": "LEARN_MORE",
    "callToActionUrl": "https://kai-techweb.com/"
  }'
```

## 投稿可能なコンテンツ

### 1. テキスト投稿
- 最大1,500文字
- ハッシュタグサポート
- 絵文字使用可能

### 2. コールトゥアクション
- `BOOK`: 予約
- `ORDER`: 注文
- `SHOP`: ショッピング
- `LEARN_MORE`: 詳細情報
- `SIGN_UP`: 登録

### 3. 画像投稿
- JPEG, PNG サポート
- 最大10MB
- 推奨サイズ: 1200x900px

## 投稿例

```json
{
  "summary": "🤖 AI記事を公開しました！",
  "content": "「NotionとWordPressを活用したコンテンツ管理術」について詳しく解説しています。\n\n✨ 主なポイント：\n• APIによる連携方法\n• 自動化のテクニック\n• 効率的なワークフロー\n\n#AI #WordPress #Notion #コンテンツ管理",
  "callToAction": "LEARN_MORE",
  "callToActionUrl": "https://kai-techweb.com/?p=1234"
}
```

## よくある問題

### 「API not enabled」エラー
- Google Cloud ConsoleでAPIが有効化されているか確認

### 「Authentication required」エラー
- APIキーが正しく設定されているか確認
- OAuth認証が必要な場合があります

### 「Access denied」エラー
- ビジネスプロフィールの管理者権限を確認
- プロフィールIDが正しいか確認

## 制限事項

### 投稿頻度
- 1日あたり最大5投稿（推奨）
- スパム防止のため適切な間隔をあけてください

### コンテンツ制限
- Google のコンテンツポリシーに準拠
- 商用利用の場合は利用規約を確認

## 注意事項

- APIキーは機密情報として管理
- ビジネス情報は正確に設定
- 投稿内容は企業ブランディングに配慮

## 現在の実装状況

### ✅ 完了済み
- Google Cloud Console プロジェクト作成
- 実際のAPIキー取得: `AIzaSyC4Dfi7_6GbF2xDn09txSXMjawz5U3aThM`
- My Business APIs の有効化
- API接続テストの実装

### ⚠️ 制限事項の確認
- **OAuth2認証が必要**: APIキーのみでは認証不可
- **ビジネスプロフィール管理者権限が必要**
- **Google Business Profile の事前設定が必要**

### 🔄 デモモードでの動作確認
現在のシステムはデモモードで正常に動作します：

```bash
# デモモード投稿テスト
curl -X POST http://localhost:3001/api/post-to-gbp \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🤖 AI記事を公開しました！新しいブログ記事をチェックしてください。",
    "callToAction": "LEARN_MORE",
    "callToActionUrl": "https://kai-techweb.com/"
  }'
```

### 🚀 本番環境での利用

実際のGoogle Business Profile投稿を行うには以下が必要：

1. **OAuth 2.0実装**
2. **Service Account の設定**
3. **ビジネスプロフィール管理者権限**
4. **Google Business Profile の事前登録**
