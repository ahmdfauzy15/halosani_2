<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;
    protected $table = 'feedbacks'; // Tambahkan ini


    protected $fillable = [
        'user_id',
        'name',
        'login_register_rating', 'login_register_reason',
        'event_info_rating', 'event_info_reason',
        'breath_management_rating', 'breath_management_reason',
        'journal_comfort_rating', 'journal_comfort_reason',
        'mentor_ai_rating', 'mentor_ai_reason',
        'blog_content_rating', 'blog_content_reason',
        'youtube_videos_rating', 'youtube_videos_reason',
        'ebook_access_rating', 'ebook_access_reason',
        'feedback_feature_rating', 'feedback_feature_reason',
        'overall_rating', 'overall_reason',
        'additional_feedback'
    ];

    protected $casts = [
        'login_register_rating' => 'integer',
        'event_info_rating' => 'integer',
        'breath_management_rating' => 'integer',
        'journal_comfort_rating' => 'integer',
        'mentor_ai_rating' => 'integer',
        'blog_content_rating' => 'integer',
        'youtube_videos_rating' => 'integer',
        'ebook_access_rating' => 'integer',
        'feedback_feature_rating' => 'integer',
        'overall_rating' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // In User model
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}