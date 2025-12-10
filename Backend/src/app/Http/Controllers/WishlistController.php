<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;
use App\Models\Product;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message'=>'Unauthorized'],401);

        $items = Wishlist::with('product')
            ->where('user_id',$user->id)
            ->get()
            ->map(function($w){ return [
                'id'=>$w->id,
                'product_id'=>$w->product_id,
                'product'=>$w->product
            ];});
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message'=>'Unauthorized'],401);

        $validated = $request->validate(['product_id'=>'required|exists:products,id']);

        // Prevent duplicates (unique constraint also helps)
        $wishlist = Wishlist::firstOrCreate(
            ['user_id'=>$user->id,'product_id'=>$validated['product_id']],
            []
        );

        $wishlist->load('product');
        return response()->json($wishlist, 201);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message'=>'Unauthorized'],401);

        // support passing product id by query param (product_id) as alternative
        if ($request->query('product_id')) {
            $deleted = Wishlist::where('user_id',$user->id)
                ->where('product_id',$request->query('product_id'))
                ->delete();
            return response()->json(['deleted'=>$deleted ? true : false]);
        }

        $wishlist = Wishlist::where('id',$id)->where('user_id',$user->id)->first();
        if (!$wishlist) return response()->json(['message'=>'Not found'],404);
        $wishlist->delete();
        return response()->json(['deleted'=>true]);
    }
}