<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\EventCarousel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function getEvents()
    {
        try {
            $currentDate = now()->format('Y-m-d H:i:s');
            
            Log::info("Fetching events with date >= $currentDate");
            
            $events = EventCarousel::where('event_date', '>=', $currentDate)
                ->orderBy('event_date', 'asc')
                ->get()
                ->map(function ($event) {
                    // Debug original image path
                    Log::debug("Processing event #{$event->id}, image path: {$event->image}");
                    
                    $imageUrl = null;
                    if ($event->image) {
                        // Jika sudah full URL (misal dari cloud storage)
                        if (str_starts_with($event->image, 'http')) {
                            $imageUrl = $event->image;
                        } 
                        // Jika path lokal
                        else {
                            // Cek file di public storage
                            $path = 'public/' . ltrim($event->image, '/');
                            if (Storage::exists($path)) {
                                $imageUrl = asset(Storage::url($event->image));
                            } else {
                                Log::warning("Image not found in storage: {$event->image}");
                            }
                        }
                    }

                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'event_date' => $event->event_date,
                        'link' => $event->link,
                        'image' => $imageUrl, // akan null jika gambar tidak ada
                        'created_at' => $event->created_at,
                        'updated_at' => $event->updated_at
                    ];
                });

            Log::info("Found {$events->count()} events", [
                'sample_event' => $events->first()
            ]);

            return response()->json([
                'success' => true,
                'events' => $events,
                'meta' => [
                    'current_time' => $currentDate,
                    'timezone' => config('app.timezone'),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch events: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch events',
                'error' => $e->getMessage(),
                'events' => []
            ], 500);
        }
    }
}