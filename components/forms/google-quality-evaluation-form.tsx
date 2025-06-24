import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Users, 
  Copy, 
  Search, 
  Shield, 
  Award, 
  FileText, 
  Bot,
  Lightbulb,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { 
  GoogleQualityGuidelineEvaluation,
  GoogleQualityCheckItem,
  GoogleQualityEvaluationRequest,
  GoogleQualityEvaluationResponse,
  GoogleQualityImprovement
} from '@/types/quality-evaluation';

export default function GoogleQualityEvaluationForm() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    metaDescription: '',
    targetKeywords: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<GoogleQualityGuidelineEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const request: GoogleQualityEvaluationRequest = {
        content: {
          title: formData.title,
          body: formData.body,
          metaDescription: formData.metaDescription || undefined,
          targetKeywords: formData.targetKeywords.split(',').map(k => k.trim()).filter(Boolean)
        },
        includeDetailedAnalysis: true
      };

      const response = await fetch('/api/quality-evaluation/google-guidelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result: GoogleQualityEvaluationResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '評価に失敗しました');
      }

      setEvaluation(result.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Google品質ガイドライン評価
        </h1>
        <p className="text-gray-600">
          Google検索品質ガイドラインに基づいて記事を評価し、SEO改善点を提案します
        </p>
      </div>

      {/* 入力フォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            記事情報入力
          </CardTitle>
          <CardDescription>
            評価したい記事の情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">記事タイトル *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="記事のタイトルを入力"
                required
              />
            </div>

            <div>
              <Label htmlFor="body">記事本文 *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="記事の本文を入力してください..."
                className="min-h-[200px]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                文字数: {formData.body.length}
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">メタディスクリプション</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="記事の要約（任意）"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="targetKeywords">ターゲットキーワード</Label>
              <Input
                id="targetKeywords"
                value={formData.targetKeywords}
                onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                placeholder="キーワード1, キーワード2, キーワード3"
              />
              <p className="text-sm text-gray-500 mt-1">
                複数のキーワードはカンマで区切ってください
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !formData.title || !formData.body}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  評価中...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  品質評価を開始
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 評価結果表示 */}
      {evaluation && (
        <EvaluationResults evaluation={evaluation} />
      )}
    </div>
  );
}

interface EvaluationResultsProps {
  evaluation: GoogleQualityGuidelineEvaluation;
}

