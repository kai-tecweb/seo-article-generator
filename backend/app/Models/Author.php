<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    protected $fillable = [
        'name',
        'email',
        'bio',
        'avatar',
        'social_links',
        'is_ai',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_ai' => 'boolean',
    ];

    /**
     * この著者の記事を取得
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
}
