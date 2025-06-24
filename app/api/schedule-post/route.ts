import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストスキーマの定義
const SchedulePostSchema = z.object({
  title: z.string().min(1, 'タイトルが必要です'),
  content: z.string().min(1, 'コンテンツが必要です'),
  scheduledDateTime: z.string().refine((date) => {
    const scheduledDate = new Date(date);
    const now = new Date();
    return scheduledDate > now;
  }, 'スケジュール日時は未来の時間である必要があります'),
  platforms: z.array(z.enum(['wordpress', 'notion', 'x', 'google-business'])).min(1, '少なくとも1つのプラットフォームを選択してください'),
  metadata: z.object({
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featuredImageUrl: z.string().url().optional(),
    customFields: z.record(z.string(), z.any()).optional(),
  }).optional(),
  settings: z.object({
    wordpress: z.object({
      status: z.enum(['draft', 'pending', 'private', 'publish']).default('publish'),
      postType: z.enum(['post', 'page']).default('post'),
      categoryId: z.number().optional(),
      authorId: z.number().optional(),
      excerpt: z.string().optional(),
    }).optional(),
    notion: z.object({
      databaseId: z.string().optional(),
      properties: z.record(z.string(), z.any()).optional(),
    }).optional(),
    x: z.object({
      tweetText: z.string().max(280, 'ツイートは280文字以内である必要があります').optional(),
      includeUrl: z.boolean().default(true),
      hashtags: z.array(z.string()).optional(),
    }).optional(),
    googleBusiness: z.object({
      locationId: z.string().optional(),
      postType: z.enum(['EVENT', 'OFFER', 'PRODUCT', 'WHAT_IS_NEW']).default('WHAT_IS_NEW'),
      callToAction: z.object({
        actionType: z.enum(['BOOK', 'ORDER', 'SHOP', 'LEARN_MORE', 'SIGN_UP', 'CALL']).optional(),
        url: z.string().url().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  recurringSchedule: z.object({
    enabled: z.boolean().default(false),
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    interval: z.number().min(1).optional(),
    endDate: z.string().optional(),
    daysOfWeek: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).optional(),
  }).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  timezone: z.string().default('Asia/Tokyo'),
});

// レスポンス型定義
interface SchedulePostResult {
  success: boolean;
  data?: {
    scheduleId: string;
    scheduledDateTime: string;
    platforms: string[];
    status: 'scheduled' | 'pending' | 'error';
    confirmationDetails: {
      title: string;
      content: string;
      metadata: any;
      settings: any;
      recurringSchedule?: any;
    };
    estimatedPublishTimes: Array<{
      platform: string;
      estimatedTime: string;
      status: 'scheduled' | 'pending' | 'error';
      details?: string;
    }>;
    nextSteps: string[];
    reminderSettings: {
      beforePublish: string[];
      afterPublish: string[];
    };
  };
  error?: string;
}

// スケジュールIDを生成する関数
function generateScheduleId(): string {
  return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// プラットフォーム固有の投稿時間を計算する関数
function calculatePlatformPublishTimes(scheduledDateTime: string, platforms: string[]) {
  const baseTime = new Date(scheduledDateTime);
  const publishTimes = [];
  
  for (const platform of platforms) {
    let estimatedTime = new Date(baseTime);
    let status: 'scheduled' | 'pending' | 'error' = 'scheduled';
    let details = '';
    
    switch (platform) {
      case 'wordpress':
        // WordPressは即座に投稿可能
        details = 'WordPressの予約投稿機能を使用';
        break;
        
      case 'notion':
        // Notionは数分遅れる可能性
        estimatedTime.setMinutes(estimatedTime.getMinutes() + 2);
        details = 'Notion APIの処理時間を考慮して約2分後';
        break;
        
      case 'x':
        // X（Twitter）は手動投稿のため確認が必要
        status = 'pending';
        details = '投稿文生成後、手動での投稿確認が必要';
        break;
        
      case 'google-business':
        // Google Businessは即座に投稿可能
        details = 'Google Business Profile APIを使用';
        break;
        
      default:
        status = 'error';
        details = '未対応のプラットフォーム';
    }
    
    publishTimes.push({
      platform,
      estimatedTime: estimatedTime.toISOString(),
      status,
      details
    });
  }
  
  return publishTimes;
}

// 繰り返しスケジュールの次回日時を計算する関数
function calculateNextRecurringDate(baseDate: string, recurringSchedule: any): string[] {
  if (!recurringSchedule?.enabled) return [];
  
  const dates: string[] = [];
  const base = new Date(baseDate);
  const endDate = recurringSchedule.endDate ? new Date(recurringSchedule.endDate) : null;
  const interval = recurringSchedule.interval || 1;
  
  for (let i = 1; i <= 10; i++) { // 最大10回分の予定を生成
    let nextDate = new Date(base);
    
    switch (recurringSchedule.frequency) {
      case 'daily':
        nextDate.setDate(base.getDate() + (i * interval));
        break;
      case 'weekly':
        nextDate.setDate(base.getDate() + (i * interval * 7));
        break;
      case 'monthly':
        nextDate.setMonth(base.getMonth() + (i * interval));
        break;
    }
    
    if (endDate && nextDate > endDate) break;
    
    dates.push(nextDate.toISOString());
  }
  
  return dates;
}

// スケジュールをデータベースまたはファイルに保存する関数（モック）
async function saveScheduleToStorage(scheduleData: any) {
  // 実際の実装では、データベース（PostgreSQL、MongoDB等）に保存
  // または JSONファイルに保存
  
  // モック実装として、メモリ内に保存（実際は永続化が必要）
  const scheduleRecord = {
    id: scheduleData.scheduleId,
    title: scheduleData.title,
    content: scheduleData.content,
    scheduledDateTime: scheduleData.scheduledDateTime,
    platforms: scheduleData.platforms,
    metadata: scheduleData.metadata,
    settings: scheduleData.settings,
    recurringSchedule: scheduleData.recurringSchedule,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // 実際の保存処理のモック
  console.log('スケジュール保存:', scheduleRecord);
  
  return scheduleRecord;
}

// リマインダー設定を生成する関数
function generateReminderSettings(scheduledDateTime: string, platforms: string[]) {
  const scheduledDate = new Date(scheduledDateTime);
  const beforePublish = [];
  const afterPublish = [];
  
  // 投稿前のリマインダー
  const oneHourBefore = new Date(scheduledDate.getTime() - 60 * 60 * 1000);
  const oneDayBefore = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000);
  
  beforePublish.push(`投稿1時間前: ${oneHourBefore.toLocaleString('ja-JP')}`);
  beforePublish.push(`投稿1日前: ${oneDayBefore.toLocaleString('ja-JP')}`);
  
  // 投稿後のリマインダー
  const oneHourAfter = new Date(scheduledDate.getTime() + 60 * 60 * 1000);
  const oneDayAfter = new Date(scheduledDate.getTime() + 24 * 60 * 60 * 1000);
  
  afterPublish.push(`投稿1時間後に確認: ${oneHourAfter.toLocaleString('ja-JP')}`);
  afterPublish.push(`投稿1日後に分析: ${oneDayAfter.toLocaleString('ja-JP')}`);
  
  // プラットフォーム固有のリマインダー
  if (platforms.includes('x')) {
    afterPublish.push('X投稿文の手動投稿を確認してください');
  }
  
  return { beforePublish, afterPublish };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SchedulePostSchema.parse(body);
    
    const {
      title,
      content,
      scheduledDateTime,
      platforms,
      metadata,
      settings,
      recurringSchedule,
      priority,
      timezone
    } = validatedData;
    
    // スケジュールIDの生成
    const scheduleId = generateScheduleId();
    
    // プラットフォーム別の投稿時間を計算
    const estimatedPublishTimes = calculatePlatformPublishTimes(scheduledDateTime, platforms);
    
    // 繰り返しスケジュールの計算
    const recurringDates = calculateNextRecurringDate(scheduledDateTime, recurringSchedule);
    
    // リマインダー設定の生成
    const reminderSettings = generateReminderSettings(scheduledDateTime, platforms);
    
    // 次のステップの生成
    const nextSteps = [
      '投稿内容の最終確認を行ってください',
      'スケジュール日時の再確認をお願いします',
    ];
    
    if (platforms.includes('wordpress')) {
      nextSteps.push('WordPressの投稿権限を確認してください');
    }
    
    if (platforms.includes('x')) {
      nextSteps.push('X投稿用のテキストを事前に確認してください');
    }
    
    if (platforms.includes('notion')) {
      nextSteps.push('Notionデータベースの接続を確認してください');
    }
    
    if (platforms.includes('google-business')) {
      nextSteps.push('Google Business Profileの権限を確認してください');
    }
    
    // スケジュールデータの保存
    const savedSchedule = await saveScheduleToStorage({
      scheduleId,
      title,
      content,
      scheduledDateTime,
      platforms,
      metadata,
      settings,
      recurringSchedule,
      priority,
      timezone,
    });
    
    const result: SchedulePostResult = {
      success: true,
      data: {
        scheduleId,
        scheduledDateTime,
        platforms,
        status: 'scheduled',
        confirmationDetails: {
          title,
          content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
          metadata,
          settings,
          recurringSchedule: recurringSchedule?.enabled ? recurringSchedule : undefined,
        },
        estimatedPublishTimes,
        nextSteps,
        reminderSettings,
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Schedule post error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: `入力データが無効です: ${error.errors.map(e => e.message).join(', ')}`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: '投稿スケジュール設定中にエラーが発生しました'
    }, { status: 500 });
  }
}

// スケジュール済み投稿の一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // scheduled, completed, failed
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // 実際の実装では、データベースからスケジュールを取得
    // ここではモックデータを返す
    const mockSchedules = [
      {
        id: 'schedule_1750681350001_abcd123',
        title: '295から始まる迷惑電話対策の完全ガイド',
        scheduledDateTime: '2025-06-24T09:00:00.000Z',
        platforms: ['wordpress', 'notion'],
        status: 'scheduled',
        createdAt: '2025-06-23T12:00:00.000Z',
      },
      {
        id: 'schedule_1750681350002_efgh456',
        title: 'SEO最適化の基本テクニック',
        scheduledDateTime: '2025-06-25T14:30:00.000Z',
        platforms: ['wordpress', 'x', 'google-business'],
        status: 'scheduled',
        createdAt: '2025-06-23T13:00:00.000Z',
      },
    ];
    
    // フィルタリング
    let filteredSchedules = mockSchedules;
    
    if (status) {
      filteredSchedules = filteredSchedules.filter(s => s.status === status);
    }
    
    if (platform) {
      filteredSchedules = filteredSchedules.filter(s => s.platforms.includes(platform));
    }
    
    // ページング
    const paginatedSchedules = filteredSchedules.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        schedules: paginatedSchedules,
        pagination: {
          total: filteredSchedules.length,
          limit,
          offset,
          hasMore: offset + limit < filteredSchedules.length,
        }
      }
    });
    
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json({
      success: false,
      error: 'スケジュール取得中にエラーが発生しました'
    }, { status: 500 });
  }
}
