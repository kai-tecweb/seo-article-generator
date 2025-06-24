# パフォーマンス分析ダッシュボード実装計画

## 📊 ダッシュボード概要

### 目的
SEO記事生成システムの各種パフォーマンス指標を可視化し、データに基づく改善を促進する総合的な分析ダッシュボードを構築する。

### 主要機能
- **記事生成パフォーマンス**: 生成時間、品質スコア、成功率
- **SEO効果測定**: 検索順位、クリック率、コンバージョン率
- **広告パフォーマンス**: CTR、収益性、配置効果
- **API使用状況**: レスポンス時間、エラー率、使用量
- **ユーザー行動分析**: 操作フロー、離脱ポイント、満足度

## 🏗️ アーキテクチャ設計

### データフロー
```
記事生成・投稿 → 
ログ収集（分析API） → 
データベース蓄積 → 
リアルタイム集計 → 
ダッシュボード表示
```

### 技術スタック
- **可視化**: Chart.js / Recharts
- **データ管理**: SQLite / PostgreSQL
- **リアルタイム**: WebSocket / SSE
- **分析**: 独自分析ロジック + 外部分析ツール統合

## 📈 実装するダッシュボード

### 1. メインダッシュボード

#### ファイル構成
```typescript
// app/dashboard/page.tsx - メインダッシュボードページ
// components/dashboard/overview-card.tsx - 概要カード
// components/dashboard/performance-chart.tsx - パフォーマンスチャート
// components/dashboard/real-time-metrics.tsx - リアルタイム指標
```

```typescript
// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import OverviewCard from '@/components/dashboard/overview-card';
import PerformanceChart from '@/components/dashboard/performance-chart';
import RealTimeMetrics from '@/components/dashboard/real-time-metrics';

interface DashboardData {
  overview: {
    totalArticles: number;
    avgGenerationTime: number;
    avgQualityScore: number;
    successRate: number;
  };
  performance: {
    generationTimes: Array<{ date: string; time: number }>;
    qualityScores: Array<{ date: string; score: number }>;
    apiUsage: Array<{ service: string; requests: number; errors: number }>;
  };
  seo: {
    rankings: Array<{ keyword: string; position: number; change: number }>;
    traffic: Array<{ date: string; visits: number; clicks: number }>;
  };
  ads: {
    ctr: number;
    revenue: number;
    impressions: number;
    clicks: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchDashboardData = async (period: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/data?period=${period}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('ダッシュボードデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>データの読み込みに失敗しました</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">パフォーマンスダッシュボード</h1>
        <div className="flex space-x-2">
          {['1d', '7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded text-sm ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="生成記事数"
          value={data.overview.totalArticles}
          change={12}
          icon="📝"
        />
        <OverviewCard
          title="平均生成時間"
          value={`${data.overview.avgGenerationTime}秒`}
          change={-5}
          icon="⏱️"
        />
        <OverviewCard
          title="平均品質スコア"
          value={`${data.overview.avgQualityScore}点`}
          change={8}
          icon="⭐"
        />
        <OverviewCard
          title="成功率"
          value={`${data.overview.successRate}%`}
          change={2}
          icon="✅"
        />
      </div>

      {/* タブコンテンツ */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
          <TabsTrigger value="seo">SEO効果</TabsTrigger>
          <TabsTrigger value="ads">広告効果</TabsTrigger>
          <TabsTrigger value="realtime">リアルタイム</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>記事生成時間の推移</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  data={data.performance.generationTimes}
                  xField="date"
                  yField="time"
                  color="#3b82f6"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>品質スコアの推移</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  data={data.performance.qualityScores}
                  xField="date"
                  yField="score"
                  color="#10b981"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API使用状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.apiUsage.map((api) => (
                  <div key={api.service} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{api.service}</span>
                      <Badge variant="secondary" className="ml-2">
                        {api.requests} requests
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        エラー率: {((api.errors / api.requests) * 100).toFixed(1)}%
                      </span>
                      <Progress
                        value={((api.requests - api.errors) / api.requests) * 100}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>検索順位</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.seo.rankings.slice(0, 10).map((ranking) => (
                    <div key={ranking.keyword} className="flex items-center justify-between">
                      <span className="font-medium">{ranking.keyword}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{ranking.position}位</Badge>
                        <span className={`text-sm ${
                          ranking.change > 0 ? 'text-green-600' : 
                          ranking.change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {ranking.change > 0 ? '↑' : ranking.change < 0 ? '↓' : '→'}
                          {Math.abs(ranking.change)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>トラフィック推移</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  data={data.seo.traffic}
                  xField="date"
                  yField="visits"
                  color="#8b5cf6"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>クリック率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.ads.ctr.toFixed(2)}%</div>
                <p className="text-sm text-gray-500">前期比 +0.3%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>収益</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{data.ads.revenue.toLocaleString()}</div>
                <p className="text-sm text-gray-500">前期比 +15%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>インプレッション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.ads.impressions.toLocaleString()}</div>
                <p className="text-sm text-gray-500">前期比 +8%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>クリック数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.ads.clicks.toLocaleString()}</div>
                <p className="text-sm text-gray-500">前期比 +12%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 2. データ収集API

