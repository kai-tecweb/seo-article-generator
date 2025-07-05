<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::create([
            'name' => 'AI Writer',
            'email' => 'ai@example.com',
            'bio' => 'AI powered content writer specialized in SEO articles.',
            'avatar' => null,
            'social_links' => [
                'twitter' => 'https://twitter.com/aiwriter',
                'linkedin' => 'https://linkedin.com/in/aiwriter'
            ],
            'is_ai' => true,
        ]);

        Author::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'bio' => 'Professional content writer with 5+ years of experience.',
            'avatar' => null,
            'social_links' => [
                'twitter' => 'https://twitter.com/johndoe',
                'linkedin' => 'https://linkedin.com/in/johndoe'
            ],
            'is_ai' => false,
        ]);
    }
}
