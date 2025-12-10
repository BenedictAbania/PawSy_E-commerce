<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use App\Models\User;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Give cards to ADMIN (User ID 1 usually)
        $admin = User::find(1);
        if ($admin && $admin->paymentMethods()->count() === 0) {
            PaymentMethod::create(['user_id' => $admin->id, 'type' => 'Visa', 'last_four' => '4242', 'expiry_date' => '12/28']);
        }

        // 2. Give cards to TEST CUSTOMER
        $customer = User::where('email', 'customer@pawsy.com')->first();
        if ($customer && $customer->paymentMethods()->count() === 0) {
            PaymentMethod::create(['user_id' => $customer->id, 'type' => 'Visa', 'last_four' => '1234', 'expiry_date' => '10/27']);
            PaymentMethod::create(['user_id' => $customer->id, 'type' => 'Mastercard', 'last_four' => '5678', 'expiry_date' => '05/26']);
        }
    }
}