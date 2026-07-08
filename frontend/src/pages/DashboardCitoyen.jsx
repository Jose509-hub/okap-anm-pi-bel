import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";//Importation du navbar

export default function DashboardCitoyen() {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]); //Tableau stockant les signalements
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ÉTATS POUR LES FENÊTRES MODALES
    const [showModal, setShowModal] = useState(false); // Modal d'Ajout
    const [showEditModal, setShowEditModal] = useState(false); // Modal de Modification
    const [currentReportId, setCurrentReportId] = useState(null); // ID du signalement a  modifier

    // Champs du formulaire partagés
    const [zone, setZone] = useState('Centre-ville');
    const [adress, setAdress] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('faible');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
   


    //Chargement initial des donnees des l'affichage de la page
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

    // Ouvrir la modal de modification avec les données existantes
    const openEditModal = (report) => {
        setCurrentReportId(report.id);
        setZone(report.zone);
        setAdress(report.adress);
        setDescription(report.description);
        setUrgency(report.urgency);
        setFormError('');
        setShowEditModal(true);
    };

    const openCreateModal = () => {
        // Reinitialisation des champs du formulaire
        setZone('Centre-ville');
        setAdress('');
        setDescription('');
        setUrgency('faible');
        setFormError('');
        // Ouvrir le modal
        setShowModal(true);
    };

    // Envoi de la modification a la methode update du controleur Laravel
    const handleUpdateReport = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const response = await api.put(`/reports/${currentReportId}`, {
                zone,
                adress: adress,
                description,
                urgency
            });

            if (response.data.success) {
                setShowEditModal(false);
                setAdress('');
                setDescription('');
                setZone('Centre-ville');
                setUrgency('faible');
                setCurrentReportId(null);
                fetchMyReports(); // Recharge la liste
            }
        } catch (err) {
            setFormError(err.response?.data?.message || 'Erreur lors de la modification.');
        } finally {
            setFormLoading(false);
        }
    };

    //Suppression du signalement
    const handleDeleteReport = async (id) => {
        //Demande de confirmation
        if (window.confirm('Voulez-vous vraiment supprimer votre signalement?')) {
            try {
                //Appel a la methode destroy du controleur
                const response = await api.delete(`/reports/${id}`);
                if (response.status >=200 && response.status < 300) {
                    await fetchMyReports(); //Recharge l'ecran de signalement
                } else {
                    alert('Erreur lors de la suppression');
                }
            } catch (err) {
                alert(err.response?.data.message || "Erreur lors de la suppression.")
            }
        }
    }

    //Soumission du formulaire modal
    const handleSubmitReport = async (e) =>{
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const response = await api.post('/reports', { zone, adress, description, urgency});

            if (response.data.success) {
                //On ferme la modal
                setShowModal(false);
                //Reinitialisation des champs
                setAdress('');
                setDescription('');
                setZone('Centre-ville');
                setUrgency('faible');
                //On recharge la liste pour voir la nouvelle carte
                fetchMyReports();
            }
        } catch (err) {
            setFormError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setFormLoading(false);
        }
    };

    //Fonction traduisant le niveau d'urgence en couleur
    const getUrgencyBadge = (urgency) => {
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
            {/*Barre de Navigation haute */}
            <Navbar />

            {/*Contenu principal de la page */}
            <div className="container py-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark m-0">Mon Tableau de bord</h2>
                        <p className="text-muted small m-0">Suivi en temps réel de vos déclarations d'insalubrité</p>
                    </div>
                    {/*Bouton d'action principal */}
                    <button onClick={openCreateModal} className="btn btn-success bg-okap-green fw-bold px-3 py-2 shadow-sm">
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
                        <h4 className="fw-bold text-muted">Aucun signalement enregistré</h4>
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

                                        {/*Bouton de modification et de suppression du signalement si statut = En attente*/}
                                        {report.status === 'En attente' && (
                                            <div className="d-flex gap-2 mt-2 pt-2 border-top border-light">
                                                {/* Bouton de Modification */}
                                                <button 
                                                    onClick={() => openEditModal(report)} 
                                                    className="btn btn-outline-primary btn-sm w-50 fw-semibold"
                                                >
                                                    Modifier
                                                </button>

                                                {/* Bouton de Suppression */}
                                                <button 
                                                    onClick={() => handleDeleteReport(report.id)} 
                                                    className="btn btn-outline-danger btn-sm w-50 fw-semibold"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                            
                                        )}

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

            {/*Code Modal Bootstrap*/}
            {showModal && (
                <>
                    {/*Fenetre de la Modal */}
                    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px'}}>
                                <div className="modal-header bg-light border-0 pt-4 px-4">
                                    <h5 className="modal-title fw-bold text-okap-green">Déclarer une zone à nettoyer</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <form onSubmit={handleSubmitReport}>
                                    <div className="modal-body px-4">
                                        {formError && <div className="alert alert-danger p-2 small text-center">{formError}</div>}

                                        {/*Selecteur de quartier */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small">Quartier du Cap-Haïtien</label>
                                            <select className="form-select" value={zone || ''} onChange={(e) => setZone(e.target.value)} required>
                                                <option value="Centre-ville">Centre-ville</option>
                                                <option value="Petite Anse">Petite Anse</option>
                                                <option value="Vertières">Vertières</option>
                                                <option value="Haut du Cap">Haut du Cap</option>
                                            </select>
                                        </div>
                                        
                                        {/*Repere physique */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small">Adresse précise ou Repères physiques</label>
                                            <input type="text" className="form-control" placeholder="Ex: Rue 18 B, en face de la pharmacie" value={adress || ''} onChange={(e) => setAdress(e.target.value)} required />
                                        </div>
                                        {/*Description */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small">Description de la situation</label>
                                            <textarea className="form-control" rows="3" placeholder="Ex: Accumulation de sacs plastiques blocant le caniveau..." value={description || ''} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                        </div>

                                        {/*Urgence */}
                                        <div className="mb-2">
                                            <label className="form-label fw-semibold small block">Niveau d'urgence estimé</label>
                                            <div className="d-flex gap-4 mt-1">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="modalUrgency" id="mFaible" value="faible" checked={urgency === 'faible'} onChange={(e) => setUrgency(e.target.value)} />
                                                    <label className="form-check-label small" htmlFor="mFaible">Faible</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="modalUrgency" id="mMoyen" value="moyen" checked={urgency === 'moyen'} onChange={(e) => setUrgency(e.target.value)} />
                                                    <label  className="form-check-label small" htmlFor="mMoyen">Moyen</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="modalUrgency" id="mCritique" value="critique" checked={urgency === 'critique'} onChange={(e) => setUrgency(e.target.value)} />
                                                    <label  className="form-check-label small text-danger fw-bold" htmlFor="mCritique">Critique</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer border-0 pb-4 px-4 gap-2">
                                        <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Annuler</button>
                                        <button type="submit" className="btn btn-success bg-okap-green fw-bold px-4" disabled={formLoading}>
                                            {formLoading ? <span className="spinner-border spinner-border-sm"></span> : "Soumettre l'alerte"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Fenetre de modification */}
            {showEditModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px'}}>
                            <div className="modal-header bg-light border-0 pt-4 px-4">
                                <h5 className="modal-title fw-bold text-okap-green">Modifier mon signalement</h5>
                                <button type="button" className="btn-close" onClick={()=> setShowEditModal(false)}></button>
                            </div>

                            <form onSubmit={handleUpdateReport}>
                                <div className="modal-body px-4">
                                    {formError && <div className="alert alert-danger p-2 small text-center>">{formError}</div>}

                                    {/*Quartier */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Quartier du Cap-Haïtien</label>
                                        <select name="form-select" value={zone} onChange={(e) => setZone(e.target.value)} required>
                                            <option value="Centre-ville">Centre-ville</option>
                                            <option value="Petite Anse">Petite Anse</option>
                                            <option value="Vertières">Vertières</option>
                                            <option value="Haut du Cap">Haut du Cap</option>
                                        </select>
                                    </div>

                                    {/*Adresse */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Adresse précise ou Repères physiques</label>
                                        <input type="text" className="form-control" value={adress} onChange={(e) => setAdress(e.target.value)} required />
                                    </div>

                                    {/*Description */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Description</label>
                                        <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                    </div>

                                    {/*Urgence */}
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold small">Niveau d'urgence</label>
                                        <div className="d-flex gap-4 mt-1">
                                            {['faible', 'moyen', 'critique'].map((level) =>(
                                                <div className="form-check" key={level}>
                                                    <input className="form-check-input" type="radio" name="editUrgency" value={level} checked={urgency === level} onChange={(e) => setUrgency(e.target.value)} />
                                                    <label className="form-check-label small text-capitalize">{level}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 pb-4 px-4 gap-2">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowEditModal(false)}>Annuler</button>
                                    <button type="button" className="btn btn-success bg-okap-green fw-bold px-4" onClick={handleUpdateReport} disabled={formLoading}>
                                        {formLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Mettre à jour'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/*Footer */}
            <footer className="bg-dark text-white-50 text-center py-3 mt-auto small border-top border-secondary">
                <div className="container">
                    &copy; {new Date().getFullYear()} Mairie du cap-Haitien &middot; Okap anm pi bèl &middot; Service d'Assainissement
                </div>
            </footer>
        </div>
    );
}