<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->longText('content_html');
            $table->text('excerpt')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('keywords')->nullable();
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('read_time')->nullable();
            $table->integer('view_count')->default(0);
            $table->boolean('ai_generated')->default(false);
            $table->text('generation_prompt')->nullable();
            $table->string('html_file_path')->nullable();
            $table->foreignId('author_id')->constrained('authors');
            $table->foreignId('category_id')->constrained('categories');
            $table->timestamps();

            // インデックス
            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
