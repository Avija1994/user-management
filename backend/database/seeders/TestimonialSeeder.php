<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name'        => 'Sarah Johnson',
                'designation' => 'Health Coach',
                'comment'     => 'Fruitables has completely changed how I shop for groceries. The organic produce is incredibly fresh and the delivery is always on time.',
                'rating'      => 5,
            ],
            [
                'name'        => 'Michael Chen',
                'designation' => 'Chef',
                'comment'     => 'As a chef I demand the best quality ingredients. Fruitables consistently delivers top-notch organic fruits and vegetables at great prices.',
                'rating'      => 5,
            ],
            [
                'name'        => 'Emily Davis',
                'designation' => 'Nutritionist',
                'comment'     => 'I recommend Fruitables to all my clients. The selection of organic produce is excellent and the website is so easy to use.',
                'rating'      => 5,
            ],
            [
                'name'        => 'Robert Wilson',
                'designation' => 'Fitness Trainer',
                'comment'     => 'Great quality, fair prices and fast delivery. Fruitables is my go-to for all my organic food needs. Highly recommend!',
                'rating'      => 4,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::firstOrCreate(
                ['name' => $testimonial['name']],
                $testimonial
            );
        }
    }
}
