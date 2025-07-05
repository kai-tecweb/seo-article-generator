# SEO記事自動生成・静的HTMLファイル生成システム開発指針

このプロジェクトは、AIを活用してSEOに強い記事を自動生成し、完全な静的HTMLファイルとして記事サイトを構築する「記事ファイルメーカー」システムです。

## 📋 プロジェクト概要

**システム名**: 記事ファイルメーカー  
**目的**: SEO最適化された静的HTMLファイル生成  
**技術スタック**: Laravel 12 + Next.js + MySQL + Laravel Sail  
**AI統合**: OpenAI API、Claude API  

## 🚀 開発を始める前に

### 必須の確認事項
1. **詳細な開発指針は [docs/](docs/) ディレクトリを参照**
2. **システム設計**: [docs/system/architecture.md](docs/system/architecture.md)
3. **開発環境構築**: [docs/development/environment-setup.md](docs/development/environment-setup.md)
4. **コーディング規約**: [docs/development/coding-standards.md](docs/development/coding-standards.md)

### 重要な制約事項
- **Laravel Sail使用必須**: すべてのLaravelコマンドは`./vendor/bin/sail`経由で実行
- **Artisanコマンド使用**: モデル・コントローラー等は手動作成禁止
- **MDファイル使用禁止**: ドキュメントはコード内コメントまたはStorybookで管理
- **型安全性**: TypeScriptによる厳密な型定義必須

## 📁 ドキュメント構成

### システム設計・仕様
- [システムアーキテクチャ](docs/system/architecture.md)
- [エンティティ設計](docs/system/entities.md)
- [API仕様](docs/system/api-specification.md)
- [システム要件](docs/system/requirements.md)

### 開発指針・規約
- [コーディング規約・標準](docs/development/coding-standards.md)
- [開発環境・ツール設定](docs/development/environment-setup.md)
- [エラーハンドリング・セキュリティ](docs/development/error-handling-security.md)
- [テスト戦略・品質保証](docs/development/testing-strategy.md)

### 実装例・ベストプラクティス
- [静的HTML生成実装例](docs/implementation/static-html-generation.md)
- [AI記事生成実装例](docs/implementation/ai-article-generation.md)
- [状態管理・データフェッチ実装例](docs/implementation/state-management.md)

### UI/UXデザイン
- [デザインシステム・スタイルガイド](docs/ui-ux/design-system.md)

## 🔧 基本的な開発フロー

1. **プロジェクト理解**: [docs/system/architecture.md](docs/system/architecture.md)を読む
# SEO記事自動生成・静的HTMLファイル生成システム開発指針

このプロジェクトは、AIを活用してSEOに強い記事を自動生成し、完全な静的HTMLファイルとして記事サイトを構築する「記事ファイルメーカー」システムです。

## 📋 プロジェクト概要

**システム名**: 記事ファイルメーカー  
**目的**: SEO最適化された静的HTMLファイル生成  
**技術スタック**: Laravel 12 + Next.js + MySQL + Laravel Sail  
**AI統合**: OpenAI API、Claude API  

## 🚀 開発を始める前に

### 必須の確認事項
1. **詳細な開発指針は [docs/](docs/) ディレクトリを参照**
2. **システム設計**: [docs/system/architecture.md](docs/system/architecture.md)
3. **開発環境構築**: [docs/development/environment-setup.md](docs/development/environment-setup.md)
4. **コーディング規約**: [docs/development/coding-standards.md](docs/development/coding-standards.md)

### 重要な制約事項
- **Laravel Sail使用必須**: すべてのLaravelコマンドは`./vendor/bin/sail`経由で実行
- **Artisanコマンド使用**: モデル・コントローラー等は手動作成禁止
- **MDファイル使用禁止**: ドキュメントはコード内コメントまたはStorybookで管理
- **型安全性**: TypeScriptによる厳密な型定義必須

## 📁 ドキュメント構成

### システム設計・仕様
- [システムアーキテクチャ](docs/system/architecture.md)
- [エンティティ設計](docs/system/entities.md)
- [API仕様](docs/system/api-specification.md)
- [システム要件](docs/system/requirements.md)

### 開発指針・規約
- [コーディング規約・標準](docs/development/coding-standards.md)
- [開発環境・ツール設定](docs/development/environment-setup.md)
- [エラーハンドリング・セキュリティ](docs/development/error-handling-security.md)
- [テスト戦略・品質保証](docs/development/testing-strategy.md)

### 実装例・ベストプラクティス
- [静的HTML生成実装例](docs/implementation/static-html-generation.md)
- [AI記事生成実装例](docs/implementation/ai-article-generation.md)
- [状態管理・データフェッチ実装例](docs/implementation/state-management.md)

### UI/UXデザイン
- [デザインシステム・スタイルガイド](docs/ui-ux/design-system.md)

## 🔧 基本的な開発フロー

1. **プロジェクト理解**: [docs/system/architecture.md](docs/system/architecture.md)を読む
2. **環境構築**: [docs/development/environment-setup.md](docs/development/environment-setup.md)に従う
3. **コーディング**: [docs/development/coding-standards.md](docs/development/coding-standards.md)に従う
4. **実装**: [docs/implementation/](docs/implementation/)の実装例を参考にする
5. **テスト**: [docs/development/testing-strategy.md](docs/development/testing-strategy.md)に従う

## 🎯 開発目標

- **完全静的HTML生成**: 外部依存のない独立したHTMLファイル生成
- **AI活用**: OpenAI/Claude APIを活用した高品質記事生成
- **SEO最適化**: メタデータ・構造化データの静的埋め込み
- **型安全性**: TypeScriptによる厳密な型定義
- **モジュール化**: 責任分離とコードの再利用性

---

