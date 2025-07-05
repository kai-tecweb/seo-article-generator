# 開発環境・ツール設定

## 開発環境構成

### Laravel Sail使用
- `./vendor/bin/sail artisan [command]` でArtisanコマンドを実行
- `./vendor/bin/sail composer [command]` でComposerコマンドを実行
- `./vendor/bin/sail npm [command]` でNPMコマンドを実行（フロントエンド側では直接npm使用）

### Next.js開発環境
- **開発サーバー**: `npm run dev` で開発サーバーを起動
- **ビルド**: `npm run build` でプロダクションビルドを実行
- **本番サーバー**: `npm run start` でプロダクションサーバーを起動
- **コード品質**: `npm run lint` でESLintチェックを実行
- **型チェック**: `npm run type-check` でTypeScriptチェックを実行
- **shadcn/ui**: `npx shadcn-ui@latest add [component]` でコンポーネントを追加
- **パッケージ管理**: pnpmを推奨（npmも可）

## Artisanコマンドによるコード生成（手動作成禁止）

- モデル生成: `make:model EntityName -m`
- APIコントローラ生成: `make:controller Api/EntityNamesController --api --model=EntityName`
- フォームリクエスト生成: `make:request Api/EntityNameRequest`
- APIリソース生成: `make:resource EntityNameResource`
- ポリシー生成: `make:policy EntityNamePolicy --model=EntityName`
- テスト生成: `make:test Api/EntityNameTest`

## 開発フロー

### 1. プロジェクト初期化
```bash
# フロントエンド
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npx shadcn-ui@latest init

# バックエンド
./vendor/bin/sail artisan install:api
./vendor/bin/sail artisan make:model [ModelName] -m
```

### 2. コンポーネント開発
```bash
# shadcn/uiコンポーネント追加
npx shadcn-ui@latest add button card input

# カスタムコンポーネント作成
# src/components/features/[feature]/[component].tsx
```

### 3. API開発
```bash
# Laravel側
./vendor/bin/sail artisan make:controller Api/[EntityName]Controller --api
./vendor/bin/sail artisan make:request Api/[EntityName]Request
./vendor/bin/sail artisan make:resource [EntityName]Resource
```

## 設定ファイル管理

- **環境変数**: `.env.local`（フロントエンド）、`.env`（バックエンド）
- **型定義**: 自動生成ツールを使用してAPI型定義を同期
- **設定ファイル**: TypeScriptとTailwind設定を統一
- **リンター**: ESLint + Prettier設定を統一
- **コミット**: Conventional Commitsを使用

## 必要なツール・パッケージ

### Laravel（バックエンド）
```bash
# 基本パッケージ
composer require laravel/sanctum
composer require laravel/sail
composer require darkaonline/l5-swagger

# 開発用パッケージ
composer require --dev barryvdh/laravel-debugbar
composer require --dev nunomaduro/collision
composer require --dev pestphp/pest
```

### Next.js（フロントエンド）
```bash
# 基本パッケージ
npm install @radix-ui/react-avatar @radix-ui/react-button
npm install @radix-ui/react-card @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu @radix-ui/react-form
npm install @radix-ui/react-input @radix-ui/react-label
npm install @radix-ui/react-select @radix-ui/react-separator
npm install @radix-ui/react-sheet @radix-ui/react-textarea
npm install @radix-ui/react-toast @radix-ui/react-tooltip

# 状態管理・データフェッチ
npm install zustand swr
npm install @tanstack/react-query

# フォーム・バリデーション
npm install react-hook-form @hookform/resolvers
npm install zod

# スタイリング
npm install tailwindcss-animate
npm install lucide-react

# 開発ツール
npm install --save-dev @types/node @types/react @types/react-dom
npm install --save-dev typescript
npm install --save-dev eslint eslint-config-next
npm install --save-dev prettier prettier-plugin-tailwindcss
npm install --save-dev husky lint-staged
npm install --save-dev @playwright/test
```

## 環境変数設定

### バックエンド（.env）
```env
# 基本設定
APP_NAME="SEO Article Generator"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

# データベース
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=seo_generator
DB_USERNAME=sail
DB_PASSWORD=password

# AI API
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=...

# メール
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

# キャッシュ
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# セッション
SESSION_DRIVER=redis
SESSION_LIFETIME=120

# ファイルシステム
FILESYSTEM_DISK=local
```

### フロントエンド（.env.local）
```env
# API エンドポイント
NEXT_PUBLIC_API_URL=http://localhost:80/api/v1

# 認証
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# 分析
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID
```

## VSCode設定

### settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "files.associations": {
    "*.blade.php": "html"
  }
}
```

### 推奨拡張機能
- PHP Intelephense
- Laravel Extension Pack
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- GitLens
- Prettier - Code formatter
- ESLint

## Git設定

### .gitignore
```gitignore
# Laravel
/vendor/
/node_modules/
/public/hot
/public/storage
/storage/*.key
/bootstrap/cache/*.php
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log

# Next.js
.next/
out/
build/
dist/

# 環境変数
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### コミット規約
```bash
# Conventional Commits
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
style: コードスタイルの修正
refactor: リファクタリング
test: テストの追加・修正
chore: その他の変更

# 例
feat: AI記事生成機能を追加
fix: HTML生成時のエラーを修正
docs: API仕様書を更新
```

## デバッグ・ログ設定

### Laravel（バックエンド）
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'daily'],
        'ignore_exceptions' => false,
    ],
    'ai_generation' => [
        'driver' => 'daily',
        'path' => storage_path('logs/ai-generation.log'),
        'level' => 'debug',
        'days' => 14,
    ],
    'html_generation' => [
        'driver' => 'daily',
        'path' => storage_path('logs/html-generation.log'),
        'level' => 'debug',
        'days' => 14,
    ],
],
```

### Next.js（フロントエンド）
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data)
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  }
}
```

## 開発時の注意事項

### 共通
- コマンドを実行する際は、Laravel Sailを使用してるか確認して、`sail` コマンドを使用して実行するように指示します。
- キャッシュ用のファイルは参考や修正対象に含みません。
- 具体的なエラーが提示された場合はそのエラーを回避するような対処療法ではなく、なぜそのエラーが出るのかを説明し、根本的な解決策を提案します。
- コードの変更を提案する際は、変更の目的とその影響を明確に説明します。

### Laravel
- Artisanコマンドによるコード生成を必ず使用し、手動作成を避ける
- マイグレーションファイルは必ず版管理に含める
- シーダーファイルでテストデータを整備する
- APIリソースクラスでレスポンス形式を統一する

### Next.js
- shadcn/uiコンポーネントを優先的に使用する
- 型定義を厳密に行い、any型の使用を避ける
- Server ComponentsとClient Componentsの使い分けを明確にする
- 静的生成を最大限活用する
