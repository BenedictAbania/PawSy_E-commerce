<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // 1. GET /api/users (Read)
    public function index()
    {
        // Return all users, newest first
        return User::orderBy('created_at', 'desc')->get();
    }

    // 2. POST /api/users (Create)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'phone' => 'nullable|string|max:20', 
            'address' => 'nullable|string|max:500',
        ]);

        // Hash the password before saving
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // 3. PUT /api/users/{id} (Update)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            // Ensure email is unique, but ignore the current user's email
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'sometimes|in:admin,user',
            'password' => 'nullable|string|min:6', // Optional when editing
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        // Only hash and update password if a new one was provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Add this to UserController class
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20', // Mapping 'contact' from frontend to 'phone'
        ]);

        // Update fields
        $user->name = $validated['name'] ?? $user->name;
        $user->address = $validated['address'];
        $user->phone = $validated['phone'];
        
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // Add this inside your User class
    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    // 4. DELETE /api/users/{id} (Delete)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}