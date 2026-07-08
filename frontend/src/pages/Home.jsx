import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import imageCap from '../assets/cap-haitien.jpg';

export default function Home() {
    const { user } = useContext(AuthContext);
    
    //Si l'utilisateur est deja connete on le redirige directement vers son tableau de bord 
    if (user) {
        return user.role === 'agent' ? <Navigate to="/agent/dashboard" /> : <Navigate to="/citoyen/dashboard" />
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* Un mini-navbar dans l'accueil*/}
            <nav className="navbar navbar-light bg-light shadow-sm px-4 py-3">
                <span className="navbar-brand fw-bold text-success fs-3 m-0">Okap anm pi bèl</span>
                <Link to="/login" className="btn btn-success bg-okap-green fw-bold px-4">Connexion</Link>
            </nav>

            {/*Section Hero (Presentation) */}
            <div className="container my-auto py-5">
                <div className="row align-items-center g-5">

                    {/*Colonnes gauches avec textes et boutons */}
                    <div className="col-12 col-md-6 text-center text-md-start">
                        <h1 className="display-4 fw-bold text-dark mb-3">
                            Rendons au <span className="text-success">Cap-Haïtien</span> toute sa splendeur !
                        </h1>
                        <p className="lead text-secondary mb-4">
                            <strong>Okap anm pi bèl</strong> est la plateforme citoyenne officielle
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                            <Link to="/register" className="btn btn-success bg-okap-green btn-lg fw-bold px-4 py-3 shadow">
                                Créer mon compte citoyen
                            </Link>
                            <Link to="/login" className="btn btn-outline-secondary btn-lg fw-semibold px-4 py-3">
                                Consulter le registre public
                            </Link>
                        </div>
                    </div>

                    {/*Colonnes droites" Image */}
                    <div className="col-12 col-md-6 text-center">
                        <img 
                            src={imageCap}
                            alt="Cathédrale Notre-Dame du Cap-Haïtien"
                            className="img-fluid rounded-4 shadow-lg animate__animated animate__fadeInRight"
                            style={{ maxHeight: '420px', width: '100%', objectFit: 'cover', borderRadius: '20px'}}
                        />
                    </div>

                </div>
            </div>

            {/*Footer */}
            <footer className="bg-light text-muted text-center py-3 mt-auto border-top small">
                &copy; {new Date().getFullYear()} Mairie du cap_Haïtien &middot; Service de Gestions des Déchets civiques
            </footer>
        </div>
    );
}