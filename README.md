# SEO 記事生成システム

Laravel 12 + Next.js + MySQL + Laravel Sail で構築された SEO 記事生成システムです。

## 🚀 機能

- **AI 記事生成**: OpenAI GPT-4、Claude、Gemini との連携
- **静的 HTML 生成**: SEO 最適化された HTML ファイルの生成
- **コンテンツ管理**: 記事、カテゴリ、タグの管理
- **SEO 最適化**: メタデータ、構造化データ、サイトマップ生成
- **ファイル管理**: HTML ファイルの出力とデプロイ管理

## 📋 必要な環境

- Docker & Docker Compose
- PHP 8.3+
- Node.js 18+
- Composer
- npm/yarn

## 🛠 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd make-seo
```

### 2. バックエンド（Laravel）の起動

```bash
cd backend
./vendor/bin/sail up -d
```

### 3. フロントエンド（Next.js）の起動

```bash
cd frontend
npm run dev
```

### 4. VSCode タスクの使用

VS Code で以下のタスクを利用できます：

- **Laravel: Start Sail**: Docker コンテナを起動
- **Next.js: Start Dev Server**: Next.js 開発サーバーを起動
- **Laravel: Stop Sail**: Docker コンテナを停止
- **Laravel: Artisan Migrate**: データベースマイグレーション
- **Laravel: Artisan Seed**: シードデータの投入

## 📁 ディレクトリ構造

```
make-seo/
├── backend/              # Laravel 12 プロジェクト
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/   # API コントローラー
│   │   ├── Models/       # Eloquent モデル
│   │   └── Services/     # ビジネスロジック
│   ├── database/
│   │   ├── migrations/   # データベース マイグレーション
│   │   └── seeders/      # シードデータ
│   └── routes/
│       └── api.php       # API ルート
├── frontend/             # Next.js プロジェクト
│   ├── src/
│   │   ├── app/          # App Router
│   │   ├── components/   # React コンポーネント
│   │   └── lib/          # ユーティリティ
│   └── public/           # 静的ファイル
├── docs/                 # システム文書
└── .vscode/              # VS Code 設定
```

## 🔧 主要な技術スタック

### バックエンド

- **Laravel 12**: PHP フレームワーク
- **MySQL 8.0**: データベース
- **Redis**: キャッシュ・セッション
- **Laravel Sail**: Docker 開発環境
- **L5 Swagger**: API 文書化

### フロントエンド

- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **shadcn/ui**: UI コンポーネント
- **Zustand**: 状態管理
- **React Hook Form**: フォーム管理

## 🌐 開発サーバー

| サービス          | URL                                   |
| ----------------- | ------------------------------------- |
| Laravel API       | http://localhost:80                   |
| Next.js Frontend  | http://localhost:3000                 |
| Laravel Telescope | http://localhost:80/telescope         |
| API Documentation | http://localhost:80/api/documentation |

## 📝 開発フロー

1. **モデル作成**: `./vendor/bin/sail artisan make:model EntityName -m`
2. **API コントローラー**: `./vendor/bin/sail artisan make:controller Api/EntityController --api`
3. **フロントエンド コンポーネント**: `npx shadcn@latest add [component]`
4. **API 型定義**: 自動生成ツールで型定義を同期

## 🔧 その他のコマンド

### Laravel

```bash
# マイグレーション
./vendor/bin/sail artisan migrate

# シード実行
./vendor/bin/sail artisan db:seed

# キャッシュクリア
./vendor/bin/sail artisan cache:clear

# API ドキュメント生成
./vendor/bin/sail artisan l5-swagger:generate
```

### Next.js

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番起動
npm run start

# リンター
npm run lint
```

## 🚀 デプロイ

デプロイ手順については、`docs/development/deployment.md` を参照してください。

## 🤝 貢献

1. Feature ブランチを作成
2. 変更を実装
3. テストを追加
4. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
