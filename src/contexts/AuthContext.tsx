import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getProfile } from '../services/authService';
import { testCookies } from '../utils/cookieUtils';
import { usePersistentAuth } from '../hooks/usePersistentAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Utiliser le hook de persistance pour gérer l'état
  const {
    user,
    token,
    isAuthenticated,
    login: persistentLogin,
    logout: persistentLogout,
    updateUser: persistentUpdateUser,
    saveUser,
    clearAuth,
    forceSync
  } = usePersistentAuth();

  // Vérifier le statut d'authentification au chargement
  const checkAuthStatus = async () => {

    
    // Si on a déjà les données en mémoire, on peut les utiliser immédiatement
    if (user && token) {

      
      // Optionnel : vérifier avec l'API si le token est toujours valide
      // Mais préserver les données locales
      try {
        const serverUserData = await getProfile();
        
        // Fusionner les données : priorité aux données locales pour la photo de profil
        const mergedUserData: User = {
          ...serverUserData,
          // Préserver la photo de profil locale si elle existe
          photo_profil: user.photo_profil || serverUserData.photo_profil
        };
        
        // Ne sauvegarder que si les données ont vraiment changé
        if (JSON.stringify(mergedUserData) !== JSON.stringify(user)) {
          saveUser(mergedUserData);
        }
        
        // Forcer la synchronisation pour s'assurer que les données sont persistées
        forceSync();
      } catch (error) {
        // Ne pas nettoyer les données locales en cas d'erreur réseau
        // Les données locales restent valides
        
        // Forcer la synchronisation même en cas d'erreur
        forceSync();
      }
      setIsLoading(false);
      return;
    }
    
    // Vérifier si le token est présent
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    if (token && user) {
      try {
        const serverUserData = await getProfile();
        
        // Fusionner les données : priorité aux données locales pour la photo de profil
        const mergedUserData: User = {
          ...serverUserData,
          photo_profil: user.photo_profil || serverUserData.photo_profil
        };
        
        saveUser(mergedUserData);
      } catch (error) {
        // Ne pas nettoyer les données locales en cas d'erreur réseau
      }
    } else if (token && !user) {
      // Token présent mais pas de données utilisateur, essayer de les récupérer
      try {
        const userData = await getProfile();
        saveUser(userData);
      } catch (error) {
        clearAuth();
      }
    }
    setIsLoading(false);
  };

  // Effet pour vérifier l'authentification au chargement uniquement
  useEffect(() => {
    testCookies(); // Test des cookies au chargement
    checkAuthStatus();
  }, []); // Pas de dépendances pour éviter les boucles infinies

  // Effet pour synchroniser l'état quand les données changent (avec debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && token) {
        forceSync();
      }
    }, 100); // Debounce de 100ms

    return () => clearTimeout(timeoutId);
  }, [user?.id, token, forceSync]); // Seulement sur les changements importants

  const login = (userData: User, userToken: string) => {
    persistentLogin(userData, userToken);
  };

  const logout = () => {
    persistentLogout();
  };

  const updateUser = (userData: User) => {
    persistentUpdateUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      isLoading,
      login, 
      logout, 
      updateUser,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};