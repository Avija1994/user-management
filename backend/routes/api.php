<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Fruitables API Routes
|--------------------------------------------------------------------------
*/

// ── Public Routes ──────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('products',           [ProductController::class,   'index']);
Route::get('products/{slug}',    [ProductController::class,   'show']);
Route::get('categories',         [CategoryController::class,  'index']);
Route::get('testimonials',       [TestimonialController::class,'index']);
Route::post('contact',           [ContactController::class,   'store']);

// ── Protected Routes (JWT) ─────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });

    // Cart
    Route::get('cart',         [CartController::class, 'index']);
    Route::post('cart',        [CartController::class, 'store']);
    Route::put('cart/{cart}',  [CartController::class, 'update']);
    Route::delete('cart/{cart}', [CartController::class, 'destroy']);

    // Orders
    Route::get('orders',  [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
});
