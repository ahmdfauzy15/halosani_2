<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    // Menampilkan daftar feedback
    public function index()
    {
        $feedbacks = Feedback::with('user')->get();
        return response()->json($feedbacks);
    }

    // Menampilkan detail feedback
    public function show($id)
    {
        $feedback = Feedback::with('user')->find($id);

        if (!$feedback) {
            return response()->json(['message' => 'Feedback not found'], 404);
        }

        return response()->json($feedback);
    }

    // Menghapus feedback
    public function destroy($id)
    {
        $feedback = Feedback::find($id);
        if (!$feedback) {
            return response()->json(['message' => 'Feedback not found'], 404);
        }

        $feedback->delete();

        return response()->json(['message' => 'Feedback deleted successfully']);
    }
}
