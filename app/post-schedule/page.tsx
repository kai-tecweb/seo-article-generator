import PostScheduleForm from '@/components/forms/post-schedule-form';

export default function PostSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              投稿スケジュール管理
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              記事の予約投稿を設定・管理します
            </p>
          </div>
          
          <PostScheduleForm />
        </div>
      </div>
    </div>
  );
}
