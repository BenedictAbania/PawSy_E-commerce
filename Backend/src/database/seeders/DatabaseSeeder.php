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

        // This runs the file that adds your 6 mock products
        // $this->call(ProductSeeder::class);
    }
}