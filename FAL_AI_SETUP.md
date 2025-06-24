# Fal AI画像生成 設定ガイド

## Fal AI APIとは

Fal AIは高速で高品質なAI画像生成サービスです。FLUX, Stable Diffusion等の最新モデルを使用して、記事のアイキャッチ画像やSNS投稿用画像を自動生成できます。

## 🔑 Fal AI APIキーの取得手順

### 1. Fal AIアカウントの作成
- URL: https://fal.ai/
- **「Sign up」でアカウント作成**
- Googleアカウントまたはメールアドレスで登録

### 2. APIキーの生成
1. **ダッシュボードにログイン**: https://fal.ai/dashboard
2. **「API Keys」セクションに移動**
3. **「Generate new key」をクリック**
4. **キー名を入力**（例：「SEO記事生成システム」）
5. **生成されたAPIキーをコピー**
   - 形式: `fal_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. 環境変数の設定
.env.localファイルに以下を追加：
```bash
FAL_AI_API_KEY=fal_your_actual_api_key_here
```

## 🖼️ 現在の実装状況

### ✅ 完了済み機能
- **画像生成API** (`/api/generate-image`)
- **複数スタイル対応** (professional, creative, minimal, tech, business, casual)
- **複数サイズ対応** (square, landscape, portrait, wide, tall)
- **用途別プロンプト** (article, social, banner, icon)
- **デモモード動作** (Fal AI APIキー未設定時)
- **エラーハンドリング** (フォールバック機能)

### 🎨 利用可能な画像スタイル

| スタイル | 特徴 | 用途 |
|---------|------|------|
| **professional** | プロフェッショナル、クリーン、モダン | ビジネス記事、企業サイト |
| **creative** | クリエイティブ、芸術的、カラフル | SNS投稿、ブログ記事 |
| **minimal** | ミニマル、シンプル、エレガント | デザイン記事、UI/UX |
| **tech** | テクノロジー、デジタル、未来的 | IT記事、技術ブログ |
| **business** | ビジネス、企業的、洗練された | 企業記事、レポート |
| **casual** | カジュアル、フレンドリー、親しみやすい | 日常ブログ、個人記事 |

### 📏 利用可能な画像サイズ

| サイズ | 実際の解像度 | 用途 |
|-------|-------------|------|
| **square** | 1024x1024 | SNS投稿、プロフィール画像 |
| **landscape** | 1024x768 | 記事アイキャッチ、ブログヘッダー |
| **portrait** | 768x1024 | スマートフォン表示、縦型記事 |
| **wide** | 1344x768 | ウェブサイトバナー、ヘッダー |
| **tall** | 768x1344 | 縦長バナー、サイドバー |

## 🚀 API使用例

### 基本的な画像生成
```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI技術を活用したコンテンツマーケティング",
    "style": "professional",
    "size": "landscape",
    "imageType": "article"
  }'
```

### カスタムプロンプトでの生成
```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic office with AI robots working on content creation, modern, bright, detailed",
    "style": "tech",
    "size": "wide"
  }'
```

### SNS用画像の生成
```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "ブログ記事のSEO最適化",
    "style": "creative",
    "size": "square",
    "imageType": "social",
    "keywords": ["SEO", "ブログ", "マーケティング"]
  }'
```

### 全スタイルテストの実行
```bash
curl -X POST http://localhost:3001/api/test-image-generation \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "all",
    "topic": "AI記事生成システム"
  }'
```

## 💰 Fal AI料金について

### 料金体系
- **従量課金制**: 生成した画像枚数に応じて課金
- **FLUX Schnell**: 約$0.003/枚（高速生成）
- **FLUX Dev**: 約$0.03/枚（高品質）
- **FLUX Pro**: 約$0.05/枚（最高品質）

### 無料利用
- **新規ユーザー**: 初回クレジット付与あり
- **月間制限**: 一定枚数まで無料

## 🔧 現在の実装詳細

### デモモード（APIキー未設定時）
```json
{
  "success": true,
  "imageUrl": "/placeholder.jpg",
  "imageId": "demo_1640995200000",
  "message": "AI画像生成が完了しました（デモモード）",
  "metadata": {
    "mode": "demo",
    "promptUsed": "A professional article header image about AI技術...",
    "generatedAt": "2025-06-23T11:00:00.000Z"
  }
}
```

### 本番モード（APIキー設定済み）
```json
{
  "success": true,
  "imageUrl": "https://fal.media/files/xyz123.jpg",
  "imageId": "req_abc123def456",
  "message": "AI画像生成が完了しました",
  "metadata": {
    "mode": "production",
    "model": "flux-schnell",
    "dimensions": "landscape_4_3",
    "promptUsed": "A professional article header image...",
    "processingTime": "約3-8秒"
  }
}
```

## ⚠️ 注意事項

### コンテンツポリシー
- **適切な内容**: 暴力、成人向けコンテンツは生成不可
- **著作権配慮**: 特定のキャラクターや商標の使用禁止
- **品質確認**: 生成画像の内容を使用前に確認

### 技術的制限
- **生成時間**: 通常3-8秒（モデルにより異なる）
- **同時リクエスト**: 制限あり（プランにより異なる）
- **画像サイズ**: 最大解像度はモデルにより制限

## 🔄 統合ワークフローでの活用

### 記事生成→画像生成の流れ
1. **AI記事生成** - OpenAI APIで記事作成
2. **記事要約** - 記事の要約生成
3. **画像生成** - 記事内容に基づいた画像生成
4. **WordPress投稿** - 記事と画像をセットで投稿
5. **SNS投稿** - 生成画像をSNS用に活用

### 次のステップ
1. **実際のFal AI APIキー取得**
2. **本番画像生成のテスト**
3. **統合ワークフローでの画像生成組み込み**
4. **生成画像の自動保存機能**

## 📞 サポート

### よくある問題
- **「unauthorized」エラー**: APIキーが正しく設定されているか確認
- **「quota exceeded」エラー**: 使用量制限を確認、プランのアップグレード検討
- **「content filtered」エラー**: プロンプト内容がポリシーに適合するか確認

### ヘルプリソース
- **Fal AI Documentation**: https://fal.ai/docs
- **Fal AI Discord**: コミュニティサポート
- **Fal AI Support**: support@fal.ai
