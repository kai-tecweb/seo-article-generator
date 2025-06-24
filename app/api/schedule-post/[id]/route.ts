import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 更新用スキーマの定義
const UpdateScheduleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  scheduledDateTime: z.string().refine((date) => {
    const scheduledDate = new Date(date);
    const now = new Date();
    return scheduledDate > now;
  }, 'スケジュール日時は未来の時間である必要があります').optional(),
  platforms: z.array(z.enum(['wordpress', 'notion', 'x', 'google-business'])).min(1).optional(),
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
      status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
      postType: z.enum(['post', 'page']).optional(),
      categoryId: z.number().optional(),
      authorId: z.number().optional(),
      excerpt: z.string().optional(),
    }).optional(),
    notion: z.object({
      databaseId: z.string().optional(),
      properties: z.record(z.string(), z.any()).optional(),
    }).optional(),
    x: z.object({
      tweetText: z.string().max(280).optional(),
      includeUrl: z.boolean().optional(),
      hashtags: z.array(z.string()).optional(),
    }).optional(),
    googleBusiness: z.object({
      locationId: z.string().optional(),
      postType: z.enum(['EVENT', 'OFFER', 'PRODUCT', 'WHAT_IS_NEW']).optional(),
      callToAction: z.object({
        actionType: z.enum(['BOOK', 'ORDER', 'SHOP', 'LEARN_MORE', 'SIGN_UP', 'CALL']).optional(),
        url: z.string().url().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  status: z.enum(['scheduled', 'paused', 'cancelled']).optional(),
});

// レスポンス型定義
interface ScheduleOperationResult {
  success: boolean;
  data?: {
    scheduleId: string;
    operation: 'updated' | 'deleted' | 'retrieved';
    schedule?: any;
    message: string;
    affectedPlatforms?: string[];
    nextAction?: string;
  };
  error?: string;
}

// モックデータストレージ（実際はデータベース）
const mockScheduleStorage = new Map();

// 初期モックデータの設定
function initializeMockData() {
  const mockSchedules = [
    {
      id: 'schedule_1750681350001_abcd123',
      title: '295から始まる迷惑電話対策の完全ガイド',
      content: '295から始まる電話番号からの迷惑電話に悩んでいませんか？この記事では効果的な対策方法について解説します。',
      scheduledDateTime: '2025-06-24T09:00:00.000Z',
      platforms: ['wordpress', 'notion'],
      status: 'scheduled',
      priority: 'high',
      metadata: {
        description: '295から始まる迷惑電話の対策方法を詳しく解説',
        keywords: ['295', '迷惑電話', '対策'],
        category: '生活の知恵'
      },
      settings: {
        wordpress: { status: 'publish', postType: 'post' },
        notion: { databaseId: 'test-db-id' }
      },
      createdAt: '2025-06-23T12:00:00.000Z',
      updatedAt: '2025-06-23T12:00:00.000Z',
    },
    {
      id: 'schedule_1750681350002_efgh456',
      title: 'SEO最適化の基本テクニック',
      content: 'SEO最適化で検索順位を上げる基本的なテクニックを紹介します。',
      scheduledDateTime: '2025-06-25T14:30:00.000Z',
      platforms: ['wordpress', 'x', 'google-business'],
      status: 'scheduled',
      priority: 'normal',
      metadata: {
        description: 'SEO最適化の基本テクニック解説',
        keywords: ['SEO', '最適化', '検索順位'],
        category: 'マーケティング'
      },
      settings: {
        wordpress: { status: 'publish', postType: 'post' },
        x: { tweetText: 'SEO最適化テクニック公開！', hashtags: ['SEO', 'マーケティング'] }
      },
      createdAt: '2025-06-23T13:00:00.000Z',
      updatedAt: '2025-06-23T13:00:00.000Z',
    }
  ];
  
  // モックストレージに初期データを保存
  mockSchedules.forEach(schedule => {
    mockScheduleStorage.set(schedule.id, schedule);
  });
}

// 初期化の実行
initializeMockData();

// スケジュールの取得
function getScheduleById(scheduleId: string) {
  return mockScheduleStorage.get(scheduleId);
}

// スケジュールの更新
function updateScheduleById(scheduleId: string, updateData: any) {
  const existingSchedule = mockScheduleStorage.get(scheduleId);
  if (!existingSchedule) return null;
  
  const updatedSchedule = {
    ...existingSchedule,
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  
  mockScheduleStorage.set(scheduleId, updatedSchedule);
  return updatedSchedule;
}

// スケジュールの削除
function deleteScheduleById(scheduleId: string) {
  const existingSchedule = mockScheduleStorage.get(scheduleId);
  if (!existingSchedule) return null;
  
  mockScheduleStorage.delete(scheduleId);
  return existingSchedule;
}

// 特定のスケジュールの取得 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    
    if (!scheduleId) {
      return NextResponse.json({
        success: false,
        error: 'スケジュールIDが指定されていません'
      }, { status: 400 });
    }
    
    const schedule = getScheduleById(scheduleId);
    
    if (!schedule) {
      return NextResponse.json({
        success: false,
        error: '指定されたスケジュールが見つかりません'
      }, { status: 404 });
    }
    
    const result: ScheduleOperationResult = {
      success: true,
      data: {
        scheduleId,
        operation: 'retrieved',
        schedule,
        message: 'スケジュールを正常に取得しました'
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'スケジュール取得中にエラーが発生しました'
    }, { status: 500 });
  }
}

// スケジュールの更新 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    const body = await request.json();
    
    if (!scheduleId) {
      return NextResponse.json({
        success: false,
        error: 'スケジュールIDが指定されていません'
      }, { status: 400 });
    }
    
    const validatedData = UpdateScheduleSchema.parse(body);
    
    // 既存スケジュールの確認
    const existingSchedule = getScheduleById(scheduleId);
    if (!existingSchedule) {
      return NextResponse.json({
        success: false,
        error: '指定されたスケジュールが見つかりません'
      }, { status: 404 });
    }
    
    // スケジュールの更新
    const updatedSchedule = updateScheduleById(scheduleId, validatedData);
    
    if (!updatedSchedule) {
      return NextResponse.json({
        success: false,
        error: 'スケジュールの更新に失敗しました'
      }, { status: 500 });
    }
    
    // 影響を受けるプラットフォームの計算
    const affectedPlatforms = updatedSchedule.platforms || [];
    
    // 次のアクションの決定
    let nextAction = '更新されたスケジュールを確認してください';
    if (validatedData.scheduledDateTime) {
      nextAction = '新しいスケジュール時間を確認し、必要に応じて関係者に通知してください';
    }
    
    const result: ScheduleOperationResult = {
      success: true,
      data: {
        scheduleId,
        operation: 'updated',
        schedule: updatedSchedule,
        message: 'スケジュールを正常に更新しました',
        affectedPlatforms,
        nextAction
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Update schedule error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: `入力データが無効です: ${error.errors.map(e => e.message).join(', ')}`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'スケジュール更新中にエラーが発生しました'
    }, { status: 500 });
  }
}

