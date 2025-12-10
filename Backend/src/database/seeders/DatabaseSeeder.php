<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // This runs the file that creates your Admin account
        $this->call(AdminUserSeeder::class);

        $this->call(ProductSeeder::class);

        $this->call([
            AdminUserSeeder::class,    // 1. Create User
            ProductSeeder::class,      // 2. Create Products
            PaymentMethodSeeder::class // 3. Create Cards for that User
        ]);
    }
}