```typescript
// app/api/dashboard/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const periodSchema = z.enum(['1d', '7d', '30d', '90d']);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = periodSchema.parse(searchParams.get('period') || '7d');
    
    // データベースまたはファイルからデータを取得
    const data = await fetchDashboardData(period);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      error: 'データ取得エラー',
      details: error.message 
    }, { status: 500 });
  }
}

async function fetchDashboardData(period: string) {
  // 実際の実装では、データベースから期間に応じたデータを取得
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case '1d':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
  }
  
  // モックデータ（実際の実装では適切なデータ取得ロジックを実装）
  return {
    overview: {
      totalArticles: 245,
      avgGenerationTime: 12.5,
      avgQualityScore: 87.3,
      successRate: 94.2,
    },
    performance: {
      generationTimes: generateMockTimeSeriesData(startDate, endDate, 'time'),
      qualityScores: generateMockTimeSeriesData(startDate, endDate, 'score'),
      apiUsage: [
        { service: 'OpenAI API', requests: 1250, errors: 15 },
        { service: 'Fal AI API', requests: 890, errors: 8 },
        { service: 'WordPress API', requests: 340, errors: 2 },
        { service: 'Notion API', requests: 120, errors: 1 },
      ],
    },
    seo: {
      rankings: [
        { keyword: 'Next.js 開発', position: 3, change: 2 },
        { keyword: 'React TypeScript', position: 7, change: -1 },
        { keyword: 'SEO 最適化', position: 12, change: 5 },
        // ... more keywords
      ],
      traffic: generateMockTimeSeriesData(startDate, endDate, 'visits'),
    },
    ads: {
      ctr: 2.34,
      revenue: 45680,
      impressions: 123450,
      clicks: 2890,
    },
  };
}

function generateMockTimeSeriesData(startDate: Date, endDate: Date, field: string) {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    let value;
    switch (field) {
      case 'time':
        value = Math.random() * 20 + 8; // 8-28秒
        break;
      case 'score':
        value = Math.random() * 20 + 75; // 75-95点
        break;
      case 'visits':
        value = Math.floor(Math.random() * 1000 + 500); // 500-1500
        break;
      default:
        value = Math.random() * 100;
    }
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      [field]: value,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}
```

### 3. リアルタイム監視コンポーネント

```typescript
// components/dashboard/real-time-metrics.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RealTimeData {
  activeUsers: number;
  ongoingGenerations: number;
  systemLoad: number;
  apiHealth: {
    openai: 'healthy' | 'warning' | 'error';
    falai: 'healthy' | 'warning' | 'error';
    wordpress: 'healthy' | 'warning' | 'error';
    notion: 'healthy' | 'warning' | 'error';
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export default function RealTimeMetrics() {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // WebSocketまたはSSE接続でリアルタイムデータを取得
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/dashboard/realtime');
        const result = await response.json();
        setData(result);
        setIsConnected(true);
      } catch (error) {
        console.error('リアルタイムデータ取得エラー:', error);
        setIsConnected(false);
      }
    };

    // 初回データ取得
    fetchRealTimeData();

    // 5秒ごとにデータを更新
    const interval = setInterval(fetchRealTimeData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>リアルタイムデータを取得中...</p>
        </div>
      </div>
    );
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* 接続状態 */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm">
          {isConnected ? 'リアルタイム監視中' : '接続エラー'}
        </span>
        <span className="text-xs text-gray-500">
          最終更新: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* アクティブユーザー */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">アクティブユーザー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-gray-500">現在のアクティブユーザー数</p>
          </CardContent>
        </Card>

        {/* 進行中の生成 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">進行中の生成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ongoingGenerations}</div>
            <p className="text-xs text-gray-500">現在処理中の記事生成</p>
          </CardContent>
        </Card>

        {/* システム負荷 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">システム負荷</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={data.systemLoad} className="flex-1" />
              <span className="text-sm font-medium">{data.systemLoad}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">CPU・メモリ使用率</p>
          </CardContent>
        </Card>

        {/* API正常性 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">API状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.apiHealth).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-xs">{service.toUpperCase()}</span>
                  <Badge variant={getHealthBadge(status)} className="text-xs">
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近のアクティビティ */}
      <Card>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 📅 実装スケジュール

### Week 1: 基盤構築
- ダッシュボードページ基本構造
- データ収集API実装
- モックデータでのプロトタイプ

### Week 2: 可視化機能実装
- チャートコンポーネント実装
- リアルタイム監視機能
- レスポンシブデザイン対応

### Week 3: データ統合・最適化
- 実データとの統合
- パフォーマンス最適化
- エラーハンドリング強化

### Week 4: テスト・デプロイ
- 統合テスト実装
- ユーザビリティテスト
- 本番環境デプロイ

これらの機能により、システムの運用状況を包括的に把握し、継続的な改善が可能になります。
