import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { login as loginService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
import type { LoginErrorResponse } from "../types";
import EmailValidator from "../components/EmailValidator";
import ErrorMessage from "../components/ErrorMessage";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Afficher le message de succès si reçu depuis la page d'inscription
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Nettoyer l'état de navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Réinitialiser l'état d'erreur quand l'utilisateur modifie les champs
    if (emailNotVerified) {
      setEmailNotVerified(false);
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérifier la validité de l'email avant de soumettre
    if (!isEmailValid) {
      setError("Veuillez corriger le format de l'email avant de continuer.");
      return;
    }
    
    setLoading(true);
    setEmailNotVerified(false);
    setError(null);

    try {
      const { utilisateur, token } = await loginService(formData);
      login(utilisateur, token);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          // Email non vérifié
          const errorData = err.response.data as LoginErrorResponse;
          if (errorData.emailNonVerifie) {
            setEmailNotVerified(true);
            return;
          }
        }
        
        if (err.response?.status === 401) {
          setError("Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.");
        } else if (err.response?.status === 400) {
          setError("Veuillez remplir tous les champs requis.");
        } else if (err.response?.status === 500) {
          setError("Erreur serveur. Veuillez réessayer plus tard.");
        } else if (err.request) {
          setError("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
        } else {
          // Traduire les messages d'erreur courants du backend
          const backendMessage = err.response?.data?.message || "";
          let translatedMessage = "Une erreur s'est produite lors de la connexion.";
          
          if (backendMessage.includes("Invalid credentials")) {
            translatedMessage = "Email ou mot de passe incorrect.";
          } else if (backendMessage.includes("User not found")) {
            translatedMessage = "Aucun compte trouvé avec cet email.";
          } else if (backendMessage.includes("Email not verified")) {
            translatedMessage = "Votre email n'est pas encore vérifié.";
          } else if (backendMessage.includes("Invalid email")) {
            translatedMessage = "Format d'email invalide.";
          } else if (backendMessage.includes("Password required")) {
            translatedMessage = "Le mot de passe est requis.";
          } else if (backendMessage.includes("Email required")) {
            translatedMessage = "L'email est requis.";
          } else if (backendMessage && backendMessage.trim() !== "") {
            translatedMessage = backendMessage;
          }
          
          setError(translatedMessage);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite.");
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
        
        {/* Messages d'erreur et de succès */}
        {error && (
          <ErrorMessage 
            message={error} 
            type="error" 
            onClose={() => setError(null)}
            className="mt-4"
          />
        )}
        
        {successMessage && (
          <ErrorMessage 
            message={successMessage} 
            type="info" 
            onClose={() => setSuccessMessage(null)}
            className="mt-4"
          />
        )}

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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
            disabled={loading || !isEmailValid}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;