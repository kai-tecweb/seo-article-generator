# OpenAI APIキー設定手順

## 新しいAPIキーの取得

1. **OpenAI Platformにアクセス**
   - URL: https://platform.openai.com/api-keys
   - OpenAIアカウントでログインしてください

2. **新しいAPIキーを作成**
   - 「Create new secret key」ボタンをクリック
   - キー名を入力（例：「SEO記事生成システム - 開発環境」）
   - 「Create secret key」ボタンをクリック

3. **APIキーをコピー**
   - 生成されたキー（sk-から始まる文字列）を全てコピー
   - ⚠️ このキーは一度しか表示されないため、必ずコピーしてください

4. **環境変数ファイルを更新**
   ```bash
   # .env.localファイルの以下の行を更新
   OPENAI_API_KEY=ここに新しいAPIキーを貼り付け
   ```

5. **接続テストを実行**
   - 開発サーバーを再起動: `npm run dev`
   - ブラウザで http://localhost:3001 にアクセス
   - 「OpenAI接続テスト」ボタンをクリック

## 注意事項

- APIキーは機密情報です。GitHubなどにコミットしないよう注意してください
- 使用量に応じて課金されますので、不要な使用は避けてください
- 開発用と本番用で異なるキーを使用することを推奨します

## トラブルシューティング

### 「Incorrect API key provided」エラー
- APIキーが正しくコピーされているか確認
- 余分なスペースや改行が含まれていないか確認
- 新しいAPIキーを生成し直してください

### 接続エラー
- インターネット接続を確認
- OpenAI APIの状況を確認: https://status.openai.com/

## 現在の状況
- 現在のAPIキーは無効です
- 新しいAPIキーの生成が必要です
