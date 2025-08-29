import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { register } from "../services/authService";
import { AxiosError } from "axios";
import RegisterPhotoUpload from "../components/RegisterPhotoUpload";
import type { RegisterData } from "../types";
import EmailValidator from "../components/EmailValidator";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import ErrorMessage from "../components/ErrorMessage";

// Type local pour le formulaire d'inscription
interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Vérifier si les mots de passe correspondent
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      const newPassword = e.target.name === 'password' ? e.target.value : formData.password;
      const newConfirmPassword = e.target.name === 'confirmPassword' ? e.target.value : formData.confirmPassword;
      setPasswordsMatch(newPassword === newConfirmPassword);
    }
    
    // Réinitialiser l'erreur quand l'utilisateur modifie les champs
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérifications avant soumission
    if (!isEmailValid) {
      setError("Veuillez corriger le format de l'email avant de continuer.");
      return;
    }
    
    if (!isPasswordStrong) {
      setError("Votre mot de passe ne respecte pas les critères de sécurité requis.");
      return;
    }
    
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Extraire seulement les champs nécessaires pour l'API
      const { confirmPassword, ...registerData } = formData;
      
      // Inscription avec ou sans photo de profil
      const response = await register(registerData, profilePhoto || undefined);
      
      // Rediriger vers la page de connexion avec un message de succès
      navigate("/login", { 
        state: { 
          message: response.message || "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte." 
        } 
      });
    } catch (err) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          errorMessage = "Veuillez remplir tous les champs requis correctement.";
        } else if (err.response?.status === 409) {
          errorMessage = "Un compte avec cet email existe déjà.";
        } else if (err.response?.status === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
        } else if (err.request) {
          errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
                 } else {
           // Traduire les messages d'erreur courants du backend
           const backendMessage = err.response?.data?.message || "";
           let translatedMessage = "Une erreur s'est produite lors de l'inscription.";
           
           if (backendMessage.includes("Email already exists")) {
             translatedMessage = "Un compte avec cet email existe déjà.";
           } else if (backendMessage.includes("Invalid email")) {
             translatedMessage = "Format d'email invalide.";
           } else if (backendMessage.includes("Password too short")) {
             translatedMessage = "Le mot de passe doit contenir au moins 6 caractères.";
           } else if (backendMessage.includes("First name required")) {
             translatedMessage = "Le prénom est requis.";
           } else if (backendMessage.includes("Last name required")) {
             translatedMessage = "Le nom est requis.";
           } else if (backendMessage.includes("Email required")) {
             translatedMessage = "L'email est requis.";
           } else if (backendMessage.includes("Password required")) {
             translatedMessage = "Le mot de passe est requis.";
           } else if (backendMessage.includes("Invalid file type")) {
             translatedMessage = "Type de fichier non supporté pour la photo de profil.";
           } else if (backendMessage.includes("File too large")) {
             translatedMessage = "La photo de profil est trop volumineuse.";
           } else if (backendMessage && backendMessage.trim() !== "") {
             translatedMessage = backendMessage;
           }
           
           errorMessage = translatedMessage;
         }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (file: File | null) => {
    setProfilePhoto(file);
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-background relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-x-2 text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à l'accueil
      </Link>
      <div className="max-w-sm w-full text-text-primary">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-text-primary">
            MoneyWise
          </Link>
          <div className="mt-5">
            <h3 className="text-2xl font-bold sm:text-3xl">Créez votre compte</h3>
            <p className="mt-2">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
        
        {/* Messages d'erreur */}
        {error && (
          <ErrorMessage 
            message={error} 
            type="error" 
            onClose={() => setError(null)}
            className="mt-4"
          />
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Section Photo de Profil */}
          <div className="text-center">
            <label className="font-medium text-text-primary mb-4 block">Photo de Profil</label>
            <RegisterPhotoUpload onPhotoSelect={handlePhotoSelect} />
          </div>
          
          <div className="flex gap-x-4">
            <div className="w-1/2">
              <label className="font-medium">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="font-medium">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
            />
            <EmailValidator 
              email={formData.email} 
              onValidationChange={setIsEmailValid}
            />
          </div>
          <div>
            <label className="font-medium">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-2 px-3 py-2 pr-10 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                placeholder="Créez un mot de passe sécurisé"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <PasswordStrengthIndicator 
              password={formData.password} 
              onStrengthChange={setIsPasswordStrong}
              className="mt-2"
            />
          </div>
          <div>
            <label className="font-medium">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full mt-2 px-3 py-2 pr-10 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                <span>Les mots de passe ne correspondent pas</span>
              </div>
            )}
            {formData.confirmPassword && passwordsMatch && formData.password && (
              <div className="mt-1 text-sm text-green-600 flex items-center gap-1">
                <span>✅</span>
                <span>Les mots de passe correspondent</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !isEmailValid || !isPasswordStrong || !passwordsMatch}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;