<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use App\Models\User;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        // Get ALL users (Admins and Customers)
        $users = User::all();

        foreach ($users as $user) {
            // Check if user already has cards to prevent duplicates
            if ($user->paymentMethods()->exists()) {
                continue;
            }

            // Add Visa
            PaymentMethod::create([
                'user_id' => $user->id,
                'type' => 'Visa',
                'last_four' => '4242',
                'expiry_date' => '12/28',
            ]);

            // Add Mastercard
            PaymentMethod::create([
                'user_id' => $user->id,
                'type' => 'Mastercard',
                'last_four' => '8899',
                'expiry_date' => '09/26',
            ]);
        }
    }
}