**💡 すべての詳細な開発指針・仕様・実装例は [docs/](docs/) ディレクトリに整理されています。**
```

### 主要エンティティ
- **Article**: AI生成記事（タイトル、本文、メタデータ、SEO情報、HTML出力パス）
- **Category**: 記事カテゴリ（プログラミング、ガジェット、レビューなど）
- **Tag**: 記事タグ（Next.js、TypeScript、Reactなど）
- **Author**: 記事著者（AI生成または人間ライター）
- **SEOMetadata**: SEO最適化情報（メタディスクリプション、キーワードなど）
- **GenerationTemplate**: AI生成テンプレート
- **HtmlTemplate**: HTML生成テンプレート（記事、カテゴリ、インデックス用）
- **StaticSite**: 静的サイト設定（デザイン、レイアウト、ナビゲーション）
- **OutputFile**: 生成されたHTMLファイル管理（パス、サイズ、更新日時）

### APIエンドポイント構造
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /logout
│   └── GET /user
├── articles/
│   ├── GET /articles          # 記事一覧
│   ├── POST /articles         # 記事作成
│   ├── GET /articles/{id}     # 記事詳細
│   ├── PUT /articles/{id}     # 記事更新
│   └── DELETE /articles/{id}  # 記事削除
├── generation/
│   ├── POST /generate         # AI記事生成
│   ├── POST /generate/bulk    # 一括生成
│   ├── GET /templates         # 生成テンプレート
│   └── POST /optimize-seo     # SEO最適化
├── categories/
│   ├── GET /categories
│   ├── POST /categories
│   └── PUT /categories/{id}
├── html-generator/
│   ├── POST /generate-html    # 単一記事HTML生成
│   ├── POST /generate-site    # 全サイトHTML生成
│   ├── POST /generate-index   # インデックスページ生成
│   ├── POST /generate-categories # カテゴリページ生成
│   └── GET /output-status     # 生成状況確認
├── file-manager/
│   ├── GET /files             # 生成ファイル一覧
│   ├── GET /files/{path}      # ファイル詳細
│   ├── DELETE /files/{path}   # ファイル削除
│   └── POST /deploy           # デプロイ実行
└── analytics/
    ├── GET /performance       # 記事パフォーマンス
    └── GET /seo-metrics       # SEOメトリクス
```

### 認証システム
- Laravel Sanctumベースの認証システム（管理者用のみ）
- 管理者のみログイン可能（記事生成・編集・HTML生成権限）
- 生成されたHTMLファイルは完全に静的（認証不要）
- SPA対応のトークンベース認証（管理画面）
- 静的ファイルは任意のWebサーバーで配信可能

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
  - コマンドを実行する際は、Laravel Sailを使用してるか確認して、`sail` コマンドを使用して実行するように指示します。
  - キャッシュ用のファイルは参考や修正対象に含みません。
  - 具体的なエラーが提示された場合はそのエラーを回避するような対処療法ではなく、なぜそのエラーが出るのかを説明し、根本的な解決策を提案します。
  - コードの変更を提案する際は、変更の目的とその影響を明確に説明します。
  - **SEO最適化**: 生成される記事やサイト構造は常にSEOを意識した設計にします。
  - **AI活用**: OpenAI APIやClaude APIを効率的に活用し、高品質な記事生成を実現します。
  - **静的HTML生成**: 完全に独立した静的HTMLファイルを生成し、どのWebサーバーでも配信可能にします。
  - **ファイル管理**: 生成されたHTMLファイルの管理と最適化を重視します。

## コードのスタイルと構造

### バックエンド（Laravel 12）
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
  - APIコントローラーは`app/Http/Controllers/Api/`配下に配置します。
  -統一されたAPIレスポンス形式を使用します。

### フロントエンド（Next.js）
  - TypeScriptを使用し、型安全性を確保します。
  - App Routerを使用し、ファイルベースルーティングを活用します。
  - **shadcn/ui + Radix UI**: 高品質なコンポーネントライブラリを使用します。
  - **コンポーネント配置**:
    - `src/components/ui/`: shadcn/ui基本コンポーネント
    - `src/components/layout/`: レイアウト関連コンポーネント
    - `src/components/features/`: 機能別コンポーネント
    - `src/components/shared/`: 共通コンポーネント
  - **カスタムフック**: `src/hooks/`配下に配置し、ロジックを分離します。
  - **API呼び出し**: `src/lib/api/`配下に集約し、型安全なAPIクライアントを構築します。
  - **型定義**: `src/types/`配下に配置し、バックエンドと同期します。
  - **状態管理**: Zustandを使用し、`src/stores/`配下に配置します。
  - **Server Components**: 静的コンテンツとデータフェッチに使用します。
  - **Client Components**: インタラクティブな要素に使用します。
  - **エラーハンドリング**: react-error-boundaryとToast通知を実装します。
  - **ローディング状態**: Skeletonコンポーネントと適切な表示を実装します。
  - **開発体験**: 
    - ESLint + Prettier設定
    - Husky + lint-stagedでコミット前チェック
    - 型チェック自動化

## 振る舞い

  - PHP、Laravel 12、Next.js、React、TypeScript、MySQL、JavaScript、Tailwind CSS、Laravel Sanctum、OpenAI API、SEO最適化、静的HTML生成のエキスパートとして振る舞います。
  - API分離型アーキテクチャのベストプラクティスに従います。
  - RESTful APIの設計原則を遵守します。
  - 静的HTMLファイル生成とSEO最適化に特化した開発を行います。
  - AI記事生成の品質向上と効率化を追求します。
  - 完全に独立した静的サイトの構築を重視します。

## UIとスタイリング

