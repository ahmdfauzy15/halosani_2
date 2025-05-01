<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Video;

class VideoController extends Controller
{
    // Get all videos
    public function index()
    {
        $videos = Video::orderBy('created_at', 'desc')->get();
        return response()->json($videos);
    }

    // Store new video
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'youtube_link' => 'required|url',
            'description' => 'nullable|string',
        ]);

        $video = Video::create([
            'title' => $request->title,
            'youtube_link' => $request->youtube_link,
            'description' => $request->description,
        ]);

        return response()->json($video, 201);
    }

    // Show single video
    public function show($id)
    {
        $video = Video::findOrFail($id);
        return response()->json($video);
    }

    // Update video
    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'youtube_link' => 'required|url',
            'description' => 'nullable|string',
        ]);

        $video->update([
            'title' => $request->title,
            'youtube_link' => $request->youtube_link,
            'description' => $request->description,
        ]);

        return response()->json($video);
    }

    // Delete video
    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}
