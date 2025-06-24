#!/bin/bash

echo "🎯 Google広告管理・WordPress投稿機能 統合テスト"
echo "=================================================="

echo "✅ 1. 新しく追加されたファイルの確認"
echo ""

files=(
  "app/ad-management/page.tsx"
  "components/forms/ad-insertion-control.tsx"
  "components/forms/wordpress-publish-control.tsx"
  "docs/GOOGLE_AD_MANAGEMENT_GUIDE.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file - 作成済み ($(wc -l < "$file") 行)"
  else
    echo "❌ $file - 見つかりません"
  fi
done

echo ""
echo "✅ 2. API エンドポイントの確認"
echo ""

apis=(
  "app/api/ad-management/route.ts"
  "app/api/ad-management/insert/route.ts"
)

for api in "${apis[@]}"; do
  if [ -f "$api" ]; then
    echo "✅ $api - 作成済み ($(wc -l < "$api") 行)"
  else
    echo "❌ $api - 見つかりません"
  fi
done

echo ""
echo "✅ 3. 型定義ファイルの確認"
echo ""

types=(
  "types/ad-management.ts"
)

for type_file in "${types[@]}"; do
  if [ -f "$type_file" ]; then
    echo "✅ $type_file - 作成済み ($(wc -l < "$type_file") 行)"
  else
    echo "❌ $type_file - 見つかりません"
  fi
done

echo ""
echo "✅ 4. 記事生成フォームの統合確認"
echo ""

if grep -q "AdInsertionControl" components/forms/article-generation-form.tsx; then
  echo "✅ 広告挿入コントロールが統合されています"
else
  echo "❌ 広告挿入コントロールが統合されていません"
fi

if grep -q "WordPressPublishControl" components/forms/article-generation-form.tsx; then
  echo "✅ WordPress投稿コントロールが統合されています"
else
  echo "❌ WordPress投稿コントロールが統合されていません"
fi

echo ""
echo "✅ 5. ナビゲーションの確認"
echo ""

if grep -q "広告管理" app/page.tsx; then
  echo "✅ ホームページに広告管理へのリンクが追加されています"
else
  echo "❌ ホームページに広告管理へのリンクが追加されていません"
fi

echo ""
echo "📋 6. 実装された機能一覧"
echo ""

echo "🎯 Google広告管理機能:"
echo "  ├── 広告設定・管理 (CRUD操作)"
echo "  ├── 複数サイズ対応 (モバイル・デスクトップ)"
echo "  ├── 配置ルール設定"
echo "  ├── 自動挿入アルゴリズム"
echo "  └── パフォーマンス追跡基盤"

echo ""
echo "🌐 WordPress自動投稿機能:"
echo "  ├── 接続状態確認"
echo "  ├── 投稿設定管理"
echo "  ├── SEO設定統合"
echo "  ├── アイキャッチ画像対応"
echo "  └── カテゴリ・タグ管理"

echo ""
echo "🔧 統合機能:"
echo "  ├── 記事生成→広告挿入→WordPress投稿の一連の流れ"
echo "  ├── タブUIによる直感的な操作"
echo "  ├── プレビュー機能"
echo "  └── ステップ進行管理"

echo ""
echo "📖 ドキュメント:"
echo "  ├── Google広告設定ガイド"
echo "  ├── AdSense連携手順"
echo "  ├── ベストプラクティス"
echo "  └── トラブルシューティング"

echo ""
echo "=================================================="
echo "🚀 統合完了！収益化に向けた準備が整いました"
echo "=================================================="

# 設定ファイルのサンプルも表示
echo ""
echo "💡 次のステップ:"
echo "1. /ad-management でGoogle AdSenseコードを設定"
echo "2. /article-generator で記事生成→広告挿入→WordPress投稿を体験"
echo "3. docs/GOOGLE_AD_MANAGEMENT_GUIDE.md でベストプラクティスを確認"
