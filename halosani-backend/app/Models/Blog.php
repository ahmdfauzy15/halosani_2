<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'description',
    ];

    protected $appends = ['image_url'];

    // Accessor for full image URL
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    // Scope for recently updated blogs
    public function scopeRecentlyUpdated($query, $limit = 3)
    {
        return $query->whereColumn('updated_at', '>', 'created_at')
                   ->orderBy('updated_at', 'desc')
                   ->limit($limit);
    }

    // Scope for count of updated blogs
    public function scopeUpdatedCount($query)
    {
        return $query->whereColumn('updated_at', '>', 'created_at')->count();
    }
}