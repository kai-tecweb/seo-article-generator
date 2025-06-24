/**
 * テスト用のモックデータ定義
 */

// 記事生成API用のモックレスポンス
export const mockArticleGenerationResponse = {
  success: true,
  article: {
    title: 'AI技術が変える未来の働き方',
    content: `
      <h1>AI技術が変える未来の働き方</h1>
      <p>人工知能（AI）技術の急速な発展により、私たちの働き方は大きな変革の時代を迎えています。</p>
      <h2>AIによる業務効率化</h2>
      <p>AIを活用することで、従来の単純作業や繰り返し作業の多くが自動化され、人間はより創造的で戦略的な業務に集中できるようになります。</p>
      <h2>新しいスキルの重要性</h2>
      <p>AI時代において重要なのは、機械にできない人間らしいスキルの向上です。</p>
    `,
    meta_description: 'AI技術の発展が働き方に与える影響と、未来に必要なスキルについて詳しく解説します。',
    keywords: ['AI', '人工知能', '働き方', '未来', 'DX', 'デジタル変革'],
    category: 'テクノロジー',
    estimated_reading_time: '5分'
  }
}

// 画像生成API用のモックレスポンス
export const mockImageGenerationResponse = {
  success: true,
  imageUrl: 'https://example.com/generated-image-ai-workplace.jpg',
  prompt: 'AI技術を使った未来のオフィス風景',
  size: '1024x768',
  generation_time: 3.2
}

// SEOチェックAPI用のモックレスポンス
export const mockSEOCheckResponse = {
  success: true,
  seo_score: 85,
  analysis: {
    title: {
      score: 90,
      issues: [],
      suggestions: ['タイトルの文字数が適切です']
    },
    meta_description: {
      score: 80,
      issues: ['メタディスクリプションがやや短い'],
      suggestions: ['160文字程度まで拡張することを推奨']
    },
    headings: {
      score: 85,
      issues: [],
      suggestions: ['見出し構造が適切に設定されています']
    },
    keywords: {
      score: 75,
      issues: ['キーワード密度がやや低い'],
      suggestions: ['主要キーワードをもう少し増やすことを推奨']
    }
  },
  improvement_suggestions: [
    'メタディスクリプションを160文字程度に拡張してください',
    'キーワード密度を2-3%程度に調整してください',
    '内部リンクを追加してサイト全体のSEOを強化してください'
  ]
}

// 品質評価API用のモックレスポンス
export const mockQualityEvaluationResponse = {
  success: true,
  evaluation: {
    overall_score: 82,
    expertise: {
      score: 85,
      comments: '専門知識が適切に記述されている'
    },
    authoritativeness: {
      score: 80,
      comments: '信頼できる情報源に基づいている'
    },
    trustworthiness: {
      score: 85,
      comments: '正確で信頼性の高い内容'
    },
    experience: {
      score: 75,
      comments: '実体験に基づく内容をもう少し含めることを推奨'
    },
    content_quality: {
      score: 88,
      comments: 'オリジナリティが高く、有用な情報が含まれている'
    },
    user_experience: {
      score: 82,
      comments: '読みやすく、構造化されている'
    },
    technical_quality: {
      score: 80,
      comments: 'パフォーマンスとアクセシビリティが良好'
    },
    mobile_friendliness: {
      score: 90,
      comments: 'モバイル対応が適切に実装されている'
    }
  },
  improvement_suggestions: [
    '実体験や事例をもう少し含めることで、より説得力のある内容になります',
    '関連記事への内部リンクを追加してユーザーエンゲージメントを向上させてください',
    '画像のalt属性をより詳細に記述してアクセシビリティを改善してください'
  ]
}

// 広告管理API用のモックレスポンス
export const mockAdManagementResponse = {
  success: true,
  ad_placements: [
    {
      id: 'ad-1',
      position: 'header',
      type: 'banner',
      size: '728x90',
      content: '<div class="ad-banner">広告バナー</div>',
      enabled: true
    },
    {
      id: 'ad-2',
      position: 'article-middle',
      type: 'responsive',
      size: 'auto',
      content: '<div class="ad-responsive">レスポンシブ広告</div>',
      enabled: true
    },
    {
      id: 'ad-3',
      position: 'footer',
      type: 'banner',
      size: '728x90',
      content: '<div class="ad-footer">フッター広告</div>',
      enabled: false
    }
  ],
  statistics: {
    total_impressions: 12450,
    total_clicks: 234,
    ctr: 1.88,
    revenue: 45.67
  }
}

// エラーレスポンス用のモック
export const mockErrorResponse = {
  success: false,
  error: 'APIエラーが発生しました。しばらく時間をおいて再度お試しください。',
  error_code: 'INTERNAL_SERVER_ERROR',
  timestamp: new Date().toISOString()
}

// テスト用のフォームデータ
export const mockFormData = {
  articleGeneration: {
    keyword: 'AI記事生成',
    tone: 'professional',
    length: 'medium',
    include_images: true,
    target_audience: 'ビジネスパーソン'
  },
  imageGeneration: {
    prompt: '美しい日本の風景、桜が咲く春の公園',
    style: 'realistic',
    size: '1024x768',
    quality: 'high'
  },
  seoCheck: {
    url: 'https://example.com/test-article',
    keyword: 'SEO最適化',
    check_type: 'full'
  }
}

// ユーザー情報のモック
export const mockUserData = {
  id: 'user-123',
  name: 'テストユーザー',
  email: 'test@example.com',
  plan: 'premium',
  usage: {
    articles_generated: 45,
    images_generated: 23,
    api_calls_remaining: 500
  }
}
