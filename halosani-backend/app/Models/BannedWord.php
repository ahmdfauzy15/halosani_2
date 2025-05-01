<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannedWord extends Model
{
    use HasFactory;

    protected $fillable = ['word'];

    public function chatRooms()
    {
        return $this->belongsToMany(ChatRoom::class);
    }
}
