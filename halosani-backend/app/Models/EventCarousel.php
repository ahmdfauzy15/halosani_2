<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventCarousel extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'link',
        'description',
        'event_date',
    ];

    protected $casts = [
        'event_date' => 'datetime:Y-m-d H:i:s',
    ];

    protected $dates = [
        'event_date',
        'created_at',
        'updated_at',
    ];
}