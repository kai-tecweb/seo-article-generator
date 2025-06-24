import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { 
  GoogleQualityEvaluationRequest, 
  GoogleQualityEvaluationResponse,
  GoogleQualityGuidelineEvaluation,
  GoogleQualityCheckItem,
  GoogleQualityImprovement
} from '@/types/quality-evaluation';

export async function POST(request: NextRequest) {
  try {
    const body: GoogleQualityEvaluationRequest = await request.json();
    
    if (!body.content?.title || !body.content?.body) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'タイトルと本文は必須です',
        }
      } as GoogleQualityEvaluationResponse, { status: 400 });
    }

    // Google品質ガイドライン評価を実行
    const evaluation = await evaluateGoogleQualityGuidelines(body);

    return NextResponse.json({
      success: true,
      data: evaluation,
      metadata: {
        evaluationTime: Date.now(),
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        configUsed: body.config || getDefaultConfig(),
      }
    } as GoogleQualityEvaluationResponse);

  } catch (error) {
    console.error('Google品質ガイドライン評価エラー:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'EVALUATION_ERROR',
        message: '評価中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    } as GoogleQualityEvaluationResponse, { status: 500 });
  }
}

async function evaluateGoogleQualityGuidelines(
  request: GoogleQualityEvaluationRequest
): Promise<GoogleQualityGuidelineEvaluation> {
  const { content, config = getDefaultConfig() } = request;
  
  // 各項目を並行評価
  const [
    originality,
    userBenefit,
    plagiarism,
    keywordStuffing,
    credibility,
    eeat,
    contentDepth,
    autoPostingPattern
  ] = await Promise.all([
    evaluateOriginality(content),
    evaluateUserBenefit(content),
    evaluatePlagiarism(content),
    evaluateKeywordStuffing(content),
    evaluateCredibility(content),
    evaluateEEAT(content),
    evaluateContentDepth(content),
    evaluateAutoPostingPattern(content)
  ]);

  // 総合評価の計算
  const checkItems = {
    originality,
    userBenefit,
    plagiarism,
    keywordStuffing,
    credibility,
    eeat,
    contentDepth,
    autoPostingPattern
  };

  const overallScore = calculateOverallScore(checkItems);
  const overallAssessment = getOverallAssessment(overallScore, config);
  const criticalWarnings = extractCriticalWarnings(checkItems);
  const improvementPriorities = generateImprovementPriorities(checkItems);

  return {
    overallAssessment,
    overallScore,
    checkItems,
    criticalWarnings,
    improvementPriorities,
    summary: {
      okCount: Object.values(checkItems).filter(item => item.status === 'OK').length,
      improvementCount: Object.values(checkItems).filter(item => item.status === 'NEEDS_IMPROVEMENT').length,
      ngCount: Object.values(checkItems).filter(item => item.status === 'NG').length,
      mainIssues: criticalWarnings.slice(0, 3),
      quickWins: improvementPriorities
        .filter(p => p.difficulty === 'easy')
        .slice(0, 3)
        .map(p => p.title)
    }
  };
}

