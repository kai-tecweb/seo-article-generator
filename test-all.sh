#!/bin/bash

# SEO記事生成システム - テスト自動実行スクリプト
echo "🧪 SEO記事生成システム - テスト自動実行開始"
echo "========================================"

# テスト開始時刻を記録
start_time=$(date +%s)

echo "📋 1. ユニットテスト実行..."
npm run test -- --passWithNoTests --silent

if [ $? -eq 0 ]; then
    echo "✅ ユニットテスト: 成功"
else
    echo "❌ ユニットテスト: 失敗"
    exit 1
fi

echo ""
echo "📋 2. TypeScript型チェック..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ TypeScript型チェック: 成功"
else
    echo "❌ TypeScript型チェック: 失敗"
    exit 1
fi

echo ""
echo "📋 3. ESLintコード品質チェック..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ ESLintチェック: 成功"
else
    echo "❌ ESLintチェック: 失敗"
    exit 1
fi

echo ""
echo "📋 4. Prettierフォーマットチェック..."
npm run format:check

if [ $? -eq 0 ]; then
    echo "✅ Prettierチェック: 成功"
else
    echo "❌ Prettierチェック: 失敗"
    echo "💡 修正するには: npm run format"
    exit 1
fi

echo ""
echo "📋 5. Next.jsビルドテスト..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ ビルドテスト: 成功"
else
    echo "❌ ビルドテスト: 失敗"
    exit 1
fi

# テスト完了時刻を計算
end_time=$(date +%s)
duration=$((end_time - start_time))

echo ""
echo "🎉 全てのテストが成功しました！"
echo "⏱️  実行時間: ${duration}秒"
echo "========================================"
echo "🚀 デプロイ準備完了です！"
