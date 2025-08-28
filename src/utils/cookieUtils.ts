// Utilitaires pour gérer les cookies
export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Configuration plus robuste des cookies
  const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  
  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
};

// Interface pour les données utilisateur
export interface UserData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photo_profil?: string;
  theme?: 'light' | 'dark';
}

// Constantes pour les noms des cookies
const USER_DATA_COOKIE = 'moneywise_user_data';
const USER_TOKEN_COOKIE = 'moneywise_token';

// Fonctions spécifiques pour les données utilisateur
export const saveUserDataToCookie = (userData: UserData) => {
  try {
    const userDataString = JSON.stringify(userData);
    setCookie(USER_DATA_COOKIE, userDataString, 30); // 30 jours
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

export const getUserDataFromCookie = (): UserData | null => {
  try {
    const userDataString = getCookie(USER_DATA_COOKIE);
    if (!userDataString) {
      return null;
    }
    
    const userData: UserData = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    return null;
  }
};

export const saveTokenToCookie = (token: string) => {
  try {
    setCookie(USER_TOKEN_COOKIE, token, 30); // 30 jours
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

export const getTokenFromCookie = (): string | null => {
  try {
    const token = getCookie(USER_TOKEN_COOKIE);
    if (!token) {
      return null;
    }
    
    return token;
  } catch (error) {
    return null;
  }
};

export const clearUserCookies = () => {
  try {
    deleteCookie(USER_DATA_COOKIE);
    deleteCookie(USER_TOKEN_COOKIE);
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

export const updateUserDataInCookie = (updates: Partial<UserData>) => {
  try {
    const currentData = getUserDataFromCookie();
    if (!currentData) {
      return;
    }
    
    const updatedData = { ...currentData, ...updates };
    saveUserDataToCookie(updatedData);
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

// Fonction pour vérifier si les cookies utilisateur existent
export const hasUserCookies = (): boolean => {
  const userData = getCookie(USER_DATA_COOKIE);
  const token = getCookie(USER_TOKEN_COOKIE);
  return !!(userData && token);
};

// Fonction pour synchroniser les cookies avec localStorage
export const syncCookiesWithLocalStorage = () => {
  try {
    // Récupérer les données depuis localStorage
    const localStorageUser = localStorage.getItem('user');
    const localStorageToken = localStorage.getItem('token');
    
    if (localStorageUser && localStorageToken) {
      const userData = JSON.parse(localStorageUser);
      saveUserDataToCookie(userData);
      saveTokenToCookie(localStorageToken);
    }
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

// Fonction pour synchroniser localStorage avec les cookies
export const syncLocalStorageWithCookies = () => {
  try {
    const userData = getUserDataFromCookie();
    const token = getTokenFromCookie();
    
    if (userData && token) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    }
  } catch (error) {
    // Gestion silencieuse de l'erreur
  }
};

// Fonction de test pour vérifier les cookies
export const testCookies = () => {
  // Fonction de test silencieuse
};
