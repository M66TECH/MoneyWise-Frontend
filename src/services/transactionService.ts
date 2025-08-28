import api from './api';
import type { Transaction, CreateTransactionData, UpdateTransactionData } from '../types';

// Récupérer toutes les transactions de l'utilisateur connecté
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/transactions');

    
    // Le backend renvoie { transactions: [...], pagination: {...} }
    const transactions = response.data.transactions || response.data || [];
    const data = Array.isArray(transactions) ? transactions : [];
    
    // Convertir les données du backend vers notre format frontend
    return data.map((transaction: any) => ({
      id: transaction.id,
      montant: transaction.montant || transaction.amount,
      description: transaction.description,
      type: transaction.type, // Le backend envoie déjà 'revenu' ou 'depense'
      date_creation: transaction.date_creation || transaction.createdAt,
      date_transaction: transaction.date_transaction || transaction.date,
      utilisateur_id: transaction.utilisateur_id || transaction.userId,
      categorie_id: transaction.categorie_id || transaction.categoryId
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    return [];
  }
};

// Récupérer les transactions récentes
export const getRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/transactions?limit=${limit}`);

    
    // Le backend renvoie { transactions: [...], pagination: {...} }
    const transactions = response.data.transactions || response.data || [];
    const data = Array.isArray(transactions) ? transactions : [];
    
    // Convertir les données du backend vers notre format frontend
    return data.map((transaction: any) => ({
      id: transaction.id,
      montant: transaction.montant || transaction.amount,
      description: transaction.description,
      type: transaction.type, // Le backend envoie déjà 'revenu' ou 'depense'
      date_creation: transaction.date_creation || transaction.createdAt,
      date_transaction: transaction.date_transaction || transaction.date,
      utilisateur_id: transaction.utilisateur_id || transaction.userId,
      categorie_id: transaction.categorie_id || transaction.categoryId
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions récentes:', error);
    return [];
  }
};

// Créer une nouvelle transaction
export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  try {
    // Préparer les données avec les noms de champs attendus par le backend
    const transactionData = {
      amount: data.montant,
      description: data.description || null,
      type: data.type, // Garder 'revenu' ou 'depense'
      userId: data.utilisateur_id,
      categoryId: data.categorie_id,
      date: new Date().toISOString()
    };
    
            
            
            const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error: any) {
    console.error('Erreur détaillée lors de la création:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    throw error;
  }
};

// Mettre à jour une transaction
export const updateTransaction = async (id: number, data: UpdateTransactionData): Promise<Transaction> => {
  try {
    // Convertir les noms de champs pour le backend
    const updateData: any = {};
    if (data.montant !== undefined) updateData.amount = data.montant;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type; // Garder 'revenu' ou 'depense'
    if (data.categorie_id !== undefined) updateData.categoryId = data.categorie_id;
    

    const response = await api.put(`/transactions/${id}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error.response?.data || error.message);
    throw error;
  }
};

// Supprimer une transaction
export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

// Récupérer les transactions par catégorie
export const getTransactionsByCategory = async (categoryId: number): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/transactions/category/${categoryId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions par catégorie:', error);
    return [];
  }
};

// Récupérer les transactions par période
export const getTransactionsByPeriod = async (startDate: string, endDate: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/transactions/period?startDate=${startDate}&endDate=${endDate}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions par période:', error);
    return [];
  }
};
