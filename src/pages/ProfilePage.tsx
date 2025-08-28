import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { 
    User, 
    Lock, 
    Palette, 
    Bell, 
    Shield, 
    Download, 
    Trash2, 
    Eye, 
    EyeOff,
    CheckCircle,
    Settings,
    Moon,
    Sun,
    Monitor,
    Database,
    Key,
    Mail,
    Zap,
    Save,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword, updateTheme } from '../services/authService';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import type { UpdateProfileData, ChangePasswordData } from '../types';

// Type local pour le formulaire de changement de mot de passe
interface PasswordFormData extends ChangePasswordData {
  confirmPassword: string;
}

// Type pour les sections de paramètres
interface SettingsSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [profileData, setProfileData] = useState<UpdateProfileData>({
        firstName: '',
        lastName: ''
    });
    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Sections de paramètres
    const settingsSections: SettingsSection[] = [
        {
            id: 'profile',
            title: 'Profil Utilisateur',
            icon: <User size={20} />,
            description: 'Gérez vos informations personnelles et votre photo de profil',
            color: 'bg-gradient-to-r from-blue-500 to-blue-600'
        },
        {
            id: 'security',
            title: 'Sécurité',
            icon: <Shield size={20} />,
            description: 'Mot de passe et sécurité du compte',
            color: 'bg-gradient-to-r from-red-500 to-red-600'
        }
    ];

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.prenom || '',
                lastName: user.nom || ''
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { utilisateur, message } = await updateProfile(profileData);
            updateUser(utilisateur);
            toast.success(message || "Profil mis à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du profil.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);
        try {
            const { currentPassword, newPassword } = passwordData;
            const { message } = await changePassword({
                currentPassword,
                newPassword
            });
            toast.success(message || "Mot de passe modifié avec succès !");
            setIsPasswordModalOpen(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error("Erreur lors du changement de mot de passe.");
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = async (theme: 'light' | 'dark') => {
        try {
            const { utilisateur, message } = await updateTheme({ theme });
            updateUser(utilisateur);
            toast.success(message || "Thème mis à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors du changement de thème.");
        }
    };

    const handlePhotoUpdate = (updatedUser: any) => {
        updateUser(updatedUser);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
    return (
                    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
                        {/* Photo de Profil */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                    <User className="w-6 h-6 text-white" />
                    </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Photo de Profil</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Personnalisez votre profil avec une photo qui vous représente
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        {user && <ProfilePhotoUpload user={user} onPhotoUpdate={handlePhotoUpdate} />}
                    </div>
                </div>

                        {/* Informations Personnelles */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations Personnelles</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Gérez vos informations de base et votre identité
                                    </p>
                                </div>
                    </div>
                            
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Prénom
                                        </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                                            placeholder="Votre prénom"
                                />
                            </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Nom
                                        </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                                            placeholder="Votre nom"
                                />
                            </div>
                        </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Adresse Email
                                    </label>
                                    <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>L'email ne peut pas être modifié pour des raisons de sécurité</span>
                                    </div>
                        </div>
                                
                                <div className="flex justify-end pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Enregistrer les modifications
                                            </>
                                        )}
                            </button>
                        </div>
                    </form>
                </div>
                    </div>
                );

                        case 'security':
                return (
                    <div className="space-y-6">
                        {/* Changement de mot de passe */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                                    <Lock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sécurité du Compte</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Protégez votre compte avec un mot de passe sécurisé
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Mot de passe
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Modifiez votre mot de passe pour sécuriser votre compte et protéger vos données financières
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Dernière modification : Il y a 30 jours</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3"
                                    >
                                        <Key className="w-5 h-5" />
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sessions actives */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                    <Monitor className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sessions Actives</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Surveillez les appareils connectés à votre compte
                                    </p>
                                </div>
                    </div>
                            
                    <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                            <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Ordinateur Windows</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Session actuelle • Il y a 2 heures</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                            Actif
                                        </span>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Aucune autre session active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        {/* Thème */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thème de l'Interface</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Choisissez le thème qui vous convient le mieux pour une expérience personnalisée.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleThemeChange('light')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    user?.theme === 'light'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Sun className={`w-5 h-5 ${user?.theme === 'light' ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${user?.theme === 'light' ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                                            Mode Clair
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                                        Interface claire et lumineuse, parfaite pour la journée
                                    </p>
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    user?.theme === 'dark'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Moon className={`w-5 h-5 ${user?.theme === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${user?.theme === 'dark' ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                                            Mode Sombre
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                                        Interface sombre et élégante, idéale pour la soirée
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Personnalisation avancée */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personnalisation Avancée</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Animations</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Activer les animations et transitions
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Notifications visuelles</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Afficher les notifications avec des animations
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Préférences de Notification</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Alertes financières</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Recevoir des notifications pour les alertes de solde et dépenses
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Rapports mensuels</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Recevoir des rapports automatiques par email
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Notifications push</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Recevoir des notifications push sur votre navigateur
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'data':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestion des Données</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Export des données</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Télécharger toutes vos données au format JSON
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Exporter
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Sauvegarde automatique</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Sauvegarder automatiquement vos données
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <div>
                                        <h4 className="font-medium text-red-900 dark:text-red-100">Supprimer le compte</h4>
                                        <p className="text-sm text-red-700 dark:text-red-300">
                                            Cette action est irréversible et supprimera toutes vos données
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'advanced':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paramètres Avancés</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Mode développeur</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Activer les outils de développement
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Cache des données</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Vider le cache pour libérer de l'espace
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
                                        Vider
                            </button>
                        </div>
                    </div>
                </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
                <AppLayout title="Paramètres">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête amélioré */}
                <div className="mb-10">
                    <div className="bg-green-600 rounded-2xl p-8 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Settings className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Paramètres</h1>
                                <p className="text-green-100 mt-2 text-lg">
                                    Gérez votre profil et sécurisez votre compte MoneyWise
                                </p>
                            </div>
                        </div>
                    </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="space-y-3">
                            {settingsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                                        activeSection === section.id
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0'
                                            : section.id === 'profile'
                                                ? 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm'
                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${
                                            activeSection === section.id
                                                ? 'bg-white/20 backdrop-blur-sm'
                                                : section.color
                                        }`}>
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-lg ${
                                                activeSection === section.id
                                                    ? 'text-white'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}>
                                                {section.title}
                                            </h3>
                                            <p className={`text-sm mt-1 ${
                                                activeSection === section.id
                                                    ? 'text-blue-100'
                                                    : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="animate-fadeIn">
                            {renderSectionContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Changement de mot de passe */}
            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Changer le mot de passe">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mot de passe actuel
                        </label>
                        <div className="relative">
                        <input
                                type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                        <input
                                type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                            placeholder="Minimum 6 caractères"
                        />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                        <input
                                type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsPasswordModalOpen(false)} 
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Modification...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Modifier
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default ProfilePage;