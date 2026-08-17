<?php

use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminContactMessageController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFinancialAidController;
use App\Http\Controllers\Admin\AdminTestController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWalletController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Doctor\DoctorDashboardController;
use App\Http\Controllers\Doctor\DoctorNotificationController;
use App\Http\Controllers\Doctor\DoctorResultController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\FinancialAidController;
use App\Http\Controllers\Patient\PatientNotificationController;
use App\Http\Controllers\Patient\PatientTrackingController;
use App\Http\Controllers\PatientResultController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Reception\ReceptionDashboardController;
use App\Http\Controllers\Reception\ReceptionOrderController;
use App\Http\Controllers\Reception\ReceptionPatientController;
use App\Http\Controllers\Reception\ReceptionPaymentController;
use App\Http\Controllers\Reception\ReceptionWalletController;
use App\Http\Controllers\Technician\TechnicianOrderController;
use App\Http\Controllers\Technician\TechnicianDashboardController;
use App\Http\Controllers\Technician\TechnicianNotificationController;
use App\Http\Controllers\Technician\TechnicianResultController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TubeTypeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::middleware('reject.authenticated.api')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/register-staff', [AuthController::class, 'registerStaff']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});
Route::get('/tests', [TestController::class, 'index']);
Route::get('/tests/{test}', [TestController::class, 'show']);
Route::get('/tube-types', [TubeTypeController::class, 'index']);
Route::post('/contact', [ContactMessageController::class, 'store']);

// Authenticated routes
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Patient routes
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        Route::get('/tracking', [PatientTrackingController::class, 'index']);
        Route::get('/results', [PatientResultController::class, 'index']);
        Route::get('/results/{id}', [PatientResultController::class, 'show']);
        Route::get('/results/{id}/download', [PatientResultController::class, 'download']);
        Route::get('/notifications', [PatientNotificationController::class, 'index']);
        Route::patch('/notifications/read-all', [PatientNotificationController::class, 'markAllRead']);
        Route::patch('/notifications/{notification}/read', [PatientNotificationController::class, 'markRead']);
    });

    Route::middleware('role:patient')->group(function () {
        Route::get('/wallet', [WalletController::class, 'show']);
        Route::get('/payments/unpaid-orders', [PaymentController::class, 'unpaidOrders']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/my', [PaymentController::class, 'myPayments']);
        Route::post('/financial-aid', [FinancialAidController::class, 'store']);
        Route::get('/financial-aid/my', [FinancialAidController::class, 'myRequests']);
        Route::post('/donations', [DonationController::class, 'store']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus']);

        Route::get('/tests', [AdminTestController::class, 'index']);
        Route::post('/tests', [AdminTestController::class, 'store']);
        Route::put('/tests/{test}', [AdminTestController::class, 'update']);
        Route::delete('/tests/{test}', [AdminTestController::class, 'destroy']);

        Route::get('/financial-aid', [AdminFinancialAidController::class, 'index']);
        Route::get('/financial-aid/{financialAid}/files/{fileId}', [AdminFinancialAidController::class, 'downloadFile']);
        Route::patch('/financial-aid/{financialAid}/status', [AdminFinancialAidController::class, 'updateStatus']);

        Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
        Route::patch('/contact-messages/{contactMessage}/read', [AdminContactMessageController::class, 'markAsRead']);

        Route::get('/wallets', [AdminWalletController::class, 'index']);
        Route::get('/wallets/{patient}', [AdminWalletController::class, 'show']);
        Route::post('/wallets/{patient}/top-up', [AdminWalletController::class, 'topUp']);

        Route::get('/audit-logs', [AdminAuditLogController::class, 'index']);
    });

    // Doctor routes
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        Route::get('/dashboard', [DoctorDashboardController::class, 'index']);
        Route::get('/notifications', [DoctorNotificationController::class, 'index']);
        Route::patch('/notifications/read-all', [DoctorNotificationController::class, 'markAllRead']);
        Route::patch('/notifications/{notification}/read', [DoctorNotificationController::class, 'markRead']);
        Route::get('/results', [DoctorResultController::class, 'index']);
        Route::get('/results/pending', [DoctorResultController::class, 'pending']);
        Route::patch('/results/{result}/approve', [DoctorResultController::class, 'approve']);
        Route::patch('/results/{result}/reject', [DoctorResultController::class, 'reject']);
    });

    // Technician routes
    Route::middleware('role:technician')->prefix('technician')->group(function () {
        Route::get('/dashboard', [TechnicianDashboardController::class, 'index']);
        Route::get('/notifications', [TechnicianNotificationController::class, 'index']);
        Route::patch('/notifications/read-all', [TechnicianNotificationController::class, 'markAllRead']);
        Route::patch('/notifications/{notification}/read', [TechnicianNotificationController::class, 'markRead']);
        Route::get('/orders', [TechnicianOrderController::class, 'index']);
        Route::get('/orders/{order}/tracking', [TechnicianOrderController::class, 'tracking']);
        Route::get('/orders/{order}', [TechnicianOrderController::class, 'show']);
        Route::post('/orders/{order}/samples', [TechnicianOrderController::class, 'storeSamples']);
        Route::patch('/orders/{order}/mark-received', [TechnicianOrderController::class, 'markReceived']);
        Route::patch('/orders/{order}/mark-processing', [TechnicianOrderController::class, 'markProcessing']);
        Route::post('/results', [TechnicianResultController::class, 'store']);
        Route::put('/results/{result}', [TechnicianResultController::class, 'update']);
        Route::patch('/results/{result}/submit-review', [TechnicianResultController::class, 'submitReview']);
    });

    // Reception routes
    Route::middleware('role:reception')->prefix('reception')->group(function () {
        Route::get('/dashboard', [ReceptionDashboardController::class, 'index']);

        Route::get('/patients', [ReceptionPatientController::class, 'index']);
        Route::post('/patients', [ReceptionPatientController::class, 'store']);
        Route::get('/patients/{patient}', [ReceptionPatientController::class, 'show']);
        Route::get('/patients/{patient}/orders', [ReceptionOrderController::class, 'patientOrders']);
        Route::get('/patients/{patient}/open-workflow', [ReceptionOrderController::class, 'openWorkflow']);
        Route::get('/patients/{patient}/unpaid-orders', [ReceptionPaymentController::class, 'unpaidOrders']);
        Route::get('/patients/{patient}/payments', [ReceptionPaymentController::class, 'patientPayments']);
        Route::get('/patients/{patient}/wallet', [ReceptionWalletController::class, 'show']);

        Route::get('/orders', [ReceptionOrderController::class, 'index']);
        Route::post('/orders', [ReceptionOrderController::class, 'store']);
        Route::get('/orders/{order}', [ReceptionOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [ReceptionOrderController::class, 'updateStatus']);
        Route::post('/orders/{order}/samples', [ReceptionOrderController::class, 'storeSamples']);
        Route::post('/orders/{order}/send-to-technician', [ReceptionOrderController::class, 'sendToTechnician']);

        Route::post('/payments', [ReceptionPaymentController::class, 'store']);
    });
});
