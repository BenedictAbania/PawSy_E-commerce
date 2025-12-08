<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;

class DashboardController extends Controller
{
    public function stats()
    {
        // 1. Calculate Total Sales (Exclude cancelled orders)
        $totalSales = Order::where('status', '!=', 'cancelled')->sum('total_price');

        // 2. Counts
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalUsers = User::count();

        return response()->json([
            'total_products' => $totalProducts,
            'total_users'    => $totalUsers,
            'total_sales'    => $totalSales,
            'total_orders'   => $totalOrders,
        ]);
    }
}