<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    // Mengirim feedback
    public function store(Request $request)
    {
        $validated = $request->validate([
            'feedback' => 'required|string|max:1000',
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),  // Menyimpan ID user yang sedang login
            'feedback' => $validated['feedback'],
        ]);

        return response()->json(['message' => 'Feedback submitted successfully', 'feedback' => $feedback], 201);
    }
}
