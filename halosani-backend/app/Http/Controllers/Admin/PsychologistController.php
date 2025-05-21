<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Psychologist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PsychologistController extends Controller
{
    // List semua psikolog dengan filter dan pencarian
    public function index(Request $request)
{
    $psychologists = Psychologist::orderBy('created_at', 'desc')->get();
    
    return response()->json([
        'success' => true,
        'data' => $psychologists
    ]);
}

    // Tambah psikolog baru
 public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'specialization' => 'required|string|max:255',
        'description' => 'required|string',
        'education' => 'required|string',
        'experience_years' => 'required|integer|min:0',
        'hospital_affiliation' => 'nullable|string',
        'contact_email' => 'required|email',
        'contact_phone' => 'required|string',
        'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,bmp,gif,svg|max:2048',
        'languages' => 'nullable|array',
        'languages.*' => 'string|max:50',
        'treatment_approaches' => 'nullable|array',
        'treatment_approaches.*' => 'string|max:50',
        'is_verified' => 'sometimes|boolean'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('psychologists', 'public');
    }

    $psychologist = Psychologist::create([
        'name' => $request->name,
        'specialization' => $request->specialization,
        'description' => $request->description,
        'education' => $request->education,
        'experience_years' => $request->experience_years,
        'hospital_affiliation' => $request->hospital_affiliation,
        'contact_email' => $request->contact_email,
        'contact_phone' => $request->contact_phone,
        'image' => $imagePath,
        'languages' => $request->languages ?: [],
        'treatment_approaches' => $request->treatment_approaches ?: [],
        'is_verified' => $request->boolean('is_verified'),
    ]);

    return response()->json([
        'message' => 'Psychologist created successfully',
        'data' => $psychologist
    ], 201);
}

    // Tampilkan detail psikolog
    public function show($id)
    {
        $psychologist = Psychologist::findOrFail($id);
        return response()->json($psychologist);
    }

    // Update psikolog
    public function update(Request $request, $id)
    {
        $psychologist = Psychologist::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'specialization' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'education' => 'sometimes|required|string',
            'experience_years' => 'sometimes|required|integer|min:0',
            'hospital_affiliation' => 'nullable|string',
            'contact_email' => 'sometimes|required|email',
            'contact_phone' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,bmp,gif,svg|max:2048',
            'languages' => 'nullable|array',
            'treatment_approaches' => 'nullable|array',
            'is_verified' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($psychologist->image) {
                Storage::disk('public')->delete($psychologist->image);
            }
            $imagePath = $request->file('image')->store('psychologists', 'public');
            $data['image'] = $imagePath;
        }

        $psychologist->update($data);

        return response()->json($psychologist);
    }

    // Hapus psikolog
    public function destroy($id)
    {
        $psychologist = Psychologist::findOrFail($id);

        if ($psychologist->image) {
            Storage::disk('public')->delete($psychologist->image);
        }

        $psychologist->delete();

        return response()->json(['message' => 'Psychologist deleted successfully']);
    }
}