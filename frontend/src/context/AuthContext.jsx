import { createContext, useState, useEffect } from "react";

//Creation du context
export const AuthContext = createContext();

//Initialisation de l'etat avec les donnees du localStorage s'il y en a
export function AuthProvider({ children}) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('okap_user');
        return savedUser ? JSON.parse(savedUser) :null;
    });

    // Mise a jour du localStorage au changement de l'utilisateur
    useEffect(() =>{
        if (user) {
            localStorage.setItem('okap_user', JSON.stringify(user));
        }else {
            localStorage.removeItem('okap_user');
        }
    }, [user]);

    //Fonction pour connecter l'utilisateur
    const loginUser = (userData) => {
        setUser(userData);
    };

    //Fonction pour deconnecter
    const logoutUser = () => {
        setUser(null);
    }

    //On diffuse l'etat et les fonctions a toute l'appli
    return (
        <AuthContext.Provider value={{user, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    );
}