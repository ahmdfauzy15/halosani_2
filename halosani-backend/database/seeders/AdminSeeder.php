<?php

namespace Database\Seeders;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Admin::create([
            'username' => 'admin1',
            'password' => Hash::make('password123'),
        ]);
        Admin::create([
            'username' => 'admin2',
            'password' => Hash::make('password123'),
        ]);
        Admin::create([
            'username' => 'admin3',
            'password' => Hash::make('password123'),
        ]);
    }
}
