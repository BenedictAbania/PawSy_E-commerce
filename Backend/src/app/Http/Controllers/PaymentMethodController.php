<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    // Get user's cards
    public function index(Request $request)
    {
        return $request->user()->paymentMethods()->latest()->get();
    }

    // Add new card
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'card_number' => 'required|string|min:4', // We will strip this to last 4
            'expiry_date' => 'required|string',
        ]);

        $paymentMethod = PaymentMethod::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            // Simulate security: Only save the last 4 digits
            'last_four' => substr($validated['card_number'], -4), 
            'expiry_date' => $validated['expiry_date'],
        ]);

        return response()->json($paymentMethod, 201);
    }

    // Delete card
    public function destroy(Request $request, $id)
    {
        $card = PaymentMethod::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $card->delete();

        return response()->json(['message' => 'Card removed']);
    }
}