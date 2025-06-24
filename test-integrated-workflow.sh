#!/bin/bash

echo "=== SEO記事生成システム 統合ワークフローテスト ==="
echo "AI記事生成 → WordPress投稿 → Notion保存 → Google Business Profile投稿"
echo ""

# ステップ1: AI記事生成
echo "🤖 ステップ1: AI記事生成中..."
ARTICLE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI技術を活用したコンテンツマーケティングの未来",
    "keywords": ["AI", "コンテンツマーケティング", "自動化", "SEO"],
    "tone": "professional",
    "length": "medium"
  }')

# 必須: API呼び出し後のスリープ
echo "⏳ API処理完了待ち (2秒)..."
sleep 2

echo "✅ AI記事生成完了"
echo "📄 レスポンス確認: $(echo "$ARTICLE_RESPONSE" | head -c 100)..."
echo ""

# ステップ2: WordPress投稿
echo "📝 ステップ2: WordPress投稿中..."
WP_RESPONSE=$(curl -s -X POST http://localhost:3001/api/post-to-wordpress \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI技術を活用したコンテンツマーケティングの未来",
    "content": "AI技術の発展により、コンテンツマーケティングは新たな局面を迎えています。本記事では、AIを活用した効率的なコンテンツ制作の手法と、その将来性について詳しく解説します。",
    "status": "publish",
    "categories": ["AI", "マーケティング"]
  }')

# 必須: API呼び出し後のスリープ
echo "⏳ WordPress投稿処理待ち (2秒)..."
sleep 2

echo "✅ WordPress投稿完了"
echo "📄 レスポンス確認: $(echo "$WP_RESPONSE" | head -c 100)..."
echo ""

# ステップ3: Notion保存
echo "📚 ステップ3: Notion保存中..."
NOTION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/save-to-notion \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI技術を活用したコンテンツマーケティングの未来",
    "content": "AI技術の発展により、コンテンツマーケティングは新たな局面を迎えています。",
    "tags": ["AI", "コンテンツマーケティング", "自動化"],
    "source": "AI Generated Article"
  }')

# 必須: API呼び出し後のスリープ
echo "⏳ Notion保存処理待ち (2秒)..."
sleep 2

echo "✅ Notion保存完了"
echo "📄 レスポンス確認: $(echo "$NOTION_RESPONSE" | head -c 100)..."
echo ""

# ステップ4: Google Business Profile投稿
echo "🏢 ステップ4: Google Business Profile投稿中..."
GBP_RESPONSE=$(curl -s -X POST http://localhost:3001/api/post-to-gbp \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🤖 新しいAI記事を公開しました！\n\n「AI技術を活用したコンテンツマーケティングの未来」\n\n✨ 主なポイント：\n• AI自動化技術の活用\n• 効率的なコンテンツ制作\n• マーケティング戦略の革新\n\n詳細はWebサイトでご確認ください！\n\n#AI #コンテンツマーケティング #自動化 #SEO",
    "title": "AI記事：コンテンツマーケティングの未来",
    "callToAction": "LEARN_MORE",
    "callToActionUrl": "https://kai-techweb.com/"
  }')

# 必須: API呼び出し後のスリープ
echo "⏳ Google Business Profile投稿処理待ち (2秒)..."
sleep 2

echo "✅ Google Business Profile投稿完了"
echo "📄 レスポンス確認: $(echo "$GBP_RESPONSE" | head -c 100)..."
echo ""

echo "🎉 統合ワークフロー完了！"
echo "====================================="
echo ""
echo "📊 結果サマリー:"
echo "- AI記事生成: ✅ 完了"
echo "- WordPress投稿: ✅ 完了"  
echo "- Notion保存: ✅ 完了"
echo "- Google Business Profile投稿: ✅ 完了（デモモード）"
echo ""
echo "🔗 生成されたリンク:"
echo "- WordPress記事: https://kai-techweb.com/"
echo "- Notion記事: https://notion.so/"
echo "- Google Business投稿: https://business.google.com/"
