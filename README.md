# okap-anm-pi-bel
Une application permettant de mieux gérer les déchets de rues au cap-haitien.

# Okap anm pi bèl - Application d'Assainissement Urbain

**Okap anm pi bèl** est une application web participative conçue pour optimiser la gestion de la collecte des déchets et de l'insalubrité dans la commune du Cap-Haïtien. Elle permet une collaboration directe entre les citoyens engagés et les agents logistiques de la Mairie.



# Fonctionnalités Principales

# Vitrine & Accueil (Public)
**Landing Page immersive** : Page d'accueil présentant les objectifs civiques du projet avec une illustration locale de la ville du Cap-Haïtien.
**Orientation** : Boutons d'accès direct vers les formulaires de connexion ou d'inscription, avec redirection automatique si une session est déjà active.

# Espace Citoyen
**Inscription & Connexion sécurisées** : Formulaire dédié avec validation des coordonnées.
**Signalement en Modal** : Déclaration géolocalisée par quartier avec adresse précise, description de l'insalubrité et niveau d'urgence estimé (Faible, Moyen, Critique).
**Tableau de bord dynamique** : Suivi en temps réel de l'état d'avancement de ses propres signalements.
***Droit de modification & d'annulation** : Possibilité de modifier ou supprimer un signalement, uniquement tant qu'il est marqué "En attente" par la mairie.

# Espace Agent / Administration
**Inscription contrôlée** : Accès réservé aux agents municipaux via la validation d'un code secret de la mairie (`CAP2026`).
**Registre de supervision global** : Vue sous forme de tableau centralisant tous les signalements de la commune du Cap-Haïtien.
**Eager Loading** : Affichage instantané du nom et du numéro de téléphone de l'habitant auteur pour faciliter la logistique.
**Mise à jour asymétrique** : Menu déroulant pour modifier le statut d'intervention en direct (*En attente*, *En cours*, *Traité*).
**Filtrage multicritères à la volée** : Tri instantané du registre par Quartier (Centre-ville, Petite Anse, Vertières, Haut du Cap) ou par Niveau d'Urgence.



# Technologies Utilisées

L'application repose sur une architecture moderne entièrement découplée :

**Back-end (API Pure)** : 
**Framework Laravel 13** (PHP)
**Base de données relationnelle **MySQL**
Sécurité : Isolation CORS, Stateful API Middlewares et chiffrement des mots de passe.
**Front-end (SPA)** :
**React** (propulsé par **Vite**)
Gestion d'état global : **Context API** (Persistance de session via `localStorage`)
Client HTTP : **Axios** (avec configuration `withCredentials` pour les cookies de session)
Design & Responsive : **Bootstrap 5** et styles personnalisés.



# Procédure d'Installation

# 1. Prérequis
Assurez-vous d'avoir installé :
[PHP >= 8.2](https://php.net)
[Composer](https://getcomposer.org)
[Node.js & npm](https://nodejs.org)
Un serveur local MySQL (XAMPP, WampServer ou Laragon)

# 2. Configuration du Back-end (Laravel)
1. Ouvrez un terminal dans le dossier `backend/` :
   
   cd backend

2. Installez les dépendances PHP :

   composer install
   
3. Copiez le fichier d'environnement et configurez vos accès de base de données :
   
   cp .env.example .env
   
4. Générez la clé de l'application et exécutez les migrations :
   
   php artisan key:generate
   php artisan migrate
   
5. Lancez le serveur d'API :
   
   php artisan serve

   *(L'API s'exécute sur `http://localhost:8000`)*

# 3. Configuration du Front-end (React)
1. Ouvrez un second terminal dans le dossier `frontend/` :
   
   cd frontend
   
2. Installez les paquets Node.js :
   
   npm install
   
3. Lancez le serveur de développement local :
   
   npm run dev
   
   *(L'interface s'exécute sur `http://localhost:5173`)*



# Configuration de Sécurité Locale (.env)
Pour assurer une parfaite communication locale entre les deux ports distincts, le fichier `.env` du back-end intègre les configurations suivantes :

SESSION_DRIVER=cookie
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173



*Développé dans le cadre du projet académique d'assainissement de la ville du Cap-Haïtien.*

