<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // 1. GET /api/products (Fetch all)
    public function index()
    {
        return Product::all();
    }

    // 2. POST /api/products (Create new)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'brand' => 'nullable|string',
            'petType' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'image' => 'nullable', // <--- CHANGED: Removed '|image' to allow strings
        ]);

        // Handle Image Upload (If it's a file)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }
        // If it's a String URL, it's already in $validated['image'], so we do nothing.

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    // 3. PUT /api/products/{id} (Update existing)
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'brand' => 'nullable|string',
            'petType' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'image' => 'nullable', // <--- CHANGED: Removed '|image'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it was a local file
            if ($product->image && str_contains($product->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $product->update($validated);

        return response()->json($product);
    }

    // 4. DELETE /api/products/{id} (Remove)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            $oldPath = str_replace('/storage/', '', $product->image);
            Storage::disk('public')->delete($oldPath);
        }

        $product->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}