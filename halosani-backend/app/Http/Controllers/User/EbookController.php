<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;

class EbookController extends Controller
{
    // Menampilkan daftar ebook
    public function index()
    {
        $ebooks = Ebook::all();  // Ambil semua ebook
        return response()->json($ebooks);
    }

    // Menampilkan detail ebook
    public function show($id)
    {
        $ebook = Ebook::find($id);  // Ambil ebook berdasarkan ID
        if ($ebook) {
            return response()->json($ebook);
        } else {
            return response()->json(['message' => 'Ebook not found'], 404);
        }
    }
}
