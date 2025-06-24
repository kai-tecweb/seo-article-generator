// Google品質ガイドライン評価のテスト用サンプルデータ

export const sampleArticles = {
  // 良い記事の例
  goodArticle: {
    title: "実際に使って分かった！プロが教えるWordPress初心者向け完全ガイド",
    body: `
私は5年間WordPressサイトを運営し、これまで50個以上のテーマを試し、数百のプラグインを検証してきました。

## WordPress初心者が最初に知るべき3つのポイント

### 1. レンタルサーバーの選び方
私が実際に10社以上のレンタルサーバーを使った経験から、初心者におすすめなのは以下の3社です：

**エックスサーバー**
- 月額990円～
- 実際の稼働率：99.99%（私の2年間の監視データより）
- サポート対応時間：24時間以内（私の問い合わせ経験談）

### 2. テーマ選びの重要性
WordPressのテーマ選びで失敗すると、後からの変更が大変です。私は実際に5回もテーマを変更し、その度に数十時間の作業が必要でした。

### 3. セキュリティ対策
私のサイトも過去に2回攻撃を受けましたが、適切な対策により被害を防げました。具体的な対策方法：

1. プラグイン「Wordfence Security」の導入
2. 定期的なバックアップ（私は毎日自動バックアップ設定）
3. パスワードの定期変更

## 参考文献
- WordPress公式ドキュメント (https://wordpress.org/documentation/)
- セキュリティ専門家田中氏のブログ
- 私自身の5年間の運営データ

この記事が、WordPress初心者の方の参考になれば幸いです。
    `,
    metaDescription: "5年間の実体験を基に、WordPress初心者向けの完全ガイドを作成しました。実際に検証したレンタルサーバー、テーマ、セキュリティ対策を詳しく解説します。",
    targetKeywords: ["WordPress", "初心者", "ガイド"]
  },

  // 問題のある記事の例
  problematicArticle: {
    title: "WordPress WordPress 初心者 ガイド WordPress 簡単",
    body: `
WordPressは初心者でも簡単に使えるCMSです。WordPressを使えば初心者でも簡単にサイトが作れます。

## WordPressとは
WordPressはCMSです。WordPressは世界で最も人気のあるCMSです。WordPressは初心者にも簡単です。

### WordPressの特徴
WordPressの特徴は以下の通りです：
- WordPressは無料です
- WordPressは簡単です
- WordPressは初心者向けです
- WordPressは便利です

### WordPressの使い方
WordPressの使い方を説明します。まずWordPressをダウンロードします。次にWordPressをインストールします。最後にWordPressを設定します。

WordPressはとても簡単なCMSです。初心者の方もWordPressを使って簡単にサイトを作ることができます。

WordPressには多くのテーマがあります。WordPressのテーマを使えば初心者でも簡単にデザインできます。

## まとめ
WordPressは初心者におすすめのCMSです。WordPressを使って素晴らしいサイトを作りましょう。
    `,
    metaDescription: "WordPress初心者ガイド",
    targetKeywords: ["WordPress", "初心者", "ガイド", "簡単"]
  },

  // 自動生成感のある記事の例
  automatedArticle: {
    title: "【2024年最新】おすすめのレンタルサーバー10選比較ランキング",
    body: `
## レンタルサーバーとは

レンタルサーバーとは、Webサイトやアプリケーションをインターネット上で公開するために必要なサーバーを借りるサービスのことです。

## おすすめレンタルサーバー10選

### 1位：エックスサーバー
エックスサーバーは高性能で安定性に優れたレンタルサーバーです。
料金：月額990円～
容量：300GB～

### 2位：ロリポップ
ロリポップは初心者向けの使いやすいレンタルサーバーです。
料金：月額220円～
容量：100GB～

### 3位：さくらのレンタルサーバ
さくらのレンタルサーバは老舗の信頼できるサービスです。
料金：月額524円～
容量：100GB～

（以下、8位まで同様の構成で続く）

## まとめ
以上、おすすめのレンタルサーバー10選をご紹介しました。用途に応じて最適なサービスを選択してください。
    `,
    metaDescription: "2024年最新のおすすめレンタルサーバー10選を比較ランキング形式でご紹介します。",
    targetKeywords: ["レンタルサーバー", "おすすめ", "比較", "ランキング"]
  }
};

// APIテスト用のヘルパー関数
export async function testGoogleQualityAPI(articleData: any) {
  try {
    const response = await fetch('/api/quality-evaluation/google-guidelines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: articleData,
        includeDetailedAnalysis: true
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API Test Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
