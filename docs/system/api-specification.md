# API仕様

## ベースURL
```
https://api.example.com/api/v1
```

## 認証
Laravel Sanctumベースのトークン認証

```http
Authorization: Bearer {token}
```

## レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "操作が成功しました"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "バリデーションエラーが発生しました",
    "details": {
      "field": ["エラーメッセージ"]
    }
  }
}
```

## エンドポイント一覧

### 認証関連
```
POST   /auth/login          # ログイン
POST   /auth/logout         # ログアウト
GET    /auth/user           # ユーザー情報取得
```

### 記事管理
```
GET    /articles            # 記事一覧取得
POST   /articles            # 記事作成
GET    /articles/{id}       # 記事詳細取得
PUT    /articles/{id}       # 記事更新
DELETE /articles/{id}       # 記事削除
```

### AI記事生成
```
POST   /generation/generate         # AI記事生成
POST   /generation/generate/bulk    # 一括生成
GET    /generation/templates        # 生成テンプレート一覧
POST   /generation/optimize-seo     # SEO最適化
```

### HTML生成
```
POST   /html-generator/generate-html      # 単一記事HTML生成
POST   /html-generator/generate-site      # 全サイトHTML生成
POST   /html-generator/generate-index     # インデックスページ生成
POST   /html-generator/generate-categories # カテゴリページ生成
GET    /html-generator/output-status      # 生成状況確認
```

### ファイル管理
```
GET    /file-manager/files           # 生成ファイル一覧
GET    /file-manager/files/{path}    # ファイル詳細
DELETE /file-manager/files/{path}    # ファイル削除
POST   /file-manager/deploy          # デプロイ実行
```

### カテゴリ管理
```
GET    /categories          # カテゴリ一覧
POST   /categories          # カテゴリ作成
PUT    /categories/{id}     # カテゴリ更新
DELETE /categories/{id}     # カテゴリ削除
```

### アナリティクス
```
GET    /analytics/performance       # 記事パフォーマンス
GET    /analytics/seo-metrics       # SEOメトリクス
```

## 詳細仕様

### 記事一覧取得
```http
GET /articles
```

**クエリパラメータ:**
- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの件数（デフォルト: 20、最大: 100）
- `status`: ステータスフィルタ（draft, published, archived）
- `category_id`: カテゴリフィルタ
- `search`: 検索キーワード
- `sort`: ソート順（created_at, updated_at, published_at, title）
- `direction`: ソート方向（asc, desc）

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Next.js 14の新機能",
        "slug": "nextjs-14-features",
        "excerpt": "Next.js 14の新機能について...",
        "status": "published",
        "published_at": "2024-01-15T10:00:00Z",
        "author": {
          "id": 1,
          "name": "田中太郎"
        },
        "category": {
          "id": 1,
          "name": "プログラミング"
        },
        "tags": [
          {
            "id": 1,
            "name": "Next.js"
          }
        ]
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

### 記事作成
```http
POST /articles
```

**リクエストボディ:**
```json
{
  "title": "記事タイトル",
  "content": "記事本文（Markdown）",
  "excerpt": "記事抜粋",
  "meta_title": "SEOタイトル",
  "meta_description": "SEOディスクリプション",
  "keywords": ["キーワード1", "キーワード2"],
  "featured_image": "画像URL",
  "status": "draft",
  "category_id": 1,
  "tag_ids": [1, 2, 3],
  "published_at": "2024-01-15T10:00:00Z"
}
```

### AI記事生成
```http
POST /generation/generate
```

**リクエストボディ:**
```json
{
  "prompt": "Next.jsの最新機能について記事を書いて",
  "category_id": 1,
  "template_id": 1,
  "settings": {
    "max_tokens": 3000,
    "temperature": 0.7,
    "target_keywords": ["Next.js", "React", "SSG"],
    "word_count": 2000,
    "tone": "professional"
  }
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "article_id": 123,
    "title": "生成されたタイトル",
    "content": "生成された記事本文",
    "meta_data": {
      "meta_title": "SEOタイトル",
      "meta_description": "SEOディスクリプション",
      "keywords": ["キーワード1", "キーワード2"]
    },
    "generation_info": {
      "model": "gpt-4",
      "tokens_used": 2500,
      "generation_time": 15.3
    }
  }
}
```

### HTML生成
```http
POST /html-generator/generate-html
```

**リクエストボディ:**
```json
{
  "article_id": 123,
  "template_id": 1,
  "options": {
    "minify": true,
    "include_assets": true,
    "generate_sitemap": true
  }
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "file_path": "/output/articles/nextjs-14-features.html",
    "file_size": 45678,
    "generation_time": 2.1,
    "assets": [
      "/output/assets/css/main.css",
      "/output/assets/js/main.js"
    ]
  }
}
```

### 全サイト生成（ストリーミング）
```http
POST /html-generator/generate-site
```

**レスポンス（Server-Sent Events）:**
```
data: {"type": "progress", "progress": 10, "message": "記事HTML生成中..."}

data: {"type": "file_generated", "file_path": "/output/articles/article-1.html"}

data: {"type": "progress", "progress": 50, "message": "カテゴリページ生成中..."}

data: {"type": "completed", "total_files": 150, "total_time": 120.5}
```

## エラーコード

| コード | 説明 |
|--------|------|
| VALIDATION_ERROR | バリデーションエラー |
| UNAUTHORIZED | 認証エラー |
| FORBIDDEN | 認可エラー |
| NOT_FOUND | リソースが見つからない |
| AI_GENERATION_FAILED | AI生成エラー |
| HTML_GENERATION_FAILED | HTML生成エラー |
| FILE_OPERATION_FAILED | ファイル操作エラー |
| EXTERNAL_API_ERROR | 外部API呼び出しエラー |

## レート制限

- 一般API: 100リクエスト/分
- AI生成API: 10リクエスト/分
- HTML生成API: 5リクエスト/分

## バージョニング

APIバージョンはURLパスに含める方式を採用。

- v1: `/api/v1/`
- v2: `/api/v2/`（将来用）
