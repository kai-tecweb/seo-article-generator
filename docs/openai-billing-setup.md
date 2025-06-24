# OpenAI API 課金設定ガイド

## OpenAI APIの課金設定手順

### 1. OpenAI Platform にアクセス
1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. アカウントにログイン

### 2. 課金設定の確認
1. 右上のアカウントメニューから「Billing」を選択
2. 「Payment methods」で支払い方法を確認
3. 「Usage」で現在の使用量と残高を確認

### 3. 支払い方法の追加
1. 「Payment methods」タブを選択
2. 「Add payment method」をクリック
3. クレジットカード情報を入力

### 4. 使用制限の設定
1. 「Usage limits」タブを選択
2. 「Monthly budget」で月額予算を設定（例：$20）
3. 「Hard limit」にチェックを入れて予算オーバーを防止

### 5. APIキーの利用制限確認
1. 「API keys」ページでキーの利用制限を確認
2. 必要に応じて新しいAPIキーを生成

## トラブルシューティング

### エラー: "You exceeded your current quota"
- **原因**: 無料クレジットの使い切りまたは課金設定未完了
- **解決**: 上記手順で課金設定を完了

### エラー: "Invalid API key"
- **原因**: APIキーが無効または削除済み
- **解決**: 新しいAPIキーを生成

### エラー: "Rate limit exceeded"
- **原因**: APIの利用制限に達している
- **解決**: 時間をおいて再試行またはプランのアップグレード

## 料金体系（2024年現在）

### GPT-4o
- **入力**: $2.50 / 1M tokens
- **出力**: $10.00 / 1M tokens

### GPT-4o-mini
- **入力**: $0.15 / 1M tokens
- **出力**: $0.60 / 1M tokens

### GPT-3.5 Turbo
- **入力**: $0.50 / 1M tokens
- **出力**: $1.50 / 1M tokens

## 推奨設定

### 開発環境
- 月額予算: $10-20
- モデル: GPT-4o-mini（コスト効率重視）
- Hard limit: 有効

### 本番環境
- 月額予算: $50-100
- モデル: GPT-4o（品質重視）
- Hard limit: 有効
