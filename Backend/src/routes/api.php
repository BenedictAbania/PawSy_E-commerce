<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// This connects your React Admin Panel to the Backend
Route::apiResource('products', ProductController::class);

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('users', UserController::class);

// Protected Routes (require login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cart Management
    Route::apiResource('cart', CartController::class);
    Route::get('/cart', [CartController::class, 'index']); // Get all cart items
    Route::post('/cart', [CartController::class, 'store']); // Add to cart
    Route::put('/cart/{id}', [CartController::class, 'update']); // Update quantity
    Route::delete('/cart/{id}', [CartController::class, 'destroy']); // Remove item
    Route::delete('/cart', [CartController::class, 'clear']); // Clear cart
    Route::get('/cart/count', [CartController::class, 'count']); // Get cart count

    // Wishlist Management
    Route::get('/wishlist', [WishlistController::class,'index']);
    Route::post('/wishlist', [WishlistController::class,'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class,'destroy']);
    
    // Order Management
    Route::post('/orders', [OrderController::class, 'store']); // Place Order
    Route::get('/orders', [OrderController::class, 'index']);  // View History
});