import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Mail } from "lucide-react";
import { verifyEmail, resendVerification } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const token = searchParams.get('token');

  const handleVerification = useCallback(async (verificationToken: string) => {
    setLoading(true);
    setVerificationStatus('pending');
    
    try {
      const { utilisateur, token: authToken, message } = await verifyEmail({ token: verificationToken });
      
      // Mettre à jour l'état de vérification AVANT le login
      setVerificationStatus('success');
      toast.success(message || "Email vérifié avec succès !");
      
      // Attendre un peu avant le login pour s'assurer que le token est bien sauvegardé
      setTimeout(() => {
        // Login après avoir mis à jour l'état
        login(utilisateur, authToken);
        
        // Redirection après un délai supplémentaire
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }, 1000);
      
    } catch (err) {
      setVerificationStatus('error');
      let errorMessage = "Erreur lors de la vérification de l'email.";
      if (err instanceof AxiosError) {
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    if (token && !loading && verificationStatus === 'pending') {
      handleVerification(token);
    }
  }, [token, handleVerification, loading, verificationStatus]);

  const handleResendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez saisir votre adresse email.");
      return;
    }

    setResendLoading(true);
    try {
      const { message } = await resendVerification({ email });
      toast.success(message || "Email de vérification renvoyé !");
    } catch (err) {
      let errorMessage = "Erreur lors de l'envoi de l'email de vérification.";
      if (err instanceof AxiosError) {
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Vérification de votre email...</p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-600 mb-2">Email vérifié !</h3>
          <p className="text-text-secondary mb-4">Votre compte a été activé avec succès.</p>
          <p className="text-sm text-text-secondary">Redirection vers le tableau de bord...</p>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Échec de la vérification</h3>
          <p className="text-text-secondary mb-6">
            Le lien de vérification est invalide ou a expiré. Veuillez demander un nouveau lien.
          </p>
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                placeholder="Votre adresse email"
              />
            </div>
            <button
              type="submit"
              disabled={resendLoading}
              className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
            >
              {resendLoading ? "Envoi..." : "Renvoyer l'email de vérification"}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="text-center">
        <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Vérification de l'email</h3>
        <p className="text-text-secondary">
          Veuillez patienter pendant que nous vérifions votre email...
        </p>
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

export default EmailVerificationPage; 