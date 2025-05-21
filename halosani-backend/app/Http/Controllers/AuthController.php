<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register User dan Kirim OTP via Email
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'gender' => 'required|string|in:male,female,other',
            'age' => 'required|integer|min:13|max:100',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            // Generate OTP (6 digit) dan waktu kedaluwarsa (10 menit)
            $otp = rand(100000, 999999);
            $otpExpiresAt = Carbon::now()->addMinutes(10);

            // Buat user baru dengan OTP
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'gender' => $validated['gender'],
                'age' => $validated['age'],
                'address' => $validated['address'],
                'password' => Hash::make($validated['password']),
                'otp' => $otp,
                'otp_expires_at' => $otpExpiresAt,
            ]);

            // Kirim OTP via email
            $this->sendOtpEmail($user->email, $otp);

            return response()->json([
                'message' => 'OTP sent to your email.',
                'user_id' => $user->id
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Kirim OTP via email
    private function sendOtpEmail($email, $otp)
    {
        $data = ['otp' => $otp];

        Mail::send('emails.otp', $data, function ($message) use ($email) {
            $message->to($email)
                    ->subject('Your OTP Verification Code');
        });
    }

    // Verifikasi OTP
    public function verifyOtp(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'otp' => 'required|digits:6',
            ]);

            $user = User::find($validated['user_id']);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Cek apakah OTP cocok
            if ($user->otp !== $validated['otp']) {
                return response()->json(['message' => 'Invalid OTP code'], 400);
            }

            // Cek apakah OTP sudah kadaluarsa
            if (Carbon::now()->gt($user->otp_expires_at)) {
                return response()->json(['message' => 'OTP has expired'], 400);
            }

            // Verifikasi user
            $user->update([
                'is_verified' => true,
                'otp' => null,
                'otp_expires_at' => null,
                'email_verified_at' => Carbon::now()
            ]);

            // Generate token
            $token = $user->createToken('UserToken')->plainTextToken;

            return response()->json([
                'message' => 'Account verified successfully',
                'token' => $token,
                'user' => $user->only(['id', 'name', 'email'])
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('OTP Verification Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'OTP verification failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Resend OTP
    public function resendOtp(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id'
            ]);

            $user = User::find($validated['user_id']);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Generate OTP baru
            $otp = rand(100000, 999999);
            $otpExpiresAt = Carbon::now()->addMinutes(10);

            $user->update([
                'otp' => $otp,
                'otp_expires_at' => $otpExpiresAt
            ]);

            // Kirim OTP via email
            $this->sendOtpEmail($user->email, $otp);

            return response()->json([
                'message' => 'New OTP sent to your email',
                'expires_at' => $otpExpiresAt->toDateTimeString()
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Resend OTP Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to resend OTP',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login User
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Account not verified',
                'user_id' => $user->id
            ], 403);
        }

        $token = $user->createToken('UserToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only(['id', 'name', 'email', 'gender', 'age', 'address'])
        ], 200);
    }

    // Forgot Password - Kirim link reset password
    public function forgotPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|exists:users,email'
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                return response()->json(['message' => 'Email not found'], 404);
            }

            // Generate token reset password
            $token = Str::random(60);
            $tokenExpiresAt = Carbon::now()->addMinutes(60);

            $user->update([
                'password_reset_token' => hash('sha256', $token),
                'password_reset_token_expires_at' => $tokenExpiresAt
            ]);

            // Gunakan URL frontend dari environment variable
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $resetLink = "{$frontendUrl}/reset-password?token={$token}&email={$user->email}";
            
            Mail::send('emails.password-reset', ['resetLink' => $resetLink], function($message) use ($user) {
                $message->to($user->email)
                        ->subject('Password Reset Request');
            });

            return response()->json([
                'message' => 'Password reset link has been sent to your email',
                'expires_at' => $tokenExpiresAt->toDateTimeString()
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Forgot Password Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send reset link',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Reset Password - Proses reset password
    public function resetPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'token' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string|min:8|confirmed'
            ]);

            Log::info('Reset Password Attempt:', [
                'email' => $validated['email'],
                'token_received' => $validated['token'],
                'time' => now()
            ]);

            // Cari user berdasarkan email
            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                Log::error('User not found for email: ' . $validated['email']);
                return response()->json(['message' => 'User not found'], 404);
            }

            // Cek apakah user memiliki token reset password
            if (!$user->password_reset_token) {
                Log::error('No reset token found for user: ' . $user->email);
                return response()->json(['message' => 'No password reset request found'], 400);
            }

            Log::info('User Token Info:', [
                'user_id' => $user->id,
                'db_token' => $user->password_reset_token,
                'expires_at' => $user->password_reset_token_expires_at,
                'current_time' => now(),
                'is_expired' => $user->password_reset_token_expires_at ? now()->gt($user->password_reset_token_expires_at) : true
            ]);

            // Validasi token
            $hashedInputToken = hash('sha256', $validated['token']);
            $tokenMatch = $hashedInputToken === $user->password_reset_token;
            
            Log::info('Token Comparison:', [
                'input_token' => $validated['token'],
                'hashed_input' => $hashedInputToken,
                'db_token' => $user->password_reset_token,
                'match' => $tokenMatch
            ]);

            if (!$tokenMatch) {
                Log::error('Invalid token for user: ' . $user->email);
                return response()->json(['message' => 'Invalid or expired reset token'], 400);
            }

            // Cek apakah token sudah expired
            if (!$user->password_reset_token_expires_at || now()->gt($user->password_reset_token_expires_at)) {
                Log::error('Token expired for user: ' . $user->email);
                return response()->json(['message' => 'Reset token has expired'], 400);
            }

            // Update password dan hapus token
            $user->update([
                'password' => Hash::make($validated['password']),
                'password_reset_token' => null,
                'password_reset_token_expires_at' => null
            ]);

            // Hapus semua token akses yang ada untuk keamanan
            $user->tokens()->delete();

            Log::info('Password reset successful for user: ' . $user->email);

            return response()->json([
                'message' => 'Password has been reset successfully'
            ], 200);

        } catch (ValidationException $e) {
            Log::error('Validation error in reset password: ', $e->errors());
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Reset Password Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to reset password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Logout User
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}