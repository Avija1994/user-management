<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@fruitables.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@fruitables.com',
                'password' => Hash::make('Admin@123'),
                'role'     => 'admin',
            ]
        );
    }
}
