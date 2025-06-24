# 🚀 開発者クイックリファレンス

## ⚡ 緊急コマンド

### 🆘 緊急バックアップ（VS Codeクラッシュ時）
```bash
git add . && git commit -m "🆘 緊急バックアップ" && git push
```

### 🔄 プロジェクト初期化（新環境）
```bash
git clone https://github.com/your-username/seo-article-generator-nextjs-backup.git
cd seo-article-generator-nextjs-backup
pnpm install
cp .env.example .env.local
pnpm dev
```

### 🧪 テスト実行
```bash
pnpm test:all           # 全テスト
pnpm test              # ユニットテスト
pnpm test:e2e          # E2Eテスト
pnpm test:coverage     # カバレッジ
```

---

## 📋 日次開発チェックリスト

### 🌅 開発開始時
- [ ] `git pull origin develop` - 最新コードを取得
- [ ] `pnpm install` - 依存関係更新確認
- [ ] `pnpm dev` - 開発サーバー起動
- [ ] バックアップ状況確認: `tail -5 backup.log`
- [ ] 未解決Issues確認

### 🛠️ 開発中
- [ ] 機能追加前にブランチ作成: `git checkout -b feature/new-feature`
- [ ] こまめなコミット（15-30分間隔）
- [ ] コミットメッセージ規約遵守: `✨ feat: 新機能の説明`
- [ ] TypeScript型チェック: `pnpm type-check`
- [ ] ESLint警告解消: `pnpm lint`

### 🌙 開発終了時
- [ ] 全変更をコミット: `git add . && git commit -m "..."`
- [ ] 開発ブランチプッシュ: `git push origin feature/branch-name`
- [ ] テスト実行確認: `pnpm test:api`
- [ ] 明日のタスク整理
- [ ] バックアップ確認: 最新コミットがpushされているか

---

## 🔧 よく使うコマンド集

### Git操作
```bash
# ブランチ操作
git checkout -b feature/new-feature    # 新ブランチ作成・切り替え
git branch -d feature/old-feature      # ブランチ削除
git merge develop                      # developブランチをマージ

# リモート操作  
git fetch origin                       # リモート最新化
git push origin feature/branch-name    # ブランチプッシュ
git pull origin develop               # プル（マージ込み）

# 履歴確認
git log --oneline -10                  # 最新10コミット
git status                            # 変更状況確認
git diff                              # 変更差分確認

# 緊急復旧
git checkout develop                   # developに戻る
git reset --hard origin/develop       # リモートに完全同期
git clean -fd                         # 未追跡ファイル削除
```

### パッケージ管理
```bash
# 依存関係管理
pnpm install                          # パッケージインストール
pnpm add package-name                 # 本番依存関係追加
pnpm add -D package-name              # 開発依存関係追加
pnpm remove package-name              # パッケージ削除
pnpm update                           # 全パッケージ更新

# プロジェクト管理
pnpm clean                            # .next, dist クリア
pnpm build                            # 本番ビルド
pnpm start                            # 本番モード起動
pnpm analyze                          # バンドルサイズ分析
```

### 開発・デバッグ
```bash
# 開発サーバー
pnpm dev                              # 開発モード起動
pnpm dev --port 3001                  # ポート指定起動

# コード品質
pnpm lint                             # ESLintチェック
pnpm lint --fix                       # ESLint自動修正
pnpm type-check                       # TypeScript型チェック
pnpm format                           # Prettierフォーマット
pnpm format:check                     # フォーマットチェック

# テスト
pnpm test                             # Jestテスト
pnpm test:watch                       # Jestウォッチモード
pnpm test:coverage                    # カバレッジレポート
pnpm test:e2e                         # Playwrightテスト
pnpm test:e2e:ui                      # Playwright UIモード
```

---

## 🐛 トラブルシューティング

### よくあるエラーと解決方法

#### 1. Next.js ビルドエラー
```bash
# エラー: Type errors found
pnpm type-check                       # 型エラー詳細確認
# → TypeScriptエラーを修正してからビルド
```

#### 2. ESLint エラー
```bash
# エラー: Linting errors found
pnpm lint                             # エラー詳細確認
pnpm lint --fix                       # 自動修正可能なエラーを修正
```

