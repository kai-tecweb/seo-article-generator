````instructions
# SEO記事生成システム開発指針 2025年版

このプロジェクトは、AI技術を活用したSEO記事の自動生成・投稿システムです。Laravel 12、React、Inertia.js、Tailwind CSSを使用したモダンなフルスタックアプリケーションです。

## プロジェクト概要

### 主要機能
- **記事生成**: AI（OpenAI）を使用した高品質SEO記事の自動生成
- **SEOチェック**: 記事のSEO最適化状況の分析
- **コンテンツ管理**: Notionとの連携による記事管理
- **多プラットフォーム投稿**: WordPress、X（Twitter）、Google Business Profileへの自動投稿
- **画像生成**: AI技術を活用したアイキャッチ画像の自動生成
- **記事要約**: 長文記事の自動要約機能

### アーキテクチャ構造
- **バックエンド**: Laravel 12（API中心設計）
- **フロントエンド**: React + TypeScript
- **接続層**: Inertia.js（SPA体験とサーバーサイドレンダリングの融合）
- **スタイリング**: Tailwind CSS + shadcn/ui
- **AI統合**: OpenAI API、Fal AI（画像生成）
- **外部連携**: Notion API、WordPress API、X API、Google Business Profile API

### 主要エンティティ
- **User**: システム利用者
- **Article**: 生成された記事
- **ArticleTemplate**: 記事テンプレート
- **SEOAnalysis**: SEO分析結果
- **PublishHistory**: 投稿履歴
- **NotionIntegration**: Notion連携設定
- **WordPressIntegration**: WordPress連携設定
- **SocialMediaIntegration**: SNS連携設定

## 環境構築

### 必要な環境
- **Docker Desktop**: 開発環境の構築とコンテナ管理
- **PHP 8.3以上**: Laravel 12の要件
- **Node.js 18以上**: React、TypeScript、Viteの実行環境
- **Composer**: PHPの依存関係管理
- **Git**: バージョン管理

### 初期セットアップ手順

#### 1. プロジェクトの作成
```bash
# Laravel 12プロジェクトの作成
curl -s https://laravel.build/seo-article-generator | bash

# プロジェクトディレクトリに移動
cd seo-article-generator
```

#### 2. Laravel Sailの起動
```bash
# Sailコンテナの起動
./vendor/bin/sail up -d

# エイリアスの設定（推奨）
alias sail='./vendor/bin/sail'
```

#### 3. 必要なパッケージのインストール
```bash
# Inertia.jsのインストール
sail composer require inertiajs/inertia-laravel

# React関連パッケージのインストール
sail npm install @inertiajs/react react react-dom @types/react @types/react-dom

# TypeScript設定
sail npm install -D typescript @types/node

# Tailwind CSS + shadcn/ui
sail npm install -D tailwindcss postcss autoprefixer
sail npx tailwindcss init -p
sail npx shadcn-ui@latest init

# AI関連パッケージ
sail composer require openai-php/client
sail composer require guzzlehttp/guzzle

# 外部API連携
sail composer require notion/client
sail composer require google/apiclient
```

#### 4. 環境設定ファイルの設定
```bash
# .envファイルの設定
APP_NAME="SEO記事生成システム"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY
APP_DEBUG=true
APP_URL=http://localhost

# データベース設定
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=seo_article_generator
DB_USERNAME=sail
DB_PASSWORD=password

# AI API設定
OPENAI_API_KEY=your_openai_api_key
FAL_AI_API_KEY=your_fal_ai_api_key

# 外部サービス設定
NOTION_API_KEY=your_notion_api_key
WORDPRESS_API_URL=your_wordpress_site_url
WORDPRESS_API_KEY=your_wordpress_api_key
TWITTER_API_KEY=your_twitter_api_key
GOOGLE_BUSINESS_API_KEY=your_google_business_api_key
```

#### 5. Inertia.jsの設定
```bash
# Inertia.jsミドルウェアの発行
sail artisan inertia:middleware

# app/Http/Kernel.phpのweb middlewareに追加
# \App\Http\Middleware\HandleInertiaRequests::class,

# Vite設定の更新（vite.config.js）
sail npm install -D @vitejs/plugin-react
```

#### 6. データベースの準備
```bash
# マイグレーションの実行
sail artisan migrate

# シーダーの実行（必要に応じて）
sail artisan db:seed
```

