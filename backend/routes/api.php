<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Routes d'acces publiques(Ne necessite pas de connexion)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Route protegee (Necessite la connexion)
Route::middleware('auth:sanctum')->group(function(){
    //Deconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    //CRUD du signalement
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::put('/reports/{report}', [ReportController::class, 'update']);
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
});