# Google品質ガイドライン評価機能

## 🎯 機能概要

このシステムは、Google検索品質ガイドラインに基づいて記事の品質を自動評価し、SEO改善点を提案する機能です。

## ✨ 主な特徴

### 📊 8つのチェック項目

1. **オリジナリティ** - テンプレート感や重複の有無
2. **ユーザーへの有益性** - 検索意図に合っているか
3. **剽窃・再構成の有無** - 他サイトからのコピーの疑い
4. **キーワードの詰め込み** - 不自然な使用の回避
5. **出典や根拠の提示** - 情報の信頼性
6. **E-E-A-T** - 実体験・専門性・権威性・信頼性
7. **コンテンツの厚み** - 無駄に長くて中身が薄くないか
8. **自動投稿傾向** - 自動投稿的な見え方がないか

### ✅ 3段階判定システム

- **OK** - 品質基準をクリア（緑色で表示）
- **要改善** - 改善の余地あり（黄色で表示）
- **NG** - 重大な問題あり（赤色で表示）

## 🚀 使用方法

### 1. アクセス方法

```
http://localhost:3005/quality-evaluation?tab=google-quality
```

または、ホームページの「🎯 Google品質評価」ボタンをクリック

### 2. 評価手順

1. **記事タイトル**を入力
2. **記事本文**を入力（最低300文字推奨）
3. **メタディスクリプション**を入力（任意）
4. **ターゲットキーワード**をカンマ区切りで入力（任意）
5. 「品質評価を開始」ボタンをクリック

### 3. 結果の確認

- **総合評価**: スコアと評価ランクを表示
- **詳細評価**: 8項目それぞれのOK/要改善/NG判定
- **改善提案**: 具体的な改善アクション

## 📋 評価基準

### スコア基準

- **80点以上**: OK（緑色）
- **60-79点**: 要改善（黄色）
- **59点以下**: NG（赤色）

### 重み付け

```javascript
const weights = {
  originality: 0.15,      // オリジナリティ
  userBenefit: 0.2,       // ユーザー価値
  plagiarism: 0.15,       // 剽窃回避
  keywordStuffing: 0.1,   // キーワード詰め込み回避
  credibility: 0.15,      // 信頼性
  eeat: 0.15,            // E-E-A-T
  contentDepth: 0.05,     // コンテンツの厚み
  autoPostingPattern: 0.05 // 自動投稿傾向回避
};
```

## 🔧 技術仕様

### API エンドポイント

```
POST /api/quality-evaluation/google-guidelines
```

### リクエスト形式

```json
{
  "content": {
    "title": "記事タイトル",
    "body": "記事本文",
    "metaDescription": "メタディスクリプション",
    "targetKeywords": ["キーワード1", "キーワード2"]
  },
  "includeDetailedAnalysis": true
}
```

### レスポンス形式

```json
{
  "success": true,
  "data": {
    "overallAssessment": "OK|NEEDS_IMPROVEMENT|NG",
    "overallScore": 85,
    "checkItems": {
      "originality": {
        "status": "OK",
        "score": 90,
        "reasons": ["独自の視点が含まれている"],
        "issues": [],
        "suggestions": ["さらに個人的な経験を追加"],
        "severity": "low"
      }
      // ... 他の7項目
    },
    "improvementPriorities": [
      {
        "category": "userBenefit",
        "priority": "high",
        "title": "ユーザー価値の向上",
        "actionItems": ["具体的なステップを追加"]
      }
    ]
  }
}
```

## 🧪 テストデータ

システムには以下のテスト用サンプル記事が用意されています：

### 高品質記事の例
```typescript
// /utils/test-google-quality.ts の sampleArticles.goodArticle
```

### 問題のある記事の例
```typescript
// /utils/test-google-quality.ts の sampleArticles.problematicArticle
```

## ⚙️ 設定とカスタマイズ

### 厳格度の調整

```typescript
const config = {
  strictness: 'standard', // 'lenient' | 'standard' | 'strict'
  customThresholds: {
    okThreshold: 80,
    improvementThreshold: 60
  }
};
```

### 業界特化評価

```typescript
const industryConfig = {
  industryContext: {
    type: 'health', // 'health' | 'finance' | 'legal' | 'news'
    additionalStandards: ['医療監修が必要', 'エビデンスレベルA以上']
  }
};
```

## 🎨 UI コンポーネント

### 使用されているコンポーネント

- `Card` - 評価結果の表示
- `Badge` - ステータス表示（OK/要改善/NG）
- `Progress` - スコア表示
- `Tabs` - 評価概要/詳細分析/改善提案の切り替え
- `Accordion` - 詳細項目の展開表示
- `Alert` - 重要な警告の表示

### カラーシステム

```css
/* OK (緑) */
.status-ok {
  background: rgb(240 253 244); /* bg-green-50 */
  color: rgb(22 163 74);         /* text-green-600 */
  border: rgb(34 197 94);        /* border-green-500 */
}

/* 要改善 (黄) */
.status-improvement {
  background: rgb(254 252 232); /* bg-yellow-50 */
  color: rgb(202 138 4);         /* text-yellow-600 */
  border: rgb(234 179 8);        /* border-yellow-500 */
}

/* NG (赤) */
.status-ng {
  background: rgb(254 242 242); /* bg-red-50 */
  color: rgb(220 38 38);         /* text-red-600 */
  border: rgb(239 68 68);        /* border-red-500 */
}
```

## 🔍 よくある質問

### Q: 評価に時間がかかる場合がありますか？
A: はい、8項目を並行処理していますが、記事の長さによっては30秒～1分程度かかる場合があります。

### Q: 同じ記事を再評価すると結果が変わりますか？
A: AIモデルの性質上、若干の差異が生じる可能性がありますが、大きな傾向は一貫しています。

### Q: どの程度の記事の長さが必要ですか？
A: 最低300文字以上を推奨します。短すぎる記事は適切な評価ができません。

### Q: 英語の記事は評価できますか？
A: 現在は日本語記事に特化していますが、英語記事でも基本的な評価は可能です。

## 🔐 セキュリティとプライバシー

- 入力された記事データは評価処理にのみ使用され、保存されません
- OpenAI APIとの通信は暗号化されています
- APIキーは環境変数で安全に管理されています

## 📈 今後の改善予定

- [ ] 競合記事との比較機能
- [ ] 評価履歴の保存機能
- [ ] PDF形式での評価レポート出力
- [ ] 多言語対応（英語、中国語など）
- [ ] 業界特化型の評価基準
- [ ] リアルタイム評価（入力中の即座評価）

## 🛠️ 開発者向け情報

### 新しい評価項目の追加

```typescript
// 1. 型定義に追加
interface GoogleQualityCheckItems {
  // 既存項目...
  newItem: GoogleQualityCheckItem;
}

// 2. 評価関数を実装
async function evaluateNewItem(content: any): Promise<GoogleQualityCheckItem> {
  // 評価ロジック
}

// 3. メイン評価関数に追加
const newItem = await evaluateNewItem(content);
```

### カスタム評価基準の実装

```typescript
function calculateCustomScore(checkItems: any): number {
  // カスタムスコア計算ロジック
  return score;
}
```

---

この機能により、Google検索品質ガイドラインに準拠した高品質な記事作成をサポートし、SEO効果の向上を図ることができます。
