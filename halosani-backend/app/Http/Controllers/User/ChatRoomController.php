<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ChatRoom;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    // Menampilkan daftar chat room untuk user
    public function index()
    {
        // Mengambil daftar chat room dengan banned words (untuk informasi)
        $chatRooms = ChatRoom::with('bannedWords')->get();
        return response()->json($chatRooms);
    }

    // Menampilkan detail chat room untuk user
    public function show($id)
    {
        // Mengambil detail chat room berdasarkan ID
        $chatRoom = ChatRoom::with('bannedWords')->find($id);

        // Jika chat room tidak ditemukan
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        return response()->json($chatRoom);
    }
}