### ブログサイト（静的HTML生成）
  - **デザインコンセプト**: 美しい技術ブログサイト（参考LPフォルダのデザイン）
  - **生成方式**: 完全な静的HTMLファイル生成（.html形式）
  - **テンプレートエンジン**: Laravel Blade（HTMLテンプレート）+ React（コンポーネント）
  - **レイアウト設計**: 
    - ヘッダー: ナビゲーション + 検索機能
    - メインコンテンツ: 記事一覧・個別記事表示
    - サイドバー: カテゴリ・人気記事・広告枠
    - フッター: 会社情報・リンク
  - **レスポンシブデザイン**: モバイルファーストのアプローチを採用します。
  - **色彩設計**: 淡い色調をベースとし、以下のカラーパレットを使用します：
    - 背景色: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20`
    - カード背景: `bg-white/95`, `bg-card/90`
    - アクセント色: `bg-gradient-to-r from-blue-600 to-purple-600`
    - テキスト色: `text-gray-700`, `text-slate-800`
  - **視覚効果**: 
    - シャドウ: `shadow-lg`, `shadow-xl/20`
    - ホバー効果: `hover:shadow-2xl/30`, `hover:scale-105`
    - トランジション: `transition-all duration-300 ease-out`
    - グラデーション: `bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10`
  - **フォント**: Inter（本文）+ Playfair Display（見出し）
  - **SEO最適化**: 
    - メタタグの静的埋め込み
    - 構造化データの静的埋め込み
    - サイトマップ自動生成
    - 画像最適化とalt属性
  - **ファイル構成**:
    - `index.html` - トップページ
    - `articles/article-slug.html` - 個別記事ページ
    - `categories/category-slug.html` - カテゴリページ
    - `assets/` - CSS、JavaScript、画像ファイル

### 管理画面（Next.js）
  - **デザインコンセプト**: ダッシュボード型の管理画面
  - **サイドバーレイアウト**: 左サイドにナビゲーションメニューを配置
  - **色彩設計**: プロフェッショナルな色調
    - 背景色: `bg-slate-50/30`, `bg-gray-50/40`
    - カード背景: `bg-white/70`, `bg-card/60`
    - アクセント色: `bg-blue-500/80 hover:bg-blue-600/90`
  - **機能**: 
    - 記事生成フォーム
    - 記事一覧・編集画面
    - AI生成設定
    - HTML生成管理
    - 静的ファイル管理
    - HTMLプレビュー機能
    - サイト構築設定
    - アナリティクス表示

### バックエンド（Laravel）
  - RESTful APIのみを提供し、HTMLテンプレートからの静的ファイル生成を行います。
  - 統一されたAPIレスポンス形式を使用します。
  - 適切なHTTPステータスコードを返します。
  - APIリソースクラスを使用してデータの変換を行います。
  - AI APIとの連携処理を実装します。
  - 静的HTML生成処理を実装します。
  - ファイル管理処理を実装します。

## 状態管理とデータフェッチ

### 静的HTML生成（Next.js + Laravel）
  - **完全静的生成**: Next.jsのSSGとLaravelのBladeテンプレートを組み合わせた静的HTML生成
  - **テンプレートシステム**: Laravelのリソースビューを使用したHTMLテンプレート管理
  - **アセット管理**: CSS、JavaScript、画像の最適化と埋め込み
  - **SEO最適化**: 
    - 各HTMLファイルにメタタグを静的に埋め込み
    - 構造化データの静的埋め込み
    - サイトマップの自動生成と更新
  - **ファイル構造**:
    ```
    output/
    ├── index.html              # トップページ
    ├── articles/               # 記事ページ
    │   ├── nextjs-guide.html
    │   ├── react-tutorial.html
    │   └── ...
    ├── categories/             # カテゴリページ
    │   ├── programming.html
    │   ├── review.html
    │   └── ...
    ├── assets/                 # 静的アセット
    │   ├── css/
    │   │   └── main.css
    │   ├── js/
    │   │   └── main.js
    │   └── images/
    │       └── ...
    └── sitemap.xml            # サイトマップ
    ```

### 管理画面（Next.js SPA）
  - **データフェッチ**: SWRまたはTanStack Queryを使用し、キャッシュ戦略を実装します。
  - **状態管理**: Zustandを使用し、機能別にストアを分離します。
    ```typescript
    // stores/articleStore.ts - 記事管理
    // stores/generationStore.ts - AI生成管理
    // stores/htmlGeneratorStore.ts - HTML生成管理
    // stores/fileManagerStore.ts - ファイル管理
    // stores/authStore.ts - 認証管理
    ```
  - **API呼び出し**: 型安全なAPIクライアントを使用します。
    ```typescript
    // lib/api/client.ts - 基本クライアント
    // lib/api/articles.ts - 記事管理API
    // lib/api/generation.ts - AI生成API
    // lib/api/htmlGenerator.ts - HTML生成API
    // lib/api/fileManager.ts - ファイル管理API
    ```
  - **エラーハンドリング**: react-error-boundaryとToast通知を使用します。
  - **ローディング状態**: Suspenseとスケルトンコンポーネントを使用します。
  - **リアルタイム更新**: Server-Sent EventsでHTML生成進捗を表示します。

### バックエンド（Laravel）
  - セッション管理にはLaravelの組み込みセッション機能を使用します。
  - データベースアクセスにはEloquent ORMを使用し、適切なリレーションシップを定義します。
  - 認証にはLaravel Sanctumを使用し、トークンベースの認証を実装します。
  - AI APIとの連携処理を実装します。
  - 静的HTML生成処理を実装します。
  - ファイル管理とデプロイ処理を実装します。

## データベース

  - Eloquent ORMを使用してモデルを定義し、データベースとのやり取りを行います。
  - Laravelのマイグレーション機能を使用してデータベーススキーマを管理します。
  - 適切なインデックスと外部キー制約を設定し、データベースの整合性を保ちます。
  - クエリビルダーを使用して複雑なクエリを構築します。
  - データベースシーディングを使用してテストデータを準備します。

## フォームとバリデーション

### バックエンド（Laravel）
  - Laravelのフォームリクエストクラスを使用してバリデーションロジックを分離します。
  - APIエンドポイントでサーバーサイドバリデーションを実装します。
  - Laravelの組み込みバリデーションルールを活用し、カスタムルールが必要な場合は適切に実装します。
  - 統一されたエラーレスポンス形式を使用します。
  - CSRFプロテクションはAPI認証で代替します。

### フロントエンド（Next.js）
  - **フォームライブラリ**: React Hook Form + Zod を使用してフォームを構築します。
    ```typescript
    // lib/validations/student.ts
    import { z } from 'zod'
    
    export const studentSchema = z.object({
      name: z.string().min(1, '名前は必須です'),
      email: z.string().email('有効なメールアドレスを入力してください'),
    })
    ```
  - **リアルタイムバリデーション**: zodResolverを使用してクライアントサイドバリデーションを実装します。
  - **サーバーエラー処理**: APIから返されたバリデーションエラーを適切に表示します。
  - **フォーム状態管理**: 送信中、成功、エラー状態を管理します。
  - **アクセシビリティ**: 適切なaria属性とfocus管理を実装します。
  - **エラー表示**: フィールドレベルとフォームレベルのエラー表示を実装します。

## エラー処理とセキュリティ

### 共通原則
  - エラー処理とエッジケースを優先します。
  - エラー条件にはアーリーリターンを使用し、ガード句を実装して前提条件や無効な状態を早期に処理します。
  - 具体的なエラーメッセージを提供し、ユーザーフレンドリーなエラー表示を実装します。

### バックエンド（Laravel）
  - Laravelのログファサードを使用して適切なエラーログを記録します。
  - 例外処理にはtry-catch文を適切に使用し、カスタム例外クラスを必要に応じて作成します。
  - 統一されたAPIエラーレスポンス形式を使用します。
  - 適切なHTTPステータスコードを返します。
  - XSS攻撃を防ぐために、適切なデータサニタイゼーションを実装します。
  - SQLインジェクション攻撃を防ぐために、Eloquent ORMやクエリビルダーのパラメータバインディングを使用します。
  - Laravel Sanctumによる認証・認可を適切に実装します。
  - レート制限を実装してAPIの不正使用を防止します。

### フロントエンド（Next.js）
  - **Error Boundary**: react-error-boundaryを使用して包括的なエラーハンドリングを実装します。
  - **Toast通知**: shadcn/uiのToastコンポーネントを使用してユーザーフレンドリーな通知を表示します。
  - **API呼び出しエラー**: 統一されたエラーハンドリング関数を作成します。
    ```typescript
    // lib/api/error-handler.ts
    export function handleApiError(error: unknown) {
      // 統一されたエラー処理ロジック
    }
    ```
  - **入力検証**: Zodを使用してクライアントサイドの検証を実装します。
  - **認証トークン**: httpOnlyクッキーまたはsecureなlocalStorageを使用します。
  - **XSS対策**: DOMPurifyを使用してユーザー入力をサニタイズします。
  - **CSP**: Content Security Policyを適切に設定します。

## 最適化とパフォーマンス

### バックエンド（Laravel）
  - データベースクエリを最適化し、N+1問題を避けるためにEagerローディングを使用します。
  - Laravelのキャッシュ機能を活用して、頻繁にアクセスされるデータをキャッシュします。
  - 不要なミドルウェアやサービスプロバイダーの読み込みを避けます。
  - データベースインデックスを適切に設定し、クエリパフォーマンスを向上させます。
  - APIレスポンスの最適化（必要なデータのみを返す）を行います。
  - ページネーションを適切に実装し、大量データの処理を効率化します。

### フロントエンド（Next.js）
  - **画像最適化**: Next.jsのImageコンポーネントを使用し、WebP変換と遅延読み込みを実装します。
  - **コード分割**: 動的インポートを使用して機能別にコードを分割します。
    ```typescript
    // 動的インポート例
    const AdminPanel = dynamic(() => import('./AdminPanel'), {
      loading: () => <AdminPanelSkeleton />,
    })
    ```
  - **Server Components**: 静的コンテンツやデータフェッチにはServer Componentsを使用します。
  - **Client Components**: インタラクションが必要な部分のみClient Componentsを使用します。
  - **メモ化**: React.memo、useMemo、useCallbackを適切に使用します。
  - **バンドル最適化**: webpack-bundle-analyzerを使用してバンドルサイズを監視します。
  - **プリフェッチ**: Next.jsのLinkコンポーネントのprefetch機能を活用します。
  - **キャッシュ戦略**: 
    - SWR/TanStack Queryでデータキャッシュ
    - Next.jsのISRでページキャッシュ
    - CDNでアセットキャッシュ

## SEO記事生成・静的HTML生成システム固有の要件

### AI記事生成機能
- **AI API統合**: OpenAI GPT-4、Claude、Geminiとの連携
- **生成テンプレート**: 記事タイプ別の生成テンプレート管理
- **キーワード最適化**: SEOキーワードを考慮した記事生成
- **文章品質制御**: 文体、トーン、文字数の制御
- **一括生成**: 複数記事の同時生成とキュー処理
- **生成履歴**: 生成プロセスの記録と分析

### 静的HTML生成機能
- **テンプレートエンジン**: Laravel Blade + React コンポーネント
- **レイアウト管理**: ヘッダー、フッター、サイドバーの統一
- **ページ生成**: 
  - 記事ページ（`articles/slug.html`）
  - カテゴリページ（`categories/slug.html`）
  - インデックスページ（`index.html`）
  - 固定ページ（`about.html`, `contact.html`等）
- **アセット管理**: CSS、JavaScript、画像の最適化と埋め込み
- **ファイル管理**: 生成されたHTMLファイルの管理と組織化
- **プレビュー機能**: 生成前のHTMLプレビュー

### SEO最適化機能
- **メタデータ埋め込み**: タイトル、ディスクリプション、キーワードの静的埋め込み
- **構造化データ**: JSON-LDの静的埋め込み（Article、BreadcrumbList等）
- **内部リンク**: 関連記事の自動リンク生成
- **画像最適化**: WebP変換、alt属性の自動生成
- **サイトマップ**: HTML生成時の自動更新
- **パフォーマンス**: 軽量HTMLファイルの生成
- **クローラー対応**: 完全な静的HTMLによる確実なインデックス

### ファイル管理機能
- **出力管理**: 生成されたHTMLファイルの管理
- **バージョン管理**: ファイルの版管理と差分確認
- **デプロイ機能**: FTP、SFTP、S3等への自動デプロイ
- **ファイル最適化**: HTMLの圧縮とクリーンアップ
- **一括操作**: 全サイトの再生成、特定カテゴリの生成等
- **バックアップ**: 生成ファイルの定期バックアップ

### コンテンツ管理機能
- **カテゴリ管理**: 階層カテゴリとタグシステム
- **エディター**: Markdownエディターと画像アップロード
- **HTMLテンプレート管理**: 記事、カテゴリ、インデックス用テンプレート
- **デザイン設定**: サイト全体のデザインとレイアウト設定
- **ナビゲーション管理**: メニュー構造の設定と管理
- **版管理**: コンテンツの版管理と差分表示

### アナリティクス機能
- **ファイル分析**: 生成ファイル数、サイズ、最終更新日
- **SEO分析**: 検索順位、キーワード分析（外部ツール連携）
- **AI生成効果測定**: AI記事の成果測定
- **サイト統計**: ページ数、カテゴリ別統計
- **レポート機能**: 週次・月次レポートの自動生成

### 技術要件
- **完全静的生成**: 依存関係のない独立したHTMLファイル
- **高速配信**: 任意のWebサーバーでの高速配信
- **SEO対応**: 完全な静的HTMLによる検索エンジン最適化
- **レスポンシブ**: モバイル対応の静的HTML生成
- **アクセシビリティ**: WCAG準拠の静的HTML生成

### 収益化機能
- **広告統合**: Google AdSense、Amazon Associates等の静的埋め込み
- **アフィリエイト**: 商品リンクの静的埋め込み
- **有料記事**: パスワード保護機能（JavaScript）
- **メール配信**: 静的フォームとサードパーティ連携

### セキュリティ要件
- **静的ファイル**: サーバーサイド脆弱性の排除
- **管理画面保護**: API認証とレート制限
- **コンテンツ検証**: 生成記事の品質チェック
- **バックアップ**: 定期的なデータとファイルバックアップ
- **監査ログ**: 管理操作とファイル生成の記録

## その他の技術

### バックエンド（Laravel）
  - 支払い処理とサブスクリプション管理にはStripeを実装します（将来実装）。
  - 国際化にはLaravelの多言語機能を使用します。
  - ファイルアップロードにはLaravelのストレージ機能を使用します。
  - メール送信にはLaravelのメール機能とキュー処理を使用します。
  - 認証にはLaravel Sanctumを使用します。
  - APIドキュメントの生成にはL5-Swaggerを使用します。
  - **AI API統合**: OpenAI、Claude、Gemini APIとの連携サービスを実装します。
  - **SEO分析**: Google Analytics、Search Console APIとの連携を実装します。
  - **キュー処理**: 記事生成とHTML生成の非同期処理を実装します。
  - **スケジューラー**: 定期的なサイト再生成とバックアップを実装します。
  - **ファイル管理**: 静的ファイルの生成、管理、デプロイを実装します。
  - **テンプレート管理**: Bladeテンプレートによる柔軟なHTML生成を実装します。

### フロントエンド（Next.js）
  - **国際化**: next-intlを使用してi18n機能を実装します（日本語メイン）。
  - **画像最適化**: Next.jsのImageコンポーネントでWebP変換と遅延読み込みを実装します。
  - **SEO最適化**: Next.jsのMetadata APIを使用してメタタグを動的に生成します。
  - **状態管理**: Zustandを使用して軽量で型安全な状態管理を実装します。
  - **スタイリング**: Tailwind CSS + shadcn/uiで統一されたデザインシステムを構築します。
  - **フォーム処理**: React Hook Form + Zodで型安全なフォーム処理を実装します。
  - **認証**: NextAuthまたはAuth0を使用した認証システムを実装します（管理画面のみ）。
  - **静的サイト**: Next.jsのSSGで静的サイトのテンプレートを生成します。
  - **HTML生成**: サーバーサイドレンダリングで完全な静的HTMLを生成します。
  - **ファイル管理**: 生成されたHTMLファイルの管理機能を実装します。

## テスト

### バックエンド（Laravel）
  - PHPUnitを使用してユニットテストと機能テストを記述します。
  - データベーステストにはテストデータベースとファクトリーを使用します。
  - Laravelのテスト機能を活用してAPIテストを実装します。
  - フィーチャーテストでAPIエンドポイントをテストします。
  - モック機能を使用して外部サービスとの連携をテストします。

### フロントエンド（Next.js）
  - **ユニットテスト**: Jest + React Testing Libraryを使用します。
  - **コンポーネントテスト**: Storybookを使用してコンポーネントの動作確認を行います。
  - **E2Eテスト**: Playwrightを使用してユーザーシナリオをテストします。
  - **視覚回帰テスト**: Chromatic（Storybook）を使用してUI変更を検証します。
  - **APIモック**: MSW（Mock Service Worker）を使用してAPIをモックします。
  - **アクセシビリティテスト**: axe-coreを使用してWCAG準拠を確認します。
  - **パフォーマンステスト**: Lighthouse CIを使用してパフォーマンスを監視します。
  - **テストカバレッジ**: Jest coverageを使用してテストカバレッジを監視します。

## 主な規約

### 共通規約
  - Laravelの規約とベストプラクティスに従います。
  - RESTful APIの設計原則を遵守します。
  - API分離型アーキテクチャを維持し、バックエンドとフロントエンドの責任を明確に分離します。
  - 統一されたAPIレスポンス形式を使用します。
  - 適切なHTTPステータスコードを返します。

### バックエンド（Laravel）
  - コントローラーはRESTfulな設計に従い、適切なHTTPメソッドを使用します。
  - サービスクラスを使用してビジネスロジックをコントローラーから分離します。
  - リソースクラスを使用してAPIレスポンスを標準化します。
  - ミドルウェアを適切に使用して横断的関心事を処理します。
  - 認証処理は役割別に専用のサービスクラス（例：StudentAuthService）を使用します。
  - スケジューリングロジックはSchedulingServiceクラスに集約します。

### フロントエンド（Next.js）
  - **コンポーネント設計**: 機能別（Blog/Admin/HTML Generator）にコンポーネントを分離します。
  - **ディレクトリ構造**: App Routerの規約に従い、サイト別にページを構成します。
  - **型安全性**: TypeScriptを厳密に使用し、APIレスポンスの型を定義します。
  - **コンポーネント分離**: 
    - Server Components: HTML生成、SEO最適化、静的コンテンツ
    - Client Components: 管理画面のインタラクション、フォーム処理
  - **再利用性**: shadcn/uiをベースとしたコンポーネントライブラリを構築します。
  - **一貫性**: デザイントークンとスタイルガイドに従います。
  - **SEO対応**: メタタグ、構造化データを静的HTMLに埋め込みます。
  - **パフォーマンス**: 軽量で高速な静的HTMLファイルを生成します。

## 開発環境とコード生成

### Laravel Sail使用
  - `./vendor/bin/sail artisan [command]` でArtisanコマンドを実行
  - `./vendor/bin/sail composer [command]` でComposerコマンドを実行
  - `./vendor/bin/sail npm [command]` でNPMコマンドを実行（フロントエンド側では直接npm使用）

### Artisanコマンドによるコード生成（手動作成禁止）
  - モデル生成: `make:model EntityName -m`
  - APIコントローラ生成: `make:controller Api/EntityNamesController --api --model=EntityName`
  - フォームリクエスト生成: `make:request Api/EntityNameRequest`
  - APIリソース生成: `make:resource EntityNameResource`
  - ポリシー生成: `make:policy EntityNamePolicy --model=EntityName`
  - テスト生成: `make:test Api/EntityNameTest`

### Next.js開発環境
  - **開発サーバー**: `npm run dev` で開発サーバーを起動
  - **ビルド**: `npm run build` でプロダクションビルドを実行
  - **本番サーバー**: `npm run start` でプロダクションサーバーを起動
  - **コード品質**: `npm run lint` でESLintチェックを実行
  - **型チェック**: `npm run type-check` でTypeScriptチェックを実行
  - **shadcn/ui**: `npx shadcn-ui@latest add [component]` でコンポーネントを追加
  - **パッケージ管理**: pnpmを推奨（npmも可）

### 開発フロー
  1. **プロジェクト初期化**:
     ```bash
     # フロントエンド
     npx create-next-app@latest frontend --typescript --tailwind --app
     cd frontend
     npx shadcn-ui@latest init
     
     # バックエンド
     ./vendor/bin/sail artisan install:api
     ./vendor/bin/sail artisan make:model [ModelName] -m
     ```
  
  2. **コンポーネント開発**:
     ```bash
     # shadcn/uiコンポーネント追加
     npx shadcn-ui@latest add button card input
     
     # カスタムコンポーネント作成
     # src/components/features/[feature]/[component].tsx
     ```

  3. **API開発**:
     ```bash
     # Laravel側
     ./vendor/bin/sail artisan make:controller Api/[EntityName]Controller --api
     ./vendor/bin/sail artisan make:request Api/[EntityName]Request
     ./vendor/bin/sail artisan make:resource [EntityName]Resource
     ```

### 設定ファイル管理
  - **環境変数**: `.env.local`（フロントエンド）、`.env`（バックエンド）
  - **型定義**: 自動生成ツールを使用してAPI型定義を同期
  - **設定ファイル**: TypeScriptとTailwind設定を統一
  - **リンター**: ESLint + Prettier設定を統一
  - **コミット**: Conventional Commitsを使用

## UI/UXガイドライン

### デザインシステム（shadcn/ui準拠）
  - **基本カラーパレット（淡い色調）**:
    - 背景色: `bg-slate-50/30`, `bg-gray-50/40`, `bg-white/60`
    - カード背景: `bg-white/70`, `bg-card/60`, `backdrop-blur-sm`
    - 主要アクション: `bg-blue-500/80 hover:bg-blue-600/90`
    - セカンダリアクション: `bg-slate-200/60 hover:bg-slate-300/70`
    - 成功アクション: `bg-green-500/80 hover:bg-green-600/90`
    - 警告アクション: `bg-amber-400/80 hover:bg-amber-500/90`
    - 危険アクション: `bg-red-400/80 hover:bg-red-500/90`
    - テキスト色: `text-slate-600`, `text-gray-700`, `text-slate-800`
    - 薄いテキスト: `text-slate-500`, `text-gray-500`

### サイドバーレイアウト（管理画面）
  ```typescript
  // 管理画面サイドバー構造
  const sidebarItems = [
    { title: "ダッシュボード", href: "/dashboard", icon: Home },
    { title: "記事管理", href: "/articles", icon: FileText },
    { title: "AI記事生成", href: "/generation", icon: Bot },
    { title: "HTML生成", href: "/html-generator", icon: Code },
    { title: "ファイル管理", href: "/files", icon: Folder },
    { title: "カテゴリ管理", href: "/categories", icon: Tag },
    { title: "サイト設定", href: "/site-settings", icon: Globe },
    { title: "テンプレート", href: "/templates", icon: Layout },
    { title: "デプロイ", href: "/deploy", icon: Upload },
    { title: "設定", href: "/settings", icon: Settings },
  ]
  ```

### 視覚効果とアニメーション
  - **シャドウ効果**: 
    - カード: `shadow-sm hover:shadow-md/20`
    - フローティング要素: `shadow-lg/10`
    - メニュー項目: `hover:shadow-sm/30`
  - **ホバー効果**: 
    - ボタン: `hover:shadow-lg/20 hover:scale-[1.02]`
    - カード: `hover:shadow-md/30 hover:bg-white/80`
    - サイドバー項目: `hover:bg-slate-100/50`
  - **トランジション**: 
    - 基本: `transition-all duration-200 ease-in-out`
    - 複雑: `transition-[background-color,box-shadow,transform] duration-300 ease-out`
  - **ブラー効果**: 
    - 背景: `backdrop-blur-sm`
    - オーバーレイ: `backdrop-blur-md`

### コンポーネント設計
  - **カードコンポーネント**:
    ```typescript
    className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md/20 transition-all duration-200 border border-slate-200/50"
    ```
  - **ボタンコンポーネント**:
    ```typescript
    // 主要ボタン
    className="bg-blue-500/80 hover:bg-blue-600/90 text-white shadow-sm hover:shadow-md/20 transition-all duration-200"
    
    // セカンダリボタン
    className="bg-slate-100/60 hover:bg-slate-200/70 text-slate-700 shadow-sm hover:shadow-md/20 transition-all duration-200"
    ```

### レスポンシブデザイン
  - **サイドバー**: 
    - デスクトップ: 固定幅256px、常時表示
    - タブレット: 折りたたみ可能
    - モバイル: オーバーレイ表示、ハンバーガーメニュー
  - **グリッドレイアウト**: 
    - デスクトップ: `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`
    - タブレット: `grid-cols-1 md:grid-cols-2`
    - モバイル: `grid-cols-1`

### フォームデザイン
  - **入力フィールド**:
    ```typescript
    className="bg-white/60 border border-slate-200/50 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
    ```
  - **ラベル**: `text-slate-700 font-medium text-sm`
  - **エラー表示**: `text-red-500/80 text-sm mt-1`
  - **ヘルプテキスト**: `text-slate-500 text-xs mt-1`

### 状態表示
  - **ローディング**: Skeletonコンポーネントと淡いアニメーション
  - **エラー**: Toast通知とインラインエラー表示
  - **成功**: 緑色のToast通知とアイコン
  - **空の状態**: イラストレーション付きの優しいメッセージ

### アクセシビリティ
  - **キーボードナビゲーション**: 適切なfocus状態とtabindex
  - **スクリーンリーダー**: aria-labelとaria-describedby
  - **カラーコントラスト**: WCAG AA準拠
  - **フォーカス表示**: `focus:outline-none focus:ring-2 focus:ring-blue-500/20`

## 多言語対応（日本語・英語）

### 翻訳ファイル構造
**バックエンド（Laravel）**
  - 各エンティティ専用の翻訳ファイル: `lang/ja/entity_names.php`
  - 共通翻訳: `lang/ja/common.php`
  - 標準的な翻訳キー: `management_title`, `create_title`, `edit_title`, `view_title`
  - アクション翻訳: `actions`, `view`, `edit`, `delete`, `create`, `update`, `cancel`, `back`
  - メッセージ翻訳: `created_successfully`, `updated_successfully`, `deleted_successfully`

**フロントエンド（Next.js）**
  - 各言語用の翻訳ファイル: `src/locales/ja/common.json`, `src/locales/en/common.json`
  - コンポーネント別翻訳ファイル: `src/locales/ja/components.json`
  - Next.jsの国際化機能を使用した言語切り替え機能

### APIエンドポイント設計
```
/api/v1/
├── admin/
│   ├── administrators/
│   │   ├── GET /api/v1/admin/administrators
│   │   ├── POST /api/v1/admin/administrators
│   │   ├── GET /api/v1/admin/administrators/{id}
│   │   ├── PUT /api/v1/admin/administrators/{id}
│   │   └── DELETE /api/v1/admin/administrators/{id}
│   ├── teachers/
│   ├── students/
│   ├── courses/
│   ├── buildings/
│   ├── classrooms/
│   └── schedules/
├── teacher/
│   ├── schedules/
│   ├── availability/
│   └── students/
└── student/
    ├── schedules/
    └── courses/