function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  return (
    <div className="space-y-6">
      {/* 総合評価 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            総合評価結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${
                  evaluation.overallAssessment === 'OK' ? 'text-green-600' :
                  evaluation.overallAssessment === 'NEEDS_IMPROVEMENT' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {evaluation.overallScore}
                </div>
                <div className="text-gray-600">/ 100点</div>
                <StatusBadge status={evaluation.overallAssessment} />
              </div>
              <Progress value={evaluation.overallScore} className="w-full" />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {evaluation.summary.okCount}
                  </div>
                  <div className="text-sm text-green-700">OK項目</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {evaluation.summary.improvementCount}
                  </div>
                  <div className="text-sm text-yellow-700">要改善</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {evaluation.summary.ngCount}
                  </div>
                  <div className="text-sm text-red-700">NG項目</div>
                </div>
              </div>

              {evaluation.criticalWarnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">重要な警告があります:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.criticalWarnings.slice(0, 3).map((warning, idx) => (
                        <li key={idx} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細評価 */}
      <Card>
        <CardHeader>
          <CardTitle>詳細評価項目</CardTitle>
          <CardDescription>
            各項目の評価結果と改善提案をご確認ください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">評価概要</TabsTrigger>
              <TabsTrigger value="details">詳細分析</TabsTrigger>
              <TabsTrigger value="improvements">改善提案</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4">
                <CheckItemCard
                  title="オリジナリティ"
                  icon={<Eye className="w-5 h-5" />}
                  item={evaluation.checkItems.originality}
                />
                <CheckItemCard
                  title="ユーザーへの有益性"
                  icon={<Users className="w-5 h-5" />}
                  item={evaluation.checkItems.userBenefit}
                />
                <CheckItemCard
                  title="剽窃・コピーコンテンツ"
                  icon={<Copy className="w-5 h-5" />}
                  item={evaluation.checkItems.plagiarism}
                />
                <CheckItemCard
                  title="キーワード詰め込み"
                  icon={<Search className="w-5 h-5" />}
                  item={evaluation.checkItems.keywordStuffing}
                />
                <CheckItemCard
                  title="信頼性・出典"
                  icon={<Shield className="w-5 h-5" />}
                  item={evaluation.checkItems.credibility}
                />
                <CheckItemCard
                  title="E-E-A-T"
                  icon={<Award className="w-5 h-5" />}
                  item={evaluation.checkItems.eeat}
                />
                <CheckItemCard
                  title="コンテンツの厚み"
                  icon={<FileText className="w-5 h-5" />}
                  item={evaluation.checkItems.contentDepth}
                />
                <CheckItemCard
                  title="自動投稿傾向"
                  icon={<Bot className="w-5 h-5" />}
                  item={evaluation.checkItems.autoPostingPattern}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(evaluation.checkItems).map(([key, item]) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      <span className="capitalize">{getItemTitle(key)}</span>
                      <StatusBadge status={item.status} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <DetailedItemView item={item} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="improvements" className="space-y-4">
              <div className="space-y-4">
                {evaluation.improvementPriorities.map((improvement, idx) => (
                  <ImprovementCard key={idx} improvement={improvement} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* クイックウィン */}
      {evaluation.summary.quickWins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              すぐに改善できるポイント
            </CardTitle>
            <CardDescription>
              簡単に実装できる改善提案です
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {evaluation.summary.quickWins.map((quickWin, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900">{quickWin}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CheckItemCardProps {
  title: string;
  icon: React.ReactNode;
  item: GoogleQualityCheckItem;
}

function CheckItemCard({ title, icon, item }: CheckItemCardProps) {
  return (
    <Card className={`border-l-4 ${
      item.status === 'OK' ? 'border-l-green-500 bg-green-50' :
      item.status === 'NEEDS_IMPROVEMENT' ? 'border-l-yellow-500 bg-yellow-50' :
      'border-l-red-500 bg-red-50'
    }`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">
                スコア: {item.score}/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status={item.status} />
            <StatusBadge status={item.status} />
          </div>
        </div>
        <Progress value={item.score} className="mt-3" />
        {item.reasons.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">評価理由:</p>
            <p className="text-sm text-gray-600">{item.reasons[0]}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DetailedItemViewProps {
  item: GoogleQualityCheckItem;
}

function DetailedItemView({ item }: DetailedItemViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">評価理由</h4>
          <ul className="list-disc list-inside space-y-1">
            {item.reasons.map((reason, idx) => (
              <li key={idx} className="text-sm text-gray-600">{reason}</li>
            ))}
          </ul>
        </div>
        {item.issues.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">問題点</h4>
            <ul className="list-disc list-inside space-y-1">
              {item.issues.map((issue, idx) => (
                <li key={idx} className="text-sm text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {item.suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">改善提案</h4>
          <ul className="list-disc list-inside space-y-1">
            {item.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-blue-600">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {item.examples && item.examples.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">具体例</h4>
          <div className="space-y-2">
            {item.examples.map((example, idx) => (
              <div key={idx} className="p-2 bg-gray-100 rounded text-sm">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ImprovementCardProps {
  improvement: GoogleQualityImprovement;
}

function ImprovementCard({ improvement }: ImprovementCardProps) {
  const priorityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold">{improvement.title}</h3>
          <div className="flex gap-2">
            <Badge className={priorityColors[improvement.priority]}>
              {improvement.priority}
            </Badge>
            <Badge className={difficultyColors[improvement.difficulty]}>
              {improvement.difficulty}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">現在の問題</h4>
            <p className="text-sm text-gray-600">{improvement.currentIssue}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">改善アクション</h4>
            <ul className="list-disc list-inside space-y-1">
              {improvement.actionItems.map((action, idx) => (
                <li key={idx} className="text-sm text-gray-600">{action}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {improvement.estimatedEffort}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {improvement.expectedImpact}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: { status: 'OK' | 'NEEDS_IMPROVEMENT' | 'NG' }) {
  switch (status) {
    case 'OK':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'NEEDS_IMPROVEMENT':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    case 'NG':
      return <XCircle className="w-5 h-5 text-red-600" />;
  }
}

function StatusBadge({ status }: { status: 'OK' | 'NEEDS_IMPROVEMENT' | 'NG' }) {
  const colors = {
    OK: 'bg-green-100 text-green-800',
    NEEDS_IMPROVEMENT: 'bg-yellow-100 text-yellow-800',
    NG: 'bg-red-100 text-red-800'
  };

  const labels = {
    OK: '✅ OK',
    NEEDS_IMPROVEMENT: '⚠️ 要改善',
    NG: '❌ NG'
  };

  return (
    <Badge className={colors[status]}>
      {labels[status]}
    </Badge>
  );
}

function getItemTitle(key: string): string {
  const titles: Record<string, string> = {
    originality: 'オリジナリティ',
    userBenefit: 'ユーザーへの有益性',
    plagiarism: '剽窃・コピーコンテンツ',
    keywordStuffing: 'キーワード詰め込み',
    credibility: '信頼性・出典',
    eeat: 'E-E-A-T',
    contentDepth: 'コンテンツの厚み',
    autoPostingPattern: '自動投稿傾向'
  };
  return titles[key] || key;
}
