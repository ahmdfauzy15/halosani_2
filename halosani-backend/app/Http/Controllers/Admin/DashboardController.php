<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\EventCarousel;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'blogs' => Blog::count(),
            'updatedBlogs' => Blog::whereColumn('updated_at', '>', 'created_at')->count(),
            'events' => EventCarousel::count(),
            'users' => User::count(),
            'recentBlogs' => Blog::latest()->take(4)->get(),
            'updatedBlogsList' => Blog::whereColumn('updated_at', '>', 'created_at')
                                    ->orderBy('updated_at', 'desc')
                                    ->take(4)
                                    ->get()
        ]);
    }
}