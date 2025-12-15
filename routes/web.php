<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('products', \App\Http\Controllers\ProductController::class);
    Route::resource('leads', \App\Http\Controllers\LeadController::class);
    Route::resource('projects', \App\Http\Controllers\ProjectController::class);
    Route::patch('/projects/{project}/approve', [\App\Http\Controllers\ProjectController::class, 'approve'])->name('projects.approve');
    Route::patch('/projects/{project}/reject', [\App\Http\Controllers\ProjectController::class, 'reject'])->name('projects.reject');
    Route::patch('/projects/{project}/complete', [\App\Http\Controllers\ProjectController::class, 'complete'])->name('projects.complete');


    Route::resource('customers', \App\Http\Controllers\CustomerController::class);
});

require __DIR__ . '/auth.php';
