<?php

use App\Http\Controllers\Admin\AdminContactMessageController;
use App\Http\Controllers\Admin\AdminFinancialAidController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminResultController;
use App\Http\Controllers\Admin\AdminTestController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWalletController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Doctor\DoctorResultController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\FinancialAidController;
use App\Http\Controllers\PatientResultController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Reception\ReceptionOrderController;
use App\Http\Controllers\Reception\ReceptionPatientController;
use App\Http\Controllers\Technician\TechnicianOrderController;
use App\Http\Controllers\Technician\TechnicianResultController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/tests', [TestController::class, 'index']);
Route::get('/tests/{test}', [TestController::class, 'show']);
Route::post('/contact', [ContactMessageController::class, 'store']);
Route::post('/donations', [DonationController::class, 'store']);

// Authenticated routes
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Patient routes
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        Route::get('/results', [PatientResultController::class, 'index']);
        Route::get('/results/{id}', [PatientResultController::class, 'show']);
        Route::get('/results/{id}/download', [PatientResultController::class, 'download']);
    });

    Route::middleware('role:patient')->group(function () {
        Route::get('/wallet', [WalletController::class, 'show']);
        Route::get('/payments/unpaid-orders', [PaymentController::class, 'unpaidOrders']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/my', [PaymentController::class, 'myPayments']);
        Route::post('/financial-aid', [FinancialAidController::class, 'store']);
        Route::get('/financial-aid/my', [FinancialAidController::class, 'myRequests']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus']);

        Route::get('/tests', [AdminTestController::class, 'index']);
        Route::post('/tests', [AdminTestController::class, 'store']);
        Route::put('/tests/{test}', [AdminTestController::class, 'update']);
        Route::delete('/tests/{test}', [AdminTestController::class, 'destroy']);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::post('/orders', [AdminOrderController::class, 'store']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

        Route::get('/results', [AdminResultController::class, 'index']);
        Route::post('/results', [AdminResultController::class, 'store']);
        Route::get('/results/{result}', [AdminResultController::class, 'show']);
        Route::put('/results/{result}', [AdminResultController::class, 'update']);
        Route::patch('/results/{result}/submit-review', [AdminResultController::class, 'submitReview']);
        Route::patch('/results/{result}/approve', [AdminResultController::class, 'approve']);
        Route::patch('/results/{result}/reject', [AdminResultController::class, 'reject']);

        Route::get('/financial-aid', [AdminFinancialAidController::class, 'index']);
        Route::patch('/financial-aid/{financialAid}/status', [AdminFinancialAidController::class, 'updateStatus']);

        Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
        Route::patch('/contact-messages/{contactMessage}/read', [AdminContactMessageController::class, 'markAsRead']);

        Route::get('/wallets', [AdminWalletController::class, 'index']);
        Route::get('/wallets/{patient}', [AdminWalletController::class, 'show']);
        Route::post('/wallets/{patient}/top-up', [AdminWalletController::class, 'topUp']);
    });

    // Doctor routes
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        Route::get('/results/pending', [DoctorResultController::class, 'pending']);
        Route::patch('/results/{result}/approve', [DoctorResultController::class, 'approve']);
        Route::patch('/results/{result}/reject', [DoctorResultController::class, 'reject']);
    });

    // Technician routes
    Route::middleware('role:technician')->prefix('technician')->group(function () {
        Route::get('/orders', [TechnicianOrderController::class, 'index']);
        Route::post('/results', [TechnicianResultController::class, 'store']);
        Route::put('/results/{result}', [TechnicianResultController::class, 'update']);
        Route::patch('/results/{result}/submit-review', [TechnicianResultController::class, 'submitReview']);
    });

    // Reception routes
    Route::middleware('role:reception')->prefix('reception')->group(function () {
        Route::post('/orders', [ReceptionOrderController::class, 'store']);
        Route::get('/orders', [ReceptionOrderController::class, 'index']);
        Route::get('/patients', [ReceptionPatientController::class, 'index']);
    });
});
