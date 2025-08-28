import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/authService';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Veuillez saisir votre adresse email.');
            return;
        }

        setLoading(true);
        try {
            const { message } = await forgotPassword({ email });
            setEmailSent(true);
            toast.success(message || 'Email de récupération envoyé !');
        } catch (err) {
            let errorMessage = 'Erreur lors de l\'envoi de l\'email de récupération.';
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
        if (emailSent) {
            return (
                <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Email envoyé !</h3>
                    <p className="text-text-secondary mb-4">
                        Nous avons envoyé un lien de récupération à <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-text-secondary mb-6">
                        Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                    </p>
                    <button
                        onClick={() => {
                            setEmailSent(false);
                            setEmail('');
                        }}
                        className="text-primary hover:text-primary-hover font-medium"
                    >
                        Envoyer un autre email
                    </button>
                </div>
            );
        }

        return (
            <div>
                <div className="text-center mb-6">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Mot de passe oublié ?</h3>
                    <p className="text-text-secondary">
                        Pas de panique. Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loading}
                        className="w-full px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150 disabled:bg-gray-500"
                    >
                        {loading ? "Envoi..." : "Envoyer le lien"}
                    </button>
                </form>
            </div>
        );
    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-background relative">
            <Link to="/login" className="absolute top-8 left-8 flex items-center gap-x-2 text-text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                Retour à la connexion
            </Link>
            <div className="max-w-sm w-full text-text-primary">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-text-primary">MoneyWise</Link>
                </div>
                {renderContent()}
            </div>
        </main>
    );
};

export default ForgotPasswordPage;