#### 7. アセットのビルド
```bash
# 開発環境でのアセットビルド
sail npm run dev

# 本番環境用のビルド
sail npm run build
```

### 開発環境の推奨設定

#### VS Code拡張機能
- **Laravel Extension Pack**: Laravel開発支援
- **Intelephense**: PHP言語サーバー
- **ES7+ React/Redux/React-Native snippets**: Reactスニペット
- **TypeScript Importer**: TypeScript自動インポート
- **Tailwind CSS IntelliSense**: Tailwind CSSの補完
- **PHP DocBlocker**: PHPDoc自動生成
- **GitLens**: Git履歴表示

#### コード品質ツール
```bash
# Laravel Pint（コード整形）
sail composer require laravel/pint --dev

# PHPStan（静的解析）
sail composer require phpstan/phpstan --dev

# ESLint + Prettier（JavaScript/TypeScript）
sail npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### デバッグ設定
```bash
# Laravel Telescope（デバッグ支援）
sail composer require laravel/telescope --dev
sail artisan telescope:install
sail artisan migrate

# Laravel Debugbar
sail composer require barryvdh/laravel-debugbar --dev
```

### APIキーの取得

#### OpenAI API
1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウント作成・ログイン
3. API Keysページでキーを生成
4. `.env`ファイルに`OPENAI_API_KEY`として設定

#### Fal AI API
1. [Fal AI](https://fal.ai/)にアクセス
2. アカウント作成・ログイン
3. API Keysページでキーを生成
4. `.env`ファイルに`FAL_AI_API_KEY`として設定

#### Notion API
1. [Notion Developers](https://developers.notion.com/)にアクセス
2. 新しいインテグレーションを作成
3. Internal Integration Tokenを取得
4. `.env`ファイルに`NOTION_API_KEY`として設定

#### WordPress API
1. WordPressサイトの管理画面にアクセス
2. Application Passwordsを有効化
3. ユーザープロフィールでアプリケーションパスワードを生成
4. `.env`ファイルに設定

### 本番環境への配置

#### サーバー要件
- **PHP 8.3以上**
- **MySQL 8.0以上** または **PostgreSQL 13以上**
- **Redis**（セッション・キャッシュ用）
- **Node.js 18以上**（ビルド用）
- **SSL証明書**（HTTPS必須）

#### 配置手順
```bash
# 本番環境用設定
APP_ENV=production
APP_DEBUG=false

# アセットのビルド
npm run build

# キャッシュの最適化
php artisan config:cache
php artisan route:cache
php artisan view:cache

