import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";//Importation du navbar

export default function DashboardCitoyen() {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]); //Tableau stockant les signalements
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //Chargement automatique des donnees des l'affichage de la page
    useEffect(() =>{
        fetchMyReports();
    }, []);

    const fetchMyReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reports');//Appel de la methode index du controller
            if (response.data.success) {
                setReports(response.data.reports);
            }
        } catch (err) {
            setError('Impossible de récupérer vos signalements pour le moment.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //Fonction traduisant le niveau d'urgence en couleur
    const getUrgenycBadge = (urgency) => {
        switch (urgency) {
            case 'critique': return 'bg-danger';
            case 'moyen': return 'bg-warning text dark';
            default: return 'bg-secondary';
        }
    };

    //Fonction appliquant la classe de statut personnalise
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'En cours': return 'statut-encours';
            case 'Traité': return 'status-traite';
            default: return 'status-attente';
        }
    };
    
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/*Barre de vaigation haute */}
            <Navbar />

            {/*Contenu principal de la page */}
            <div className="container py-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark m-0">Mon Tableau de bord</h2>
                        <p className="text-muted small m-0">Suivi en temps réel de vos déclarations d'insalubrité</p>
                    </div>
                    {/*Bouton d'action principal */}
                    <button className="btn btn-success bg-okap-green fw-bold px-3 py-2 shadow-sm">
                        + Déclarer une zone à nettoyer
                    </button>
                </div>

                {/*Gestion des affichages d'etats */}
                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-success" role="status"></div>
                            <p className="text-muted mt-2 small">Chargement de vos données... </p>
                    </div>
                ) : reports.length === 0 ? (
                    //Affichage si la bd ne contient aucun signalement
                    <div className="card text-center p-5 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
                        <div className="my-3 fs-1">🌱</div>
                        <h4 className="fw-bold text-muted">Auncun signalement enregistré</h4>
                        <p className="text-muted small">Merci de contribuer à rendre la ville du Cap-Haitien plus propre. Cliquez sur le bouton ci-dessus pour faire votre première alerte</p>
                    </div>
                ) : (
                    //Grille de cartes
                    <div className="row g-3">
                        {reports.map((report) => (
                            <div key={report.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card-h-100 shadow-sm border-0 bg-white" style={{ borderRadius: '12px'}}>
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="fw-bold text-okap-green m-0 text-capitalize">{report.zone}</h5>
                                                {/*Niveau d'urgence */}
                                                <span className="{`badge ${getUrgencyBadge(report.urgency)} text-uppercase`}">
                                                    {report.urgency}
                                                </span>
                                            </div>
                                            <p className="text-muted small fw-semibold mb-2"> {report.adress}</p>
                                            <p className="card-text text-secondary small bg-light p-2 rounded" style={{minHeight: '60px'}}>
                                                {report.description}
                                            </p>
                                        </div>
                                        {/*Pied de la carte avec affichage du statut et date */}
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                            <span className="{`badge px-3 py-2 ${getStatusBadgeClass(report.status)} text-capitalize`}">
                                                {report.status}
                                            </span>
                                            <small className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                                                {new Date(report.created_at).toLocaleDateString('fr-FR')}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> 
                
                )}
            </div>
            {/*Footer */}
            <footer className="bg-dark text-white-50 text-center py-3 mt-auto small border-top border-secondary">
                <div className="container">
                    &copy; {new Date().getFullYear()} Mairie du cap-Haitien &middot; Okap anm pi bèl &middot; Service d'Assainissement
                </div>
            </footer>
        </div>
    );
}