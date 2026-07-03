<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        //Validation des donnees recues du formulaire
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:50',
            'email' =>'required|string|email|max:255|unique:users',
            'password' =>'required|string|min:6',
            'phone' =>['required', 'regex:/^(\+509)?\d{8}$/'],
            'role' => 'required|string|in:citoyen,agent',
        ]);

        if ($validator->fails()) {
            return response()->json([
            'success' => false,
            'errors' => $validator->errors()
            ], 422);
        }

        //Verification du code secret pour le role agent
        $role = $request->role;
        if ($role === 'agent') {
            if ($request->secret_code !== 'CAP2026') {
                return response()->json([
                    'success' => false,
                    'message' => 'Code secret invalide'
                ], 403);
            }
        }

        //Creation de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' =>$request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $role,
        ]);

        //Reponse au format JSON
        return response()->json([
            'success' => true,
            'message' => 'Inscription effectuée avec succès !',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        //Tentative de connexion
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Connexion reussie : On recupere l'utilisateur connecte
            $user = Auth::user();

            // Securite : On regenere la session pour eviter les attaques par fixation de session
            $request->session()->regenerate();

        //Reponse JSON a React avec les infos et le Role pour le routage
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie !',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }

        //Échec de connexion
        return response()->json([
            'success' => false,
            'message' => 'Les identifiants fournis sont incorrects.'
    ], 401); //Non authentifié
    }

    public function logout(Request $request)
    {
        Auth::logout();
        //Destruction de la session actuelle
        $request->session()->invalidate();
        //Regeneration du token csrf pour la securite
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie !'
        ], 200);
    }
}
