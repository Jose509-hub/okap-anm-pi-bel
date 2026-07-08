import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function DashboardAgent() {
  const [reports, setReports] = useState([]); // Contient tous les signalements
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(null); // Piste quelle ligne est en cours de modification

  // Chargement automatique de tous les signalements de la mairie au démarrage
  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports'); // Appel de la logique Agent du controleur
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (err) {
      setError('Impossible de charger la liste globale des signalements.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Mise a jour du statut via la methode update du controleur Laravel
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdateLoading(id); // Activation d'un mini-chargement sur cette ligne precise
      
      // Appel PUT vers l'API Laravel
      const response = await api.put(`/reports/${id}`, { status: newStatus });
      
      if (response.data.success) {
        fetchAllReports(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdateLoading(null);
    }
  };

  // Fonctions de styles Bootstrap pour le tableau
  const getUrgencyClass = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critique': return 'text-danger fw-bold';
      case 'moyen': return 'text-warning bg-dark px-2 rounded';
      default: return 'text-secondary';
    }
  };

  const getStatusRowClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'Traité': return 'table-success-light';
      case 'En cours': return 'table-warning-light';
      default: return '';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="container-fluid py-4 flex-grow-1 px-md-5">
        <div className="mb-4">
          <h2 className="fw-bold text-dark m-0">Espace Administration & Logistique</h2>
          <p className="text-muted small m-0">Gestion globale des interventions d'assainissement de la commune du Cap-Haïtien</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 small">Chargement du registre municipal...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="card text-center p-5 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
            <div className="my-3 fs-1">🧹</div>
            <h4 className="fw-bold text-muted">Aucun signalement en cours dans la commune</h4>
            <p className="text-muted small">La ville est parfaitement propre. Félicitations aux équipes d'entretien.</p>
          </div>
        ) : (
          //Tableau avec les informations
          <div className="card shadow-sm border-0 bg-white" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="ps-4">Date</th>
                    <th scope="col">Citoyen (Auteur)</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Quartier / Zone</th>
                    <th scope="col">Adresse Précise</th>
                    <th scope="col" style={{ maxWidth: '250px' }}>Description du problème</th>
                    <th scope="col">Urgence</th>
                    <th scope="col" className="pe-4 text-center" style={{ width: '180px' }}>Statut / Action Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className={getStatusRowClass(report.status)}>
                      <td className="ps-4 font-monospace small">
                        {new Date(report.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      {/* on affiche les donnees du citoyen auteur ! */}
                      <td className="fw-semibold text-capitalize text-dark">
                        {report.user?.name || 'Citoyen Anonyme'}
                      </td>
                      <td className="small text-muted font-monospace">
                        {report.user?.phone || 'Non renseigné'}
                      </td>
                      <td className="text-capitalize fw-bold text-okap-green">
                        {report.zone}
                      </td>
                      <td className="small text-secondary">
                            {report.adress}
                      </td>
                      <td className="small text-secondary text-truncate" style={{ maxWidth: '250px' }} title={report.description}>
                        {report.description}
                      </td>
                      <td className={`small text-uppercase ${getUrgencyClass(report.urgency)}`}>
                        {report.urgency}
                      </td>
                      
                      {/* Selecteur de statut dynamique */}
                      <td className="pe-4 text-center">
                        {updateLoading === report.id ? (
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        ) : (
                          <select 
                            className={`form-select form-select-sm fw-bold ${
                              report.status === 'Traité' ? 'border-success text-success bg-success-light' : 
                              report.status === 'En cours' ? 'border-warning text-warning bg-warning-light' : 'border-danger text-danger'
                            }`}
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value)} // Declenche la mise a jour 
                          >
                            <option value="En attente" className="text-danger fw-bold">En attente</option>
                            <option value="En cours" className="text-warning fw-bold">En cours</option>
                            <option value="Traité" className="text-success fw-bold">Traité</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-dark text-white-50 text-center py-3 mt-auto small border-top border-secondary">
        <div className="container">
          &copy; {new Date().getFullYear()} Mairie du Cap-Haitien &middot; Okap anm pi bèl &middot; Registre de Supervision
        </div>
      </footer>
    </div>
  );
}
