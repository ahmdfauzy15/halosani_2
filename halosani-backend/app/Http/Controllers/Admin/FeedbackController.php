<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        // Simple fetch without pagination first (like BlogController)
        $feedbacks = Feedback::latest()->get();
        
        return response()->json([
            'feedbacks' => $feedbacks,
            'averageRatings' => $this->calculateAverageRatings(),
            'totalFeedbacks' => Feedback::count()
        ]);
    }

    public function show($id)
    {
        $feedback = Feedback::findOrFail($id);
        return response()->json($feedback);
    }

    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        
        return response()->json(['message' => 'Feedback deleted successfully']);
    }

   private function calculateAverageRatings()
    {
        return [
            'login_register' => (float)Feedback::avg('login_register_rating'),
            'event_info' => (float)Feedback::avg('event_info_rating'),
            'breath_management' => (float)Feedback::avg('breath_management_rating'),
            'journal_comfort' => (float)Feedback::avg('journal_comfort_rating'),
            'mentor_ai' => (float)Feedback::avg('mentor_ai_rating'),
            'blog_content' => (float)Feedback::avg('blog_content_rating'),
            'youtube_videos' => (float)Feedback::avg('youtube_videos_rating'),
            'ebook_access' => (float)Feedback::avg('ebook_access_rating'),
            'feedback_feature' => (float)Feedback::avg('feedback_feature_rating'),
            'overall' => (float)Feedback::avg('overall_rating'),
        ];
    }
}