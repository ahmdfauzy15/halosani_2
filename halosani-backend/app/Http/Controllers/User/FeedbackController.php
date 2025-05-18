<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
{
    try {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
            ], 401);
        }

        $feedback = Feedback::where('user_id', $userId)->first();

        return response()->json([
            'status' => 'success',
            'data' => $feedback ?: null
        ]);

    } catch (\Exception $e) {
        Log::error('Error in FeedbackController@index: ' . $e->getMessage());
        return response()->json([
            'status' => 'error',
            'message' => 'Server error occurred',
            'error' => $e->getMessage() // Hanya untuk development
        ], 500);
    }
}

    public function store(Request $request)
    {
        try {
            $validated = $this->validateRequest($request);

            $feedback = Feedback::updateOrCreate(
                ['user_id' => Auth::id()],
                $validated
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Feedback saved successfully',
                'data' => $feedback
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('FeedbackController@store - ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save feedback'
            ], 500);
        }
    }

    protected function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'login_register_rating' => 'nullable|integer|between:1,5',
            'login_register_reason' => 'nullable|string|max:500',
            'event_info_rating' => 'nullable|integer|between:1,5',
            'event_info_reason' => 'nullable|string|max:500',
            'breath_management_rating' => 'nullable|integer|between:1,5',
            'breath_management_reason' => 'nullable|string|max:500',
            'journal_comfort_rating' => 'nullable|integer|between:1,5',
            'journal_comfort_reason' => 'nullable|string|max:500',
            'mentor_ai_rating' => 'nullable|integer|between:1,5',
            'mentor_ai_reason' => 'nullable|string|max:500',
            'blog_content_rating' => 'nullable|integer|between:1,5',
            'blog_content_reason' => 'nullable|string|max:500',
            'youtube_videos_rating' => 'nullable|integer|between:1,5',
            'youtube_videos_reason' => 'nullable|string|max:500',
            'ebook_access_rating' => 'nullable|integer|between:1,5',
            'ebook_access_reason' => 'nullable|string|max:500',
            'feedback_feature_rating' => 'nullable|integer|between:1,5',
            'feedback_feature_reason' => 'nullable|string|max:500',
            'overall_rating' => 'nullable|integer|between:1,5',
            'overall_reason' => 'nullable|string|max:500',
            'additional_feedback' => 'nullable|string|max:1000',
        ]);
    }
}