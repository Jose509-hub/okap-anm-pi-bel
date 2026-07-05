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

export default api;