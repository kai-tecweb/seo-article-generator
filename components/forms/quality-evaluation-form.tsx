import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Search, 
  Eye, 
  Cog,
  Loader2,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  Lightbulb
} from 'lucide-react';
import { 
  QualityEvaluationResult, 
  QualityEvaluationRequest,
  QualityRecommendation 
} from '@/types/quality-evaluation';

interface QualityEvaluationFormProps {
  initialContent?: string;
  onEvaluationComplete?: (result: QualityEvaluationResult) => void;
}

const QualityEvaluationForm: React.FC<QualityEvaluationFormProps> = ({
  initialContent = '',
  onEvaluationComplete
}) => {
  const [htmlContent, setHtmlContent] = useState(initialContent);
  const [targetKeywords, setTargetKeywords] = useState<string[]>(['']);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<QualityEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  // キーワードの追加・削除
  const addKeyword = () => {
    setTargetKeywords([...targetKeywords, '']);
  };

  const removeKeyword = (index: number) => {
    setTargetKeywords(targetKeywords.filter((_, i) => i !== index));
  };

  const updateKeyword = (index: number, value: string) => {
    const updated = [...targetKeywords];
    updated[index] = value;
    setTargetKeywords(updated);
  };

  // セクションの展開・折りたたみ
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // 品質評価の実行
  const handleEvaluate = async () => {
    if (!htmlContent.trim()) {
      setError('記事コンテンツを入力してください');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const requestData: QualityEvaluationRequest = {
        htmlContent,
        targetKeywords: targetKeywords.filter(k => k.trim() !== ''),
        config: {
          weights: {
            seo: 0.4,
            readability: 0.3,
            content: 0.2,
            technical: 0.1
          }
        }
      };

      const response = await fetch('/api/quality-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setEvaluationResult(result.data);
        onEvaluationComplete?.(result.data);
        setExpandedSections(new Set(['overview', 'seo', 'recommendations']));
      } else {
        throw new Error(result.error?.message || '評価に失敗しました');
      }
    } catch (err) {
      console.error('Quality evaluation error:', err);
      setError(err instanceof Error ? err.message : '評価中にエラーが発生しました');
    } finally {
      setIsEvaluating(false);
    }
  };

  // スコアの色とアイコンを取得
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <TrendingUp className="h-5 w-5 text-blue-600" />;
    if (score >= 50) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    const labels = {
      excellent: '優秀',
      good: '良好',
      fair: '普通',
      poor: '要改善'
    };
    return (
      <Badge className={variants[category as keyof typeof variants]}>
        {labels[category as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    const labels = {
      high: '高',
      medium: '中',
      low: '低'
    };
    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            記事品質評価
          </CardTitle>
          <CardDescription>
            記事のSEO、読みやすさ、コンテンツ品質、技術的実装を総合的に評価します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="htmlContent">記事コンテンツ（HTML）</Label>
            <Textarea
              id="htmlContent"
              placeholder="評価したい記事のHTMLコンテンツを入力してください..."
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              rows={8}
              className="mt-1"
            />
          </div>

          <div>
            <Label>ターゲットキーワード</Label>
            <div className="space-y-2 mt-1">
              {targetKeywords.map((keyword, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`キーワード ${index + 1}`}
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                  />
                  {targetKeywords.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeKeyword(index)}
                    >
                      削除
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyword}
              >
                キーワードを追加
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleEvaluate} 
            disabled={isEvaluating || !htmlContent.trim()}
            className="w-full"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                評価中...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                品質評価を実行
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 評価結果 */}
      {evaluationResult && (
        <div className="space-y-6">
          {/* 総合スコア */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('overview')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  総合評価
                </div>
                {expandedSections.has('overview') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.has('overview') && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getScoreIcon(evaluationResult.overallScore)}
                      <span className={`text-2xl font-bold ${getScoreColor(evaluationResult.overallScore)}`}>
                        {evaluationResult.overallScore}点
                      </span>
                    </div>
                    {getCategoryBadge(evaluationResult.category)}
                  </div>

                  <Progress value={evaluationResult.overallScore} className="w-full" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(evaluationResult.evaluations.seo.score)}`}>
                        {evaluationResult.evaluations.seo.score}
                      </div>
                      <div className="text-sm text-gray-600">SEO</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(evaluationResult.evaluations.readability.score)}`}>
                        {evaluationResult.evaluations.readability.score}
                      </div>
                      <div className="text-sm text-gray-600">読みやすさ</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(evaluationResult.evaluations.content.score)}`}>
                        {evaluationResult.evaluations.content.score}
                      </div>
                      <div className="text-sm text-gray-600">コンテンツ</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(evaluationResult.evaluations.technical.score)}`}>
                        {evaluationResult.evaluations.technical.score}
                      </div>
                      <div className="text-sm text-gray-600">技術</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* 詳細評価タブ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                詳細評価
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="readability">読みやすさ</TabsTrigger>
                  <TabsTrigger value="content">コンテンツ</TabsTrigger>
                  <TabsTrigger value="technical">技術</TabsTrigger>
                </TabsList>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">メタデータ</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>タイトル ({evaluationResult.evaluations.seo.metadata.title.length}文字)</span>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(evaluationResult.evaluations.seo.metadata.title.score)}>
                              {evaluationResult.evaluations.seo.metadata.title.score}点
                            </span>
                            {evaluationResult.evaluations.seo.metadata.title.isOptimal ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ディスクリプション ({evaluationResult.evaluations.seo.metadata.description.length}文字)</span>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(evaluationResult.evaluations.seo.metadata.description.score)}>
                              {evaluationResult.evaluations.seo.metadata.description.score}点
                            </span>
                            {evaluationResult.evaluations.seo.metadata.description.isOptimal ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">コンテンツSEO</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>見出し構造</span>
                          <span className={getScoreColor(evaluationResult.evaluations.seo.content.headingStructure.score)}>
                            {evaluationResult.evaluations.seo.content.headingStructure.score}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>キーワード最適化</span>
                          <span className={getScoreColor(evaluationResult.evaluations.seo.content.keywordOptimization.overallOptimization)}>
                            {evaluationResult.evaluations.seo.content.keywordOptimization.overallOptimization}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>画像最適化</span>
                          <span className={getScoreColor(evaluationResult.evaluations.seo.content.imageOptimization.score)}>
                            {evaluationResult.evaluations.seo.content.imageOptimization.score}点
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">技術的SEO</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(evaluationResult.evaluations.seo.technical).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm">
                              {key === 'structuredData' && '構造化データ'}
                              {key === 'canonicalUrl' && 'Canonical URL'}
                              {key === 'metaViewport' && 'Viewport設定'}
                              {key === 'ogTags' && 'OGタグ'}
                              {key === 'twitterCards' && 'Twitter Cards'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="readability" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">文章統計</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>文字数: {evaluationResult.evaluations.readability.statistics.wordCount}</div>
                        <div>文数: {evaluationResult.evaluations.readability.statistics.sentenceCount}</div>
                        <div>段落数: {evaluationResult.evaluations.readability.statistics.paragraphCount}</div>
                        <div>平均文字数/文: {Math.round(evaluationResult.evaluations.readability.statistics.averageWordsPerSentence)}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">読みやすさ要素</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(evaluationResult.evaluations.readability.userFriendliness).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm">
                              {key === 'hasIntroduction' && '導入部分'}
                              {key === 'hasConclusion' && 'まとめ部分'}
                              {key === 'hasBulletPoints' && '箇条書き'}
                              {key === 'hasNumberedLists' && '番号付きリスト'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">内容の深さ</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>トピックカバレッジ</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.depth.topicCoverage)}>
                            {Math.round(evaluationResult.evaluations.content.depth.topicCoverage)}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>詳細度</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.depth.detailLevel)}>
                            {Math.round(evaluationResult.evaluations.content.depth.detailLevel)}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>専門性</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.depth.expertise)}>
                            {Math.round(evaluationResult.evaluations.content.depth.expertise)}点
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">構造の質</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>論理的な流れ</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.structure.logicalFlow)}>
                            {evaluationResult.evaluations.content.structure.logicalFlow}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>導入の質</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.structure.introduction)}>
                            {evaluationResult.evaluations.content.structure.introduction}点
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>結論の質</span>
                          <span className={getScoreColor(evaluationResult.evaluations.content.structure.conclusion)}>
                            {evaluationResult.evaluations.content.structure.conclusion}点
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">HTML品質</h4>
                      <div className="space-y-2">
                        {Object.entries(evaluationResult.evaluations.technical.htmlQuality).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm">
                              {key === 'validMarkup' && '有効なマークアップ'}
                              {key === 'semanticStructure' && 'セマンティック構造'}
                              {key === 'accessibilityCompliance' && 'アクセシビリティ対応'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">パフォーマンス</h4>
                      <div className="space-y-2">
                        {Object.entries(evaluationResult.evaluations.technical.performance).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm">
                              {key === 'imageOptimization' && '画像最適化'}
                              {key === 'loadingOptimization' && '読み込み最適化'}
                              {key === 'cacheability' && 'キャッシュ設定'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">モバイル最適化</h4>
                      <div className="space-y-2">
                        {Object.entries(evaluationResult.evaluations.technical.mobileOptimization).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm">
                              {key === 'responsive' && 'レスポンシブ対応'}
                              {key === 'touchFriendly' && 'タッチフレンドリー'}
                              {key === 'fastLoading' && '高速読み込み'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 改善提案 */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('recommendations')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  改善提案 ({evaluationResult.recommendations.length}件)
                </div>
                {expandedSections.has('recommendations') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.has('recommendations') && (
              <CardContent>
                <div className="space-y-4">
                  {evaluationResult.recommendations.map((rec, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(rec.priority)}
                              <Badge variant="outline">{rec.difficulty}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{rec.currentState}</p>
                          <p className="text-sm">{rec.recommendation}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>期待効果: {rec.expectedImpact}</span>
                            <span>予想時間: {rec.estimatedTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* サマリー */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection('summary')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  評価サマリー
                </div>
                {expandedSections.has('summary') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
            {expandedSections.has('summary') && (
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">✅ 強み</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {evaluationResult.summary.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">⚠️ 改善点</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {evaluationResult.summary.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-2">🎯 優先改善項目</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {evaluationResult.summary.priorityImprovements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default QualityEvaluationForm;
