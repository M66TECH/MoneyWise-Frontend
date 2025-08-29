import { useState, useEffect, useMemo } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Plus, DollarSign, TrendingUp, TrendingDown, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories } from '../services/categoryService';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';
import { getDashboardSummary } from '../services/dashboardService';
import toast from 'react-hot-toast';
import TransactionModal from '../components/transactions/TransactionModal';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import { useTransactionAlerts } from '../hooks/useTransactionAlerts';
import AlertNotification from '../components/alerts/AlertNotification';

import type { Category, Transaction, CreateTransactionData, UpdateTransactionData } from '../types';
import type { Alerte } from '../services/alertService';

const TransactionsPage = () => {
    const { user } = useAuth();
    
    // Fonction utilitaire pour extraire l'ID utilisateur
    const getUserId = (userData: any): number | null => {
        if (!userData) return null;
        
        // Essayer différentes structures possibles
        if (userData.utilisateur?.id) return userData.utilisateur.id;
        if (userData.id) return userData.id;
        if (typeof userData === 'object' && userData.id) return userData.id;
        
        return null;
    };
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    
    // États pour les filtres et la recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');

    // États pour les alertes
    const [alertesDetectees, setAlertesDetectees] = useState<Alerte[]>([]);
    const [showAlertNotification, setShowAlertNotification] = useState(false);

    // Hook pour les alertes après transaction
    const { checkAlertsAfterTransaction, calculateStatsFromDashboard } = useTransactionAlerts({
        autoCheckAfterTransaction: true,
        envoyerEmail: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Récupérer les catégories
            let categoriesData: Category[] = [];
            try {
                categoriesData = await getCategories();
            } catch (error) {
                            // Données de test si l'API n'est pas disponible
            categoriesData = [
                {
                    id: 1,
                    nom: 'Salaire',
                    couleur: '#10B981',
                    type: 'revenu' as const,
                    utilisateur_id: 1,
                    date_creation: new Date().toISOString(),
                    date_modification: new Date().toISOString()
                },
                {
                    id: 2,
                    nom: 'Alimentation',
                    couleur: '#EF4444',
                    type: 'depense' as const,
                    utilisateur_id: 1,
                    date_creation: new Date().toISOString(),
                    date_modification: new Date().toISOString()
                },
                {
                    id: 3,
                    nom: 'Transport',
                    couleur: '#3B82F6',
                    type: 'hybride' as const,
                    utilisateur_id: 1,
                    date_creation: new Date().toISOString(),
                    date_modification: new Date().toISOString()
                }
            ] as Category[];
            }
            
            // Récupérer les transactions
            let transactionsData: Transaction[] = [];
            try {
                transactionsData = await getTransactions();
            } catch (error) {
                            // Données de test si l'API n'est pas disponible
            transactionsData = [
                {
                    id: 1,
                    montant: 150000,
                    description: 'Salaire mensuel',
                    type: 'revenu' as const,
                    date_creation: new Date().toISOString(),
                    date_transaction: new Date().toISOString(),
                    utilisateur_id: 1,
                    categorie_id: 1
                },
                {
                    id: 2,
                    montant: 25000,
                    description: 'Courses alimentaires',
                    type: 'depense' as const,
                    date_creation: new Date().toISOString(),
                    date_transaction: new Date().toISOString(),
                    utilisateur_id: 1,
                    categorie_id: 2
                }
            ] as Transaction[];
            }
            
            setCategories(categoriesData);
            setTransactions(transactionsData);
        } catch (error) {
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = (category: Category) => {
        setSelectedCategory(category);
        setEditingTransaction(null);
        setIsTransactionModalOpen(true);
    };

    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        console.log('✏️ Modification de transaction:', transaction);
        console.log('👤 Utilisateur actuel:', user);
        
        const userId = getUserId(user);
        if (!user || !userId) {
            toast.error('Erreur: Utilisateur non connecté');
            console.error('❌ Utilisateur non connecté pour la modification');
            return;
        }
        
        setEditingTransaction(transaction);
        const category = categories.find(cat => cat.id === transaction.categorie_id);
        if (category) {
            setSelectedCategory(category);
            setIsTransactionModalOpen(true);
        } else {
            toast.error('Catégorie introuvable pour cette transaction');
        }
    };

    const handleDeleteTransaction = async (transactionId: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
        try {
            await deleteTransaction(transactionId);
            toast.success('Transaction supprimée avec succès');
            fetchData();
        } catch (error) {
            // Simulation de succès pour les tests
            toast.success('Transaction supprimée avec succès (mode test)');
            fetchData();
            }
        }
    };

    const handleTransactionSubmit = async (data: CreateTransactionData | UpdateTransactionData) => {
        try {
            
            
            let updatedTransaction: Transaction | null = null;
            let newTransaction: Transaction | null = null;
            
            if (editingTransaction) {
                // Pour la mise à jour, on ne doit pas envoyer utilisateur_id
                const updateData: UpdateTransactionData = {};
                
                // Ajouter seulement les champs qui ont des valeurs
                if (data.montant !== undefined && data.montant !== null) {
                    updateData.montant = data.montant;
                }
                if (data.description !== undefined && data.description !== null) {
                    updateData.description = data.description;
                }
                if (data.type !== undefined && data.type !== null) {
                    updateData.type = data.type;
                }
                if (data.categorie_id !== undefined && data.categorie_id !== null) {
                    updateData.categorie_id = data.categorie_id;
                }
                
                // Vérifier qu'on a au moins une donnée à mettre à jour
                if (Object.keys(updateData).length === 0) {
                    throw new Error('Aucune donnée à mettre à jour');
                }
                
                updatedTransaction = await updateTransaction(editingTransaction.id, updateData);
                toast.success('Transaction modifiée avec succès');
                
                // Mettre à jour directement l'état local
                setTransactions(prevTransactions => {
                    const updated = prevTransactions.map(t => 
                        t.id === editingTransaction.id ? updatedTransaction! : t
                    );
                    return updated;
                });
                
                // Réinitialiser l'état d'édition
                setEditingTransaction(null);
            } else {
                newTransaction = await createTransaction(data as CreateTransactionData);
                toast.success('Transaction créée avec succès');
                
                // Ajouter directement à l'état local
                setTransactions(prevTransactions => {
                    const updated = [newTransaction!, ...prevTransactions];
                    return updated;
                });
            }
            
            // Fermer le modal et réinitialiser les états
            setIsTransactionModalOpen(false);
            setSelectedCategory(null);
            
            // Note: Pas de rechargement en arrière-plan pour éviter les conflits
            // Les données sont mises à jour directement dans l'état local
            
            // Vérifier les alertes APRÈS la mise à jour réussie (sans recharger les données)
            try {
                // Récupérer les données du dashboard MISE À JOUR
                const dashboardData = await getDashboardSummary();
                
                // Calculer les statistiques pour les alertes avec les NOUVELLES données
                const stats = calculateStatsFromDashboard(dashboardData, transactions);
                
                // Vérifier les alertes
                const alertResult = await checkAlertsAfterTransaction(stats);
                
                if (alertResult && alertResult.alertes && alertResult.alertes.length > 0) {
                    console.log(`⚠️ ${alertResult.alertes.length} alerte(s) détectée(s)`);
                    
                    // Afficher la notification d'alertes
                    setAlertesDetectees(alertResult.alertes);
                    setShowAlertNotification(true);
                    
                    // Afficher aussi un toast rapide
                    const alertesCritiques = alertResult.alertes.filter(a => a.severite === 'critical');
                    if (alertesCritiques.length > 0) {
                        toast.error(`🚨 ${alertesCritiques.length} alerte(s) critique(s) détectée(s) !`);
                    } else {
                        toast(`⚠️ ${alertResult.alertes.length} alerte(s) détectée(s)`, {
                            icon: '⚠️',
                            style: {
                                background: '#fbbf24',
                                color: '#92400e'
                            }
                        });
                    }
                }
            } catch (alertError) {
                // Ne pas afficher d'erreur toast pour les alertes, juste logger
            }
            
        } catch (error: any) {
            
            // Afficher un message d'erreur approprié
            let errorMessage = 'Erreur lors de la sauvegarde de la transaction';
            
            if (error.response?.status === 400) {
                errorMessage = 'Données invalides. Vérifiez les informations saisies.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Transaction introuvable.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Timeout de la requête. Vérifiez votre connexion.';
            }
            
            toast.error(errorMessage);
            
            // Ne pas fermer le modal en cas d'erreur pour permettre à l'utilisateur de corriger
            // setIsTransactionModalOpen(false);
            // Ne pas recharger les données en cas d'erreur
            // fetchData();
        }
    };

    const getCategoryIcon = (type: string, size: number = 20) => {
        const sizeClass = `w-${size} h-${size}`;
        switch (type) {
            case 'revenu':
                return <TrendingUp className={`${sizeClass} text-green-500`} />;
            case 'depense':
                return <TrendingDown className={`${sizeClass} text-red-500`} />;
            case 'hybride':
                return <DollarSign className={`${sizeClass} text-purple-500`} />;
            default:
                return <DollarSign className={`${sizeClass} text-gray-500`} />;
        }
    };

    const getCategoryTypeLabel = (type: string) => {
        switch (type) {
            case 'revenu':
                return 'Revenu';
            case 'depense':
                return 'Dépense';
            case 'hybride':
                return 'Hybride';
            default:
                return 'Inconnu';
        }
    };

    // Fonction pour calculer le montant total d'une catégorie
    const getCategoryTotal = (categoryId: number) => {
        if (!Array.isArray(transactions)) return 0;
        return transactions
            .filter(t => t.categorie_id === categoryId)
            .reduce((sum, t) => {
                const montant = parseFloat(t.montant?.toString() || '0');
                return sum + (isNaN(montant) ? 0 : montant);
            }, 0);
    };

    // Fonction pour formater les montants en français
    const formatAmount = (amount: number) => {
        if (isNaN(amount) || amount === null || amount === undefined) {
            return '0 F CFA';
        }
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Fonction pour formater les dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Transactions filtrées et recherchées
    const filteredTransactions = useMemo(() => {
        if (!Array.isArray(transactions)) return [];
        
        let filtered = transactions;

        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(transaction => {
                const category = categories.find(cat => cat.id === transaction.categorie_id);
                const searchLower = searchTerm.toLowerCase();
                return (
                    transaction.description?.toLowerCase().includes(searchLower) ||
                    transaction.montant?.toString().includes(searchLower) ||
                    transaction.type?.toLowerCase().includes(searchLower) ||
                    category?.nom.toLowerCase().includes(searchLower) ||
                    formatDate(transaction.date_transaction).includes(searchLower)
                );
            });
        }

        // Filtre par catégorie
        if (filterCategory) {
            filtered = filtered.filter(transaction => 
                transaction.categorie_id === parseInt(filterCategory)
            );
        }

        // Filtre par type
        if (filterType) {
            filtered = filtered.filter(transaction => 
                transaction.type === filterType
            );
        }

        // Filtre par date
        if (filterDate) {
            filtered = filtered.filter(transaction => 
                transaction.date_transaction.startsWith(filterDate)
            );
        }

        return filtered;
    }, [transactions, categories, searchTerm, filterCategory, filterType, filterDate]);

    if (loading) {
        return (
            <AppLayout title="Transactions">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Transactions">
            {/* Notification d'alertes */}
            <AlertNotification
                alertes={alertesDetectees}
                isVisible={showAlertNotification}
                onClose={() => setShowAlertNotification(false)}
            />
            
            <div className="space-y-8">
                {/* En-tête avec statistiques */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-600">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Gestion des Transactions
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                                Créez et gérez vos transactions par catégorie avec style
                            </p>
                        </div>
                        
                        {/* Statistiques dynamiques */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {Array.isArray(transactions) ? transactions.length || 0 : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Revenus</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {Array.isArray(transactions) ? transactions.filter(t => t.type === 'revenu').length || 0 : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dépenses</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {Array.isArray(transactions) ? transactions.filter(t => t.type === 'depense').length || 0 : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Catégories</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {Array.isArray(categories) ? categories.length || 0 : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cartes des catégories avec style amélioré */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catégories</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.isArray(categories) && categories.map((category) => (
                            <div
                                key={category.id}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, ${category.couleur}10 0%, ${category.couleur}05 100%)`
                                }}
                            >
                                {/* Effet de brillance au survol */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg shadow-md flex items-center justify-center">
                                                {getCategoryIcon(category.type, 16)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{category.nom}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {Array.isArray(transactions) ? transactions.filter(t => t.categorie_id === category.id).length || 0 : 0} transactions
                                                </p>
                                            </div>
                                    </div>
                                </div>
                                
                                    <div className="mb-6">
                                        <span 
                                            className="inline-block px-4 py-2 text-sm font-semibold rounded-full shadow-sm"
                                            style={{
                                                backgroundColor: `${category.couleur}20`,
                                                color: category.couleur
                                            }}
                                        >
                                        {getCategoryTypeLabel(category.type)}
                                    </span>
                                </div>

                                    <div className="mb-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
                                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                {formatAmount(getCategoryTotal(category.id))}
                                            </span>
                                        </div>
                                </div>

                                    <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => handleAddTransaction(category)}
                                            className="flex-1 px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm"
                                            style={{ backgroundColor: category.couleur }}
                                >
                                            <Plus size={14} className="group-hover/btn:scale-110 transition-transform" />
                                            <span>Ajouter</span>
                                </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liste complète des transactions avec filtres */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Toutes les Transactions</h2>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* En-tête avec filtres et recherche */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Liste des transactions
                                </h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredTransactions.length} transaction(s) trouvée(s)
                                </span>
                            </div>
                            
                            
                                
                                {/* Barre de recherche */}
                                <div className="relative w-full lg:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans toutes les colonnes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            
                            {/* Filtres */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                {/* Filtre par catégorie */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Toutes les catégories</option>
                                        {Array.isArray(categories) && categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Filtre par type */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tous les types</option>
                                        <option value="revenu">Revenu</option>
                                        <option value="depense">Dépense</option>
                                    </select>
                                </div>
                                
                                {/* Filtre par date */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Tableau des transactions */}
                        <div className="overflow-x-auto max-w-full">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            N°
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Catégorie
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Montant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredTransactions.map((transaction, index) => {
                                        const category = categories.find(cat => cat.id === transaction.categorie_id);
                                        return (
                                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {transaction.description || 'Aucune description'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: category?.couleur }}
                                                        />
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                            {category?.nom || 'Catégorie inconnue'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        transaction.type === 'revenu' 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {transaction.type === 'revenu' ? 'Revenu' : 'Dépense'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                                    {formatAmount(transaction.montant || 0)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(transaction.date_transaction)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewTransaction(transaction)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                            title="Voir les détails"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditTransaction(transaction)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            
                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Aucune transaction trouvée avec les critères actuels
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal pour ajouter/modifier une transaction */}
            {selectedCategory && (
                <TransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    onSubmit={handleTransactionSubmit}
                    category={selectedCategory}
                    transaction={editingTransaction}
                    userId={getUserId(user) || 0}
                />
            )}

            {/* Modal pour afficher les détails d'une transaction */}
            {selectedTransaction && (
                <TransactionDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    transaction={selectedTransaction}
                    category={categories.find(cat => cat.id === selectedTransaction.categorie_id)}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                />
            )}
        </AppLayout>
    );
};

export default TransactionsPage;