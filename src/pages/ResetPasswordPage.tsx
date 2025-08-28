import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Lock } from "lucide-react";
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
  const [resetStatus, setResetStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const navigate = useNavigate();

  const token = searchParams.get('token');

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

    if (formData.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const { message } = await resetPassword({
        token,
        newPassword: formData.newPassword,
      });
      setResetStatus('success');
      toast.success(message || "Mot de passe réinitialisé avec succès !");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setResetStatus('error');
      let errorMessage = "Erreur lors de la réinitialisation du mot de passe.";
      if (err instanceof AxiosError) {
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!token) {
      return (
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Token invalide</h3>
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
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
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
              placeholder="Confirmez votre mot de passe"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
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