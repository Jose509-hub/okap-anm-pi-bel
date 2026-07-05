import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import DashboardCitoyen from './pages/DashboardCitoyen';
import DashboardAgent from './pages/DashboardAgent';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Route publique : Connexion */}
        <Route path="/login" element={!user ? <Login /> : (user.role === 'agent' ? <Navigate to="/agent/dashboard" /> : <Navigate to="/citoyen/dashboard" />)} />

        {/*Routes privees securisees selon le role */}
        <Route path="/citoyen/dashboard" element={user && user.role === 'citoyen' ? <DashboardCitoyen /> : <Navigate to="/login" /> } />
        <Route path="/agent/dashboard" element={user && user.role === 'agent' ? <DashboardAgent /> : <Navigate to="/login" />} />

        {/*Redirection automatique par defaut */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}