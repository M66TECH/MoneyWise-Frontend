import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { register } from "../services/authService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import RegisterPhotoUpload from "../components/RegisterPhotoUpload";
import type { RegisterData } from "../types";

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      // Extraire seulement les champs nécessaires pour l'API
      const { confirmPassword, ...registerData } = formData;
      
      // Inscription avec ou sans photo de profil
      const response = await register(registerData, profilePhoto || undefined);
      toast.success(response.message || "Inscription réussie !");
      
      setTimeout(() => {
        navigate("/login");
      }, 4000); // Laisser le temps de voir le toast
    } catch (err) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      if (err instanceof AxiosError) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Erreur ${err.response.status}: Le serveur a répondu avec une erreur.`;
        } else if (err.request) {
          errorMessage =
            "Le serveur ne répond pas. Vérifiez votre connexion ou la configuration CORS du serveur.";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
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
          </div>
          <div>
            <label className="font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label className="font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;