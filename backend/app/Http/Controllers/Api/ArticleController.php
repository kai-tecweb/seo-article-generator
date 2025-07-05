<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::with(['author', 'category', 'tags']);

        // フィルタリング
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        if ($request->has('ai_generated')) {
            $query->where('ai_generated', $request->boolean('ai_generated'));
        }

        // 検索
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // ソート
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // ページネーション
        $perPage = $request->get('per_page', 15);
        $articles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
            'message' => 'Articles retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'content' => 'required|string',
            'content_html' => 'required|string',
            'excerpt' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
            'read_time' => 'nullable|integer|min:1',
            'ai_generated' => 'boolean',
            'generation_prompt' => 'nullable|string',
            'html_file_path' => 'nullable|string',
            'author_id' => 'required|exists:authors,id',
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $tagIds = $validated['tag_ids'] ?? [];
        unset($validated['tag_ids']);

        $article = Article::create($validated);

        // タグを関連付け
        if (!empty($tagIds)) {
            $article->tags()->attach($tagIds);
        }

        $article->load(['author', 'category', 'tags']);

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article): JsonResponse
    {
        $article->load(['author', 'category', 'tags']);

        // 閲覧数を増加
        $article->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('articles')->ignore($article->id)],
            'content' => 'sometimes|required|string',
            'content_html' => 'sometimes|required|string',
            'excerpt' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,published,archived',
            'published_at' => 'nullable|date',
            'read_time' => 'nullable|integer|min:1',
            'ai_generated' => 'boolean',
            'generation_prompt' => 'nullable|string',
            'html_file_path' => 'nullable|string',
            'author_id' => 'sometimes|required|exists:authors,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $tagIds = $validated['tag_ids'] ?? null;
        unset($validated['tag_ids']);

        $article->update($validated);

        // タグを更新
        if ($tagIds !== null) {
            $article->tags()->sync($tagIds);
        }

        $article->load(['author', 'category', 'tags']);

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }

    /**
     * 記事を公開
     */
    public function publish(Article $article): JsonResponse
    {
        $article->publish();

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article published successfully'
        ]);
    }

    /**
     * 記事を非公開
     */
    public function unpublish(Article $article): JsonResponse
    {
        $article->unpublish();

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article unpublished successfully'
        ]);
    }

    /**
     * 記事をアーカイブ
     */
    public function archive(Article $article): JsonResponse
    {
        $article->archive();

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article archived successfully'
        ]);
    }
}
