import React, { useState, useEffect, useMemo } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import { getTransactions as getTransactionsService } from '../services/transactionService';
import { getCategories as getCategoriesService } from '../services/categoryService';
import StatCard from '../components/dashboard/StatCard';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import MonthlyAnalyticsChart from '../components/dashboard/MonthlyAnalyticsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import type { Transaction, Category } from '../types';
import type { DashboardSummary } from '../services/dashboardService';
import AlertManager from '../components/alerts/AlertManager';

// Composant optimisé pour les statistiques
const DashboardStats = React.memo(({ safeData }: { safeData: any }) => {

    
    const formatCurrency = (value: number) => {
        return `${value.toLocaleString('fr-FR')} F CFA`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Solde Actuel"
                value={safeData ? formatCurrency(safeData.solde) : "0 F CFA"}
                icon={<Wallet className="w-6 h-6 text-white" />}
                color="bg-primary"
            />
            <StatCard 
                title="Revenus du Mois"
                value={safeData ? formatCurrency(safeData.statistiques_mensuelles.total_revenus) : "0 F CFA"}
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                color="bg-positive"
            />
            <StatCard 
                title="Dépenses du Mois"
                value={safeData ? formatCurrency(safeData.statistiques_mensuelles.total_depenses) : "0 F CFA"}
                icon={<TrendingDown className="w-6 h-6 text-white" />}
                color="bg-negative"
            />
            <StatCard 
                title="Transactions"
                value={safeData ? safeData.statistiques_mensuelles.nombre_transactions.toString() : "0"}
                icon={<BarChart3 className="w-6 h-6 text-white" />}
                color="bg-secondary"
            />
        </div>
    );
});

