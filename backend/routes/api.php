<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\API\AIArticleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes
Route::prefix('v1')->group(function () {
    // Articles
    Route::apiResource('articles', ArticleController::class);
    Route::post('articles/{article}/publish', [ArticleController::class, 'publish']);
    Route::post('articles/{article}/unpublish', [ArticleController::class, 'unpublish']);
    Route::post('articles/{article}/archive', [ArticleController::class, 'archive']);

    // Authors
    Route::apiResource('authors', AuthorController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Tags
    Route::apiResource('tags', TagController::class);

    // AI Article Generation
    Route::prefix('ai')->group(function () {
        Route::post('generate-article', [AIArticleController::class, 'generateArticle']);
        Route::post('improve-article', [AIArticleController::class, 'improvementSuggestions']);
        Route::get('parameters', [AIArticleController::class, 'getAIParameters']);
        Route::get('history', [AIArticleController::class, 'getGenerationHistory']);
    });
});
