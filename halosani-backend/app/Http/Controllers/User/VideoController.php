<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    // Menampilkan daftar video
    public function index()
    {
        $videos = Video::all();  // Ambil semua video
        return response()->json($videos);
    }

    // Menampilkan detail video
    public function show($id)
    {
        $video = Video::find($id);  // Ambil video berdasarkan ID
        if ($video) {
            return response()->json($video);
        } else {
            return response()->json(['message' => 'Video not found'], 404);
        }
    }
}
