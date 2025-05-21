<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Psychologist;
use Illuminate\Http\Request;

class PsychologistController extends Controller
{
    // List psikolog untuk user dengan filter
    public function index(Request $request)
    {
        $query = Psychologist::where('is_verified', true);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                  ->orWhere('specialization', 'like', '%'.$search.'%')
                  ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($request->has('specialization')) {
            $query->where('specialization', 'like', '%'.$request->specialization.'%');
        }

        $psychologists = $query->orderBy('name', 'asc')->paginate(12);

        return response()->json($psychologists);
    }

    // Detail psikolog untuk user
    public function show($id)
    {
        $psychologist = Psychologist::where('is_verified', true)->findOrFail($id);
        return response()->json($psychologist);
    }

    // List spesialisasi unik untuk filter
    public function specializations()
    {
        $specializations = Psychologist::where('is_verified', true)
            ->distinct()
            ->pluck('specialization')
            ->filter()
            ->values();

        return response()->json($specializations);
    }
}