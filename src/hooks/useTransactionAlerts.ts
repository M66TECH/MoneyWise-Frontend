import { useCallback } from 'react';
import alertService, { type FinancialStats } from '../services/alertService';
import { useAuth } from '../contexts/AuthContext';

interface UseTransactionAlertsOptions {
  autoCheckAfterTransaction?: boolean;
  envoyerEmail?: boolean;
}

export const useTransactionAlerts = (options: UseTransactionAlertsOptions = {}) => {
  const { token } = useAuth();
  const { autoCheckAfterTransaction = true, envoyerEmail = true } = options;

  // Fonction pour déclencher les alertes après une transaction
  const checkAlertsAfterTransaction = useCallback(async (
    statistiques: FinancialStats
  ) => {
    console.log('🚨 Début de la vérification des alertes après transaction...');
    console.log('📊 Statistiques reçues:', statistiques);
    
    if (!autoCheckAfterTransaction) {
      console.log('⚠️ Vérification automatique désactivée');
      return;
    }
    
    if (!token) {
      console.log('⚠️ Token d\'authentification manquant');
      return;
    }

    try {
      console.log('🔧 Initialisation du service d\'alertes...');
      // Initialiser le service si nécessaire
      alertService.init(token);
      
      console.log('🔍 Vérification des alertes avec les nouvelles statistiques...');
      // Vérifier les alertes avec les nouvelles statistiques
      const result = await alertService.checkAlerts(statistiques, envoyerEmail);
      console.log('📋 Résultat de la vérification des alertes:', result);
      
      if (result.alertes && result.alertes.length > 0) {
        console.log(`⚠️ ${result.alertes.length} alerte(s) détectée(s)`);
        
        // Afficher une notification si des alertes critiques sont détectées
        const alertesCritiques = result.alertes.filter(a => a.severite === 'critical');
        if (alertesCritiques.length > 0) {
          console.log(`🚨 ${alertesCritiques.length} alerte(s) critique(s) détectée(s)`);
          // Créer une notification toast ou popup
          const event = new CustomEvent('showAlert', {
            detail: {
              type: 'critical',
              message: `${alertesCritiques.length} alerte(s) critique(s) détectée(s) !`,
              alertes: result.alertes
            }
          });
          window.dispatchEvent(event);
        }
      } else {
        console.log('✅ Aucune alerte détectée');
      }
      
      return result;
    } catch (error) {
      return null;
    }
  }, [token, autoCheckAfterTransaction, envoyerEmail]);

  // Fonction pour calculer les statistiques à partir des données du dashboard
  const calculateStatsFromDashboard = useCallback((
    dashboardData: any,
    transactions: any[]
  ): FinancialStats => {
    console.log('🔧 Calcul des statistiques pour alertes...');
    console.log('📊 Données dashboard reçues:', dashboardData);
    console.log('💳 Transactions reçues:', transactions?.length || 0);

    if (!dashboardData) {
      console.log('⚠️ Aucune donnée dashboard disponible');
      return {
        solde: 0,
        total_revenus: 0,
        total_depenses: 0,
        depenses_mensuelles: 0,
        revenus_mensuels: 0,
        nombre_transactions: 0
      };
    }

    // Extraire les statistiques du dashboard avec la même logique que DashboardPage
    const solde = dashboardData.solde && !isNaN(dashboardData.solde) ? dashboardData.solde : 0;
    const total_revenus = dashboardData.total_revenus && !isNaN(dashboardData.total_revenus) ? dashboardData.total_revenus : 0;
    const total_depenses = dashboardData.total_depenses && !isNaN(dashboardData.total_depenses) ? dashboardData.total_depenses : 0;
    
    console.log('📈 Données de base extraites:', { solde, total_revenus, total_depenses });
    
    // Utiliser les données du dashboard principal pour les alertes (plus fiables que statistiques_mensuelles)
    // Si les statistiques mensuelles sont à 0, utiliser les données principales
    let revenus_mensuels = 0;
    let depenses_mensuelles = 0;
    let nombre_transactions = 0;

    if (dashboardData.statistiques_mensuelles) {
      if (typeof dashboardData.statistiques_mensuelles === 'string') {
        // Gérer le cas où statistiques_mensuelles est une chaîne
        const match = dashboardData.statistiques_mensuelles.match(/\(([^,]+),([^,]+),([^,]+),([^)]+)\)/);
        if (match) {
          revenus_mensuels = parseFloat(match[1]) || 0;
          depenses_mensuelles = parseFloat(match[2]) || 0;
          nombre_transactions = parseInt(match[4]) || 0;
        }
      } else {
        // Gérer le cas où statistiques_mensuelles est un objet
        revenus_mensuels = dashboardData.statistiques_mensuelles.total_revenus && !isNaN(dashboardData.statistiques_mensuelles.total_revenus) 
          ? dashboardData.statistiques_mensuelles.total_revenus : 0;
        depenses_mensuelles = dashboardData.statistiques_mensuelles.total_depenses && !isNaN(dashboardData.statistiques_mensuelles.total_depenses) 
          ? dashboardData.statistiques_mensuelles.total_depenses : 0;
        nombre_transactions = dashboardData.statistiques_mensuelles.nombre_transactions && !isNaN(dashboardData.statistiques_mensuelles.nombre_transactions) 
          ? dashboardData.statistiques_mensuelles.nombre_transactions : 0;
      }
    }

    console.log('📅 Statistiques mensuelles extraites:', { revenus_mensuels, depenses_mensuelles, nombre_transactions });

    // Si les statistiques mensuelles sont à 0, utiliser les données principales du dashboard
    // Cela arrive souvent quand les statistiques mensuelles ne sont pas encore mises à jour
    if (revenus_mensuels === 0 && total_revenus > 0) {
      console.log('🔄 Utilisation des revenus totaux pour les alertes');
      revenus_mensuels = total_revenus;
    }
    
    if (depenses_mensuelles === 0 && total_depenses > 0) {
      console.log('🔄 Utilisation des dépenses totales pour les alertes');
      depenses_mensuelles = total_depenses;
    }

    // Pour les alertes uniquement : si toutes les données sont à 0 mais qu'il y a un solde positif, 
    // calculer des valeurs estimées basées sur le solde (UNIQUEMENT pour les alertes)
    let revenusPourAlertes = revenus_mensuels;
    let depensesPourAlertes = depenses_mensuelles;
    
    if (revenus_mensuels === 0 && depenses_mensuelles === 0 && solde > 0) {
      console.log('🔄 Estimation des revenus/dépenses basée sur le solde...');
      // Si le solde est positif, on suppose qu'il y a eu des revenus
      // On estime les revenus à 1.5x le solde et les dépenses à 0.5x le solde
      revenusPourAlertes = Math.round(solde * 1.5);
      depensesPourAlertes = Math.round(solde * 0.5);
    }

    // Vérifier s'il y a des données dans depenses_par_categorie pour les alertes
    if (dashboardData.depenses_par_categorie && Array.isArray(dashboardData.depenses_par_categorie)) {
      const totalDepensesCategories = dashboardData.depenses_par_categorie.reduce((sum: number, cat: any) => {
        return sum + (parseFloat(cat.montant) || 0);
      }, 0);
      
      if (totalDepensesCategories > 0 && depensesPourAlertes === 0) {
        console.log('🔄 Utilisation des dépenses par catégorie pour les alertes');
        depensesPourAlertes = totalDepensesCategories;
      }
    }

    // Calculer la date de la dernière transaction
    let derniere_transaction: Date | undefined;
    if (transactions && transactions.length > 0) {
      const lastTransaction = transactions[0]; // Supposons que les transactions sont triées par date décroissante
      derniere_transaction = new Date(lastTransaction.date_creation || lastTransaction.date_transaction);
    }

    const stats = {
      solde,
      total_revenus,
      total_depenses,
      depenses_mensuelles: depensesPourAlertes, // Utiliser les valeurs pour alertes
      revenus_mensuels: revenusPourAlertes,     // Utiliser les valeurs pour alertes
      nombre_transactions,
      derniere_transaction
    };

    console.log('✅ Statistiques finales pour alertes:', stats);
    return stats;
  }, []);

  return {
    checkAlertsAfterTransaction,
    calculateStatsFromDashboard
  };
};
