import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { login as loginService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { LoginErrorResponse } from "../types";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Réinitialiser l'état d'erreur quand l'utilisateur modifie les champs
    if (emailNotVerified) {
      setEmailNotVerified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setEmailNotVerified(false);

    try {
      const { utilisateur, token, message } = await loginService(formData);
      login(utilisateur, token);
      toast.success(message || "Connexion réussie !");
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          // Email non vérifié
          const errorData = err.response.data as LoginErrorResponse;
          if (errorData.emailNonVerifie) {
            setEmailNotVerified(true);
            toast.error("Veuillez vérifier votre email avant de vous connecter.");
            return;
          }
        }
        
        const errorMessage = err.response?.data?.message || 
          `Erreur ${err.response?.status}: Le serveur a répondu avec une erreur.`;
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Une erreur inattendue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
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
            <h3 className="text-2xl font-bold sm:text-3xl">
              Connectez-vous à votre compte
            </h3>
            <p className="mt-2">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
        
        {emailNotVerified && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm mb-3">
              Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Rediriger vers la page de renvoi de vérification
                  navigate("/verify-email", { 
                    state: { email: formData.email, fromLogin: true } 
                  });
                }}
                className="w-full px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Renvoyer l'email de vérification
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-center text-primary hover:text-primary-hover"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;