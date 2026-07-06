import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api, { csrfApi } from "../services/api";
import { Link } from "react-router-dom";

export default function Login() {
    //Les etats locaux pour capturer les saisies de l'utilisateur
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    //Recuperation de la fonction connexion du context global
    const { loginUser  } = useContext(AuthContext);

    //Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            //Recuperation du cookie CSRF
            await csrfApi.get('/sanctum/csrf-cookie');

            //Envoie de la tentative de connexion
            const response = await api.post('/login', { email, password});

            if (response.data.success) {
                //Si succes on met a jour le context global avec les info recues
                loginUser(response.data.user);
            }
        }catch(err) {
            //Capture des erreurs
            setError(err.response?.data.message || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-okap-green m-0">Okap anm pi bèl</h2>
                    <small className="text-muted">Gestion de l'Assainissement Urbain</small>
                </div>

                {/*Affichage d'une alerte rouge su une erreur survient */}
                {error && <div className="alert alert-danger p-2 text-center small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/*champ Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Adresse Email</label>
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="exemple@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/*Champ mot de passe */}
                    <div className="mb-4">
                        <label className="form-label fw-semibol small">Mot de passe</label>
                        <input 
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/*Bouton de validation  */}
                    <button
                        type="submit"
                        className="btn btn-success bg-okap-green w-100 fw-bold py-2"
                        disabled={loading}
                    >
                        {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                    ) : 'Se connecter'}

                    </button>
                </form>
                <div className="text-center mt-3 small">
                    <span className="text-muted">Pas encore inscrit ? </span>
                    <Link to="/register" className="text-success fw-bold text-decoration-none">
                        Créer un compte
                    </Link>
                </div>

            </div>
        </div>
    );
}