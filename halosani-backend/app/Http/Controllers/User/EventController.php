<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\EventCarousel;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Menampilkan daftar event
    public function index()
    {
        $events = EventCarousel::all();  // Ambil semua event
        return response()->json($events);
    }

    // Menampilkan detail event
    public function show($id)
    {
        $event = EventCarousel::find($id);  // Ambil event berdasarkan ID
        if ($event) {
            return response()->json($event);
        } else {
            return response()->json(['message' => 'Event not found'], 404);
        }
    }
}