#### 3. パッケージインストールエラー
```bash
# node_modules削除・再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 4. ポートエラー（開発サーバー）
```bash
# ポート3000が使用中の場合
lsof -ti:3000 | xargs kill -9        # プロセス強制終了
pnpm dev --port 3001                 # 別ポートで起動
```

#### 5. Git conflict
```bash
# マージコンフリクト解決
git status                            # コンフリクトファイル確認
# → エディタでコンフリクト手動解決
git add .                             # 解決済みファイルをステージ
git commit -m "🔧 コンフリクト解決"
```

#### 6. 環境変数エラー
```bash
# .env.local 確認
cat .env.local                        # 環境変数確認
cp .env.example .env.local            # テンプレートからコピー
# → 必要なAPIキーを設定
```

---

## 📊 プロジェクト状況確認

### ヘルスチェック
```bash
# システム全体チェック
./scripts/health-check.sh             # 総合ヘルスチェック（作成予定）

# 個別チェック
pnpm type-check                       # TypeScript
pnpm lint                             # ESLint  
pnpm test:api                         # API テスト
git status                            # Git状況
tail -10 backup.log                   # バックアップ状況
```

### バックアップ状況確認
```bash
# 最新バックアップ確認
git log --oneline -5                  # 最新コミット
git branch -r | grep auto-backup      # 自動バックアップブランチ
crontab -l                            # Cron設定確認
tail -20 backup.log                   # バックアップログ
```

---

## 🎯 フィーチャー別コマンド

### Googleトレンド機能
```bash
# CSVテストデータで動作確認
curl -X POST http://localhost:3000/api/google-trends/upload-csv \
  -F "file=@trending_JP_7d_20250624-1002.csv" \
  -F "keyword=人工知能"

# 型定義確認
cat types/google-trends.ts

# コンポーネントテスト
pnpm test components/google-trends-csv-uploader.test.tsx
```

### 記事生成機能
```bash
# 記事生成テスト
curl -X POST http://localhost:3000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{"keyword": "AI技術", "wordCount": 1000}'

# 品質評価テスト
curl -X POST http://localhost:3000/api/quality-evaluation \
  -H "Content-Type: application/json" \
  -d '{"content": "記事内容..."}'
```

### WordPress投稿機能
```bash
# WordPress接続テスト
curl -X GET http://localhost:3000/api/test-wordpress-connection

# 投稿テスト
curl -X POST http://localhost:3000/api/post-to-wordpress \
  -H "Content-Type: application/json" \
  -d '{"title": "テスト記事", "content": "内容..."}'
```

---

## 📚 リファレンスリンク

### 技術ドキュメント
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### AI・API
- [OpenAI API](https://platform.openai.com/docs)
- [Fal AI](https://fal.ai/docs)
- [Notion API](https://developers.notion.com)
- [WordPress REST API](https://developer.wordpress.org/rest-api)

### テスト・品質
- [Jest](https://jestjs.io/docs)
- [Playwright](https://playwright.dev/docs)
- [ESLint](https://eslint.org/docs)
- [Prettier](https://prettier.io/docs)

---

## 🔗 プロジェクト内重要ファイル

### 設定ファイル
- `package.json` - プロジェクト設定・スクリプト
- `next.config.mjs` - Next.js設定
- `tailwind.config.ts` - TailwindCSS設定
- `tsconfig.json` - TypeScript設定
- `.eslintrc.json` - ESLint設定
- `.prettierrc` - Prettier設定

### 開発ツール
- `scripts/auto-backup.sh` - 自動バックアップスクリプト
- `scripts/setup-backup-cron.sh` - バックアップ設定
- `jest.config.js` - Jestテスト設定
- `playwright.config.ts` - Playwrightテスト設定

### ドキュメント
- `docs/COMPREHENSIVE_DEVELOPMENT_GUIDELINES.md` - 総合開発指針
- `docs/BACKUP_STRATEGY.md` - バックアップ戦略
- `TESTING_STRATEGY.md` - テスト戦略
- `README.md` - プロジェクト概要

---

## 🎉 成功の指標

### 日次目標
- [ ] バックアップエラー 0件
- [ ] TypeScriptエラー 0件
- [ ] ESLintエラー 0件
- [ ] テスト失敗 0件
- [ ] 新機能1つ以上の進捗

### 週次目標  
- [ ] 新機能完成・テスト完了
- [ ] ドキュメント更新
- [ ] パフォーマンス改善1つ以上
- [ ] セキュリティチェック完了
- [ ] 技術負債解消1つ以上

---

**💡 このクイックリファレンスをブックマークして、開発効率を最大化しましょう！**
