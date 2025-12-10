<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'stock',
        'category',
        'brand',
        'petType',
        'tags',
        'image',
        'is_featured',
        'is_best_seller',
    ];

    protected $casts = [
        'tags' => 'array',
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_best_seller' => 'boolean',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}