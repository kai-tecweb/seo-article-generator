'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, RefreshCw, ArrowUp, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Yahoo!急上昇ワード型定義
 */
interface YahooTrendingItem {
  rank: number;
  keyword: string;
  searchVolume: number;
  risePercentage: number;
  category: 'エンタメ' | 'スポーツ' | 'ニュース' | 'IT・科学' | 'ライフスタイル' | 'その他';
  relatedKeywords: string[];
  trendStartTime: string;
  estimatedDuration: string;
  description: string;
}

interface YahooTrendingResponse {
  success: boolean;
  data?: YahooTrendingItem[];
  timestamp: string;
  totalCount: number;
  message?: string;
  error?: string;
}

interface YahooTrendingSelectorProps {
  /** 現在選択されているキーワード */
  currentKeyword?: string;
  /** キーワード変更時のコールバック */
  onKeywordChange?: (keyword: string, trendData?: YahooTrendingItem) => void;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 表示する件数 */
  displayLimit?: number;
}

/**
 * Yahoo!急上昇ワードセレクターコンポーネント
 * 
 * 記事生成フォームでトレンドキーワードを選択・適用する機能を提供
 */
export default function YahooTrendingSelector({
  currentKeyword,
  onKeywordChange,
  disabled = false,
  displayLimit = 5
}: YahooTrendingSelectorProps) {
  const [trendingData, setTrendingData] = useState<YahooTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // カテゴリオプション
  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'エンタメ', label: 'エンタメ' },
    { value: 'スポーツ', label: 'スポーツ' },
    { value: 'ニュース', label: 'ニュース' },
    { value: 'IT・科学', label: 'IT・科学' },
    { value: 'ライフスタイル', label: 'ライフスタイル' },
    { value: 'その他', label: 'その他' }
  ];

  /**
   * Yahoo!急上昇ワードを取得
   */
  const fetchTrendingData = async (isRefresh = false) => {
    if (disabled) return;
    
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: '20'
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/yahoo-trending/realtime?${params}`);
      const data: YahooTrendingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'データの取得に失敗しました');
      }

      if (data.success && data.data) {
        setTrendingData(data.data);
        setLastUpdated(new Date().toLocaleTimeString('ja-JP'));
        console.log('✅ Yahoo!急上昇ワード取得成功:', data.data.length, '件');
      } else {
        throw new Error(data.error || 'データの取得に失敗しました');
      }

    } catch (err) {
      console.error('❌ Yahoo!急上昇ワード取得エラー:', err);
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * キーワード選択処理
   */
  const handleKeywordSelect = (keyword: string, trendData: YahooTrendingItem) => {
    if (disabled) return;
    
    // 親コンポーネントに通知
    onKeywordChange?.(keyword, trendData);
  };

  /**
   * 初回データ取得
   */
  useEffect(() => {
    fetchTrendingData();
  }, [selectedCategory, disabled]);

  /**
   * 表示用データ
   */
  const displayData = isExpanded ? trendingData : trendingData.slice(0, displayLimit);

  /**
   * 急上昇率の色分け
   */
  const getRisePercentageColor = (percentage: number) => {
    if (percentage >= 400) return 'text-red-600 bg-red-50';
    if (percentage >= 200) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  /**
   * カテゴリーの色分け
   */
  const getCategoryColor = (category: string) => {
    const colors = {
      'エンタメ': 'bg-purple-100 text-purple-700',
      'スポーツ': 'bg-blue-100 text-blue-700',
      'ニュース': 'bg-red-100 text-red-700',
      'IT・科学': 'bg-green-100 text-green-700',
      'ライフスタイル': 'bg-yellow-100 text-yellow-700',
      'その他': 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Yahoo!急上昇ワード
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastUpdated}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTrendingData(true)}
              disabled={isRefreshing || isLoading || disabled}
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">カテゴリ:</span>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            disabled={disabled || isLoading}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* エラー表示 */}
        {error && (
          <Alert className="mb-4" variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-gray-600">急上昇ワードを取得中...</span>
          </div>
        )}

        {/* トレンドリスト */}
        {!isLoading && displayData.length > 0 && (
          <div className="space-y-2">
            {displayData.map((item) => {
              const isSelected = currentKeyword === item.keyword;
              
              return (
                <div
                  key={item.rank}
                  className={`p-3 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-sm ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${disabled ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && handleKeywordSelect(item.keyword, item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-400">#{item.rank}</span>
                        <h4 className="font-medium text-gray-900 truncate">{item.keyword}</h4>
                        <Badge className={`text-xs ${getRisePercentageColor(item.risePercentage)}`}>
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +{item.risePercentage}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {item.searchVolume.toLocaleString()}検索
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="ml-2 shrink-0"
                      disabled={disabled}
                    >
                      {isSelected ? '選択中' : '選択'}
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {/* 展開/縮小ボタン */}
            {trendingData.length > displayLimit && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  disabled={disabled}
                >
                  {isExpanded ? '少なく表示' : `他 ${trendingData.length - displayLimit}件を表示`}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* データなし表示 */}
        {!isLoading && displayData.length === 0 && !error && (
          <div className="text-center py-6 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">現在表示できる急上昇ワードがありません</p>
          </div>
        )}

        {/* 使用方法ヒント */}
        {!isLoading && displayData.length > 0 && !error && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            💡 急上昇中のキーワードを選択して記事のトピックに活用し、SEO効果を高めましょう
          </div>
        )}
      </CardContent>
    </Card>
  );
}
