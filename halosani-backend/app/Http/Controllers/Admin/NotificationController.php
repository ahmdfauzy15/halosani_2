<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\UserNotification;
use Illuminate\Support\Facades\Notification;

class NotificationController extends Controller
{
    // Kirim notifikasi ke semua user
    public function sendNotificationToUsers()
    {
        $users = User::all();  // Ambil semua user
        $message = "Ada update terbaru di aplikasi HaloSani!";

        // Kirim notifikasi ke semua user
        Notification::send($users, new UserNotification($message));

        return response()->json(['message' => 'Notifikasi berhasil dikirim ke semua user']);
    }
}
