import { NextRequest, NextResponse } from 'next/server';

// HTMLサンプルを使用してAPI動作をテストする
export async function POST(request: NextRequest) {
  try {
    // テスト用のHTMLサンプル（簡略版）
    const testHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <title>295から始まる電話番号は迷惑電話？</title>
  <meta name="description" content="短い説明文">
</head>
<body>
  <h1>295から始まる電話番号は迷惑電話？電話かかってきたらどう対応すべきなの？</h1>
  
  <h2>295から始まる電話番号はどこから？</h2>
  <img src="telephone-image.jpg" alt="" width="1024" height="682" />
  <p>フェロー諸島からの国際電話です。</p>
  
  <h2>なぜ295番から迷惑電話が多いの？</h2>
  <img src="scam-image.jpg" alt="" width="1024" height="768" />
  <p>ワンコール詐欺が多いです。<a href="/details">こちら</a>で詳細を確認してください。</p>
  
  <h2>正しい対応方法</h2>
  <p>電話に出ないことが重要です。</p>
</body>
</html>`;

    const testPayload = {
      htmlContent: testHtml,
      targetTopic: '迷惑電話対策',
      generateAds: true,
      optimizeImages: true,
      optimizeLinks: true
    };

    // generate-from-html APIを呼び出し
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-from-html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      testResult: result,
      message: 'HTML解析記事生成APIのテストが完了しました'
    });

  } catch (error) {
    console.error('テストエラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'HTML解析記事生成APIのテスト中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test-html-analysis',
    description: 'HTML解析記事生成APIのテスト機能',
    usage: 'POST request to test the generate-from-html API with sample data',
    testData: {
      htmlContent: 'Sample HTML with empty alt attributes and vague links',
      targetTopic: '迷惑電話対策',
      optimizations: 'Images, links, and ads insertion'
    }
  });
}
