// Google Business Profile投稿テスト用スクリプト

async function testGoogleBusinessProfile() {
  console.log("=== Google Business Profile投稿テスト開始 ===");
  
  try {
    const testData = {
      content: "🤖 AI記事生成システムのテスト投稿です！\n\n技術ブログの新しい記事を公開しました。\n\n✨ 主な内容：\n• AI を活用した記事自動生成\n• WordPress との連携\n• Notion データベース管理\n\n#AI #WordPress #Notion #ブログ",
      title: "AI記事生成システム - テスト投稿",
      callToAction: "LEARN_MORE",
      callToActionUrl: "https://kai-techweb.com/"
    };

    console.log("投稿データ:", testData);
    
    const response = await fetch('http://localhost:3001/api/post-to-gbp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log("レスポンスステータス:", response.status);
    
    const result = await response.json();
    console.log("投稿結果:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("✅ Google Business Profile投稿が正常に完了しました");
      if (result.data?.postUrl) {
        console.log("📝 投稿URL:", result.data.postUrl);
      }
    } else {
      console.log("❌ 投稿エラー:", result.error);
      if (result.guidance) {
        console.log("💡 ガイダンス:", result.guidance);
      }
    }
    
  } catch (error) {
    console.error("テストエラー:", error);
  }
}

// テスト実行
testGoogleBusinessProfile();
