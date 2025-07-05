<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $authors = Author::withCount(['articles', 'publishedArticles'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $authors,
            'message' => 'Authors retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:authors,email',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'social_links' => 'nullable|array',
            'is_ai' => 'boolean',
        ]);

        $author = Author::create($validated);

        return response()->json([
            'success' => true,
            'data' => $author,
            'message' => 'Author created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Author $author): JsonResponse
    {
        $author->load(['articles' => function ($query) {
            $query->latest()->take(10);
        }]);

        $author->loadCount(['articles', 'publishedArticles']);

        return response()->json([
            'success' => true,
            'data' => $author,
            'message' => 'Author retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Author $author): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('authors')->ignore($author->id)],
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'social_links' => 'nullable|array',
            'is_ai' => 'boolean',
        ]);

        $author->update($validated);

        return response()->json([
            'success' => true,
            'data' => $author,
            'message' => 'Author updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author): JsonResponse
    {
        // 記事がある場合は削除を防ぐ
        if ($author->articles()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete author with existing articles'
            ], 400);
        }

        $author->delete();

        return response()->json([
            'success' => true,
            'message' => 'Author deleted successfully'
        ]);
    }
}
