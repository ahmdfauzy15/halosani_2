<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function bannedWords()
    {
        return $this->belongsToMany(BannedWord::class, 'chat_room_banned_word');
    }
}
