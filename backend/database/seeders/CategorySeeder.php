<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vegetables', 'slug' => 'vegetables'],
            ['name' => 'Fruits',     'slug' => 'fruits'],
            ['name' => 'Bread',      'slug' => 'bread'],
            ['name' => 'Meat',       'slug' => 'meat'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
