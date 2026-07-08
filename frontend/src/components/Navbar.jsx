import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            //Appel de l'API Laravel pour detruire ls session
            await api.post('/logout');
        } catch (err) {
            console.error('Erreur lors de la déconnexion', err);
        } finally {
            //On vide le context React et le localStorage
            logoutUser();
            Navigate('/');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-okap-green shadow-sm px-3">
            <div className="container-fluid">
                {/*Utilisation du nom de l'appli pour logo */}
                <span className="navbar-brand fw-bold fs-4">Okap anm pi bèl</span>
            
            {/*A droite: Informations user et bouton deconnexion */}
            {user && (
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white small d-none d-md-inline">
                        Bienvenue, <strong className="text-capitalize">{user.name}</strong>
                        <span className="badge bg-light text-success ms-2 text-uppercase font-monospace">{user.role}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="btn btn-btn-outline btn-sm fw-bold px-3 py-1"
                        style={{ borderRadius: '20px'}}
                    >
                        Déconnexion
                    </button>
                </div>
            )}
            </div>
        </nav>
    );
}