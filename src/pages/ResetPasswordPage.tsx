import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../services/authService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<'pending' | 'success' | 'error' | 'validating'>('validating');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  // Valider le token au chargement de la page
  useEffect(() => {
    if (!token) {
      setResetStatus('error');
      toast.error("Token de réinitialisation manquant ou invalide.");
      return;
    }

    // Vérifier que le token a un format valide (optionnel)
    if (token.length < 10) {
      setResetStatus('error');
      toast.error("Token de réinitialisation invalide.");
      return;
    }

    setResetStatus('pending');
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Token de réinitialisation manquant.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    // Validation de sécurité du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.");
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Réinitialisation du mot de passe...');
      console.log('🔑 Token:', token ? `${token.substring(0, 10)}...` : 'Manquant');
      
      const { message } = await resetPassword({
        token,
        newPassword: formData.newPassword,
      });
      
      console.log('✅ Mot de passe réinitialisé avec succès');
      setResetStatus('success');
      toast.success(message || "Mot de passe réinitialisé avec succès !");
      
      // Nettoyer les données sensibles
      setFormData({ newPassword: "", confirmPassword: "" });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setResetStatus('error');
      let errorMessage = "Erreur lors de la réinitialisation du mot de passe.";
      
      if (err instanceof AxiosError) {
        if (err.response) {
          
          if (err.response.status === 400) {
            errorMessage = "Token invalide ou expiré. Veuillez demander un nouveau lien.";
          } else if (err.response.status === 401) {
            errorMessage = "Token expiré. Veuillez demander un nouveau lien de réinitialisation.";
          } else if (err.response.status === 500) {
            errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = "Timeout de la requête. Vérifiez votre connexion internet.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (resetStatus === 'validating') {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Validation du lien...</h3>
          <p className="text-text-secondary">
            Vérification de la validité du lien de réinitialisation.
          </p>
        </div>
      );
    }

    if (!token) {
      return (
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Lien invalide</h3>
          <p className="text-text-secondary mb-4">
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg"
          >
            Demander un nouveau lien
          </Link>
        </div>
      );
    }

    if (resetStatus === 'success') {
      return (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-600 mb-2">Mot de passe réinitialisé !</h3>
          <p className="text-text-secondary mb-4">
            Votre mot de passe a été modifié avec succès.
          </p>
          <p className="text-sm text-text-secondary">Redirection vers la page de connexion...</p>
        </div>
      );
    }

    if (resetStatus === 'error') {
      return (
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Échec de la réinitialisation</h3>
          <p className="text-text-secondary mb-4">
            Une erreur s'est produite lors de la réinitialisation de votre mot de passe.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg"
          >
            Demander un nouveau lien
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="text-center mb-6">
          <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Réinitialiser votre mot de passe</h3>
          <p className="text-text-secondary">
            Saisissez votre nouveau mot de passe ci-dessous.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium">Nouveau mot de passe</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2 pr-10 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                placeholder="Minimum 8 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li className={formData.newPassword.length >= 8 ? "text-green-600" : "text-gray-400"}>
                  Au moins 8 caractères
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : "text-gray-400"}>
                  Une lettre minuscule
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : "text-gray-400"}>
                  Une lettre majuscule
                </li>
                <li className={/\d/.test(formData.newPassword) ? "text-green-600" : "text-gray-400"}>
                  Un chiffre
                </li>
                <li className={/[@$!%*?&]/.test(formData.newPassword) ? "text-green-600" : "text-gray-400"}>
                  Un caractère spécial (@$!%*?&)
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label className="font-medium">Confirmer le mot de passe</label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 pr-10 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">Les mots de passe ne correspondent pas</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    );
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-background relative">
        <Link
          to="/login"
          className="absolute top-8 left-8 flex items-center gap-x-2 text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à la connexion
        </Link>
        <div className="max-w-sm w-full text-text-primary">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-text-primary">
              MoneyWise
            </Link>
          </div>
          {renderContent()}
        </div>
      </main>
  );
};

export default ResetPasswordPage; 