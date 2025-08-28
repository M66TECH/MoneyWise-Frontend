import { useState, useRef } from 'react';
import { Camera, X, Upload, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterPhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
}

const RegisterPhotoUpload = ({ onPhotoSelect }: RegisterPhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    onPhotoSelect(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo de profil */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-background-surface border-2 border-border flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={32} className="text-text-secondary" />
          )}
        </div>

        {/* Overlay avec options */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleClickUpload}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
              title="Ajouter une photo"
            >
              <Camera size={14} />
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 bg-negative text-white rounded-full hover:bg-negative-hover transition-colors"
                title="Supprimer la photo"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bouton d'upload alternatif */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleClickUpload}
          className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          <Upload size={14} />
          <span>{previewUrl ? 'Changer la photo' : 'Ajouter une photo'}</span>
        </button>
        
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="flex items-center space-x-2 px-3 py-1.5 bg-negative text-white rounded-lg hover:bg-negative-hover transition-colors text-sm"
          >
            <X size={14} />
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
      <div className="text-center text-xs text-text-secondary">
        <p>Formats supportés : JPG, PNG, GIF</p>
        <p>Taille maximale : 5MB</p>
        <p className="text-primary">Optionnel</p>
      </div>
    </div>
  );
};

export default RegisterPhotoUpload;
