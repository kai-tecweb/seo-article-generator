<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' => 'Latest technology trends and innovations',
                'meta_title' => 'Technology Articles - Latest Tech News',
                'meta_description' => 'Stay updated with the latest technology trends, innovations, and news.',
                'color' => '#3B82F6',
                'icon' => 'computer',
                'sort_order' => 1,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' => 'Business strategies and entrepreneurship',
                'meta_title' => 'Business Articles - Strategies & Tips',
                'meta_description' => 'Discover business strategies, entrepreneurship tips, and industry insights.',
                'color' => '#10B981',
                'icon' => 'briefcase',
                'sort_order' => 2,
            ],
            [
                'name' => 'Health & Wellness',
                'slug' => 'health-wellness',
                'description' => 'Health tips and wellness advice',
                'meta_title' => 'Health & Wellness - Tips for Better Living',
                'meta_description' => 'Expert health tips and wellness advice for a better lifestyle.',
                'color' => '#F59E0B',
                'icon' => 'heart',
                'sort_order' => 3,
            ],
            [
                'name' => 'Travel',
                'slug' => 'travel',
                'description' => 'Travel guides and destination reviews',
                'meta_title' => 'Travel Guides - Destinations & Tips',
                'meta_description' => 'Comprehensive travel guides and destination reviews for your next adventure.',
                'color' => '#8B5CF6',
                'icon' => 'map-pin',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
