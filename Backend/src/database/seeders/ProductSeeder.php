<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // --- FOOD ---
            [
                'name' => 'Pedigree Adult Beef & Vegetables (1.5kg)',
                'category' => 'Food',
                'price' => 20.00,
                'stock' => 50,
                'brand' => 'PawBrand',
                'petType' => 'Dog',
                'is_featured' => true,
                'is_best_seller' => true,
                'image' => 'https://pngimg.com/uploads/dog_food/dog_food_PNG40.png',
            ],
            [
                'name' => 'Whiskas Ocean Fish Flavor',
                'category' => 'Food',
                'price' => 18.00,
                'stock' => 40,
                'brand' => 'WhiskerCo',
                'petType' => 'Cat',
                'is_featured' => true,
                'is_best_seller' => true,
                'image' => 'https://www.whiskas.com.ph/sites/g/files/fnmzdf8166/files/2025-05/whiskas-3d-1-2kg-fop-adult-oceanfish-2_1713962774553.png',
            ],
            [
                'name' => 'Goldfish Flakes (50g)',
                'category' => 'Food',
                'price' => 8.50,
                'stock' => 60,
                'brand' => 'Royal Canin',
                'petType' => 'Turtle',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://www.apifishcare.com/images/products-us/goldfish-flakes/goldfish-flakes-.36.jpg',
            ],
            [
                'name' => 'Aquatic Turtle Pellets',
                'category' => 'Food',
                'price' => 14.50,
                'stock' => 55,
                'brand' => 'PawBrand',
                'petType' => 'Turtle',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://mazuri.com/cdn/shop/files/727613010300-center-1.jpg?v=1714169928',
            ],
            [
                'name' => 'Timothy Hay Bundle',
                'category' => 'Food',
                'price' => 16.00,
                'stock' => 50,
                'brand' => 'Jinx',
                'petType' => 'Rabbit',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://pngimg.com/d/grass_PNG4926.png',
            ],
            [
                'name' => 'Tropical Fruit Bird Mix',
                'category' => 'Food',
                'price' => 22.00,
                'stock' => 35,
                'brand' => 'Royal Canin',
                'petType' => 'Parrot',
                'is_featured' => true,
                'is_best_seller' => true,
                'image' => 'https://cdn11.bigcommerce.com/s-bbbdf/images/stencil/original/products/3550/15091/Country-Tropical-Bird-Food-Finch-Seed-Mix-600g-652708__22002.1730110819.jpg?c=2',
            ],
            [
                'name' => 'Hamster Pellet Blend (500g)',
                'category' => 'Food',
                'price' => 12.00,
                'stock' => 40,
                'brand' => 'Jinx',
                'petType' => 'Hamster',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://pngimg.com/d/sunflower_PNG13374.png',
            ],

            // --- ACCESSORIES ---
            [
                'name' => 'Retractable Dog Leash (5m)',
                'category' => 'Accessories',
                'price' => 12.50,
                'stock' => 30,
                'brand' => 'PawBrand',
                'petType' => 'Dog',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://pngimg.com/uploads/leash/leash_PNG39.png',
            ],
            [
                'name' => 'Water Filter Pump',
                'category' => 'Accessories',
                'price' => 35.00,
                'stock' => 20,
                'brand' => 'Jinx',
                'petType' => 'Turtle',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://pngimg.com/d/engine_PNG38.png',
            ],
            [
                'name' => 'Rabbit Water Bottle (500ml)',
                'category' => 'Accessories',
                'price' => 8.99,
                'stock' => 40,
                'brand' => 'PawBrand',
                'petType' => 'Rabbit',
                'is_featured' => false,
                'is_best_seller' => false,
                'image' => 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTDq-kDUzt0uslhWupIvIpuC6Y0EQeDhNbkwVtnWxozQDaIcLQzP84j5ZtRcvlwf13G0SnU8wmqnTMaR9jZdwCowRm7dBmu7PLKN9qautiC2Uuxi4gVfLZE2w',
            ],

            // --- FURNITURE ---
            [
                'name' => 'Soft Plush Dog Bed (Large)',
                'category' => 'Furniture',
                'price' => 45.00,
                'stock' => 15,
                'brand' => 'Jinx',
                'petType' => 'Dog',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://img.lazcdn.com/g/p/20fb5afe4311e50ea819ad1b6702f1a1.jpg_720x720q80.jpg',
            ],
            [
                'name' => 'Multi-Level Cat Tree Tower',
                'category' => 'Furniture',
                'price' => 85.00,
                'stock' => 10,
                'brand' => 'WhiskerCo',
                'petType' => 'Cat',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://www.kazoo.com.au/cdn/shop/files/Kazoo__15603_MultiLevelScandiCatTree-85.jpg?v=1755066065&width=1080',
            ],
            [
                'name' => 'Glass Tank (20 Gallon)',
                'category' => 'Furniture',
                'price' => 75.00,
                'stock' => 8,
                'brand' => 'WhiskerCo',
                'petType' => 'Turtle',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://pngimg.com/uploads/aquarium/aquarium_PNG24.png',
            ],
            [
                'name' => 'Wooden Rabbit Hutch',
                'category' => 'Furniture',
                'price' => 150.00,
                'stock' => 3,
                'brand' => 'WhiskerCo',
                'petType' => 'Rabbit',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://www.outdoorlivinguk.co.uk/media/catalog/product/cache/dc623b31b1284f20d50cd196871d5304/d/e/def2ed48e61cdde0f68f34010f2306e6.jpg',
            ],
            [
                'name' => 'Large Metal Bird Cage',
                'category' => 'Furniture',
                'price' => 120.00,
                'stock' => 5,
                'brand' => 'WhiskerCo',
                'petType' => 'Parrot',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://pngimg.com/d/cage_PNG22.png',
            ],
            [
                'name' => 'Cozy Hamster Hideout',
                'category' => 'Furniture',
                'price' => 9.99,
                'stock' => 20,
                'brand' => 'WhiskerCo',
                'petType' => 'Hamster',
                'is_featured' => false,
                'is_best_seller' => false,
                'image' => 'https://pngimg.com/d/box_PNG88.png',
            ],

            // --- TOYS ---
            [
                'name' => 'Interactive Feather Wand',
                'category' => 'Toys',
                'price' => 5.99,
                'stock' => 100,
                'brand' => 'Royal Canin',
                'petType' => 'Cat',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZ3-8VXGE4l7zZQcFAF6wt0sxxUoPZwGO-g&s',
            ],
            [
                'name' => 'Wooden Chewing Block',
                'category' => 'Toys',
                'price' => 8.50,
                'stock' => 60,
                'brand' => 'Jinx',
                'petType' => 'Parrot',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://images-cdn.ubuy.co.in/633b909354e61a46983c28ea-bird-toys-multi-color-wooden-block.jpg',
            ],
            [
                'name' => 'Silent Spinner Wheel',
                'category' => 'Toys',
                'price' => 14.50,
                'stock' => 25,
                'brand' => 'PawBrand',
                'petType' => 'Hamster',
                'is_featured' => true,
                'is_best_seller' => false,
                'image' => 'https://pngimg.com/uploads/hamster/hamster_PNG38.png',
            ],

            // --- TREATS ---
            [
                'name' => 'Beef Jerky Treats',
                'category' => 'Treats',
                'price' => 9.99,
                'stock' => 50,
                'brand' => 'PawBrand',
                'petType' => 'Dog',
                'is_featured' => false,
                'is_best_seller' => true,
                'image' => 'https://smmarkets.ph/media/catalog/product/2/0/20555784_copy_.png',
            ],
        ];

        foreach ($products as $product) {
            // Using firstOrCreate prevents duplicates!
            Product::firstOrCreate(
                ['name' => $product['name']], // Check this field
                $product // Create with these fields if not found
            );
        }
    }
}