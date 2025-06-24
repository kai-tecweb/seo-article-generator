import ArticleGenerationForm from '@/components/forms/article-generation-form';

export default function ArticleGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              AI記事生成システム
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              OpenAI APIを活用したSEO最適化記事の自動生成
            </p>
          </div>
          
          <ArticleGenerationForm />
        </div>
      </div>
    </div>
  );
}
