import { useState, useRef } from 'react';
import { Camera, X, Upload, User } from 'lucide-react';
import { uploadProfilePhoto, deleteProfilePhoto, getProfilePhotoUrl } from '../services/profileService';
import type { User as UserType } from '../types';
import toast from 'react-hot-toast';

interface ProfilePhotoUploadProps {
  user: UserType;
  onPhotoUpdate: (user: UserType) => void;
}

const ProfilePhotoUpload = ({ user, onPhotoUpdate }: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoUrl = getProfilePhotoUrl(user.photo_profil || null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Uploader le fichier
    uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadProfilePhoto(file);
      
      if (response.success) {
        // Mettre à jour l'utilisateur avec les nouvelles données
        const updatedUser = {
          ...user,
          photo_profil: JSON.stringify(response.photo_profil)
        };
        onPhotoUpdate(updatedUser);
        toast.success(response.message || 'Photo de profil mise à jour avec succès !');
        setPreviewUrl(null);
      } else {
        toast.error(response.message || 'Erreur lors de l\'upload de la photo');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload de la photo de profil');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoUrl) return;

    setIsDeleting(true);
    try {
      const response = await deleteProfilePhoto();
      
      if (response.success) {
        // Mettre à jour l'utilisateur en supprimant la photo
        const updatedUser = {
          ...user,
          photo_profil: null
        };
        onPhotoUpdate(updatedUser);
        toast.success(response.message || 'Photo de profil supprimée avec succès !');
      } else {
        toast.error(response.message || 'Erreur lors de la suppression de la photo');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de la photo de profil');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || photoUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo de profil */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-background-surface border-2 border-border flex items-center justify-center">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-text-secondary" />
          )}
        </div>

        {/* Overlay avec options */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={handleClickUpload}
              disabled={isUploading}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50"
              title="Changer la photo"
            >
              <Camera size={16} />
            </button>
            {photoUrl && (
              <button
                onClick={handleDeletePhoto}
                disabled={isDeleting}
                className="p-2 bg-negative text-white rounded-full hover:bg-negative-hover transition-colors disabled:opacity-50"
                title="Supprimer la photo"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Indicateur de chargement */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Bouton d'upload alternatif */}
      <div className="flex space-x-2">
        <button
          onClick={handleClickUpload}
          disabled={isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          <span>{photoUrl ? 'Changer la photo' : 'Ajouter une photo'}</span>
        </button>
        
        {photoUrl && (
          <button
            onClick={handleDeletePhoto}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-4 py-2 bg-negative text-white rounded-lg hover:bg-negative-hover transition-colors disabled:opacity-50"
          >
            <X size={16} />
            <span>Supprimer</span>
          </button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Informations */}
      <div className="text-center text-sm text-text-secondary">
        <p>Formats supportés : JPG, PNG, GIF</p>
        <p>Taille maximale : 5MB</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
