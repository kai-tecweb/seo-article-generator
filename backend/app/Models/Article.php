<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'content_html',
        'excerpt',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'keywords',
        'featured_image',
        'status',
        'published_at',
        'read_time',
        'view_count',
        'ai_generated',
        'ai_params',
        'generation_prompt',
        'html_file_path',
        'author_id',
        'category_id',
    ];

    protected $casts = [
        'keywords' => 'array',
        'ai_params' => 'array',
        'published_at' => 'datetime',
        'ai_generated' => 'boolean',
    ];

    /**
     * 記事の著者を取得
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    /**
     * 記事のカテゴリを取得
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * 記事のタグを取得
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * 公開済みの記事のスコープ
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * 下書きの記事のスコープ
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    /**
     * アーカイブされた記事のスコープ
     */
    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('status', 'archived');
    }

    /**
     * AI生成記事のスコープ
     */
    public function scopeAiGenerated(Builder $query): Builder
    {
        return $query->where('ai_generated', true);
    }

    /**
     * 公開済みかどうかを判定
     */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /**
     * 下書きかどうかを判定
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * アーカイブされているかどうかを判定
     */
    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }

    /**
     * 読了時間を計算（おおよその値）
     */
    public function calculateReadTime(): int
    {
        $wordCount = str_word_count(strip_tags($this->content_html));
        $readingSpeed = 200; // 1分あたりの読み取り語数
        return (int) ceil($wordCount / $readingSpeed);
    }

    /**
     * 記事を公開
     */
    public function publish(): bool
    {
        $this->status = 'published';
        $this->published_at = now();
        return $this->save();
    }

    /**
     * 記事を下書きに戻す
     */
    public function unpublish(): bool
    {
        $this->status = 'draft';
        $this->published_at = null;
        return $this->save();
    }

    /**
     * 記事をアーカイブ
     */
    public function archive(): bool
    {
        $this->status = 'archived';
        return $this->save();
    }
}