// スケジュールの削除 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    
    if (!scheduleId) {
      return NextResponse.json({
        success: false,
        error: 'スケジュールIDが指定されていません'
      }, { status: 400 });
    }
    
    // 既存スケジュールの確認
    const existingSchedule = getScheduleById(scheduleId);
    if (!existingSchedule) {
      return NextResponse.json({
        success: false,
        error: '指定されたスケジュールが見つかりません'
      }, { status: 404 });
    }
    
    // スケジュールが実行前かどうかの確認
    const scheduledTime = new Date(existingSchedule.scheduledDateTime);
    const now = new Date();
    
    if (scheduledTime <= now) {
      return NextResponse.json({
        success: false,
        error: 'すでに実行されたスケジュールは削除できません'
      }, { status: 400 });
    }
    
    // スケジュールの削除
    const deletedSchedule = deleteScheduleById(scheduleId);
    
    if (!deletedSchedule) {
      return NextResponse.json({
        success: false,
        error: 'スケジュールの削除に失敗しました'
      }, { status: 500 });
    }
    
    const result: ScheduleOperationResult = {
      success: true,
      data: {
        scheduleId,
        operation: 'deleted',
        schedule: deletedSchedule,
        message: 'スケジュールを正常に削除しました',
        affectedPlatforms: deletedSchedule.platforms,
        nextAction: '削除されたスケジュールの代替投稿を検討してください'
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'スケジュール削除中にエラーが発生しました'
    }, { status: 500 });
  }
}

// スケジュール一覧の取得 (GET - ルートパス)
export async function GET_LIST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // 全スケジュールの取得
    const allSchedules = Array.from(mockScheduleStorage.values());
    
    // フィルタリング
    let filteredSchedules = allSchedules;
    
    if (status) {
      filteredSchedules = filteredSchedules.filter(s => s.status === status);
    }
    
    if (platform) {
      filteredSchedules = filteredSchedules.filter(s => s.platforms.includes(platform));
    }
    
    // ソート（スケジュール日時順）
    filteredSchedules.sort((a, b) => 
      new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime()
    );
    
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
        },
        summary: {
          totalScheduled: allSchedules.filter(s => s.status === 'scheduled').length,
          totalCompleted: allSchedules.filter(s => s.status === 'completed').length,
          totalCancelled: allSchedules.filter(s => s.status === 'cancelled').length,
        }
      }
    });
    
  } catch (error) {
    console.error('Get schedules list error:', error);
    return NextResponse.json({
      success: false,
      error: 'スケジュール一覧取得中にエラーが発生しました'
    }, { status: 500 });
  }
}
