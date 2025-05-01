<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventCarousel;
use Illuminate\Support\Facades\Storage;

class EventCarouselController extends Controller
{
    // Get all Event Carousel
    public function index()
    {
        $events = EventCarousel::all();
        return response()->json($events);
    }

    // Store new Event
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'link' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
        ]);

        $data = $request->only(['title', 'link', 'description', 'event_date']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('event_images', 'public');
        }

        $event = EventCarousel::create($data);

        return response()->json([
            'message' => 'Event berhasil dibuat',
            'event' => $event
        ]);
    }

    // Show single Event
    public function show($id)
    {
        $event = EventCarousel::findOrFail($id);

        return response()->json($event);
    }

    // Update Event
    public function update(Request $request, $id)
{
    $event = EventCarousel::findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'link' => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'event_date' => 'nullable|date',
    ]);

    $data = $request->only(['title', 'link', 'description', 'event_date']);

    if ($request->hasFile('image')) {
        // Hapus gambar lama kalau ada
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }
        $data['image'] = $request->file('image')->store('event_images', 'public');
        // Tambahkan URL lengkap untuk gambar
        $data['image_url'] = asset('storage/'.$data['image']);
    }

    $event->update($data);

    return response()->json([
        'message' => 'Event berhasil diupdate',
        'event' => $event
    ]);
}

    // Delete Event
    public function destroy($id)
    {
        $event = EventCarousel::findOrFail($id);

        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event berhasil dihapus'
        ]);
    }
}
