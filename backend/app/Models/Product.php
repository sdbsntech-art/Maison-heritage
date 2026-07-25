<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'price',
        'description',
        'image_url',
        'is_featured',
        'in_stock',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'is_featured' => 'boolean',
            'in_stock' => 'boolean',
        ];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
