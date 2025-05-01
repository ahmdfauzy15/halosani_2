<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WebInfo;
use Illuminate\Http\Request;

class WebInfoController extends Controller
{
    // Menampilkan web info
    public function index()
    {
        $webInfo = WebInfo::all();  // Ambil semua web info
        return response()->json($webInfo);
    }

    // Menampilkan detail web info
    public function show($id)
    {
        $webInfo = WebInfo::find($id);  // Ambil web info berdasarkan ID
        if ($webInfo) {
            return response()->json($webInfo);
        } else {
            return response()->json(['message' => 'Web Info not found'], 404);
        }
    }
}
