<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tags = Tag::withCount(['articles', 'publishedArticles'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tags,
            'message' => 'Tags retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tags,slug',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $tag = Tag::create($validated);

        return response()->json([
            'success' => true,
            'data' => $tag,
            'message' => 'Tag created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag): JsonResponse
    {
        $tag->load(['articles' => function ($query) {
            $query->published()->with(['author', 'category'])->latest()->take(10);
        }]);

        $tag->loadCount(['articles', 'publishedArticles']);

        return response()->json([
            'success' => true,
            'data' => $tag,
            'message' => 'Tag retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('tags')->ignore($tag->id)],
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $tag->update($validated);

        return response()->json([
            'success' => true,
            'data' => $tag,
            'message' => 'Tag updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): JsonResponse
    {
        // 記事がある場合は削除を防ぐ
        if ($tag->articles()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete tag with existing articles'
            ], 400);
        }

        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tag deleted successfully'
        ]);
    }
}
