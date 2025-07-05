# 定型的なコミットメッセージテンプレート集

## 📝 コミットメッセージの書き方

### 基本形式

```
<type>: <subject>

<body>
```

### タイプ一覧

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメント更新
- **style**: コードスタイル変更（機能に影響しない）
- **refactor**: リファクタリング
- **test**: テストの追加・修正
- **chore**: その他の変更（ビルドプロセス、補助ツールなど）
- **wip**: 作業中（Work In Progress）

---

## 🔧 よく使うコミットメッセージ例

### 機能追加

```bash
git commit -m "feat: Article モデル作成完了" \
           -m "- Article モデル実装" \
           -m "- マイグレーションファイル作成" \
           -m "- バリデーションルール追加" \
           -m "- リレーション設定完了"
```

### バグ修正

```bash
git commit -m "fix: データベース接続エラーを修正" \
           -m "- MySQL接続設定を修正" \
           -m "- 環境変数の設定を調整" \
           -m "- 権限問題を解決"
```

### API 実装

```bash
git commit -m "feat: 記事管理API実装完了" \
           -m "- 記事一覧取得API (GET /api/articles)" \
           -m "- 記事作成API (POST /api/articles)" \
           -m "- 記事更新API (PUT /api/articles/{id})" \
           -m "- 記事削除API (DELETE /api/articles/{id})"
```

### UI/UX 実装

```bash
git commit -m "feat: 記事一覧画面実装完了" \
           -m "- 記事一覧コンポーネント作成" \
           -m "- ページネーション機能追加" \
           -m "- 検索・フィルタリング機能実装" \
           -m "- レスポンシブデザイン対応"
```

### 設定変更

```bash
git commit -m "chore: 開発環境設定を更新" \
           -m "- Docker設定を最適化" \
           -m "- 環境変数を追加" \
           -m "- VSCode設定を更新"
```

### ドキュメント更新

```bash
git commit -m "docs: APIドキュメントを更新" \
           -m "- 記事管理API仕様書を追加" \
           -m "- エラーレスポンス例を追加" \
           -m "- 使用例を追加"
```

### テスト実装

```bash
git commit -m "test: Article モデルのテストを追加" \
           -m "- 記事作成テスト" \
           -m "- バリデーションテスト" \
           -m "- リレーションテスト"
```

### リファクタリング

```bash
git commit -m "refactor: ArticleService クラスを改善" \
           -m "- 長いメソッドを分割" \
           -m "- 責任の分離" \
           -m "- 可読性の向上"
```

---

## 🚀 作業フェーズ別のコミットメッセージ

### フェーズ 1: データベース設計

```bash
# モデル作成
git commit -m "feat: Article モデル作成" \
           -m "- Eloquent モデル実装" \
           -m "- マイグレーションファイル作成" \
           -m "- ファクトリー・シーダー作成"

# 関連モデル作成
git commit -m "feat: Category・Tag モデル作成" \
           -m "- Category モデル実装" \
           -m "- Tag モデル実装" \
           -m "- 中間テーブルの設定"
```

### フェーズ 2: API 実装

```bash
# コントローラー作成
git commit -m "feat: ArticleController API実装" \
           -m "- CRUD操作の実装" \
           -m "- バリデーション追加" \
           -m "- エラーハンドリング実装"

# リソースクラス作成
git commit -m "feat: API リソースクラス作成" \
           -m "- ArticleResource 実装" \
           -m "- CategoryResource 実装" \
           -m "- レスポンス形式の統一"
```

### フェーズ 3: フロントエンド実装

```bash
# コンポーネント作成
git commit -m "feat: 記事管理画面のコンポーネント作成" \
           -m "- ArticleList コンポーネント" \
           -m "- ArticleForm コンポーネント" \
           -m "- ArticleCard コンポーネント"

# ページ実装
git commit -m "feat: 記事管理ページ実装完了" \
           -m "- 記事一覧ページ" \
           -m "- 記事作成・編集ページ" \
           -m "- 記事詳細ページ"
```

### フェーズ 4: AI 機能実装

```bash
# AI統合
git commit -m "feat: OpenAI API統合完了" \
           -m "- AIService クラス実装" \
           -m "- 記事生成機能追加" \
           -m "- エラーハンドリング実装"
```

### フェーズ 5: HTML 生成機能

```bash
# HTML生成
git commit -m "feat: 静的HTML生成機能実装" \
           -m "- HtmlGeneratorService 実装" \
           -m "- テンプレートシステム構築" \
           -m "- SEO最適化処理追加"
```

---

## 🐛 デバッグ・修正時のコミットメッセージ

### 開発中のバグ修正

```bash
git commit -m "fix: データベース接続エラーを修正" \
           -m "- MySQL権限設定を修正" \
           -m "- 接続プールサイズを調整"
```

### パフォーマンス改善

```bash
git commit -m "perf: 記事一覧取得のパフォーマンス改善" \
           -m "- N+1問題を解決" \
           -m "- インデックスを追加" \
           -m "- キャッシュ機能を実装"
```

### セキュリティ対応

```bash
git commit -m "security: XSS脆弱性を修正" \
           -m "- 入力値のエスケープ処理を追加" \
           -m "- CSRFトークン検証を強化"
```

---

## 🔄 作業中断時のコミットメッセージ

### 作業継続中

```bash
git commit -m "wip: Article モデル作成中" \
           -m "- 基本構造を実装" \
           -m "- バリデーションルールを追加中" \
           -m "- 次回：リレーション設定を追加予定"
```

### 一時保存

```bash
git commit -m "save: 作業を一時保存" \
           -m "- 現在の作業状態を保存" \
           -m "- 明日継続予定"
```

---

**最終更新**: 2025 年 7 月 5 日
**作成者**: 開発チーム
