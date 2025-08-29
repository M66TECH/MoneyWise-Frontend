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
      
      // Le backend renvoie { message: "...", transaction: {...} }
      const responseTransactionData = response.data.transaction || response.data;
      
      // Convertir la réponse du backend vers notre format frontend
      const newTransaction: Transaction = {
        id: responseTransactionData.id,
        montant: responseTransactionData.montant || responseTransactionData.amount,
        description: responseTransactionData.description || undefined,
        type: responseTransactionData.type,
        date_creation: responseTransactionData.date_creation || responseTransactionData.createdAt || new Date().toISOString(),
        date_transaction: responseTransactionData.date_transaction || responseTransactionData.date || new Date().toISOString(),
        utilisateur_id: responseTransactionData.utilisateur_id || responseTransactionData.userId,
        categorie_id: responseTransactionData.categorie_id || responseTransactionData.categoryId
      };
      
      return newTransaction;
    } catch (error: any) {
      throw error;
    }
};

  // Mettre à jour une transaction
  export const updateTransaction = async (id: number, data: UpdateTransactionData): Promise<Transaction> => {
    try {
      // Convertir les noms de champs pour le backend selon la documentation
      const updateData: any = {};
      
      // Vérifier et ajouter chaque champ
      if (data.montant !== undefined && data.montant !== null) {
        updateData.amount = data.montant;
      }
      
      if (data.description !== undefined && data.description !== null) {
        updateData.description = data.description;
      }
      
      if (data.type !== undefined && data.type !== null) {
        updateData.type = data.type; // Garder 'revenu' ou 'depense'
      }
      
      if (data.categorie_id !== undefined && data.categorie_id !== null) {
        updateData.categoryId = data.categorie_id;
      }
      
      // Ajouter la date obligatoire
      updateData.date = new Date().toISOString();
      
      const response = await api.put(`/transactions/${id}`, updateData, {
        timeout: 10000 // 10 secondes
      });
      
      // Vérifier que la réponse contient les données attendues
      if (!response.data) {
        throw new Error('Réponse vide du serveur');
      }
      
      // Le backend renvoie { message: "...", transaction: {...} }
      const transactionData = response.data.transaction || response.data;
      
      if (!transactionData.id) {
        throw new Error('ID manquant dans la réponse du serveur');
      }
      
      // Convertir la réponse du backend vers notre format frontend
      const updatedTransaction: Transaction = {
        id: transactionData.id,
        montant: transactionData.montant || transactionData.amount,
        description: transactionData.description,
        type: transactionData.type,
        date_creation: transactionData.date_creation || transactionData.createdAt,
        date_transaction: transactionData.date_transaction || transactionData.date,
        utilisateur_id: transactionData.utilisateur_id || transactionData.userId,
        categorie_id: transactionData.categorie_id || transactionData.categoryId
      };
      
      return updatedTransaction;
    } catch (error: any) {
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
    return [];
  }
};

// Récupérer les transactions par période
export const getTransactionsByPeriod = async (startDate: string, endDate: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/transactions/period?startDate=${startDate}&endDate=${endDate}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};
