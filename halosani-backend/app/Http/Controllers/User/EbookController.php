<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Support\Facades\Storage;

class EbookController extends Controller
{
    // Menampilkan daftar ebook
    public function index()
    {
        $ebooks = Ebook::query()
            ->when(request('search'), function($query) {
                $query->where('title', 'like', '%'.request('search').'%')
                      ->orWhere('short_description', 'like', '%'.request('search').'%');
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ebook) {
                // Format image URL
                $ebook->image_url = $this->getFileUrl($ebook->image);
                // Format download URL
                $ebook->download_url = $this->getFileUrl($ebook->link);
                return $ebook;
            });
            
        return response()->json($ebooks);
    }

    // Menampilkan detail ebook
    public function show($id)
    {
        $ebook = Ebook::find($id);
        
        if (!$ebook) {
            return response()->json(['message' => 'Ebook not found'], 404);
        }
        
        // Format URLs
        $ebook->image_url = $this->getFileUrl($ebook->image);
        $ebook->download_url = $this->getFileUrl($ebook->link);
        
        return response()->json($ebook);
    }

    // Helper method to generate proper file URLs
    protected function getFileUrl($path)
    {
        if (!$path) return null;
        if (filter_var($path, FILTER_VALIDATE_URL)) return $path;
        return Storage::url($path);
    }
}