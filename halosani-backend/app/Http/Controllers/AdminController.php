<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Menampilkan daftar admin
    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins);
    }

    // Membuat admin baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:admins|max:255',
            'password' => 'required|min:6',
        ]);

        $admin = Admin::create([
            'username' => $validated['username'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json(['message' => 'Admin created successfully', 'admin' => $admin], 201);
    }

    // Menampilkan detail admin
    public function show($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        return response()->json($admin);
    }

    // Mengupdate data admin
    public function update(Request $request, $id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $validated = $request->validate([
            'username' => 'required|max:255|unique:admins,username,' . $id,
            'password' => 'nullable|min:6',
        ]);

        $admin->username = $validated['username'];
        if ($request->has('password')) {
            $admin->password = bcrypt($validated['password']);
        }

        $admin->save();

        return response()->json(['message' => 'Admin updated successfully', 'admin' => $admin]);
    }

    // Menghapus admin
    public function destroy($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $admin->delete();

        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