```

### 認証・認可エンドポイント
```
/api/v1/auth/
├── POST /login
├── POST /logout
├── POST /refresh
├── GET /user
└── PUT /user
```

## 実装例とベストプラクティス

### 静的HTML生成レイアウト実装例
```typescript
// src/components/layout/StaticSiteLayout.tsx
import { ReactNode } from 'react'

interface StaticSiteLayoutProps {
  children: ReactNode
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
}

export function StaticSiteLayout({ 
  children, 
  title, 
  description, 
  keywords,
  canonicalUrl 
}: StaticSiteLayoutProps) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* 構造化データ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
          })}
        </script>
        
        {/* CSS */}
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main className="lg:col-span-3">
              {children}
            </main>
            <aside className="lg:col-span-1">
              <Sidebar />
            </aside>
          </div>
        </div>
        <Footer />
        
        {/* JavaScript */}
        <script src="/assets/js/main.js"></script>
      </body>
    </html>
  )
}
```

### HTML生成サービス実装例
```php
// app/Services/StaticHtmlGeneratorService.php
<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\File;

class StaticHtmlGeneratorService
{
    protected string $outputPath;

    public function __construct()
    {
        $this->outputPath = base_path('output');
    }

    /**
     * 単一記事のHTML生成
     */
    public function generateArticleHtml(Article $article): string
    {
        $data = [
            'article' => $article,
            'title' => $article->title . ' | TechVibe',
            'description' => $article->meta_description,
            'keywords' => $article->keywords,
            'canonicalUrl' => "https://techvibe.com/articles/{$article->slug}.html",
            'relatedArticles' => $this->getRelatedArticles($article),
        ];

        $html = View::make('templates.article', $data)->render();
        
        $filePath = $this->outputPath . "/articles/{$article->slug}.html";
        $this->ensureDirectoryExists(dirname($filePath));
        File::put($filePath, $html);

        return $filePath;
    }