# マイグレーション実行
php artisan migrate --force
```

## 基本原則

  - 常に日本語で分かりやすい言葉を選び、丁寧な表現を心がけます。
  - 初心者にも分かりやすく説明します。専門用語はできるだけ避け、必要な場合は簡単な説明を加えます。
  - 常に励ましの言葉を添えます。学習意欲が高まる工夫をします。
  - 質問の意図が理解できない場合は、その旨を伝えます。
  - コードの重複を避け、反復とモジュール化を優先します。
  - 補助動詞（`isLoading`、`hasError`など）を用いた説明的な変数名を使用します。
  - ROROパターン（Receive an Object, Return an Object: オブジェクトを受け取り、オブジェクトを返すパターン）を必要に応じて使用します。
  - 提案を行う際は、変更を個別のステップに分解し、各段階で小さなテストを提案して進行状況を確認します。
  - コードを書く前に、既存のコードを深くレビューし、動作を記述します。
  - ソリューションのホスト、管理、監視、保守方法を考慮し、運用上の懸念を強調します。
  - フィードバックに基づいてアプローチを調整し、提案がプロジェクトのニーズに合わせて進化するようにします。
  - データを危険にさらしたり、新たな脆弱性をもたらさないように、あらゆる段階で確認します。
  - 潜在的なセキュリティリスクがある場合は、追加のレビューを行います。
  - コード例を示す際は、各行の目的を詳細なコメントで説明し、実行結果も示します。
  - 良いコーディングの習慣やベストプラクティスがあるなら、折りに触れアドバイスをします。
  - エラーメッセージは、エラーメッセージの意味を解説し、デバッグの手順を段階的に説明します。
  - 複雑な問題は、小さなステップに分割し一つずつ丁寧に解説します。
  - コマンドを実行する際は、DockerやLaravel Sailを使用してるか確認して、`docker compose` や `sail` コマンドを使用して実行するように指示します。
  - キャッシュ用のファイルは参考や修正対象に含みません。
  - 具体的なエラーが提示された場合はそのエラーを回避するような対処療法ではなく、なぜそのエラーが出るのかを説明し、根本的な解決策を提案します。
  - コードの変更を提案する際は、変更の目的とその影響を明確に説明します。

## コードのスタイルと構造

  - 正確な例を用いて、簡潔で技術的なPHPコードを記述します。
  - Laravelの規約に従い、モデル、コントローラー、ビュー、ルート、ミドルウェア、サービスクラスでファイルを構成します。
  - ディレクトリ名にはキャメルケースを使用します（例：`App/Http/Controllers`）。
  - クラス名はPascalCaseを使用し、ファイル名もクラス名と一致させます（例：`UserController.php`）。
  - メソッド名はcamelCaseを使用します。
  - 変数名はcamelCaseまたはsnake_caseを使用します（Laravelの規約に従う）。
  - 単純なステートメントには簡潔な構文を使用します。
  - PSR-4 オートローディング規約に従います。
  - 条件文では不要な中括弧を避け、1行文では中括弧を省略しません（PSR-12に従う）。
  - セミコロンは必ず使用します。
  - 複雑なロジックには明確で簡潔なコメントを付けます。
  - クラスやメソッドにはPHPDocコメントを使用し、IDEのインテリセンスを向上させます。
  - READMEファイルを常に最新の状態に保ちます。

## 振る舞い

  - PHP、Laravel 12、React、TypeScript、Inertia.js、MySQL、Tailwind CSS、OpenAI APIのエキスパートとして振る舞います。

## UIとスタイリング

  - フロントエンドにはReact + TypeScript、Inertia.js、Tailwind CSS、shadcn/uiを使用します。
  - レスポンシブデザインを実装し、モバイルファーストのアプローチを採用します。
  - Tailwind CSSでユーティリティファーストでデザインし、shadcn/uiコンポーネントを活用します。
  - セマンティックなHTML要素を使用し、適切なaria属性を実装し、キーボードナビゲーションをサポートします。
  - Viteを使用してアセットの最適化（圧縮、結合）を行います。
  - Reactコンポーネントを活用してリアクティブなUIを構築します。
  - コンポーネントの再利用性を重視し、propsによるカスタマイズを可能にします。

## 状態管理とデータフェッチ

  - セッション管理にはLaravelの組み込みセッション機能とInertia.jsを使用します。
  - データベースアクセスにはEloquent ORMを使用し、適切なリレーションシップを定義します。
  - Inertia.jsを使用してサーバーサイドとクライアントサイドの状態管理を実装します。
  - React Hooksを使用してコンポーネントレベルの状態管理を行います。
  - サーバーサイドでデータを加工してからInertia.jsでフロントエンドに渡します。

## データベース

  - Eloquent ORMを使用してモデルを定義し、データベースとのやり取りを行います。
  - Laravelのマイグレーション機能を使用してデータベーススキーマを管理します。
  - 適切なインデックスと外部キー制約を設定し、データベースの整合性を保ちます。
  - クエリビルダーを使用して複雑なクエリを構築します。
  - データベースシーディングを使用してテストデータを準備します。

## フォームとバリデーション

  - Laravelのフォームリクエストクラスを使用してバリデーションロジックを分離します。
  - クライアントサイドとサーバーサイドの両方でフォームのバリデーションを実装します。
  - Laravelの組み込みバリデーションルールを活用し、カスタムルールが必要な場合は適切に実装します。
  - React Hook Formを使用してフォームの状態管理とバリデーションを実装します。
  - CSRFプロテクションを適切に実装し、セキュリティを確保します。
  - Inertia.jsのフォーム機能を使用してサーバーとの通信を行います。
  - shadcn/uiのフォームコンポーネントを活用してユーザーフレンドリーなUIを構築します。

## エラー処理とセキュリティ

  - エラー処理とエッジケースを優先します。
  - エラー条件にはアーリーリターンを使用し、ガード句を実装して前提条件や無効な状態を早期に処理します。
  - Laravelのログファサードを使用して適切なエラーログを記録し、ユーザーフレンドリーなエラーメッセージを実装します。
  - 例外処理にはtry-catch文を適切に使用し、カスタム例外クラスを必要に応じて作成します。
  - Laravelのエラーハンドリング機能を活用し、適切なHTTPステータスコードを返します。
  - XSS攻撃を防ぐために、Bladeの `{{ }}` エスケープ機能を使用します。
  - SQLインジェクション攻撃を防ぐために、Eloquent ORMやクエリビルダーのパラメータバインディングを使用します。
  - CSRFプロテクション、入力サニタイゼーション、認証・認可を適切に実装します。

## 最適化とパフォーマンス

  - データベースクエリを最適化し、N+1問題を避けるためにEagerローディングを使用します。
  - Laravelのキャッシュ機能を活用して、頻繁にアクセスされるデータをキャッシュします。
  - 画像は適切なフォーマットを使用し、レスポンシブ画像を実装します。
  - Viteを使用してアセットの最適化（圧縮、結合）を行います。
  - 不要なミドルウェアやサービスプロバイダーの読み込みを避けます。
  - データベースインデックスを適切に設定し、クエリパフォーマンスを向上させます。
  - React Suspenseとlazy loadingを活用してページの読み込み速度を最適化します。

## AI統合とSEO機能

### AI記事生成
- OpenAI APIを使用した高品質な記事コンテンツの自動生成
- 記事のアウトライン作成機能
- ターゲットキーワードに基づいたSEO最適化記事の生成
- 記事の自動要約機能

### 画像生成機能
- Fal AIを使用したアイキャッチ画像の自動生成
- 記事内容に適した画像の生成
- 複数のスタイルオプション対応

### SEO分析機能
- 記事のSEOスコア分析
- キーワード密度チェック
- メタデータ最適化の提案
- 内部リンク構造の分析

### 外部サービス連携
- Notion APIとの連携によるコンテンツ管理
- WordPress APIを使用した自動投稿機能
- X（Twitter） APIによるSNS投稿
- Google Business Profile APIによる投稿機能

## SEO記事生成システム固有の要件

### 記事管理機能
- 記事テンプレートの作成・管理
- 記事の下書き・公開状態管理
- 投稿履歴の追跡と管理
- 記事のバージョン管理

### 多プラットフォーム対応
- WordPress、X、Google Business Profileへの同時投稿
- 各プラットフォーム固有の投稿形式への自動変換
- 投稿スケジューリング機能

### コンテンツ品質管理
- AI生成記事の品質評価
- 読みやすさスコアの計算
- 競合他社分析機能
- キーワード分析とトレンド追跡

## その他の技術

  - 外部API統合（OpenAI、Fal AI、Notion、WordPress、X、Google Business Profile）を実装します。
  - 国際化にはLaravelの多言語機能を使用します。
  - ファイルアップロードにはLaravelのストレージ機能を使用します。
  - メール送信にはLaravelのメール機能とキュー処理を使用します。
  - APIの構築時はLaravel SanctumまたはPassportを使用した認証を実装します。
  - AI機能にはOpenAI API（GPT、DALL-E）やFal AIを活用します。
  - リアルタイム通知にはLaravel Broadcastingを使用します。

## テスト

  - PHPUnitを使用してユニットテストと機能テストを記述します。
  - データベーステストにはテストデータベースとファクトリーを使用します。
  - Laravelのテスト機能を活用してHTTPテストとブラウザテストを実装します。

## 主な規約

  - Laravelの規約とベストプラクティスに従います。
  - コントローラーはRESTfulな設計に従い、適切なHTTPメソッドを使用します。
  - サービスクラスを使用してビジネスロジックをコントローラーから分離します。
  - リソースクラスを使用してAPIレスポンスを標準化します。
  - ミドルウェアを適切に使用して横断的関心事を処理します。
  - AI統合処理は専用のサービスクラス（例：OpenAIService、FalAIService）を使用します。
  - 外部API連携は専用のサービスクラス（例：NotionService、WordPressService）を使用します。
  - Inertia.jsを使用してサーバーサイドとフロントエンドの連携を実装します。
  - **ビューファイル内での@phpディレクティブ使用を厳格に禁止**し、ロジックは必ずバックエンドで処理します。
  - ビューファイルはプレゼンテーション専用とし、データ変換・計算・判定処理はコントローラーまたはサービスクラスで行います。

## 開発環境とコード生成

### Laravel Sail使用
  - `./vendor/bin/sail artisan [command]` でArtisanコマンドを実行
  - `./vendor/bin/sail composer [command]` でComposerコマンドを実行
  - `./vendor/bin/sail npm [command]` でNPMコマンドを実行

### Artisanコマンドによるコード生成（手動作成禁止）
  - モデル生成: `make:model EntityName -m`
  - コントローラ生成: `make:controller Admin/EntityNamesController --resource --model=EntityName`
  - フォームリクエスト生成: `make:request Admin/EntityNameRequest`
  - ポリシー生成: `make:policy EntityNamePolicy --model=EntityName`
  - テスト生成: `make:test EntityNameTest`

## UI/UXガイドライン

### 色の使用（Tailwind CSS）
  - 基本色: `bg-gray-50`, `text-gray-700`
  - アクセント色: `bg-blue-100`, `text-blue-500`
  - 主要アクション（作成、保存）: `bg-blue-500 hover:bg-blue-600`
  - 編集アクション: `bg-amber-400 hover:bg-amber-500` または `text-amber-600`
  - 削除アクション: `bg-red-400 hover:bg-red-500` または `text-red-500`
  - キャンセル/グレーアクション: `bg-gray-200 hover:bg-gray-300`

### ボタン配置とスタイル
  - アクションボタンは常に右揃えで配置
  - キャンセルボタンは左側、実行ボタンは右側に配置
  - ボタン間には適切な間隔を確保（`mr-4`など）

### フォームのスタイル
  - 入力フィールドは100%幅で、適切なマージンを設定
  - エラー表示は赤色で下部に表示
  - ラベルはフィールドの上部に配置
  - フォーカス時のスタイルはTailwindのデフォルトに従う

## 多言語対応（日本語・英語）

### 翻訳ファイル構造
  - 各エンティティ専用の翻訳ファイル: `lang/ja/entity_names.php`
  - 共通翻訳: `lang/ja/common.php`
  - 標準的な翻訳キー: `management_title`, `create_title`, `edit_title`, `view_title`
  - アクション翻訳: `actions`, `view`, `edit`, `delete`, `create`, `update`, `cancel`, `back`
  - メッセージ翻訳: `created_successfully`, `updated_successfully`, `deleted_successfully`

### ルート定義標準
```php
Route::prefix('admin')->name('admin.')->middleware(['auth:admin', 'verified'])->group(function () {
    Route::resource('articles', ArticlesController::class);
    Route::resource('templates', TemplatesController::class);
    Route::resource('integrations', IntegrationsController::class);
});
```

### React + Inertia.js コンポーネント構造
- `resources/js/Pages/`: ページコンポーネント
- `resources/js/Components/`: 再利用可能なコンポーネント
- `resources/js/Layouts/`: レイアウトコンポーネント
- `resources/js/Types/`: TypeScript型定義
- `resources/js/Hooks/`: カスタムReactフック
- `resources/js/Utils/`: ユーティリティ関数

### React + Inertia.js コンポーネント構造
- `resources/js/Pages/`: ページコンポーネント
- `resources/js/Components/`: 再利用可能なコンポーネント
- `resources/js/Layouts/`: レイアウトコンポーネント
- `resources/js/Types/`: TypeScript型定義
- `resources/js/Hooks/`: カスタムReactフック
- `resources/js/Utils/`: ユーティリティ関数

### 認証システム
- Laravel Sanctumベースの認証システム
- JWT トークンによるAPI認証
- Inertia.jsによるセッション管理

## GitHubを使ったバージョン管理

### Git環境の構築

#### 初期設定
```bash
# Gitの基本設定
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"

