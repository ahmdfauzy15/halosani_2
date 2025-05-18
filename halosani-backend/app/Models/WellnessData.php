<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class WellnessData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'data',
        'expires_at'
    ];

    protected $casts = [
        'data' => 'array',
        'expires_at' => 'datetime'
    ];

    // Otomatis menghapus data yang sudah kadaluarsa
    protected static function booted()
    {
        static::addGlobalScope('notExpired', function ($builder) {
            $builder->where('expires_at', '>', now());
        });
    }

    // Membersihkan data yang sudah kadaluarsa
    public static function cleanupExpired()
    {
        return self::where('expires_at', '<=', now())->delete();
    }
}
