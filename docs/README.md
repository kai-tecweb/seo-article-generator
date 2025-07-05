# SEO記事自動生成・静的HTMLファイル生成システム ドキュメント

このディレクトリには、SEO記事自動生成・静的HTMLファイル生成システムの開発に関する全ドキュメントが含まれています。

## 📁 ディレクトリ構成

```
docs/
├── README.md                           # このファイル
├── system/                             # システム設計・仕様
│   ├── architecture.md                # システムアーキテクチャ
│   ├── entities.md                    # エンティティ設計
│   ├── api-specification.md           # API仕様
│   └── requirements.md                # システム要件
├── development/                        # 開発指針・規約
│   ├── coding-standards.md            # コーディング規約・標準
│   ├── environment-setup.md           # 開発環境・ツール設定
│   ├── error-handling-security.md     # エラーハンドリング・セキュリティ
│   └── testing-strategy.md            # テスト戦略・品質保証
├── implementation/                     # 実装例・ベストプラクティス
│   ├── static-html-generation.md      # 静的HTML生成実装例
│   ├── ai-article-generation.md       # AI記事生成実装例
│   └── state-management.md            # 状態管理・データフェッチ実装例
└── ui-ux/                             # UI/UXデザイン
    ├── design-system.md               # デザインシステム・スタイルガイド
    ├── components.md                  # コンポーネント設計・実装例
    └── layouts.md                     # レイアウト設計・実装例
```

## 🚀 クイックスタート

1. **システム概要を理解する**: [システムアーキテクチャ](system/architecture.md)
2. **開発環境を準備する**: [開発環境・ツール設定](development/environment-setup.md)
3. **コーディング規約を確認する**: [コーディング規約・標準](development/coding-standards.md)
4. **実装例を参考にする**: [実装例一覧](implementation/)

## 📖 ドキュメント一覧

### 🏗️ システム設計・仕様
- [システムアーキテクチャ](system/architecture.md) - 全体的なシステム構成とアーキテクチャ
- [エンティティ設計](system/entities.md) - データモデルとエンティティ関係
- [API仕様](system/api-specification.md) - RESTful API設計とエンドポイント
- [システム要件](system/requirements.md) - 機能要件と非機能要件

### 🛠️ 開発指針・規約
- [コーディング規約・標準](development/coding-standards.md) - コーディングスタイルとベストプラクティス
- [開発環境・ツール設定](development/environment-setup.md) - 開発環境の構築と設定
- [エラーハンドリング・セキュリティ](development/error-handling-security.md) - エラー処理とセキュリティ対策
- [テスト戦略・品質保証](development/testing-strategy.md) - テスト手法と品質管理

### 💻 実装例・ベストプラクティス
- [静的HTML生成実装例](implementation/static-html-generation.md) - 静的HTMLファイル生成の実装
- [AI記事生成実装例](implementation/ai-article-generation.md) - AI APIを活用した記事生成
- [状態管理・データフェッチ実装例](implementation/state-management.md) - 状態管理とデータ取得

### 🎨 UI/UXデザイン
- [デザインシステム・スタイルガイド](ui-ux/design-system.md) - デザインシステムとスタイルガイド
- [コンポーネント設計・実装例](ui-ux/components.md) - 再利用可能なコンポーネント設計
- [レイアウト設計・実装例](ui-ux/layouts.md) - レスポンシブレイアウト設計

## 📋 開発指針の要約

### 基本原則
- **完全静的HTML生成**: 外部依存のない独立したHTMLファイル生成
- **AI活用**: OpenAI/Claude APIを活用した高品質記事生成
- **SEO最適化**: メタデータ・構造化データの静的埋め込み
- **型安全性**: TypeScriptによる厳密な型定義
- **モジュール化**: 責任分離とコードの再利用性

### 技術スタック
- **バックエンド**: Laravel 12 (PHP 8.3)
- **フロントエンド**: Next.js (React 18)
- **データベース**: MySQL 8.0
- **開発環境**: Laravel Sail (Docker)
- **認証**: Laravel Sanctum
- **AI統合**: OpenAI API、Claude API

### 重要な注意事項
- **MDファイル使用禁止**: ドキュメントはコード内コメントまたはStorybookで管理
- **Laravel Sail使用**: すべてのLaravelコマンドは`./vendor/bin/sail`経由で実行
- **Artisanコマンド使用**: モデル・コントローラー等は手動作成禁止
- **型安全性**: すべてのAPIレスポンスに型定義必須

## 🔗 関連リンク

- [システム設計書](../system_design.md)
- [参考プロジェクト](../参考/)
- [メインの開発指針](../copilot-instructions.md)
