<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Psychologist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialization',
        'description',
        'education',
        'experience_years',
        'hospital_affiliation',
        'contact_email',
        'contact_phone',
        'image',
        'is_verified',
        'languages',
        'treatment_approaches'
    ];

    protected $casts = [
        'languages' => 'array',
        'treatment_approaches' => 'array',
        'is_verified' => 'boolean'
    ];

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/'.$this->image) : asset('images/default-psychologist.jpg');
    }
}