# システムアーキテクチャ

## システム概要

このプロジェクトは、AIを活用してSEOに強い記事を自動生成し、完全な静的HTMLファイルとして記事サイトを構築する「記事ファイルメーカー」システムです。

## 基本アーキテクチャ

- **バックエンド**: Laravel 12 (PHP 8.3) - RESTful API（記事生成・管理・HTML生成）
- **フロントエンド**: Next.js (React 18) - 静的HTMLファイル生成（SSG）
- **データベース**: MySQL 8.0（記事データ・設定管理）
- **開発環境**: Laravel Sail (Docker)
- **認証**: Laravel Sanctum（管理者用）
- **AI統合**: OpenAI API、Claude API（記事生成）
- **SEO最適化**: 静的HTML生成 + メタデータ埋め込み
- **ファイル生成**: 完全な静的HTMLファイル出力システム

## プロジェクト構造

```
seo-article-generator/
├── backend/                    # Laravel 12 プロジェクト
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/       # API コントローラー
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── Article.php    # 記事モデル
│   │   │   ├── Category.php   # カテゴリモデル
│   │   │   └── Tag.php        # タグモデル
│   │   ├── Services/          # AI生成・HTML生成サービス
│   │   │   ├── ArticleGeneratorService.php
│   │   │   ├── SEOOptimizerService.php
│   │   │   ├── OpenAIService.php
│   │   │   ├── StaticHtmlGeneratorService.php  # 静的HTML生成
│   │   │   └── FileManagerService.php          # ファイル管理
│   │   └── Repositories/      # データアクセス層
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── resources/
│   │   └── views/
│   │       └── templates/     # HTML生成用テンプレート
│   │           ├── article.blade.php
│   │           ├── index.blade.php
│   │           └── category.blade.php
│   └── routes/api.php
├── frontend/                   # Next.js プロジェクト（静的サイト生成）
│   ├── src/
│   │   ├── app/              # App Router
│   │   │   ├── (blog)/       # ブログ関連ページ
│   │   │   ├── article/      # 個別記事ページ
│   │   │   ├── category/     # カテゴリページ
│   │   │   ├── about/        # 会社情報
│   │   │   ├── contact/      # お問い合わせ
│   │   │   ├── privacy-policy/ # プライバシーポリシー
│   │   │   ├── terms/        # 利用規約
│   │   │   ├── layout.tsx    # ルートレイアウト
│   │   │   └── page.tsx      # トップページ
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui コンポーネント
│   │   │   ├── layout/       # レイアウトコンポーネント
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── blog/         # ブログ関連コンポーネント
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleSidebar.tsx
│   │   │   │   └── CategoryGrid.tsx
│   │   │   └── shared/       # 共通コンポーネント
│   │   ├── lib/
│   │   │   ├── api/          # API クライアント
│   │   │   ├── utils/        # ユーティリティ関数
│   │   │   ├── seo/          # SEO関連機能
│   │   │   └── static-generator/ # 静的生成処理
│   │   ├── hooks/            # カスタムフック
│   │   ├── types/            # TypeScript型定義
│   │   └── styles/           # スタイルファイル
│   ├── public/
│   │   ├── images/           # 画像ファイル
│   │   └── sitemap.xml       # サイトマップ
│   ├── dist/                 # 生成された静的ファイル
│   │   ├── index.html        # トップページ
│   │   ├── articles/         # 記事HTMLファイル
│   │   │   ├── article-1.html
│   │   │   ├── article-2.html
│   │   │   └── ...
│   │   ├── categories/       # カテゴリページ
│   │   │   ├── programming.html
│   │   │   ├── gadget.html
│   │   │   └── ...
│   │   ├── assets/           # CSS・JS・画像
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   └── images/
│   │   └── sitemap.xml       # サイトマップ
│   └── next.config.js        # 静的生成設定
├── admin-panel/                # 管理画面（Next.js）
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/       # 認証関連
│   │   │   ├── dashboard/    # ダッシュボード
│   │   │   ├── articles/     # 記事管理
│   │   │   ├── generation/   # AI記事生成
│   │   │   ├── html-generator/ # HTML生成管理
│   │   │   └── settings/     # 設定管理
│   │   └── components/
│   │       ├── forms/        # 記事生成フォーム
│   │       ├── tables/       # データテーブル
│   │       ├── charts/       # 分析チャート
│   │       └── html-preview/ # HTML生成プレビュー
│   └── package.json
├── output/                     # 最終出力ディレクトリ
│   ├── index.html             # 完全な静的HTMLファイル
│   ├── articles/              # 記事HTMLファイル
│   ├── categories/            # カテゴリHTMLファイル
│   ├── assets/                # 静的アセット
│   └── sitemap.xml            # サイトマップ
└── docker-compose.yml
```

## 認証システム

- Laravel Sanctumベースの認証システム（管理者用のみ）
- 管理者のみログイン可能（記事生成・編集・HTML生成権限）
- 生成されたHTMLファイルは完全に静的（認証不要）
- SPA対応のトークンベース認証（管理画面）
- 静的ファイルは任意のWebサーバーで配信可能

## データフロー

1. **記事生成フロー**:
   ```
   管理画面 → AI API → 記事データ → データベース
   ```

2. **HTML生成フロー**:
   ```
   記事データ → Laravel Blade → 静的HTML → ファイルシステム
   ```

3. **配信フロー**:
   ```
   静的HTMLファイル → Webサーバー → ユーザー
   ```

## 技術的特徴

- **完全静的生成**: 外部依存のない独立したHTMLファイル
- **SEO最適化**: メタデータの静的埋め込み
- **高速配信**: 任意のWebサーバーでの高速配信
- **AI統合**: 高品質な記事の自動生成
- **管理機能**: 直感的な管理画面
- **拡張性**: モジュール化された設計
