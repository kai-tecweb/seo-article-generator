<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\OpenAIService;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class AIArticleController extends Controller
{
  protected OpenAIService $openaiService;

  public function __construct(OpenAIService $openaiService)
  {
    $this->openaiService = $openaiService;
  }

  /**
   * AI記事生成
   */
  public function generateArticle(Request $request): JsonResponse
  {
    $validator = Validator::make($request->all(), [
      'keyword' => 'required|string|max:100',
      'tone' => 'required|string|in:professional,friendly,authoritative,casual',
      'length' => 'required|string|in:short,medium,long',
      'target_audience' => 'required|string|max:100',
      'author_id' => 'required|exists:authors,id',
      'category_id' => 'required|exists:categories,id',
      'tag_ids' => 'array',
      'tag_ids.*' => 'exists:tags,id',
      'auto_save' => 'boolean',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'error' => 'バリデーションエラー',
        'messages' => $validator->errors()
      ], 422);
    }

    try {
      $params = $request->only([
        'keyword',
        'tone',
        'length',
        'target_audience'
      ]);

      // AI記事生成
      $aiResult = $this->openaiService->generateSEOArticle($params);

      // 自動保存が有効な場合
      if ($request->boolean('auto_save')) {
        $article = Article::create([
          'title' => $aiResult['title'],
          'content' => $aiResult['content'],
          'meta_description' => $aiResult['meta_description'],
          'meta_keywords' => $aiResult['keyword'],
          'author_id' => $request->author_id,
          'category_id' => $request->category_id,
          'status' => 'draft',
          'ai_generated' => true,
          'ai_params' => json_encode($params),
        ]);

        // タグを関連付け
        if ($request->has('tag_ids')) {
          $article->tags()->sync($request->tag_ids);
        }

        return response()->json([
          'message' => 'AI記事が生成され、下書きとして保存されました',
          'article' => $article->load(['author', 'category', 'tags']),
          'ai_data' => $aiResult
        ], 201);
      }

      // プレビューのみの場合
      return response()->json([
        'message' => 'AI記事が生成されました',
        'ai_data' => $aiResult,
        'preview' => true
      ], 200);
    } catch (Exception $e) {
      Log::error('AI Article Generation Error', [
        'request' => $request->all(),
        'error' => $e->getMessage()
      ]);

      return response()->json([
        'error' => 'AI記事生成に失敗しました',
        'message' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * 記事の改善提案
   */
  public function improvementSuggestions(Request $request): JsonResponse
  {
    $validator = Validator::make($request->all(), [
      'article_id' => 'required|exists:articles,id',
      'keyword' => 'required|string|max:100',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'error' => 'バリデーションエラー',
        'messages' => $validator->errors()
      ], 422);
    }

    try {
      $article = Article::findOrFail($request->article_id);

      $suggestions = $this->openaiService->improveSEOArticle(
        $article->content,
        $request->keyword
      );

      return response()->json([
        'message' => '改善提案が生成されました',
        'suggestions' => $suggestions,
        'article' => $article
      ], 200);
    } catch (Exception $e) {
      Log::error('AI Improvement Suggestions Error', [
        'request' => $request->all(),
        'error' => $e->getMessage()
      ]);

      return response()->json([
        'error' => '改善提案の生成に失敗しました',
        'message' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * AIパラメータの取得
   */
  public function getAIParameters(): JsonResponse
  {
    try {
      $parameters = [
        'tones' => [
          'professional' => 'プロフェッショナル',
          'friendly' => '親しみやすい',
          'authoritative' => '権威的',
          'casual' => 'カジュアル',
        ],
        'lengths' => [
          'short' => '短い (800文字程度)',
          'medium' => '中程度 (1500文字程度)',
          'long' => '長い (2500文字程度)',
        ],
        'authors' => Author::select('id', 'name')->get(),
        'categories' => Category::select('id', 'name')->get(),
        'tags' => Tag::select('id', 'name')->get(),
      ];

      return response()->json([
        'parameters' => $parameters
      ], 200);
    } catch (Exception $e) {
      Log::error('AI Parameters Error', [
        'error' => $e->getMessage()
      ]);

      return response()->json([
        'error' => 'パラメータの取得に失敗しました',
        'message' => $e->getMessage()
      ], 500);
    }
  }

  /**
   * 生成履歴の取得
   */
  public function getGenerationHistory(Request $request): JsonResponse
  {
    try {
      $query = Article::where('ai_generated', true)
        ->with(['author', 'category', 'tags'])
        ->orderBy('created_at', 'desc');

      if ($request->has('limit')) {
        $query->limit($request->integer('limit', 10));
      }

      $articles = $query->get();

      return response()->json([
        'articles' => $articles->map(function ($article) {
          return [
            'id' => $article->id,
            'title' => $article->title,
            'status' => $article->status,
            'author' => $article->author?->name,
            'category' => $article->category?->name,
            'tags' => $article->tags->pluck('name'),
            'ai_params' => json_decode($article->ai_params, true),
            'created_at' => $article->created_at,
            'updated_at' => $article->updated_at,
          ];
        })
      ], 200);
    } catch (Exception $e) {
      Log::error('AI Generation History Error', [
        'error' => $e->getMessage()
      ]);

      return response()->json([
        'error' => '生成履歴の取得に失敗しました',
        'message' => $e->getMessage()
      ], 500);
    }
  }
}
