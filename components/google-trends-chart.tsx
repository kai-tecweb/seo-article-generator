/**
 * Googleトレンドチャートコンポーネント
 * トレンドデータを時系列グラフで表示
 */

'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import type { TrendChartProps, GoogleTrendItem } from '@/types/google-trends';

export function TrendChart({
  data,
  keyword,
  height = 300,
  className = '',
  showDateRange = true
}: TrendChartProps) {
  // チャート用データの準備
  const chartData = useMemo(() => {
    return data
      .sort((a, b) => a.week.localeCompare(b.week))
      .map(item => ({
        ...item,
        displayDate: formatDateForChart(item.week),
        formattedDate: formatDateForTooltip(item.week)
      }));
  }, [data]);

  // 統計情報の計算
  const statistics = useMemo(() => {
    const scores = data.map(item => item.gTrends);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // 部分データの数
    const partialDataCount = data.filter(item => item.isPartial).length;

    return {
      maxScore,
      minScore,
      averageScore: Math.round(averageScore * 100) / 100,
      partialDataCount,
      totalDataPoints: data.length
    };
  }, [data]);

  // 期間の計算
  const dateRange = useMemo(() => {
    if (data.length === 0) return { start: '', end: '' };
    const sortedData = [...data].sort((a, b) => a.week.localeCompare(b.week));
    return {
      start: sortedData[0].week,
      end: sortedData[sortedData.length - 1].week
    };
  }, [data]);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.formattedDate}</p>
          <p className="text-blue-600">
            <span className="font-medium">スコア: </span>
            {data.gTrends}
          </p>
          {data.isPartial && (
            <p className="text-amber-600 text-sm flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              部分的なデータ
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // データが空の場合
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>トレンドチャート</CardTitle>
          <CardDescription>表示するデータがありません</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            データがありません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {keyword} - トレンドチャート
        </CardTitle>
        {showDateRange && (
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDateForDisplay(dateRange.start)} 〜 {formatDateForDisplay(dateRange.end)}
          </CardDescription>
        )}

        {/* 統計情報バッジ */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">
            平均: {statistics.averageScore}
          </Badge>
          <Badge variant="outline">
            最高: {statistics.maxScore}
          </Badge>
          <Badge variant="outline">
            最低: {statistics.minScore}
          </Badge>
          {statistics.partialDataCount > 0 && (
            <Badge variant="secondary" className="text-amber-700 bg-amber-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              部分データ: {statistics.partialDataCount}件
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* メインチャート */}
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: 'トレンドスコア', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gTrends"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorTrend)"
              />
              {/* 部分データの点を強調表示 */}
              <Line
                type="monotone"
                dataKey="gTrends"
                stroke="#f59e0b"
                strokeWidth={0}
                dot={(props: any) => {
                  const { payload } = props;
                  if (payload && payload.isPartial) {
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <div style={{ display: 'none' }} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* データポイント数の表示 */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          {statistics.totalDataPoints} データポイント
          {statistics.partialDataCount > 0 && (
            <span className="text-amber-600">
              （うち {statistics.partialDataCount} 件は部分的なデータ）
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 日付をチャート用にフォーマット（短縮形式）
 */
function formatDateForChart(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * 日付をツールチップ用にフォーマット（詳細形式）
 */
function formatDateForTooltip(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 日付を表示用にフォーマット
 */
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * 簡易版トレンドチャート（ダッシュボード用）
 */
export function MiniTrendChart({
  data,
  height = 150,
  className = ''
}: Pick<TrendChartProps, 'data' | 'height' | 'className'>) {
  const chartData = useMemo(() => {
    return data
      .sort((a, b) => a.week.localeCompare(b.week))
      .map(item => ({
        gTrends: item.gTrends,
        isPartial: item.isPartial
      }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={`h-${height} flex items-center justify-center text-gray-400 ${className}`}>
        データなし
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="miniColorTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="gTrends"
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#miniColorTrend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
