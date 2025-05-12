<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class NotificationController extends Controller
{
    // Kirim notifikasi ke semua user atau user tertentu
    public function sendNotification(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'subject' => 'required|string',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $message = $request->input('message');
        $subject = $request->input('subject');
        
        // Jika user_ids ada, kirim ke user tertentu saja
        if ($request->has('user_ids') && !empty($request->input('user_ids'))) {
            $users = User::whereIn('id', $request->input('user_ids'))->get();
        } else {
            $users = User::all();
        }

        // Kirim notifikasi ke user yang dipilih
        Notification::send($users, new UserNotification($message, $subject));

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi berhasil dikirim ke ' . $users->count() . ' user'
        ]);
    }

    // Dapatkan daftar user untuk dropdown
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email')->get();
        return response()->json($users);
    }
}