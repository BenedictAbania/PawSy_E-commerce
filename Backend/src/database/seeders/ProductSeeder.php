<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Pet Carrier',
                'price' => 25.99,
                'stock' => 10,
                'category' => 'Accessories',
                'brand' => 'PawBrand',
                'tags' => ['Travel'],
                'image' => '/assets/bestselling/catcage.png',
                'petType' => 'Cat'
            ],
            [
                'name' => 'Cat Bowl',
                'price' => 9.99,
                'stock' => 50,
                'category' => 'Feeding',
                'brand' => 'WhiskerCo',
                'tags' => ['Food'],
                'image' => '/assets/bestselling/catbowl.png',
                'petType' => 'Cat'
            ],
            [
                'name' => 'Dog Bowl',
                'price' => 10.49,
                'stock' => 30,
                'category' => 'Feeding',
                'brand' => 'PawBrand',
                'tags' => ['Food'],
                'image' => '/assets/bestselling/dogbowl.png',
                'petType' => 'Dog'
            ],
            [
                'name' => 'Premium Cat Food',
                'price' => 29.99,
                'stock' => 100,
                'category' => 'Food',
                'brand' => 'Royal Canin',
                'tags' => ['Natural'],
                'image' => '/assets/bestselling/catfood.png',
                'petType' => 'Cat'
            ],
            [
                'name' => 'Dog Collar',
                'price' => 19.99,
                'stock' => 15,
                'category' => 'Accessories',
                'brand' => 'PawBrand',
                'tags' => ['Comfort'],
                'image' => '/assets/bestselling/dogcollar.png',
                'petType' => 'Dog'
            ],
            [
                'name' => 'Large Cat Cage',
                'price' => 55.99,
                'stock' => 5,
                'category' => 'Accessories',
                'brand' => 'WhiskerCo',
                'tags' => ['Comfort'],
                'image' => '/assets/bestselling/catcage.png',
                'petType' => 'Cat'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}