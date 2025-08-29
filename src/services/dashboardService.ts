import api from "./api";

export interface DashboardSummary {
  solde: number;
  total_revenus: number;
  total_depenses: number;
  statistiques_mensuelles: {
    total_revenus: number;
    total_depenses: number;
    solde: number;
    nombre_transactions: number;
  };
  depenses_par_categorie: Array<{
    categorie_id: number;
    nom_categorie: string;
    couleur_categorie: string;
    nombre_transactions: number;
    montant_total: number;
  }>;
  evolution_six_mois: Array<{
    mois: string;
    revenus: number;
    depenses: number;
    solde: number;
  }>;
}

export interface MonthlyStats {
  mois: string;
  revenus: number;
  depenses: number;
  solde: number;
}

export interface ChartData {
  camembert?: Array<{
    nom: string;
    valeur: number;
    couleur: string;
  }>;
  ligne?: Array<{
    mois: string;
    revenus: number;
    depenses: number;
  }>;
  barres?: Array<{
    nom: string;
    valeur: number;
    couleur: string;
  }>;
}

export const getDashboardSummary = async (year?: number, month?: number): Promise<DashboardSummary> => {
  // Option pour forcer les données de test (à retirer en production)
  const FORCE_TEST_DATA = false; // Mettre à true pour tester l'affichage
  
  if (FORCE_TEST_DATA) {

    return {
      solde: 125000,
      total_revenus: 200000,
      total_depenses: 75000,
      statistiques_mensuelles: {
        total_revenus: 200000,
        total_depenses: 75000,
        solde: 125000,
        nombre_transactions: 15
      },
      depenses_par_categorie: [
        {
          categorie_id: 1,
          nom_categorie: 'Alimentation',
          couleur_categorie: '#EF4444',
          nombre_transactions: 5,
          montant_total: 25000
        },
        {
          categorie_id: 2,
          nom_categorie: 'Transport',
          couleur_categorie: '#3B82F6',
          nombre_transactions: 3,
          montant_total: 15000
        },
        {
          categorie_id: 3,
          nom_categorie: 'Loisirs',
          couleur_categorie: '#EC4899',
          nombre_transactions: 2,
          montant_total: 10000
        }
      ],
      evolution_six_mois: [
        { mois: 'Jan', revenus: 180000, depenses: 65000, solde: 115000 },
        { mois: 'Fév', revenus: 190000, depenses: 70000, solde: 120000 },
        { mois: 'Mar', revenus: 175000, depenses: 80000, solde: 95000 },
        { mois: 'Avr', revenus: 200000, depenses: 75000, solde: 125000 },
        { mois: 'Mai', revenus: 210000, depenses: 85000, solde: 125000 },
        { mois: 'Juin', revenus: 200000, depenses: 75000, solde: 125000 }
      ]
    };
  }

  try {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    

    const response = await api.get(`/dashboard/summary?${params.toString()}`);

    return response.data;
  } catch (error: any) {
    // Retourner des données par défaut en cas d'erreur
    const fallbackData = {
      solde: 0,
      total_revenus: 0,
      total_depenses: 0,
      statistiques_mensuelles: {
        total_revenus: 0,
        total_depenses: 0,
        solde: 0,
        nombre_transactions: 0
      },
      depenses_par_categorie: [],
      evolution_six_mois: []
    };
    

    return fallbackData;
  }
};

export const getMonthlyStats = async (month: string): Promise<MonthlyStats> => {
  try {
    const response = await api.get(`/dashboard/monthly-stats?month=${month}`);

    return response.data;
  } catch (error) {
    return {
      mois: month,
      revenus: 0,
      depenses: 0,
      solde: 0
    };
  }
};

export const getDashboardStats = async (startDate: string, endDate: string, type?: string) => {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    if (type) params.append('type', type);
    
    const response = await api.get(`/dashboard/stats?${params.toString()}`);

    return response.data;
  } catch (error) {
    return {};
  }
};

export const getChartData = async (startDate: string, endDate: string, chartType?: string): Promise<ChartData> => {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    if (chartType) params.append('chartType', chartType);
    
    const response = await api.get(`/dashboard/charts?${params.toString()}`);

    return response.data;
  } catch (error) {
    return {};
  }
};

export const getCategoryBreakdown = async (type?: string, startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/dashboard/category-breakdown?${params.toString()}`);

    return response.data;
  } catch (error) {
    return [];
  }
};
