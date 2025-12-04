<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin already exists to prevent duplicate errors
        if (!User::where('email', 'pawsyadmin@pawsy.com')->exists()) {
            User::create([
                'name' => 'Pawsy Admin',
                'email' => 'pawsyadmin@pawsy.com',
                'password' => Hash::make('pawsyadmin123'),
                'role' => 'admin',
            ]);
        }
    }
}