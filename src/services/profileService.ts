import api from "./api";
import type { UploadPhotoResponse, User } from "../types";

// Uploader une photo de profil
export const uploadProfilePhoto = async (file: File): Promise<UploadPhotoResponse> => {
  const formData = new FormData();
  formData.append('photo_profil', file);

  const response = await api.post("/profil/photo", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Supprimer la photo de profil
export const deleteProfilePhoto = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete("/profil/photo");
  return response.data;
};

// Récupérer les informations du profil
export const getProfile = async (): Promise<{ success: boolean; utilisateur: User }> => {
  const response = await api.get("/profil");
  return response.data;
};

// Obtenir l'URL de la photo de profil
export const getProfilePhotoUrl = (photoData: string | null): string | null => {
  if (!photoData) return null;
  
  try {
    const parsed = JSON.parse(photoData);
    if (parsed.type === 'local') {
      // En développement, utiliser l'URL relative
      const filename = parsed.url.split('/').pop();
      return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profil/photo/${filename}`;
    } else {
      // En production, utiliser l'URL Cloudinary
      return parsed.url;
    }
  } catch {
    // Si ce n'est pas du JSON, c'est probablement un chemin local direct
    if (photoData.startsWith('uploads/')) {
      const filename = photoData.split('/').pop();
      return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profil/photo/${filename}`;
    }
    // Sinon, c'est probablement une URL directe
    return photoData;
  }
};
