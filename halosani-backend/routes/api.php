<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Admin Auth Routes
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
    });
});

// Admin Event Carousel Routes
use App\Http\Controllers\Admin\EventCarouselController;
Route::prefix('admin')->group(function () {
    Route::get('events', [EventCarouselController::class, 'index']);
    Route::post('events', [EventCarouselController::class, 'store']);
    Route::get('events/{id}', [EventCarouselController::class, 'show']);
    Route::put('events/{id}', [EventCarouselController::class, 'update']); // Ubah dari post ke put
    Route::delete('events/{id}', [EventCarouselController::class, 'destroy']);
});

// Admin WebInfo Routes
use App\Http\Controllers\Admin\WebInfoController;
Route::prefix('admin')->group(function () {
    Route::get('/web-info', [WebInfoController::class, 'index']);
    Route::post('/web-info', [WebInfoController::class, 'store']);
    Route::get('/web-info/{id}', [WebInfoController::class, 'show']);
    Route::put('/web-info/{id}', [WebInfoController::class, 'update']);
    Route::delete('/web-info/{id}', [WebInfoController::class, 'destroy']);
});

// Admin Blog Routes
use App\Http\Controllers\Admin\BlogController;

Route::prefix('admin')->group(function () {
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::get('/blogs/{id}', [BlogController::class, 'show']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    Route::get('/admin/blogs/updated', [BlogController::class, 'updatedBlogs']);
});


// Admin Video Routes
use App\Http\Controllers\Admin\VideoController;

Route::prefix('admin')->group(function () {
    Route::get('/videos', [VideoController::class, 'index']);
    Route::post('/videos', [VideoController::class, 'store']);
    Route::get('/videos/{video}', [VideoController::class, 'show']);
    Route::put('/videos/{video}', [VideoController::class, 'update']); 
    Route::delete('/videos/{video}', [VideoController::class, 'destroy']);
});

// Admin ChatRoom Routes
use App\Http\Controllers\Admin\ChatRoomController;
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/chat-rooms', [ChatRoomController::class, 'index']);
    Route::get('/chat-rooms/{id}', [ChatRoomController::class, 'show']);
    Route::post('/chat-rooms', [ChatRoomController::class, 'store']);
    Route::delete('/chat-rooms/{id}', [ChatRoomController::class, 'destroy']);
    Route::post('/chat-rooms/{id}/banned-word', [ChatRoomController::class, 'addBannedWord']);
    Route::delete('/chat-rooms/{chatRoomId}/banned-word/{bannedWordId}', [ChatRoomController::class, 'removeBannedWord']);
});

// Admin Ebook Routes
use App\Http\Controllers\Admin\EbookController as AdminEbookController;
Route::prefix('admin')->group(function () {
    Route::get('/ebooks', [AdminEbookController::class, 'index']);
    Route::post('/ebooks', [AdminEbookController::class, 'store']);
    Route::get('/ebooks/{id}', [AdminEbookController::class, 'show']);
    Route::put('/ebooks/{id}', [AdminEbookController::class, 'update']);
    Route::delete('/ebooks/{id}', [AdminEbookController::class, 'destroy']);
});

// Admin Notification Routes
use App\Http\Controllers\Admin\NotificationController;
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/send-notification', [NotificationController::class, 'sendNotification']);
    Route::get('/users', [NotificationController::class, 'getUsers']);
});

// Admin Admin Management Routes
use App\Http\Controllers\Admin\AdminController;
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::get('/admins/{id}', [AdminController::class, 'show']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
});

// Admin Feedback Routes
use App\Http\Controllers\Admin\FeedbackController;
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/feedbacks', [FeedbackController::class, 'index']);
    Route::get('/feedbacks/{id}', [FeedbackController::class, 'show']);
    Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);
});

// In your api.php
use App\Http\Controllers\Admin\DashboardController;
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});

use App\Http\Controllers\Admin\UserLoginLogController;

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // Route untuk mengambil data aktivitas login user per bulan
    Route::get('/user-login-logs', [UserLoginLogController::class, 'index']);
});





// User Routes

// Auth Routes for User
use App\Http\Controllers\AuthController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// User Content Routes (Event, Blog, Video, Ebook, Web Info)
use App\Http\Controllers\User\EventController as UserEventController;
use App\Http\Controllers\User\BlogController as UserBlogController;
use App\Http\Controllers\User\VideoController as UserVideoController;
use App\Http\Controllers\User\EbookController as UserEbookController;
use App\Http\Controllers\User\WebInfoController as UserWebInfoController;
use App\Http\Controllers\User\FeedbackController as UserFeedbackController;
use App\Http\Controllers\User\ChatRoomController as UserChatRoomController ;
use App\Http\Controllers\User\DashboardController as Dashuser;

Route::prefix('user')->middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/user', [Dashuser::class, 'getUserData']);
    
    // Events
    Route::get('/events', [UserEventController::class, 'getEvents']);

    // Blogs created by Admin
    Route::get('/blogs', [UserBlogController::class, 'index']);
    Route::get('/blogs/{id}', [UserBlogController::class, 'show']);

    // Videos created by Admin
    Route::get('/videos', [UserVideoController::class, 'index']);
    Route::get('/videos/{id}', [UserVideoController::class, 'show']);

    // Ebooks created by Admin
    Route::get('/ebooks', [UserEbookController::class, 'index']);
    Route::get('/ebooks/{id}', [UserEbookController::class, 'show']);

    // Web Info created by Admin
    Route::get('/web-info', [UserWebInfoController::class, 'index']);
    Route::get('/web-info/{id}', [UserWebInfoController::class, 'show']);

    // Feedbacks from User
    Route::post('/feedbacks', [UserFeedbackController::class, 'store']);

    Route::get('/chat-rooms', [UserChatRoomController::class, 'index']);
    
    // User dapat melihat detail chat room
    Route::get('/chat-rooms/{id}', [UserChatRoomController::class, 'show']);

});
