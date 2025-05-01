<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatRoom;
use App\Models\BannedWord;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    // Menampilkan daftar chat room
    public function index()
    {
        $chatRooms = ChatRoom::with('bannedWords')->get();
        return response()->json($chatRooms);
    }

    // Menampilkan detail chat room
    public function show($id)
    {
        $chatRoom = ChatRoom::with('bannedWords')->find($id);

        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        return response()->json($chatRoom);
    }

    // Membuat chat room baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'banned_words' => 'array|nullable',
            'banned_words.*' => 'string|max:255',
        ]);

        $chatRoom = ChatRoom::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        // Menambahkan banned words ke chat room
        if (isset($validated['banned_words'])) {
            $chatRoom->bannedWords()->attach($validated['banned_words']);
        }

        return response()->json($chatRoom, 201);
    }

    // Menghapus chat room
    public function destroy($id)
    {
        $chatRoom = ChatRoom::find($id);
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        $chatRoom->delete();

        return response()->json(['message' => 'Chat room deleted successfully']);
    }

    // Menambahkan banned word ke chat room
    public function addBannedWord(Request $request, $id)
    {
        $validated = $request->validate([
            'word' => 'required|string|max:255',
        ]);

        $chatRoom = ChatRoom::find($id);
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        $bannedWord = BannedWord::create([
            'word' => $validated['word'],
        ]);

        // Menambahkan banned word ke chat room
        $chatRoom->bannedWords()->attach($bannedWord->id);

        return response()->json(['message' => 'Banned word added successfully']);
    }

    // Menghapus banned word dari chat room
    public function removeBannedWord($chatRoomId, $bannedWordId)
    {
        $chatRoom = ChatRoom::find($chatRoomId);
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        $bannedWord = BannedWord::find($bannedWordId);
        if (!$bannedWord) {
            return response()->json(['message' => 'Banned word not found'], 404);
        }

        $chatRoom->bannedWords()->detach($bannedWordId);

        return response()->json(['message' => 'Banned word removed successfully']);
    }
}