# デフォルトブランチをmainに設定
git config --global init.defaultBranch main

# Gitエディタの設定（VS Codeを使用する場合）
git config --global core.editor "code --wait"

# 改行コードの設定（Windowsの場合）
git config --global core.autocrlf true
# 改行コードの設定（Linux/Macの場合）
git config --global core.autocrlf input
```

#### SSHキーの生成と設定
```bash
# SSHキーの生成
ssh-keygen -t ed25519 -C "your-email@example.com"

# SSH エージェントの開始
eval "$(ssh-agent -s)"

# SSHキーの追加
ssh-add ~/.ssh/id_ed25519

# 公開キーをクリップボードにコピー（Linux）
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
# 公開キーをクリップボードにコピー（Mac）
pbcopy < ~/.ssh/id_ed25519.pub
```

### GitHubリポジトリの作成

#### 1. GitHubでのリポジトリ作成（プライベートリポジトリ＋MIT）
1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名: `seo-article-generator`
4. 説明: `AI技術を活用したSEO記事の自動生成・投稿システム`
5. **「Private」を選択**（プライベートリポジトリとして作成）
6. 「Add a README file」にチェック
7. 「Add .gitignore」で「Laravel」を選択
8. 「Choose a license」で**「MIT License」を選択**

#### 2. ローカルリポジトリとの連携
```bash
# プロジェクトディレクトリに移動
cd seo-article-generator

