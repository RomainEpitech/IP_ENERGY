<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsAdmin;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/delete', [UserController::class, 'destroy']);
    Route::put('/update', [UserController::class, 'update']);

    Route::post('/absences', [AbsenceController::class, 'submit']);
    Route::get('/absences', [AbsenceController::class, 'index']);

    Route::middleware(IsAdmin::class)->group(function () {
        Route::get('/admin/absences', [AdminController::class, 'adminIndex']);
        Route::put('/admin/absences/{id}/status', [AdminController::class, 'updateStatus']);

        Route::get('/admin/users', [AdminController::class, 'listUsers']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    });
});
