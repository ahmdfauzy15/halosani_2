<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Menampilkan daftar blog
    public function index()
    {
        $blogs = Blog::all();  // Ambil semua blog
        return response()->json($blogs);
    }

    // Menampilkan detail blog
    public function show($id)
    {
        $blog = Blog::find($id);  // Ambil blog berdasarkan ID
        if ($blog) {
            return response()->json($blog);
        } else {
            return response()->json(['message' => 'Blog not found'], 404);
        }
    }
}