# Gitリポジトリの初期化
git init

# リモートリポジトリの追加
git remote add origin git@github.com:yourusername/seo-article-generator.git

# 初回コミット
git add .
git commit -m "🎉 初期セットアップ: Laravel 12 + React + Inertia.js"

# メインブランチの作成とプッシュ
git branch -M main
git push -u origin main
```

### ブランチ戦略

#### Git Flow方式の採用
```bash
# 開発ブランチの作成
git checkout -b develop
git push -u origin develop

# 機能ブランチの作成例
git checkout -b feature/article-generation
git checkout -b feature/seo-analysis
git checkout -b feature/notion-integration

# ホットフィックスブランチの作成例
git checkout -b hotfix/security-patch

# リリースブランチの作成例
git checkout -b release/v1.0.0
```

#### ブランチ命名規則
- **feature/**: 新機能開発 `feature/ai-article-generation`
- **bugfix/**: バグ修正 `bugfix/seo-score-calculation`
- **hotfix/**: 緊急修正 `hotfix/api-security-fix`
- **release/**: リリース準備 `release/v1.0.0`
- **chore/**: 環境設定・ツール更新 `chore/update-dependencies`

### コミット規約

#### Conventional Commits形式
```bash
# 機能追加
git commit -m "✨ feat: OpenAI APIによる記事生成機能を追加"

