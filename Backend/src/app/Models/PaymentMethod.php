<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    // 1. Link to your specific table name
    protected $table = 'payment_methods';

    // 2. ALLOW the fields that your Controller is trying to create
    protected $fillable = [
        'user_id',
        'type',        // Matches $validated['type']
        'last_four',   // Matches the 'last_four' you created in the Controller
        'expiry_date'  // Matches $validated['expiry_date']
    ];

    // 3. Define the relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}