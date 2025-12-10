<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        // Fetch all orders with the associated User data
        // 'user:id,name,email' means we only fetch those specific fields to be efficient
        $orders = Order::with('user:id,name,email')
            ->latest() // Newest first
            ->get();

        return response()->json($orders);
    }
    
    // Optional: Update status (e.g., mark as delivered)
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }
}