/**
 * GoogleトレンドCSVアップローダーコンポーネント
 * CSV ファイルをアップロードして解析結果を表示
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import type { 
  GoogleTrendsCsvFormState, 
  GoogleTrendAnalysisResult, 
  GoogleTrendsCsvUploaderProps 
} from '@/types/google-trends';
import { formatDateRange, formatTrendDirection } from '@/utils/google-trends-csv';

export function GoogleTrendsCsvUploader({
  onUploadComplete,
  onError,
  className = '',
  disabled = false,
  maxFileSize = 5 * 1024 * 1024 // 5MB
}: GoogleTrendsCsvUploaderProps) {
  const [formState, setFormState] = useState<GoogleTrendsCsvFormState>({
    file: null,
    keyword: '',
    analysisResult: null,
    isLoading: false,
    error: null,
    successMessage: null,
    uploadProgress: 0
  });

  // ファイル選択ハンドラー
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック
    if (file.size > maxFileSize) {
      setFormState(prev => ({
        ...prev,
        error: `ファイルサイズは${Math.round(maxFileSize / 1024 / 1024)}MB以下にしてください`
      }));
      return;
    }

    // ファイル形式チェック
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFormState(prev => ({
        ...prev,
        error: 'CSVファイルのみアップロード可能です'
      }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      file,
      error: null,
      successMessage: null
    }));
  }, [maxFileSize]);

  // キーワード変更ハンドラー
  const handleKeywordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      keyword: event.target.value,
      error: null
    }));
  }, []);

  // アップロード処理
  const handleUpload = useCallback(async () => {
    if (!formState.file || !formState.keyword.trim()) {
      setFormState(prev => ({
        ...prev,
        error: 'ファイルとキーワードを入力してください'
      }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      successMessage: null,
      uploadProgress: 0
    }));

    try {
      // FormDataを作成
      const formData = new FormData();
      formData.append('file', formState.file);
      formData.append('keyword', formState.keyword.trim());

      // 進行状況をシミュレート
      const progressInterval = setInterval(() => {
        setFormState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 200);

      // APIリクエスト
      const response = await fetch('/api/google-trends/upload-csv', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'アップロードに失敗しました');
      }

      // 成功時の処理
      setFormState(prev => ({
        ...prev,
        analysisResult: data.data,
        uploadProgress: 100,
        successMessage: data.message || 'CSV取り込みが完了しました',
        isLoading: false
      }));

      // コールバック実行
      if (onUploadComplete && data.data) {
        onUploadComplete(data.data);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      
      setFormState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        uploadProgress: 0
      }));

      // エラーコールバック実行
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [formState.file, formState.keyword, onUploadComplete, onError]);

  // リセットハンドラー
  const handleReset = useCallback(() => {
    setFormState({
      file: null,
      keyword: '',
      analysisResult: null,
      isLoading: false,
      error: null,
      successMessage: null,
      uploadProgress: 0
    });
  }, []);

  // トレンド方向のアイコンを取得
  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* アップロードフォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            GoogleトレンドCSV取り込み
          </CardTitle>
          <CardDescription>
            GoogleトレンドからエクスポートしたCSVファイルをアップロードして、トレンド分析を行います
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* キーワード入力 */}
          <div className="space-y-2">
            <Label htmlFor="keyword">キーワード</Label>
            <Input
              id="keyword"
              type="text"
              placeholder="例: 人工知能"
              value={formState.keyword}
              onChange={handleKeywordChange}
              disabled={disabled || formState.isLoading}
            />
          </div>

          {/* ファイル選択 */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSVファイル</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={disabled || formState.isLoading}
            />
            {formState.file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{formState.file.name}</span>
                <span className="text-gray-400">
                  ({Math.round(formState.file.size / 1024)} KB)
                </span>
              </div>
            )}
          </div>

          {/* 進行状況 */}
          {formState.isLoading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>アップロード中...</span>
                <span>{formState.uploadProgress}%</span>
              </div>
              <Progress value={formState.uploadProgress} className="w-full" />
            </div>
          )}

          {/* エラーメッセージ */}
          {formState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {/* 成功メッセージ */}
          {formState.successMessage && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{formState.successMessage}</AlertDescription>
            </Alert>
          )}

          {/* アクションボタン */}
          <div className="flex gap-2">
            <Button 
              onClick={handleUpload}
              disabled={
                disabled || 
                formState.isLoading || 
                !formState.file || 
                !formState.keyword.trim()
              }
              className="flex-1"
            >
              {formState.isLoading ? '処理中...' : 'アップロード'}
            </Button>
            {formState.analysisResult && (
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={disabled || formState.isLoading}
              >
                リセット
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 解析結果表示 */}
      {formState.analysisResult && (
        <TrendAnalysisResults analysisResult={formState.analysisResult} />
      )}
    </div>
  );
}

/**
 * トレンド解析結果表示コンポーネント
 */
function TrendAnalysisResults({ analysisResult }: { analysisResult: GoogleTrendAnalysisResult }) {
  const { keyword, period, statistics, seoRecommendations } = analysisResult;

  return (
    <div className="space-y-4">
      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            解析結果: {keyword}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDateRange(period.startDate, period.endDate)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.averageScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">平均スコア</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.maxScore}
              </div>
              <div className="text-sm text-gray-500">最高スコア</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {getTrendIcon(statistics.trendDirection)}
                <span className="text-lg font-semibold">
                  {formatTrendDirection(statistics.trendDirection)}
                </span>
              </div>
              <div className="text-sm text-gray-500">トレンド方向</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.volatility.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">変動率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO推奨事項 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SEO推奨事項
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* コンテンツ作成推奨度 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">コンテンツ作成推奨度</span>
              <Badge variant={seoRecommendations.contentCreationScore >= 8 ? 'default' : 
                             seoRecommendations.contentCreationScore >= 6 ? 'secondary' : 'outline'}>
                {seoRecommendations.contentCreationScore}/10
              </Badge>
            </div>
            <Progress value={seoRecommendations.contentCreationScore * 10} className="w-full" />
          </div>

          {/* 最適な投稿タイミング */}
          <div>
            <h4 className="text-sm font-medium mb-2">最適な投稿タイミング</h4>
            <div className="flex flex-wrap gap-2">
              {seoRecommendations.optimalPostingTime.map((timing, index) => (
                <Badge key={index} variant="outline">
                  {timing}
                </Badge>
              ))}
            </div>
          </div>

          {/* 推奨記事タイプ */}
          <div>
            <h4 className="text-sm font-medium mb-2">推奨記事タイプ</h4>
            <div className="flex flex-wrap gap-2">
              {seoRecommendations.recommendedContentTypes.map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* 競合分析 */}
          <div>
            <h4 className="text-sm font-medium mb-2">競合分析</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {seoRecommendations.competitorAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function getTrendIcon(direction: 'up' | 'down' | 'stable') {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  }
}
