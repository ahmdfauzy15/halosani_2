<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\WellnessData;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getUserData()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'gender' => $user->gender,
                    'age' => $user->age,
                    'address' => $user->address
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getWellnessData()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Bersihkan data yang sudah kadaluarsa
            WellnessData::cleanupExpired();

            // Ambil data yang masih berlaku (7 hari terakhir)
            $wellnessData = WellnessData::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();

            return response()->json([
                'success' => true,
                'wellnessData' => $wellnessData ? $wellnessData->data : null
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch wellness data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function saveWellnessData(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $validated = $request->validate([
                'data' => 'required|array'
            ]);

            // Set waktu kadaluarsa 7 hari dari sekarang
            $expiresAt = Carbon::now()->addDays(7);

            // Update atau buat data wellness dengan waktu kadaluarsa
            $wellnessData = WellnessData::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'data' => $validated['data'],
                    'expires_at' => $expiresAt
                ]
            );

            // Bersihkan data yang sudah kadaluarsa
            WellnessData::cleanupExpired();

            return response()->json([
                'success' => true,
                'message' => 'Wellness data saved successfully',
                'data' => $wellnessData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save wellness data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