    /**
     * 全サイトHTML生成
     */
    public function generateFullSite(): array
    {
        $generatedFiles = [];
        
        // インデックスページ生成
        $generatedFiles[] = $this->generateIndexPage();
        
        // 記事ページ生成
        Article::published()->chunk(50, function ($articles) use (&$generatedFiles) {
            foreach ($articles as $article) {
                $generatedFiles[] = $this->generateArticleHtml($article);
            }
        });
        
        // カテゴリページ生成
        Category::all()->each(function ($category) use (&$generatedFiles) {
            $generatedFiles[] = $this->generateCategoryPage($category);
        });
        
        // サイトマップ生成
        $generatedFiles[] = $this->generateSitemap();
        
        return $generatedFiles;
    }

    /**
     * インデックスページ生成
     */
    protected function generateIndexPage(): string
    {
        $data = [
            'articles' => Article::published()->latest()->take(10)->get(),
            'featuredArticles' => Article::featured()->take(3)->get(),
            'categories' => Category::withCount('articles')->get(),
            'title' => 'TechVibe - 未来を創るテクノロジーメディア',
            'description' => '最新のテクノロジー、プログラミング、ガジェット情報を美しいデザインでお届けする次世代テックメディア',
            'keywords' => ['テクノロジー', 'プログラミング', 'ガジェット', 'AI', 'Web開発'],
        ];

        $html = View::make('templates.index', $data)->render();
        
        $filePath = $this->outputPath . '/index.html';
        File::put($filePath, $html);

        return $filePath;
    }

