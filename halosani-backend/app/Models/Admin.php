<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['username', 'password'];
    protected $hidden = ['password'];

    // Method untuk menentukan abilities token
    public function getAbilitiesAttribute()
    {
        return ['admin'];
    }
}