<?php

namespace App\Http\Controllers;

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
            // Get feedback for the authenticated user
            $feedback = Feedback::where('user_id', Auth::id())->first();
            
            return response()->json([
                'success' => true,
                'data' => $feedback
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching feedback: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feedback'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
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

            $userId = Auth::id();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

           $feedback = Feedback::updateOrCreate(
                ['user_id' => $userId],
                array_merge($validated, ['user_id' => $userId])
            );

            return response()->json([
                'success' => true,
                'message' => 'Feedback submitted successfully',
                'data' => $feedback
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error submitting feedback: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}