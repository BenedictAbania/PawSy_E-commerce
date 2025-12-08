<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        //Validate Request
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            //Create the Order
            $order = Order::create([
                'user_id' => $request->user()->id, // Requires Sanctum Auth
                'status' => 'pending',
                'total_price' => $validated['total_price'],
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
            ]);

            //Process Items & Deduct Stock
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['id']);

                // Check stock
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Product {$product->name} is out of stock.");
                }

                // Deduct stock
                $product->decrement('stock', $item['quantity']);

                // Create Order Item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // Use DB price for security
                ]);
            }

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id
            ], 201);
        });
    }

    // Add this function to OrderController class
    public function cancel(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // 1. Security Check: Does this order belong to the logged-in user?
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Logic Check: Is it too late to cancel?
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be cancelled. It is currently ' . $order->status
            ], 400);
        }

        // 3. Process Cancellation
        $order->status = 'cancelled';
        $order->save();

        // Optional: You could restore product stock here if you wanted to.

        return response()->json([
            'message' => 'Order cancelled successfully', 
            'status' => 'cancelled'
        ]);
    }

    // Add this to OrderController.php
    public function returnOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Logic: You can usually only return items that have been Delivered
        // For testing purposes, you might want to comment out this check if you don't have 'delivered' orders yet.
        if ($order->status !== 'delivered') {
             return response()->json([
                 'message' => 'Order cannot be returned yet. Wait until it is delivered.'
             ], 400);
        }

        $order->status = 'returned';
        $order->save();

        return response()->json(['message' => 'Return requested successfully', 'status' => 'returned']);
    }

    //Get User's Orders
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->get();
    }
}