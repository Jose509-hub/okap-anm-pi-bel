<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Routes d'acces publiques(Ne necessite pas de connexion)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Route protegee (Necessite la connexion)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);