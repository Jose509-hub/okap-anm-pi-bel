import { useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
import api from "../services/api";
import { use } from "react";

export default function Register() {
    //Capturer les infos du formulaires
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('citoyen'); //On met citoyen par defaut
    const [secretCode, setSecretCode] = useState('');

    const [error, setError] = useState('');
    const [success, setSucces] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); //pour la redirection apres l'inscription

    //Fonction de soumission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSucces('');
        setLoading(true);

        try {
            //Preparation des donnees a envoyer
            const registerData = {
                name,
                email,
                phone,
                password,
                role,
                secret_code: role === 'agent' ? secretCode : null //Envoye seulement si c'est un agent
            };

            const response = await api.post('/register', registerData);

            if (response.data.success) {
                setSucces('Inscription réussie')
                //Une petite attente de 2 sec pour laisser apparaitre le message
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
            
        } catch (err) {
            //On extrait les messages d'erreurs du validateur
            if (err.response?.data?.errors) {
                const firstErrorKey = Object.keys(err.response.data.errors)[0];
                setError(err.response.data.errors[firstErrorKey][0]);
            } else {
                setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px '}}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-okap-green m-0">Okap anm pi bèl</h2>
                    <small className="text-muted">Créer un nouveau compte citoyen ou agent</small>
                </div>

                {/*Alerte de retour */}
                {error && <div className="alert alert-danger p-2 text-center small">{error}</div>}
                {success && <div className="alert alert-success p-2 text-center small">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/*Champ nom complet */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Nom complet</label>
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Jean-Pierre Celestin"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                         />
                    </div>

                    {/*Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Adresse Email</label>
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="jean@gmail.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/*Telephone */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Numéro de Téléphone</label>
                        <input
                            type="text" 
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    {/*Mot de passe */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Mot de passe</label>
                        <input
                            type="password" 
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/*Selecteur de role */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Qui êtes-vous ?</label>
                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Citoyen">Citoyen du cap-Haïtien</option>
                            <option value="Agent">Agent d'Assainissement de la Mairie</option>
                        </select>      
                    </div>

                    {/*Affichage champ code secret si agent est selectionne */}
                    {role === 'agent' && (
                        <div className="mb-4 animate_animated animate_FadeIn">
                            <label className="form-label fw-semibold text-danger small">Code Secret de la Mairie</label>
                            <input 
                                type="password" 
                                className="form-control border-danger"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {/*Bouton de validation */}
                    <button
                    type="submit"
                    className="btn btn-success bg-okap-green w-100 fw-bold py-2 mt-2"
                    disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            
                        ): "S'inscrire"}
                    </button>
                </form>

                <div className="text-center mt-3 small">
                    <span className="text-muted">Vous avez Déjà un compte ?</span>
                    <Link to="/login" className="text-success fw-bold text-decoration-none">
                        Se connecter
                    </Link>
                </div>

            </div>
        </div>
    );
}