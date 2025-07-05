# システム設計書: Laravel 12 + Next.js + MySQL + Laravel Sail

## 1. プロジェクト概要

### 1.1 システム構成
- **バックエンド**: Laravel 12 (PHP 8.3)
- **フロントエンド**: Next.js (React 18)
- **データベース**: MySQL 8.0
- **開発環境**: Laravel Sail (Docker)
- **アーキテクチャ**: API分離型（RESTful API）

### 1.2 開発環境
- **コンテナ化**: Docker + Docker Compose
- **開発ツール**: Laravel Sail
- **パッケージマネージャー**: 
  - PHP: Composer
  - Node.js: npm/yarn

---

## 2. システムアーキテクチャ

### 2.1 全体構成図
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Laravel 12    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │   Laravel Sail  │
                    │   (Docker)      │
                    └─────────────────┘
```

### 2.2 ディレクトリ構造
```
seo-article/
├── backend/                    # Laravel 12 プロジェクト
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/       # API コントローラー
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Services/          # ビジネスロジック
│   │   └── Repositories/      # データアクセス層
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── tests/
│   ├── docker-compose.yml     # Sail設定
│   └── .env
├── frontend/                   # Next.js プロジェクト
│   ├── src/
│   │   ├── app/              # App Router
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api/          # API クライアント
│   │   │   └── utils/
│   │   ├── hooks/
│   │   ├── store/            # 状態管理
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── .env.local
├── docker-compose.yml          # 統合Docker設定
└── README.md
```

---

## 3. 技術仕様

### 3.1 Laravel 12 (Backend)

#### 3.1.1 主要機能
- **認証**: Laravel Sanctum
- **API**: RESTful API
- **バリデーション**: Form Request Classes
- **エラーハンドリング**: 統一エラーレスポンス
- **ログ**: Laravel Log
- **キャッシュ**: Redis (オプション)
- **キュー**: Database Queue

#### 3.1.2 APIエンドポイント設計
```
/api/v1/
├── auth/
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET /user
├── articles/
│   ├── GET /articles
│   ├── POST /articles
│   ├── GET /articles/{id}
│   ├── PUT /articles/{id}
│   └── DELETE /articles/{id}
└── categories/
    ├── GET /categories
    ├── POST /categories
    └── PUT /categories/{id}
```

#### 3.1.3 データベース設計
```sql
-- ユーザーテーブル
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- カテゴリーテーブル
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 記事テーブル
CREATE TABLE articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```
