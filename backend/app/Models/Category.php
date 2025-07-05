<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'meta_title',
        'meta_description',
        'color',
        'icon',
        'sort_order',
        'html_file_path',
    ];

    /**
     * このカテゴリの記事を取得
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * 公開済みの記事を取得
     */
    public function publishedArticles(): HasMany
    {
        return $this->articles()->where('status', 'published');
    }

    /**
     * 記事数を取得
     */
    public function getArticlesCountAttribute(): int
    {
        return $this->articles()->count();
    }

    /**
     * 公開済み記事数を取得
     */
    public function getPublishedArticlesCountAttribute(): int
    {
        return $this->publishedArticles()->count();
    }
}