// Composant optimisé pour les graphiques
const DashboardCharts = React.memo(({ safeData, transactions, categories }: { safeData: any, transactions: Transaction[], categories: Category[] }) => {
    // Palette de couleurs uniques pour les catégories
    const uniqueColors = [
        '#3B82F6', // Bleu
        '#EF4444', // Rouge
        '#10B981', // Vert
        '#F59E0B', // Orange
        '#8B5CF6', // Violet
        '#EC4899', // Rose
        '#06B6D4', // Cyan
        '#84CC16', // Lime
        '#F97316', // Orange foncé
        '#6366F1', // Indigo
        '#14B8A6', // Teal
        '#F43F5E', // Rose foncé
        '#22C55E', // Vert émeraude
        '#A855F7', // Violet foncé
        '#0EA5E9', // Bleu ciel
    ];

    // Fonction pour ajuster la luminosité d'une couleur
    const adjustColorBrightness = (hex: string, factor: number): string => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    const pieData = useMemo(() => {
        if (!safeData?.depenses_par_categorie) return [];
        
        // Map pour suivre les couleurs déjà utilisées
        const usedColors = new Map<string, string>();
        let colorIndex = 0;
        
        return safeData.depenses_par_categorie.map((item: any) => {
            // Trouver la catégorie correspondante pour récupérer sa couleur
            const categorie = categories.find(cat => 
                cat.nom === item.nom_categorie || 
                cat.id === item.categorie_id
            );
            
            let couleur_categorie = categorie?.couleur || '#6B7280';
            
            // Si la couleur est déjà utilisée, assigner une couleur unique
            if (usedColors.has(couleur_categorie)) {
                // Chercher la prochaine couleur disponible dans la palette
                while (colorIndex < uniqueColors.length && usedColors.has(uniqueColors[colorIndex])) {
                    colorIndex++;
                }
                
                // Si on a épuisé la palette, recommencer avec des variations
                if (colorIndex >= uniqueColors.length) {
                    colorIndex = 0;
                    // Ajouter une variation à la couleur existante
                    const baseColor = uniqueColors[colorIndex];
                    couleur_categorie = adjustColorBrightness(baseColor, Math.random() * 0.3 + 0.7);
                } else {
                    couleur_categorie = uniqueColors[colorIndex];
                }
            }
            
            // Marquer cette couleur comme utilisée
            usedColors.set(couleur_categorie, item.nom_categorie);
            
            return {
                nom_categorie: item.nom_categorie || 'Catégorie inconnue',
                couleur_categorie: couleur_categorie,
                montant_total: item.montant_total ? String(item.montant_total) : '0',
                nombre_transactions: typeof item.nombre_transactions === 'string' ? parseInt(item.nombre_transactions) : (item.nombre_transactions || 0)
            };
        });
    }, [safeData?.depenses_par_categorie, categories]);

    const lineData = useMemo(() => {
        if (!safeData?.evolution_six_mois) return [];
        
        let data = safeData.evolution_six_mois.map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            mois: item.mois || 'Mois inconnu',
            revenus: typeof item.revenus === 'string' ? parseFloat(item.revenus) : (item.revenus || 0),
            depenses: typeof item.depenses === 'string' ? parseFloat(item.depenses) : (item.depenses || 0),
            solde: typeof item.solde === 'string' ? parseFloat(item.solde) : (item.solde || 0)
        }));
        
        // Si les données sont incomplètes, calculer à partir des transactions
        if (data.length > 0 && data.every((item: any) => item.revenus === 0 && item.depenses === 0)) {
            const transactionsByMonth = new Map();
            
            if (Array.isArray(transactions)) {
                transactions.forEach(transaction => {
                    const date = new Date(transaction.date_transaction || transaction.date_creation);
                    const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
                    
                    if (!transactionsByMonth.has(monthKey)) {
                        transactionsByMonth.set(monthKey, { revenus: 0, depenses: 0 });
                    }
                    
                    const montant = parseFloat(String(transaction.montant || '0'));
                    if (transaction.type === 'revenu') {
                        transactionsByMonth.get(monthKey).revenus += montant;
                    } else if (transaction.type === 'depense') {
                        transactionsByMonth.get(monthKey).depenses += montant;
                    }
                });
            }
            
            data = data.map((item: any) => {
                const monthData = transactionsByMonth.get(item.mois) || { revenus: 0, depenses: 0 };
                return {
                    mois: item.mois,
                    revenus: monthData.revenus,
                    depenses: monthData.depenses,
                    solde: monthData.revenus - monthData.depenses
                };
            });
        }
        
        return data;
    }, [safeData?.evolution_six_mois, transactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <ExpensePieChart data={pieData} />
            </div>
            <div className="lg:col-span-3">
                <MonthlyAnalyticsChart data={lineData} />
            </div>
        </div>
    );
});

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Fonction pour sécuriser les données du dashboard
    const getSafeDashboardData = useMemo(() => {
        if (!dashboardData) return null;
        

        
        // Parser les statistiques mensuelles si c'est une chaîne
        let statistiquesMensuelles = {
            total_revenus: 0,
            total_depenses: 0,
            solde: 0,
            nombre_transactions: 0
        };
        
        if (typeof dashboardData.statistiques_mensuelles === 'string') {
            // Format: "(56000.00,145000.00,-89000.00,5)"
            const match = (dashboardData.statistiques_mensuelles as string).match(/\(([^,]+),([^,]+),([^,]+),([^)]+)\)/);
            if (match) {
                statistiquesMensuelles = {
                    total_revenus: parseFloat(match[1]) || 0,
                    total_depenses: parseFloat(match[2]) || 0,
                    solde: parseFloat(match[3]) || 0,
                    nombre_transactions: parseInt(match[4]) || 0
                };
            }
        } else if (dashboardData.statistiques_mensuelles) {
            statistiquesMensuelles = {
                total_revenus: dashboardData.statistiques_mensuelles.total_revenus && !isNaN(dashboardData.statistiques_mensuelles.total_revenus) ? dashboardData.statistiques_mensuelles.total_revenus : 0,
                total_depenses: dashboardData.statistiques_mensuelles.total_depenses && !isNaN(dashboardData.statistiques_mensuelles.total_depenses) ? dashboardData.statistiques_mensuelles.total_depenses : 0,
                solde: dashboardData.statistiques_mensuelles.solde && !isNaN(dashboardData.statistiques_mensuelles.solde) ? dashboardData.statistiques_mensuelles.solde : 0,
                nombre_transactions: dashboardData.statistiques_mensuelles.nombre_transactions && !isNaN(dashboardData.statistiques_mensuelles.nombre_transactions) ? dashboardData.statistiques_mensuelles.nombre_transactions : 0
            };
        }
        
        // Fallback : si les statistiques mensuelles sont à 0, utiliser les données principales
        if (statistiquesMensuelles.total_revenus === 0 && dashboardData.total_revenus > 0) {
    
            statistiquesMensuelles.total_revenus = dashboardData.total_revenus;
        }
        
        if (statistiquesMensuelles.total_depenses === 0 && dashboardData.total_depenses > 0) {
    
            statistiquesMensuelles.total_depenses = dashboardData.total_depenses;
        }
        
        // Fallback avancé : calculer depuis les dépenses par catégorie si les totaux sont à 0
        if (statistiquesMensuelles.total_depenses === 0 && dashboardData.depenses_par_categorie && dashboardData.depenses_par_categorie.length > 0) {
            const totalDepensesCategories = dashboardData.depenses_par_categorie.reduce((sum: number, cat: any) => {
                return sum + (parseFloat(cat.montant_total) || 0);
            }, 0);
            if (totalDepensesCategories > 0) {
        
                statistiquesMensuelles.total_depenses = totalDepensesCategories;
            }
        }
        
        // Estimation des revenus basée sur le solde et les dépenses
        if (statistiquesMensuelles.total_revenus === 0 && statistiquesMensuelles.total_depenses > 0 && dashboardData.solde > 0) {
            // Revenus estimés = Dépenses + Solde actuel
            const revenusEstimes = statistiquesMensuelles.total_depenses + dashboardData.solde;
    
            statistiquesMensuelles.total_revenus = revenusEstimes;
        }
        
        // Si le nombre de transactions est à 0, essayer de le calculer depuis les dépenses par catégorie
        if (statistiquesMensuelles.nombre_transactions === 0 && dashboardData.depenses_par_categorie) {
            const totalTransactions = dashboardData.depenses_par_categorie.reduce((sum: number, cat: any) => {
                return sum + (parseInt(cat.nombre_transactions) || 0);
            }, 0);
            if (totalTransactions > 0) {
        
                statistiquesMensuelles.nombre_transactions = totalTransactions;
            }
        }
        
        const result = {
            ...dashboardData,
            solde: dashboardData.solde && !isNaN(dashboardData.solde) ? dashboardData.solde : 0,
            total_revenus: dashboardData.total_revenus && !isNaN(dashboardData.total_revenus) ? dashboardData.total_revenus : 0,
            total_depenses: dashboardData.total_depenses && !isNaN(dashboardData.total_depenses) ? dashboardData.total_depenses : 0,
            statistiques_mensuelles: statistiquesMensuelles
        };
        

        
        return result;
    }, [dashboardData]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                const [summaryData, transactionsData, categoriesData] = await Promise.all([
                    getDashboardSummary(),
                    getTransactionsService(),
                    getCategoriesService()
                ]);
                
                setDashboardData(summaryData);
                setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } catch (error) {
                // Gestion silencieuse de l'erreur
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <AppLayout title="Tableau de bord">
                <div className="flex items-center justify-center h-16">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Tableau de bord">
            <div className="space-y-8">

                
                <DashboardStats safeData={getSafeDashboardData} />
                
                <DashboardCharts safeData={getSafeDashboardData} transactions={transactions} categories={categories} />

                {/* Transactions récentes */}
                <div>
                    <RecentTransactions 
                        transactions={Array.isArray(transactions) ? transactions.slice(0, 5) : []}
                        categories={Array.isArray(categories) ? categories : []}
                    />
                </div>

                {/* Système d'alertes */}
                <div>
                    <AlertManager 
                        autoCheck={true}
                        checkInterval={15}
                        statistiques={getSafeDashboardData ? {
                            solde: getSafeDashboardData.solde,
                            total_revenus: getSafeDashboardData.total_revenus || 0,
                            total_depenses: getSafeDashboardData.total_depenses || 0,
                            depenses_mensuelles: getSafeDashboardData.statistiques_mensuelles.total_depenses,
                            revenus_mensuels: getSafeDashboardData.statistiques_mensuelles.total_revenus,
                            nombre_transactions: getSafeDashboardData.statistiques_mensuelles.nombre_transactions,
                            derniere_transaction: transactions.length > 0 
                                ? new Date(transactions[0].date_creation || transactions[0].date_transaction)
                                : undefined
                        } : undefined}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;