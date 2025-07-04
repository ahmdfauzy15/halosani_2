<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'gender', 
        'age', 
        'address', 
        'is_verified',
        'otp',
        'otp_expires_at',
        'password_reset_token',
        'password_reset_token_expires_at'
    ];

    protected $hidden = [
        'password', 
        'remember_token',
        'otp',
        'otp_expires_at',
        'password_reset_token'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',
        'password_reset_token_expires_at' => 'datetime',
        'is_verified' => 'boolean'
    ];
}