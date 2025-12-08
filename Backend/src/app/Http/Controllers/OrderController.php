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

    //Get User's Orders
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->get();
    }
}