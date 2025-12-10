<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get all cart items for authenticated user
     * GET /api/cart
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get cart items with product details
        $cartItems = Cart::with('product')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($cart) {
                return [
                    'id' => $cart->id,
                    'product_id' => $cart->product_id,
                    'product' => [
                        'id' => $cart->product->id,
                        'name' => $cart->product->name,
                        'price' => $cart->product->price,
                        'image' => $cart->product->image,
                        'stock' => $cart->product->stock,
                        'category' => $cart->product->category,
                        'brand' => $cart->product->brand,
                    ],
                    'quantity' => $cart->quantity,
                    'subtotal' => $cart->quantity * $cart->product->price,
                ];
            });

        $total = $cartItems->sum('subtotal');
        $count = $cartItems->sum('quantity');

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'count' => $count,
        ]);
    }

    /**
     * Add item to cart or update quantity if exists
     * POST /api/cart
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $quantity = $validated['quantity'] ?? 1;
        $productId = $validated['product_id'];

        // Check if product has enough stock
        $product = Product::findOrFail($productId);
        
        // Check if item already exists in cart
        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $quantity;
            
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'available' => $product->stock,
                ], 400);
            }
            
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            // Create new cart item
            if ($quantity > $product->stock) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'available' => $product->stock,
                ], 400);
            }
            
            $cartItem = Cart::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        // Return updated cart item with product details
        $cartItem->load('product');

        return response()->json([
            'message' => 'Item added to cart',
            'cart_item' => [
                'id' => $cartItem->id,
                'product_id' => $cartItem->product_id,
                'product' => [
                    'id' => $cartItem->product->id,
                    'name' => $cartItem->product->name,
                    'price' => $cartItem->product->price,
                    'image' => $cartItem->product->image,
                ],
                'quantity' => $cartItem->quantity,
            ],
        ], 201);
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/{id}
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $product = Product::findOrFail($cartItem->product_id);

        if ($validated['quantity'] > $product->stock) {
            return response()->json([
                'message' => 'Insufficient stock',
                'available' => $product->stock,
            ], 400);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return response()->json([
            'message' => 'Cart updated',
            'cart_item' => $cartItem,
        ]);
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/{id}
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cartItem = Cart::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }

    /**
     * Clear entire cart
     * DELETE /api/cart
     */
    public function clear(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Cart::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Cart cleared',
        ]);
    }

    /**
     * Get cart item count
     * GET /api/cart/count
     */
    public function count(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['count' => 0]);
        }

        $count = Cart::where('user_id', $user->id)->sum('quantity');

        return response()->json(['count' => $count]);
    }
}