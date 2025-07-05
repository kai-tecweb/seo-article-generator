<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
    ];

    /**
     * このタグの記事を取得
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class);
    }

    /**
     * 公開済みの記事を取得
     */
    public function publishedArticles(): BelongsToMany
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
