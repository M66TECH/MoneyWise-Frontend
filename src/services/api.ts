import axios from "axios";

// Configuration de l'API - utiliser l'URL Render par défaut
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "https://moneywise-backend-187q.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si l'erreur est 401 (non autorisé), nettoyer le localStorage
    if (error.response?.status === 401) {
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de connexion si on n'y est pas déjà
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;