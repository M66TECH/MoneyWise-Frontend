import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { 
  getCookie, 
  deleteCookie,
  saveUserDataToCookie,
  getUserDataFromCookie,
  saveTokenToCookie,
  getTokenFromCookie,
  clearUserCookies
} from '../utils/cookieUtils';

// Hook pour gérer la persistance des données d'authentification
export const usePersistentAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Essayer d'abord les cookies spécialisés, puis génériques, puis localStorage
      const cookieUser = getUserDataFromCookie();
      const cookieToken = getTokenFromCookie();
      const genericCookieUser = getCookie('user');
      const genericCookieToken = getCookie('token');
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      

      
      // Priorité aux cookies spécialisés, puis génériques, puis localStorage
      let userData = null;
      let tokenData = null;
      
      if (cookieUser && cookieToken) {
        userData = cookieUser;
        tokenData = cookieToken;
      } else if (genericCookieUser && genericCookieToken) {
        userData = JSON.parse(genericCookieUser);
        tokenData = genericCookieToken;
      } else if (storedUser && storedToken) {
        userData = JSON.parse(storedUser);
        tokenData = storedToken;
      }
      
      if (!userData || !tokenData) {
        return null;
      }
      
      return userData;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    // Essayer d'abord les cookies spécialisés, puis génériques, puis localStorage
    const cookieToken = getTokenFromCookie();
    const genericCookieToken = getCookie('token');
    const storedToken = localStorage.getItem('token');
    
    const tokenData = cookieToken || genericCookieToken || storedToken;
    return tokenData;
  });

  // Sauvegarder les données utilisateur
  const saveUser = useCallback((userData: User) => {
    try {
      // Éviter les sauvegardes inutiles
      if (JSON.stringify(userData) === JSON.stringify(user)) {
        return;
      }
      

      
      // Sauvegarder dans localStorage ET cookies spécialisés
      localStorage.setItem('user', JSON.stringify(userData));
      saveUserDataToCookie({
        id: userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        photo_profil: userData.photo_profil || undefined
      });
      
      setUser(userData);
    } catch (error) {
      // Gestion silencieuse de l'erreur
    }
  }, [user]);

  // Sauvegarder le token
  const saveToken = useCallback((userToken: string) => {
    try {
      // Éviter les sauvegardes inutiles
      if (userToken === token) {
        return;
      }
      

      
      // Sauvegarder dans localStorage ET cookies spécialisés
      localStorage.setItem('token', userToken);
      saveTokenToCookie(userToken);
      
      setToken(userToken);
    } catch (error) {
      // Gestion silencieuse de l'erreur
    }
  }, [token]);

  // Nettoyer toutes les données
  const clearAuth = useCallback(() => {
    try {
      // Nettoyer localStorage ET cookies
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      deleteCookie('token');
      deleteCookie('user');
      clearUserCookies();
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error);
    }
  }, []);

  // Connexion complète
  const login = useCallback((userData: User, userToken: string) => {
    saveToken(userToken);
    saveUser(userData);
  }, [saveToken, saveUser]);

  // Déconnexion
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Mise à jour de l'utilisateur
  const updateUser = useCallback((userData: User) => {
    saveUser(userData);
  }, [saveUser]);

  // Écouter les changements dans le localStorage (pour la synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Éviter les changements inutiles
      if (e.key === 'user' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          // Vérifier si l'utilisateur a vraiment changé
          if (JSON.stringify(newUser) !== JSON.stringify(user)) {
            setUser(newUser);
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation utilisateur:', error);
        }
      } else if (e.key === 'token' && e.newValue !== token) {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, token]); // Dépendances pour éviter les closures

  // Fonction pour forcer la synchronisation des données
  const forceSync = useCallback(() => {
    if (user && token) {
  
      saveUser(user);
      saveToken(token);
    }
  }, [user, token, saveUser, saveToken]);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
    saveUser,
    saveToken,
    clearAuth,
    forceSync
  };
};
