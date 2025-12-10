<?php
namespace App\Http\Controllers;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // Store a new message
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);
        ContactMessage::create($validated);
        return response()->json(['message' => 'Message sent!'], 201);
    }

    // Get all messages (Admin)
    public function index()
    {
        return ContactMessage::latest()->get();
    }
}