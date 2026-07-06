import axios from 'axios';

//Creation de l'instance d'axios
const api = axios.create({
    //Url de base
    baseURL: 'http://localhost:8000/api',

    //En-tete pour indiquer le json au serveur
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    //Authentification par session
    //On force Axios a envoyer et accepter les cookies a chaque requete
    withCredentials: true,
});

//Recuperation du cookie CSRF
const csrfApi = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

// Intercepteur pour ajouter X-XSRF-TOKEN à chaque requête de l'instance api
api.interceptors.request.use(config => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));
    if (cookieValue) {
        const token = cookieValue.split('=')[1];
        // Décodage URL obligatoire (le cookie est encodé)
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        console.log('Token CSRF injecté :', token.substring(0, 20) + '...');
    } else {
        console.warn('Cookie XSRF-TOKEN introuvable');
    }
    return config;
});

export default api;
export {csrfApi};