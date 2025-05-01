<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BannedWord;

class BannedWordController extends Controller
{
    // List semua banned words
    public function index()
    {
        $bannedWords = BannedWord::orderBy('banned_word')->get();
        return response()->json($bannedWords);
    }

    // Tambah banned word baru
    public function store(Request $request)
    {
        $request->validate([
            'banned_word' => 'required|string|unique:banned_words,banned_word|max:255',
        ]);

        $bannedWord = BannedWord::create([
            'banned_word' => $request->banned_word,
        ]);

        return response()->json($bannedWord, 201);
    }

    // Tampilkan satu banned word
    public function show($id)
    {
        $bannedWord = BannedWord::findOrFail($id);
        return response()->json($bannedWord);
    }

    // Update banned word
    public function update(Request $request, $id)
    {
        $bannedWord = BannedWord::findOrFail($id);

        $request->validate([
            'banned_word' => 'required|string|unique:banned_words,banned_word,' . $id . '|max:255',
        ]);

        $bannedWord->update([
            'banned_word' => $request->banned_word,
        ]);

        return response()->json($bannedWord);
    }

    // Delete banned word
    public function destroy($id)
    {
        $bannedWord = BannedWord::findOrFail($id);
        $bannedWord->delete();

        return response()->json(['message' => 'Banned word deleted successfully']);
    }
}
