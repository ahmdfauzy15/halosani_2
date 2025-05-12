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
        
         try {
        $videos = Video::latest()->get();
        return response()->json($videos ?: []); // Ensure always returns array
    } catch (\Exception $e) {
        return response()->json([], 500); // Return empty array on error
    }
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