    /**
     * ディレクトリ存在確認・作成
     */
    protected function ensureDirectoryExists(string $directory): void
    {
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }
}
```

### 静的HTML用のBladeテンプレート例
```blade
{{-- resources/views/templates/article.blade.php --}}
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    <meta name="keywords" content="{{ implode(', ', $keywords) }}">
    <link rel="canonical" href="{{ $canonicalUrl }}">
    
    {{-- Open Graph --}}
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    @if($article->featured_image)
        <meta property="og:image" content="{{ $article->featured_image }}">
    @endif
    
    {{-- 構造化データ --}}
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{{ $article->title }}",
        "description": "{{ $description }}",
        "author": {
            "@type": "Person",
            "name": "{{ $article->author->name }}"
        },
        "datePublished": "{{ $article->published_at->toISOString() }}",
        "dateModified": "{{ $article->updated_at->toISOString() }}",
        "publisher": {
            "@type": "Organization",
            "name": "TechVibe",
            "logo": {
                "@type": "ImageObject",
                "url": "https://techvibe.com/assets/images/logo.png"
            }
        }
    }
    </script>
    
    {{-- CSS --}}
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/article.css">
</head>
<body class="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
    {{-- ヘッダー --}}
    @include('templates.partials.header')
    
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main class="lg:col-span-3">
                <article class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
                    {{-- パンくずリスト --}}
                    <nav class="text-sm text-gray-600 mb-6">
                        <a href="/" class="hover:text-blue-600">ホーム</a>
                        <span class="mx-2">/</span>
                        <a href="/categories/{{ $article->category->slug }}.html" class="hover:text-blue-600">
                            {{ $article->category->name }}
                        </a>
                        <span class="mx-2">/</span>
                        <span class="text-gray-800">{{ $article->title }}</span>
                    </nav>
                    
                    {{-- 記事ヘッダー --}}
                    <header class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $article->title }}</h1>
                        
                        <div class="flex items-center text-sm text-gray-600 space-x-4">
                            <span>{{ $article->author->name }}</span>
                            <span>{{ $article->published_at->format('Y年m月d日') }}</span>
                            <span>読了時間: {{ $article->read_time }}分</span>
                        </div>
                        
                        @if($article->featured_image)
                            <img src="{{ $article->featured_image }}" 
                                 alt="{{ $article->title }}" 
                                 class="w-full h-64 object-cover rounded-lg mt-6">
                        @endif
                    </header>
                    
                    {{-- 記事本文 --}}
                    <div class="prose prose-lg max-w-none">
                        {!! $article->content_html !!}
                    </div>
                    
                    {{-- タグ --}}
                    @if($article->tags->count() > 0)
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <h3 class="text-sm font-medium text-gray-700 mb-2">タグ:</h3>
                            <div class="flex flex-wrap gap-2">
                                @foreach($article->tags as $tag)
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {{ $tag->name }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </article>
                
                {{-- 関連記事 --}}
                @if($relatedArticles->count() > 0)
                    <section class="mt-12">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            @foreach($relatedArticles as $related)
                                @include('templates.partials.article-card', ['article' => $related])
                            @endforeach
                        </div>
                    </section>
                @endif
            </main>
            
            {{-- サイドバー --}}
            <aside class="lg:col-span-1">
                @include('templates.partials.sidebar')
            </aside>
        </div>
    </div>
    
    {{-- フッター --}}
    @include('templates.partials.footer')
    
    {{-- JavaScript --}}
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

### HTML生成管理ストア実装例
```typescript
// stores/htmlGeneratorStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HtmlGeneratorState {
  isGenerating: boolean
  progress: number
  generatedFiles: string[]
  error: string | null
  generateSingleArticle: (articleId: number) => Promise<void>
  generateFullSite: () => Promise<void>
  resetGeneration: () => void
}

export const useHtmlGeneratorStore = create<HtmlGeneratorState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      progress: 0,
      generatedFiles: [],
      error: null,
      
      generateSingleArticle: async (articleId) => {
        set({ isGenerating: true, progress: 0, error: null })
        
        try {
          const response = await fetch('/api/v1/html-generator/generate-html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article_id: articleId }),
          })

          if (!response.ok) throw new Error('HTML生成に失敗しました')

          const result = await response.json()
          set({ 
            generatedFiles: [result.file_path],
            progress: 100 
          })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isGenerating: false })
        }
      },

      generateFullSite: async () => {
        set({ isGenerating: true, progress: 0, error: null, generatedFiles: [] })
        
        try {
          const response = await fetch('/api/v1/html-generator/generate-site', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })

          if (!response.ok) throw new Error('サイト生成に失敗しました')

          // Server-Sent Eventsで進捗を受信
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader?.read() || {}
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'progress') {
                  set({ progress: data.progress })
                } else if (data.type === 'file_generated') {
                  set(state => ({ 
                    generatedFiles: [...state.generatedFiles, data.file_path] 
                  }))
                }
              }
            }
          }
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isGenerating: false })
        }
      },

      resetGeneration: () => set({
        isGenerating: false,
        progress: 0,
        generatedFiles: [],
        error: null,
      }),
    }),
    { name: 'html-generator-storage' }
  )
)
```

### 開発時の注意点
1. **完全な静的HTML**: 外部依存のない独立したHTMLファイルを生成
2. **SEO最適化**: すべてのメタデータを静的に埋め込み
3. **ファイル管理**: 生成されたHTMLファイルの適切な管理
4. **テンプレート設計**: 柔軟で再利用可能なテンプレート構造
5. **パフォーマンス**: 軽量で高速なHTMLファイルの生成
6. **アクセシビリティ**: WCAG準拠の静的HTML生成

### 記事カードコンポーネント
```typescript
// src/components/blog/ArticleCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye } from 'lucide-react'

interface ArticleCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  image: string
  href: string
  readTime: string
  views: string
}

export default function ArticleCard({
  title,
  excerpt,
  date,
  author,
  category,
  image,
  href,
  readTime,
  views,
}: ArticleCardProps) {
  return (
    <article className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl/30 transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={href}>{title}</Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{views}</span>
            </div>
          </div>
          <span className="text-blue-600 font-medium">{author}</span>
        </div>
      </div>
    </article>
  )
}
```

### AI記事生成サービス実装例
```typescript
// stores/generationStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GenerationState {
  isGenerating: boolean
  progress: number
  generatedArticle: string | null
  error: string | null
  generateArticle: (prompt: string, settings: GenerationSettings) => Promise<void>
  resetGeneration: () => void
}

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      progress: 0,
      generatedArticle: null,
      error: null,
      
      generateArticle: async (prompt, settings) => {
        set({ isGenerating: true, progress: 0, error: null })
        
        try {
          const response = await fetch('/api/v1/generation/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, settings }),
          })

          if (!response.ok) throw new Error('生成に失敗しました')

          const reader = response.body?.getReader()
          const decoder = new TextDecoder()
          let content = ''

          while (true) {
            const { done, value } = await reader?.read() || {}
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'progress') {
                  set({ progress: data.progress })
                } else if (data.type === 'content') {
                  content += data.content
                  set({ generatedArticle: content })
                }
              }
            }
          }
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isGenerating: false })
        }
      },

      resetGeneration: () => set({
        isGenerating: false,
        progress: 0,
        generatedArticle: null,
        error: null,
      }),
    }),
    { name: 'generation-storage' }
  )
)
```

### SEO最適化関数
```typescript
// lib/seo/metadata.ts
import { Metadata } from 'next'

interface ArticleMetadataProps {
  title: string
  description: string
  keywords: string[]
  author: string
  publishedTime: string
  category: string
  image?: string
}

export function generateArticleMetadata({
  title,
  description,
  keywords,
  author,
  publishedTime,
  category,
  image,
}: ArticleMetadataProps): Metadata {
  const fullTitle = `${title} | TechVibe`
  const url = `https://techvibe.example.com/article/${title.toLowerCase().replace(/\s+/g, '-')}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      publishedTime,
      authors: [author],
      section: category,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : [],
    },
    
    alternates: {
      canonical: url,
    },
  }
}

