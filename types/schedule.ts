// 投稿スケジューリング関連の型定義

export interface SchedulePostRequest {
  title: string;
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: ('wordpress' | 'x' | 'gbp')[];
  status: 'pending' | 'scheduled' | 'published' | 'failed';
  metaDescription?: string;
  tags?: string[];
  categories?: string[];
  imageUrl?: string;
}

export interface ScheduledPostItem {
  id: string;
  title: string;
  content: string;
  scheduledDateTime: string;
  platforms: string[];
  status: 'pending' | 'scheduled' | 'published' | 'failed';
  createdAt: string;
  updatedAt: string;
  publishUrls?: {
    wordpress?: string;
    x?: string;
    gbp?: string;
  };
}

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: string;
}