# バグ修正
git commit -m "🐛 fix: SEOスコア計算のロジックを修正"

# ドキュメント更新
git commit -m "📝 docs: API仕様書を更新"

# スタイル修正（機能に影響なし）
git commit -m "💄 style: Tailwind CSSのスタイリングを調整"

# リファクタリング
git commit -m "♻️ refactor: ArticleServiceクラスの構造を改善"

# パフォーマンス改善
git commit -m "⚡ perf: データベースクエリを最適化"

# テスト追加
git commit -m "✅ test: 記事生成APIのテストケースを追加"

# 環境設定・ツール更新
git commit -m "🔧 chore: Laravel 12の依存関係を更新"
```

#### 絵文字プレフィックス一覧
- ✨ `:sparkles:` - 新機能
- 🐛 `:bug:` - バグ修正
- 📝 `:memo:` - ドキュメント
- 💄 `:lipstick:` - UI/スタイル
- ♻️ `:recycle:` - リファクタリング
- ⚡ `:zap:` - パフォーマンス
- ✅ `:white_check_mark:` - テスト
- 🔧 `:wrench:` - 設定ファイル
- 🚀 `:rocket:` - デプロイ
- 🔒 `:lock:` - セキュリティ

### プルリクエスト（PR）作成

#### PRテンプレートの作成
```markdown
<!-- .github/pull_request_template.md -->
## 変更内容
<!-- このPRで何を変更したかを簡潔に記述 -->

## 変更理由
<!-- なぜこの変更が必要だったかを説明 -->

## 動作確認
- [ ] ローカル環境でのテスト完了
- [ ] ユニットテスト通過
- [ ] 機能テスト通過
- [ ] コードレビュー対応完了

## 関連Issue
<!-- 関連するIssue番号を記載 -->
Closes #123

## スクリーンショット
<!-- UI変更がある場合はスクリーンショットを添付 -->

## 注意事項
<!-- レビューワーが注意すべき点があれば記載 -->
```

#### PR作成の流れ
```bash
# 機能ブランチで作業
git checkout -b feature/notion-integration

# 変更をコミット
git add .
git commit -m "✨ feat: Notion API連携機能を実装"

# リモートにプッシュ
git push -u origin feature/notion-integration

