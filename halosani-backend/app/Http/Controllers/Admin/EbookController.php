<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ebook;
use Illuminate\Support\Facades\Storage;

class EbookController extends Controller
{
    // List semua ebook
    public function index()
    {
        $ebooks = Ebook::orderBy('created_at', 'desc')->get();
        return response()->json($ebooks);
    }

    // Tambah ebook baru
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'required|url',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ebooks', 'public');
        }

        $ebook = Ebook::create([
            'title' => $request->title,
            'link' => $request->link,
            'image' => $imagePath,
            'short_description' => $request->short_description,
        ]);

        return response()->json($ebook, 201);
    }

    // Tampilkan satu ebook
    public function show($id)
    {
        $ebook = Ebook::findOrFail($id);
        return response()->json($ebook);
    }

    // Update ebook
    public function update(Request $request, $id)
    {
        $ebook = Ebook::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'required|url',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama kalau ada
            if ($ebook->image) {
                Storage::disk('public')->delete($ebook->image);
            }
            $imagePath = $request->file('image')->store('ebooks', 'public');
            $ebook->image = $imagePath;
        }

        $ebook->title = $request->title;
        $ebook->link = $request->link;
        $ebook->short_description = $request->short_description;
        $ebook->save();

        return response()->json($ebook);
    }

    // Delete ebook
    public function destroy($id)
    {
        $ebook = Ebook::findOrFail($id);

        if ($ebook->image) {
            Storage::disk('public')->delete($ebook->image);
        }

        $ebook->delete();

        return response()->json(['message' => 'Ebook deleted successfully']);
    }
}
