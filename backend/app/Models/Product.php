<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['product_name', 'description', 'price', 'in_stock', 'image_path', 'category_id'];

    protected $casts = [
        'price' => 'decimal:2',
        'in_stock' => 'integer',
    ];

    protected $appends = ['image_url'];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }
}