// Zodスキーマ定義
const checkItemSchema = z.object({
  status: z.enum(['OK', 'NEEDS_IMPROVEMENT', 'NG']),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  examples: z.array(z.string()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical'])
});

// オリジナリティ評価
async function evaluateOriginality(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事のオリジナリティを評価してください。

【評価基準】
- 独自の視点や分析があるか
- テンプレート的でないか  
- 個人的な経験や洞察が含まれているか
- 単なる情報の寄せ集めでないか

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// ユーザーへの有益性評価
async function evaluateUserBenefit(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事がユーザーにとって有益かどうか評価してください。

【評価基準】
- 読者の疑問や課題を解決しているか
- 実用的で行動に移せる情報があるか
- 検索意図に適切に答えているか
- 包括的で詳細な情報を提供しているか

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// 剽窃・コピーコンテンツ評価
async function evaluatePlagiarism(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事に剽窃やコピーコンテンツの疑いがないか評価してください。

【評価基準】
- 他のサイトからの無断転載がないか
- 引用が適切に行われているか
- オリジナルの文章で書かれているか
- 出典が明記されているか

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// キーワードスタッフィング評価
async function evaluateKeywordStuffing(content: any): Promise<GoogleQualityCheckItem> {
  const keywords = content.targetKeywords || [];
  const prompt = `
以下の記事にキーワードスタッフィング（キーワード詰め込み）がないか評価してください。

【評価基準】
- キーワードが不自然に繰り返されていないか
- 文章の自然な流れを損なっていないか
- 読みやすさが保たれているか
- キーワード密度が適切か（目安：1-3%）

【記事】
タイトル: ${content.title}
本文: ${content.body}
${keywords.length > 0 ? `ターゲットキーワード: ${keywords.join(', ')}` : ''}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// 信頼性・出典評価
async function evaluateCredibility(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事の信頼性と出典について評価してください。

【評価基準】
- 事実に基づいた正確な情報か
- 信頼できる出典が引用されているか
- 主張に根拠があるか
- 最新の情報が使われているか
- 透明性があるか（著者情報、更新日等）

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// E-E-A-T評価
async function evaluateEEAT(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事のE-E-A-T（Experience, Expertise, Authoritativeness, Trustworthiness）を評価してください。

【評価基準】
- Experience（経験）: 実体験に基づく情報があるか
- Expertise（専門性）: 専門的な知識が示されているか
- Authoritativeness（権威性）: 信頼できる情報源か
- Trustworthiness（信頼性）: 正確で誠実な情報か

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// コンテンツの厚み評価
async function evaluateContentDepth(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事のコンテンツの厚み・深さを評価してください。

【評価基準】
- トピックを十分に網羅しているか
- 詳細で具体的な情報があるか
- 多角的な視点で論じているか
- 読者の疑問に包括的に答えているか
- 薄いコンテンツでないか

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// 自動投稿傾向評価
async function evaluateAutoPostingPattern(content: any): Promise<GoogleQualityCheckItem> {
  const prompt = `
以下の記事が自動生成・大量投稿サイトの特徴を持っていないか評価してください。

【評価基準】
- 人間らしい自然な文章か
- 個人的な視点や意見があるか
- テンプレート的でないか
- オリジナリティがあるか
- 機械的な印象を与えていないか

【記事】
タイトル: ${content.title}
本文: ${content.body}
`;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: checkItemSchema,
    prompt: prompt,
  });

  return object;
}

// 総合スコア計算
function calculateOverallScore(checkItems: any): number {
  const weights = {
    originality: 0.15,
    userBenefit: 0.2,
    plagiarism: 0.15,
    keywordStuffing: 0.1,
    credibility: 0.15,
    eeat: 0.15,
    contentDepth: 0.05,
    autoPostingPattern: 0.05
  };

  return Math.round(
    Object.entries(checkItems).reduce((total, [key, item]: [string, any]) => {
      const weight = weights[key as keyof typeof weights] || 0;
      return total + (item.score * weight);
    }, 0)
  );
}

// 総合評価の決定
function getOverallAssessment(score: number, config: any): 'OK' | 'NEEDS_IMPROVEMENT' | 'NG' {
  const okThreshold = config.customThresholds?.okThreshold || 80;
  const improvementThreshold = config.customThresholds?.improvementThreshold || 60;

  if (score >= okThreshold) return 'OK';
  if (score >= improvementThreshold) return 'NEEDS_IMPROVEMENT';
  return 'NG';
}

// 重要な警告の抽出
function extractCriticalWarnings(checkItems: any): string[] {
  const warnings: string[] = [];
  
  Object.entries(checkItems).forEach(([key, item]: [string, any]) => {
    if (item.severity === 'critical' || item.status === 'NG') {
      warnings.push(...item.issues);
    }
  });

  return warnings.slice(0, 5); // 最大5件
}

// 改善提案の生成
function generateImprovementPriorities(checkItems: any): GoogleQualityImprovement[] {
  const improvements: GoogleQualityImprovement[] = [];
  
  Object.entries(checkItems).forEach(([key, item]: [string, any]) => {
    if (item.status !== 'OK') {
      improvements.push({
        category: key as any,
        priority: item.severity === 'critical' ? 'critical' : 
                 item.severity === 'high' ? 'high' : 
                 item.severity === 'medium' ? 'medium' : 'low',
        title: `${key}の改善`,
        currentIssue: item.issues[0] || '問題が検出されました',
        actionItems: item.suggestions || [],
        expectedImpact: '品質スコアの向上',
        difficulty: 'medium',
        estimatedEffort: '30分～1時間'
      });
    }
  });

  return improvements.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// デフォルト設定
function getDefaultConfig() {
  return {
    strictness: 'standard' as const,
    focusAreas: ['userBenefit', 'credibility', 'eeat', 'originality'] as const,
    customThresholds: {
      okThreshold: 80,
      improvementThreshold: 60
    }
  };
}