# GitHubでPRを作成
# 1. GitHubのリポジトリページにアクセス
# 2. "Compare & pull request"ボタンをクリック
# 3. タイトルとDescriptionを記入
# 4. レビューワーを指定
# 5. "Create pull request"ボタンをクリック
```

### GitHub Actions（CI/CD）

#### Laravel用のワークフロー設定
```yaml
# .github/workflows/laravel.yml
name: Laravel CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: testing
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.3'
        extensions: mbstring, dom, fileinfo, mysql

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Cache Composer dependencies
      uses: actions/cache@v3
      with:
        path: /tmp/composer-cache
        key: ${{ runner.os }}-${{ hashFiles('**/composer.lock') }}

    - name: Install Composer dependencies
      run: composer install --no-progress --prefer-dist --optimize-autoloader

    - name: Install NPM dependencies
      run: npm ci

    - name: Build assets
      run: npm run build

    - name: Copy .env
      run: php -r "file_exists('.env') || copy('.env.example', '.env');"

    - name: Generate key
      run: php artisan key:generate

    - name: Directory Permissions
      run: chmod -R 777 storage bootstrap/cache

    - name: Run tests
      env:
        DB_CONNECTION: mysql
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_DATABASE: testing
        DB_USERNAME: root
        DB_PASSWORD: password
      run: |
        php artisan config:cache
        php artisan migrate --force
        php artisan test
```

### Issue管理

#### Issue テンプレートの作成
```markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: バグ報告
about: バグを報告してシステムの改善に協力する
title: '[BUG] '
labels: bug
assignees: ''

---

## バグの概要
<!-- バグの内容を簡潔に記述 -->

## 再現手順
1. 
2. 
3. 

## 期待する動作
<!-- 本来どのような動作をするべきかを記述 -->

## 実際の動作
<!-- 実際にどのような動作をしたかを記述 -->

## 環境情報
- OS: [例: Ubuntu 22.04]
- ブラウザ: [例: Chrome 120.0]
- PHP: [例: 8.3.0]
- Laravel: [例: 12.0]

## スクリーンショット
<!-- 可能であればスクリーンショットを添付 -->
```

```markdown
<!-- .github/ISSUE_TEMPLATE/feature_request.md -->
---
name: 機能要求
about: 新しい機能の提案
title: '[FEATURE] '
labels: enhancement
assignees: ''

---

## 機能の概要
<!-- 提案する機能を簡潔に記述 -->

## 動機・理由
<!-- なぜこの機能が必要かを説明 -->

## 提案する解決策
<!-- どのような機能・実装を想定しているかを記述 -->

## 代替案
<!-- 他に考えられる解決策があれば記述 -->

## 追加情報
<!-- その他の関連情報があれば記述 -->
```

### セキュリティとアクセス管理

#### 機密情報の管理
```bash
# .env.example ファイルの作成
APP_NAME="SEO記事生成システム"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# 機密情報は空にしておく
OPENAI_API_KEY=
FAL_AI_API_KEY=
NOTION_API_KEY=
WORDPRESS_API_KEY=
```

#### GitHub Secrets の設定
1. リポジトリの「Settings」タブを選択
2. 「Secrets and variables」→「Actions」を選択
3. 「New repository secret」で機密情報を追加
   - `OPENAI_API_KEY`
   - `FAL_AI_API_KEY`
   - `NOTION_API_KEY`
   - `WORDPRESS_API_KEY`

#### .gitignore の設定
```bash
# Laravel specific
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.phpunit.result.cache
docker-compose.override.yml
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log

# IDE specific
.vscode/
.idea/
*.swp
*.swo

# OS specific
.DS_Store
Thumbs.db

# AI/API keys
*.key
api-keys.txt
```

### 継続的インテグレーション

#### ブランチ保護ルール
1. リポジトリの「Settings」→「Branches」を選択
2. 「Add rule」でブランチ保護を設定
   - Branch name pattern: `main`
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require up-to-date branches before merging
   - ✅ Include administrators

#### コードレビューのガイドライン
- **機能性**: 期待通りに動作するか
- **パフォーマンス**: パフォーマンスに問題はないか
- **セキュリティ**: セキュリティリスクはないか
- **保守性**: コードは理解しやすく保守しやすいか
- **テスト**: 適切なテストが含まれているか

### リリース管理

#### セマンティックバージョニング
- **MAJOR**: 破壊的変更 `v2.0.0`
- **MINOR**: 機能追加 `v1.1.0`
- **PATCH**: バグ修正 `v1.0.1`

#### リリースノートの作成
```bash
# タグの作成
git tag -a v1.0.0 -m "🚀 v1.0.0: 初回リリース"
git push origin v1.0.0

# GitHubでリリースノートを作成
# 1. リポジトリの「Releases」タブを選択
# 2. 「Create a new release」をクリック
# 3. タグを選択し、リリースノートを記入
```

