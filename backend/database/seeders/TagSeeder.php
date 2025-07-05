<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'AI', 'slug' => 'ai', 'description' => 'Artificial Intelligence', 'color' => '#EF4444'],
            ['name' => 'Machine Learning', 'slug' => 'machine-learning', 'description' => 'ML algorithms and techniques', 'color' => '#F97316'],
            ['name' => 'Web Development', 'slug' => 'web-development', 'description' => 'Frontend and backend development', 'color' => '#3B82F6'],
            ['name' => 'Mobile Apps', 'slug' => 'mobile-apps', 'description' => 'iOS and Android development', 'color' => '#10B981'],
            ['name' => 'Startup', 'slug' => 'startup', 'description' => 'Entrepreneurship and startups', 'color' => '#8B5CF6'],
            ['name' => 'Marketing', 'slug' => 'marketing', 'description' => 'Digital marketing strategies', 'color' => '#F59E0B'],
            ['name' => 'SEO', 'slug' => 'seo', 'description' => 'Search Engine Optimization', 'color' => '#06B6D4'],
            ['name' => 'Productivity', 'slug' => 'productivity', 'description' => 'Tips for better productivity', 'color' => '#84CC16'],
            ['name' => 'Finance', 'slug' => 'finance', 'description' => 'Personal and business finance', 'color' => '#14B8A6'],
            ['name' => 'Fitness', 'slug' => 'fitness', 'description' => 'Health and fitness tips', 'color' => '#F43F5E'],
            ['name' => 'Nutrition', 'slug' => 'nutrition', 'description' => 'Healthy eating and nutrition', 'color' => '#22C55E'],
            ['name' => 'Adventure', 'slug' => 'adventure', 'description' => 'Adventure travel and activities', 'color' => '#A855F7'],
            ['name' => 'Budget Travel', 'slug' => 'budget-travel', 'description' => 'Affordable travel tips', 'color' => '#EAB308'],
            ['name' => 'Photography', 'slug' => 'photography', 'description' => 'Travel and lifestyle photography', 'color' => '#EC4899'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
