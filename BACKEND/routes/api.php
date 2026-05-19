<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Top-level placeholders for the UVT Events platform. Concrete endpoint
| logic is added in later steps (auth, events, statistics, reports,
| users). Keep controllers thin — validation lives in FormRequests,
| JSON shaping in API Resources, and heavy logic in actions/services.
|
*/

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('partners', [PartnerController::class, 'index']);

    Route::middleware('role:super_administrator|department_administrator')->group(function (): void {
        Route::post('partners', [PartnerController::class, 'store']);
        Route::put('partners/{partner}', [PartnerController::class, 'update']);
        Route::delete('partners/{partner}', [PartnerController::class, 'destroy']);
    });

    Route::post('event', [EventController::class, 'store']);
    Route::get('event/{event}', [EventController::class, 'show']);
    Route::put('event/{event}', [EventController::class, 'update']);

    Route::get('events', [EventController::class, 'index']);

    Route::get('statistics', [StatisticsController::class, 'index']);

    Route::post('generate-report', [ReportController::class, 'store'])
        ->middleware('throttle:report');

    Route::middleware('role:super_administrator')->prefix('users')->group(function (): void {
        Route::get('/', [UserController::class, 'index']);
        Route::put('{user}/role', [UserController::class, 'updateRole']);
    });
});
