'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileCheck, 
  TrendingUp, 
  Award, 
  Target,
  BookOpen,
  ArrowLeft,
  Download,
  Share2,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import QualityEvaluationForm from '@/components/forms/quality-evaluation-form';
import GoogleQualityEvaluationForm from '@/components/forms/google-quality-evaluation-form';
import { QualityEvaluationResult } from '@/types/quality-evaluation';

export default function QualityEvaluationPage() {
  const searchParams = useSearchParams();
  const [evaluationHistory, setEvaluationHistory] = useState<QualityEvaluationResult[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<QualityEvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState('evaluation');

  // URLパラメータからタブを設定
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 評価完了時の処理
  const handleEvaluationComplete = (result: QualityEvaluationResult) => {
    setCurrentEvaluation(result);
    setEvaluationHistory(prev => [result, ...prev.slice(0, 4)]); // 最新5件を保持
  };

  // 評価結果のエクスポート
  const exportEvaluation = () => {
    if (!currentEvaluation) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      evaluation: currentEvaluation
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-evaluation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 評価結果の共有
  const shareEvaluation = async () => {
    if (!currentEvaluation) return;
    
    const shareData = {
      title: '記事品質評価結果',
      text: `総合スコア: ${currentEvaluation.overallScore}点 (${currentEvaluation.category})`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('共有がキャンセルされました');
      }
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('評価結果をクリップボードにコピーしました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ホームに戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  記事品質評価
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AIを活用して記事のSEO、読みやすさ、コンテンツ品質を総合的に評価
                </p>
              </div>
            </div>
            
            {currentEvaluation && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={exportEvaluation}>
                  <Download className="h-4 w-4 mr-2" />
                  結果をエクスポート
                </Button>
                <Button variant="outline" size="sm" onClick={shareEvaluation}>
                  <Share2 className="h-4 w-4 mr-2" />
                  結果を共有
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="evaluation">SEO品質評価</TabsTrigger>
                <TabsTrigger value="google-quality">Google品質評価</TabsTrigger>
                <TabsTrigger value="guide">評価ガイド</TabsTrigger>
                <TabsTrigger value="history">評価履歴</TabsTrigger>
              </TabsList>

              <TabsContent value="evaluation">
                <QualityEvaluationForm 
                  onEvaluationComplete={handleEvaluationComplete}
                />
              </TabsContent>

              <TabsContent value="google-quality">
                <GoogleQualityEvaluationForm />
              </TabsContent>

              <TabsContent value="guide" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      評価項目について
                    </CardTitle>
                    <CardDescription>
                      記事品質評価で確認される主要な項目と改善ポイント
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>SEO品質評価</strong>は従来のSEO要素、<strong>Google品質評価</strong>はGoogle検索品質ガイドラインに基づく評価です。両方の評価を参考にして記事を改善することをお勧めします。
                      </AlertDescription>
                    </Alert>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        SEO評価 (重み: 40%)
                      </h3>
                      <div className="space-y-4 ml-7">
                        <div>
                          <h4 className="font-medium">メタデータ</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>タイトル: 20-60文字、キーワード含有</li>
                            <li>メタディスクリプション: 120-160文字、魅力的な要約</li>
                            <li>キーワード設定: 関連キーワードの適切な配置</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">コンテンツSEO</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>見出し構造: H1〜H6の論理的な階層</li>
                            <li>キーワード最適化: 適切な密度と配置</li>
                            <li>画像最適化: alt属性の設定</li>
                            <li>内部リンク: 関連記事への自然なリンク</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">技術的SEO</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>構造化データ: JSON-LDによる記事情報</li>
                            <li>OGタグ: SNSシェア時の表示最適化</li>
                            <li>Canonical URL: 重複コンテンツ対策</li>
                            <li>Viewport設定: モバイル対応</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-green-600" />
                        読みやすさ評価 (重み: 30%)
                      </h3>
                      <div className="space-y-4 ml-7">
                        <div>
                          <h4 className="font-medium">文章統計</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>文字数: 適切なボリューム（300-3000文字）</li>
                            <li>文の長さ: 1文60文字以下推奨</li>
                            <li>段落構成: 適度な分割</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">ユーザビリティ</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>導入部分: 記事の目的と内容の予告</li>
                            <li>まとめ部分: 要点の整理と結論</li>
                            <li>箇条書き・リスト: 情報の整理</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        コンテンツ評価 (重み: 20%)
                      </h3>
                      <div className="space-y-4 ml-7">
                        <div>
                          <h4 className="font-medium">内容の深さ</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>トピックカバレッジ: テーマの網羅性</li>
                            <li>詳細度: 具体的で実用的な情報</li>
                            <li>専門性: 信頼できる情報源</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">構造の質</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>論理的な流れ: 情報の順序と関連性</li>
                            <li>導入の質: 読者の関心を引く導入</li>
                            <li>結論の質: 明確なまとめと提案</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        技術評価 (重み: 10%)
                      </h3>
                      <div className="space-y-4 ml-7">
                        <div>
                          <h4 className="font-medium">HTML品質</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>有効なマークアップ: 正しいHTML構文</li>
                            <li>セマンティック構造: 意味のあるタグ使用</li>
                            <li>アクセシビリティ: 障害者への配慮</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">パフォーマンス</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>画像最適化: 遅延読み込み、適切な形式</li>
                            <li>読み込み最適化: 非同期読み込み</li>
                            <li>モバイル対応: レスポンシブデザイン</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-red-600" />
                        Google品質ガイドライン評価
                      </h3>
                      <div className="space-y-4 ml-7">
                        <div>
                          <h4 className="font-medium">オリジナリティ</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>独自の視点や分析があるか</li>
                            <li>個人的な経験や洞察が含まれているか</li>
                            <li>テンプレート的でない表現か</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">E-E-A-T評価</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>Experience: 実体験に基づく情報</li>
                            <li>Expertise: 専門的な知識と正確性</li>
                            <li>Authoritativeness: 権威性のある情報源</li>
                            <li>Trustworthiness: 信頼できる出典と透明性</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">ユーザー価値</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>検索意図への適切な回答</li>
                            <li>実用的で行動に移せる情報</li>
                            <li>包括的で詳細な内容</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">品質リスク回避</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            <li>剽窃・コピーコンテンツの回避</li>
                            <li>キーワードスタッフィングの回避</li>
                            <li>自動生成感・大量投稿感の排除</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      スコア基準
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">85+</div>
                        <div className="text-sm text-green-700">優秀</div>
                        <div className="text-xs text-gray-600 mt-1">
                          高品質な記事として評価されます
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">70-84</div>
                        <div className="text-sm text-blue-700">良好</div>
                        <div className="text-xs text-gray-600 mt-1">
                          一般的に良い品質の記事です
                        </div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">50-69</div>
                        <div className="text-sm text-yellow-700">普通</div>
                        <div className="text-xs text-gray-600 mt-1">
                          改善の余地があります
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">49以下</div>
                        <div className="text-sm text-red-700">要改善</div>
                        <div className="text-xs text-gray-600 mt-1">
                          大幅な改善が必要です
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>評価履歴</CardTitle>
                    <CardDescription>
                      最近の評価結果を確認できます
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {evaluationHistory.length > 0 ? (
                      <div className="space-y-4">
                        {evaluationHistory.map((evaluation, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl font-bold">
                                      {evaluation.overallScore}点
                                    </span>
                                    <Badge className={
                                      evaluation.category === 'excellent' ? 'bg-green-100 text-green-800' :
                                      evaluation.category === 'good' ? 'bg-blue-100 text-blue-800' :
                                      evaluation.category === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }>
                                      {evaluation.category === 'excellent' ? '優秀' :
                                       evaluation.category === 'good' ? '良好' :
                                       evaluation.category === 'fair' ? '普通' : '要改善'}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>SEO: {evaluation.evaluations.seo.score}点</div>
                                    <div>読みやすさ: {evaluation.evaluations.readability.score}点</div>
                                    <div>コンテンツ: {evaluation.evaluations.content.score}点</div>
                                    <div>技術: {evaluation.evaluations.technical.score}点</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>
                          まだ評価履歴がありません。「品質評価」タブで記事の評価を実行してください。
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 現在の評価結果サマリー */}
              {currentEvaluation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">現在の評価</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-blue-600">
                        {currentEvaluation.overallScore}点
                      </div>
                      <Badge className={
                        currentEvaluation.category === 'excellent' ? 'bg-green-100 text-green-800' :
                        currentEvaluation.category === 'good' ? 'bg-blue-100 text-blue-800' :
                        currentEvaluation.category === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {currentEvaluation.category === 'excellent' ? '優秀' :
                         currentEvaluation.category === 'good' ? '良好' :
                         currentEvaluation.category === 'fair' ? '普通' : '要改善'}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {currentEvaluation.recommendations.filter(r => r.priority === 'high').length}件の高優先度改善項目
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* クイックアクション */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">関連機能</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/article-generator">
                    <Button variant="outline" className="w-full justify-start">
                      記事生成
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="outline" className="w-full justify-start">
                      テンプレート管理
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      ダッシュボード
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* ヒント */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 評価のコツ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">より正確な評価のために：</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                      <li>完全なHTMLコンテンツを入力</li>
                      <li>ターゲットキーワードを設定</li>
                      <li>メタタグを含める</li>
                      <li>画像のalt属性を確認</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
