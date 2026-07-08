<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index()
    {
        //Recuperation de l'utilisateur connecte
        $user = Auth::user();

        //Filtage selon le role
        if ($user->role === 'agent') {
            //On affiche tous les signalements pour l'agent
            $reports = Report::with('user')->orderBy('created_at', 'desc')->get();
        } else {
            //On affiche uniquement les signalements du citoyen connecte
            $reports = Report::Where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        }

        //On renvoie la liste sous forme de JSON a react
        return response()->json([
            'success' => true,
            'reports' => $reports
        ], 200);
    }

    public function store(Request $request)
    {
        //Validation des donnees du signalement
        $validator = Validator::make($request->all(),[
            'zone' => 'required|string|max:100',
            'adress' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'urgency' => 'required|string|in:faible,moyen,critique'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ],422);
        }

        //Creation du signalement liee automatiquement a l'utilisateur
        $report = Report::create([
            'user_id' =>Auth::id(), //Recuperation de l'id de l'utilisateur via la session
            'zone' => $request->zone,
            'adress' => $request->adress,
            'description' => $request->description,
            'urgency' => $request->urgency,
            'status' => 'En attente', //Statut initial par defaut
        ]);

        //Reponse de succes 
        return response()->json([
            'success' =>true,
            'message' =>'Signalement enregistré avec succès à la mairie !',
            'report' => $report
        ], 201);
    }

    public function update(Request $request, $id){
        //Recherche du signalement dans la bd 
        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Signalement introuvable.'
            ], 404);
        }

        $user = Auth::user();

        //Modification du statut par un agent
        if ($user->role === 'agent') {
            $request->validate([
                'status' => 'required|in:En attente, En cours, Traité'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Le statut du signalement a été mis à jour avec succès.',
                'report' => $report
            ], 200);
        }

        //modification de signalement par un citoyen
        if ($user->role === 'citoyen') {
            //On verifie que le signalement correspond bien a ce citoyen
            if ($report->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'etes pas authorise a modifier ce signalement'
                ], 403);
            }
        }

        if ($report->status !== 'En attente') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier le signalement car il est deja pris en charge'
            ], 400);
        }

        //Validation des nouvelles donnees
        $request->validate([
            'zone' => 'required|string|max:100',
            'adress' => 'required|string|max:255',
            'description' => 'required|string',
            'urgency' => 'required|string|in:faible,moyen,critique'
        ]);

        $report->update([
            'zone' => $request->zone,
            'adress' => $request->adress,
            'description' => $request->description,
            'urgency' => $request->urgency
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre signalement a été modifié avec succès.',
            'report' => $report
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        //Recherche du signalement dans la bd 
        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Signalement introuvable.'
            ], 404);
        }

        $user = Auth::user();

        if ($user->role === 'citoyen') {
            if ($report->user_id !== $user->id) {
                return response()->json([
                'success' => false,
                'message' => 'Vous n\'etes pas authorise a supprimer ce signalement'
            ], 403);
            }

            if ($report->status !== 'En attente') {
                 return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un signalement pris en charge'
            ], 403);
            }
            $report->delete();

            // 4. Réponse de succes
            return response()->json([
            'success' => true,
            'message' => 'Signalement annulé et supprimé avec succès.'
            ], 200);
        }

        // Si un agent tente de supprimer
        return response()->json([
        'success' => false,
        'message' => 'Action non autorisée pour votre profil.'
        ], 403);

    }
}
