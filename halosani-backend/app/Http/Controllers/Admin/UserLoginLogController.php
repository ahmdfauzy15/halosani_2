<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserLoginLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserLoginLogController extends Controller
{
    // Menampilkan grafik aktivitas login user per bulan
    public function index()
    {
        $data = UserLoginLog::selectRaw('COUNT(*) as count, DATE_FORMAT(login_at, "%Y-%m") as month')
                            ->groupBy('month')
                            ->orderBy('month', 'asc')
                            ->get();

        return response()->json($data);
    }
}