// 構造化データ生成
export function generateArticleStructuredData({
  title,
  description,
  author,
  publishedTime,
  image,
  category,
}: ArticleMetadataProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedTime,
    image: image ? [image] : [],
    articleSection: category,
    publisher: {
      '@type': 'Organization',
      name: 'TechVibe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://techvibe.example.com/logo.png',
      },
    },
  }
}
```

### Next.js SSG設定例
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  async generateBuildId() {
    return 'seo-blog-' + Date.now()
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 開発時の注意点
1. **完全な静的HTML**: 外部依存のない独立したHTMLファイルを生成
2. **SEO最適化**: すべてのメタデータを静的に埋め込み
3. **ファイル管理**: 生成されたHTMLファイルの適切な管理
4. **テンプレート設計**: 柔軟で再利用可能なテンプレート構造
5. **パフォーマンス**: 軽量で高速なHTMLファイルの生成
6. **アクセシビリティ**: WCAG準拠の静的HTML生成
7. **MDファイルの使用禁止**: ドキュメントはコード内コメントまたはStorybookで管理
8. **型安全性**: すべてのAPIレスポンスに型を定義
9. **エラーハンドリング**: 統一されたエラー処理フローを実装
10. **デプロイ対応**: 任意のWebサーバーで配信可能な構造

### 色調の統一
```css
/* globals.css - カスタムカラー定義 */
:root {
  --soft-bg: 210 20% 98%;
  --soft-card: 0 0% 100% / 0.7;
  --soft-border: 215 20% 85% / 0.5;
  --soft-hover: 0 0% 100% / 0.8;
  --soft-shadow: 0 0% 0% / 0.1;
}
```

