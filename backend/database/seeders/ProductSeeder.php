<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $fruits     = Category::where('slug', 'fruits')->first();
        $vegetables = Category::where('slug', 'vegetables')->first();
        $bread      = Category::where('slug', 'bread')->first();
        $meat       = Category::where('slug', 'meat')->first();

        $products = [
            // Fruits
            ['category_id' => $fruits->id,     'name' => 'Grapes',            'slug' => 'grapes',           'description' => 'Fresh organic grapes, sweet and juicy.',               'price' => 4.99,  'unit' => 'kg',    'stock' => 50,  'rating' => 4.5, 'is_featured' => true],
            ['category_id' => $fruits->id,     'name' => 'Raspberries',       'slug' => 'raspberries',      'description' => 'Hand-picked organic raspberries.',                      'price' => 4.99,  'unit' => 'kg',    'stock' => 30,  'rating' => 4.7, 'is_featured' => true],
            ['category_id' => $fruits->id,     'name' => 'Apricots',          'slug' => 'apricots',         'description' => 'Sun-ripened organic apricots.',                         'price' => 4.99,  'unit' => 'kg',    'stock' => 40,  'rating' => 4.3, 'is_featured' => false],
            ['category_id' => $fruits->id,     'name' => 'Banana',            'slug' => 'banana',           'description' => 'Organically grown bananas, rich in potassium.',         'price' => 2.99,  'unit' => 'kg',    'stock' => 60,  'rating' => 4.6, 'is_featured' => true],
            ['category_id' => $fruits->id,     'name' => 'Oranges',           'slug' => 'oranges',          'description' => 'Juicy organic oranges full of vitamin C.',              'price' => 3.99,  'unit' => 'kg',    'stock' => 70,  'rating' => 4.8, 'is_featured' => true],
            ['category_id' => $fruits->id,     'name' => 'Strawberries',      'slug' => 'strawberries',     'description' => 'Sweet organic strawberries, locally grown.',            'price' => 5.99,  'unit' => 'kg',    'stock' => 35,  'rating' => 4.9, 'is_featured' => true],
            // Vegetables
            ['category_id' => $vegetables->id, 'name' => 'Broccoli',          'slug' => 'broccoli',         'description' => 'Farm-fresh organic broccoli florets.',                  'price' => 3.99,  'unit' => 'kg',    'stock' => 45,  'rating' => 4.4, 'is_featured' => true],
            ['category_id' => $vegetables->id, 'name' => 'Potatoes',          'slug' => 'potatoes',         'description' => 'Earthy, creamy organic potatoes.',                      'price' => 2.99,  'unit' => 'kg',    'stock' => 100, 'rating' => 4.2, 'is_featured' => false],
            ['category_id' => $vegetables->id, 'name' => 'Pumpkin',           'slug' => 'pumpkin',          'description' => 'Sweet organic pumpkin, great for soups.',               'price' => 5.99,  'unit' => 'piece', 'stock' => 25,  'rating' => 4.5, 'is_featured' => false],
            ['category_id' => $vegetables->id, 'name' => 'Spinach',           'slug' => 'spinach',          'description' => 'Fresh organic baby spinach leaves.',                   'price' => 2.49,  'unit' => 'kg',    'stock' => 55,  'rating' => 4.6, 'is_featured' => true],
            ['category_id' => $vegetables->id, 'name' => 'Carrots',           'slug' => 'carrots',          'description' => 'Crunchy organic carrots, perfect for snacking.',        'price' => 1.99,  'unit' => 'kg',    'stock' => 80,  'rating' => 4.3, 'is_featured' => false],
            // Bread
            ['category_id' => $bread->id,      'name' => 'Whole Wheat Bread', 'slug' => 'whole-wheat-bread','description' => 'Freshly baked whole wheat organic bread.',              'price' => 3.49,  'unit' => 'loaf',  'stock' => 20,  'rating' => 4.6, 'is_featured' => true],
            ['category_id' => $bread->id,      'name' => 'Sourdough Loaf',    'slug' => 'sourdough-loaf',   'description' => 'Artisan sourdough bread with organic flour.',           'price' => 4.49,  'unit' => 'loaf',  'stock' => 15,  'rating' => 4.8, 'is_featured' => true],
            // Meat
            ['category_id' => $meat->id,       'name' => 'Organic Chicken',   'slug' => 'organic-chicken',  'description' => 'Free-range organic chicken, whole.',                    'price' => 12.99, 'unit' => 'piece', 'stock' => 20,  'rating' => 4.7, 'is_featured' => true],
            ['category_id' => $meat->id,       'name' => 'Grass-Fed Beef',    'slug' => 'grass-fed-beef',   'description' => 'Premium grass-fed organic beef cuts.',                  'price' => 15.99, 'unit' => 'kg',    'stock' => 15,  'rating' => 4.9, 'is_featured' => true],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
