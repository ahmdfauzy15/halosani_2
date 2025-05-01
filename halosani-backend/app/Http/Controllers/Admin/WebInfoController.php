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
        $data = WebInfo::all();
        return response()->json($data);
    }

    // Store new info
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required',
            'contact' => 'required|string',
            'address' => 'required|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('web_infos', 'public');
        }

        $webInfo = WebInfo::create([
            'title' => $request->title,
            'image' => $imagePath,
            'description' => $request->description,
            'contact' => $request->contact,
            'address' => $request->address,
        ]);

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

        $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'required',
            'contact' => 'required|string',
            'address' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            // delete old image if exist
            if ($webInfo->image) {
                Storage::disk('public')->delete($webInfo->image);
            }
            $webInfo->image = $request->file('image')->store('web_infos', 'public');
        }

        $webInfo->update([
            'title' => $request->title,
            'description' => $request->description,
            'contact' => $request->contact,
            'address' => $request->address,
        ]);

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
