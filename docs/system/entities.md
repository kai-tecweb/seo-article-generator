# エンティティ設計

## 主要エンティティ

### Article（記事）
AI生成記事のメインエンティティ

**属性:**
- `id`: 記事ID
- `title`: タイトル
- `slug`: URL用スラッグ
- `content`: 記事本文（Markdown）
- `content_html`: 記事本文（HTML）
- `excerpt`: 記事抜粋
- `meta_title`: SEOタイトル
- `meta_description`: SEOディスクリプション
- `keywords`: SEOキーワード（JSON配列）
- `featured_image`: アイキャッチ画像
- `status`: 公開ステータス（draft, published, archived）
- `published_at`: 公開日時
- `read_time`: 読了時間（分）
- `view_count`: 閲覧数
- `ai_generated`: AI生成フラグ
- `generation_prompt`: 生成時のプロンプト
- `html_file_path`: 生成されたHTMLファイルのパス
- `author_id`: 著者ID
- `category_id`: カテゴリID

**リレーション:**
- `belongsTo(Author)`
- `belongsTo(Category)`
- `belongsToMany(Tag)`

### Category（カテゴリ）
記事のカテゴリ分類

**属性:**
- `id`: カテゴリID
- `name`: カテゴリ名
- `slug`: URL用スラッグ
- `description`: カテゴリ説明
- `meta_title`: SEOタイトル
- `meta_description`: SEOディスクリプション
- `color`: 表示色
- `icon`: アイコン
- `sort_order`: 表示順序
- `html_file_path`: 生成されたHTMLファイルのパス

**リレーション:**
- `hasMany(Article)`

### Tag（タグ）
記事のタグ分類

**属性:**
- `id`: タグID
- `name`: タグ名
- `slug`: URL用スラッグ
- `description`: タグ説明
- `color`: 表示色

**リレーション:**
- `belongsToMany(Article)`

### Author（著者）
記事の著者情報

**属性:**
- `id`: 著者ID
- `name`: 著者名
- `email`: メールアドレス
- `bio`: 経歴
- `avatar`: アバター画像
- `social_links`: SNSリンク（JSON）
- `is_ai`: AI著者フラグ

**リレーション:**
- `hasMany(Article)`

### SEOMetadata（SEOメタデータ）
SEO最適化情報の管理

**属性:**
- `id`: ID
- `entity_type`: エンティティタイプ（article, category, page）
- `entity_id`: エンティティID
- `meta_title`: SEOタイトル
- `meta_description`: SEOディスクリプション
- `meta_keywords`: SEOキーワード（JSON配列）
- `og_title`: OGタイトル
- `og_description`: OGディスクリプション
- `og_image`: OG画像
- `structured_data`: 構造化データ（JSON）
- `canonical_url`: カノニカルURL

**リレーション:**
- `morphTo(entity)` - ポリモーフィック関連

### GenerationTemplate（生成テンプレート）
AI記事生成用のテンプレート

**属性:**
- `id`: テンプレートID
- `name`: テンプレート名
- `description`: 説明
- `prompt_template`: プロンプトテンプレート
- `category_id`: 対象カテゴリID
- `parameters`: 生成パラメータ（JSON）
- `is_active`: 有効フラグ

**リレーション:**
- `belongsTo(Category)`

### HtmlTemplate（HTMLテンプレート）
静的HTML生成用のテンプレート

**属性:**
- `id`: テンプレートID
- `name`: テンプレート名
- `type`: テンプレートタイプ（article, category, index, page）
- `blade_view`: Bladeビューファイル名
- `description`: 説明
- `variables`: テンプレート変数（JSON）
- `is_default`: デフォルトフラグ

### StaticSite（静的サイト設定）
サイト全体の設定管理

**属性:**
- `id`: 設定ID
- `site_name`: サイト名
- `site_description`: サイト説明
- `site_url`: サイトURL
- `site_logo`: サイトロゴ
- `navigation_menu`: ナビゲーションメニュー（JSON）
- `footer_content`: フッターコンテンツ
- `custom_css`: カスタムCSS
- `custom_js`: カスタムJavaScript
- `analytics_code`: アナリティクスコード

### OutputFile（出力ファイル）
生成されたHTMLファイルの管理

**属性:**
- `id`: ファイルID
- `file_path`: ファイルパス
- `file_type`: ファイルタイプ（article, category, index, page）
- `entity_type`: 関連エンティティタイプ
- `entity_id`: 関連エンティティID
- `file_size`: ファイルサイズ
- `last_modified`: 最終更新日時
- `checksum`: ファイルチェックサム

**リレーション:**
- `morphTo(entity)` - ポリモーフィック関連

## データベース関連図

```
Articles
├── author_id → Authors
├── category_id → Categories
└── tags (Many-to-Many) → Tags

Categories
└── articles → Articles

Tags
└── articles (Many-to-Many) → Articles

SEOMetadata
└── entity (Polymorphic) → Articles/Categories/Pages

OutputFiles
└── entity (Polymorphic) → Articles/Categories/Pages

GenerationTemplates
└── category_id → Categories

HtmlTemplates
└── (独立)

StaticSite
└── (独立・シングルトン)
```

## インデックス設計

### パフォーマンス最適化のためのインデックス

```sql
-- Articles
CREATE INDEX idx_articles_status_published_at ON articles(status, published_at);
CREATE INDEX idx_articles_category_status ON articles(category_id, status);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);

-- Tags
CREATE INDEX idx_tags_slug ON tags(slug);

-- SEOMetadata
CREATE INDEX idx_seo_entity ON seo_metadata(entity_type, entity_id);

-- OutputFiles
CREATE INDEX idx_output_files_entity ON output_files(entity_type, entity_id);
CREATE INDEX idx_output_files_type ON output_files(file_type);
```

## データ整合性制約

- `articles.slug`: ユニーク制約
- `categories.slug`: ユニーク制約
- `tags.slug`: ユニーク制約
- `articles.status`: ENUM制約（draft, published, archived）
- `html_templates.type`: ENUM制約（article, category, index, page）
- `output_files.file_type`: ENUM制約（article, category, index, page）
