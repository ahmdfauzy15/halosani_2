<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WebInfo;
use Illuminate\Support\Facades\Storage;

class WebInfoController extends Controller
{
    // Get all info
    public function index()
    {
        return response()->json(WebInfo::all());
    }

    // Store new info
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required|string',
            'contact' => 'required|string',
            'address' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('web_infos', 'public');
        }

        $webInfo = WebInfo::create($validated);

        return response()->json($webInfo, 201);
    }

    // Show single info
    public function show($id)
    {
        $webInfo = WebInfo::findOrFail($id);
        return response()->json($webInfo);
    }

    // Update info
    public function update(Request $request, $id)
    {
        $webInfo = WebInfo::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required|string',
            'contact' => 'required|string',
            'address' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($webInfo->image) {
                Storage::disk('public')->delete($webInfo->image);
            }
            $validated['image'] = $request->file('image')->store('web_infos', 'public');
        }

        $webInfo->update($validated);

        return response()->json($webInfo);
    }

    // Delete info
    public function destroy($id)
    {
        $webInfo = WebInfo::findOrFail($id);

        if ($webInfo->image) {
            Storage::disk('public')->delete($webInfo->image);
        }

        $webInfo->delete();

        return response()->json(['message' => 'Web info deleted successfully']);
    }
}
