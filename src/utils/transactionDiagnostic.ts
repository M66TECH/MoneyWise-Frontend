import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../services/transactionService';
import api from '../services/api';
import type { CreateTransactionData, UpdateTransactionData } from '../types';

export const runTransactionDiagnostic = async () => {
  console.log('🔍 === DIAGNOSTIC COMPLET DU SYSTÈME DE TRANSACTIONS ===');
  
  try {
    // 1. Test de récupération des transactions existantes
    console.log('\n📋 1. Test de récupération des transactions...');
    const existingTransactions = await getTransactions();
    console.log(`✅ ${existingTransactions.length} transactions récupérées`);
    console.log('📊 Exemple de transaction:', existingTransactions[0]);
    
    // 2. Test de création d'une nouvelle transaction
    console.log('\n📝 2. Test de création d\'une nouvelle transaction...');
    
    // Récupérer d'abord les catégories disponibles
    console.log('📂 Récupération des catégories...');
    const categoriesResponse = await api.get('/categories');
    const categories = categoriesResponse.data.categories || categoriesResponse.data || [];
    
    if (categories.length === 0) {
      throw new Error('Aucune catégorie disponible pour le test');
    }
    
    const validCategory = categories[0];
    console.log(`✅ Catégorie sélectionnée: ID ${validCategory.id} - ${validCategory.nom}`);
    
    const testTransactionData: CreateTransactionData = {
      montant: 1000,
      description: 'Test diagnostic',
      type: validCategory.type === 'hybride' ? 'depense' : validCategory.type,
      utilisateur_id: 23, // ID utilisateur actuel
      categorie_id: validCategory.id // ID catégorie valide
    };
    
    console.log('📤 Données de test:', testTransactionData);
    const newTransaction = await createTransaction(testTransactionData);
    console.log('✅ Transaction créée:', newTransaction);
    
    // 3. Test de mise à jour de la transaction
    console.log('\n✏️ 3. Test de mise à jour de la transaction...');
    const updateData: UpdateTransactionData = {
      montant: 1500,
      description: 'Test diagnostic modifié'
    };
    
    console.log('📤 Données de mise à jour:', updateData);
    const updatedTransaction = await updateTransaction(newTransaction.id, updateData);
    console.log('✅ Transaction mise à jour:', updatedTransaction);
    
    // 4. Test de suppression de la transaction
    console.log('\n🗑️ 4. Test de suppression de la transaction...');
    await deleteTransaction(newTransaction.id);
    console.log('✅ Transaction supprimée');
    
    // 5. Vérification finale
    console.log('\n🔍 5. Vérification finale...');
    const finalTransactions = await getTransactions();
    console.log(`✅ ${finalTransactions.length} transactions après test`);
    
    console.log('\n🎉 === DIAGNOSTIC TERMINÉ AVEC SUCCÈS ===');
    return { success: true, message: 'Tous les tests ont réussi' };
    
  } catch (error: any) {
    console.error('\n❌ === ERREUR DANS LE DIAGNOSTIC ===');
    console.error('Erreur:', error);
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export const testTransactionCreation = async (data: CreateTransactionData) => {
  console.log('🧪 Test de création de transaction spécifique...');
  console.log('📤 Données:', data);
  
  try {
    const result = await createTransaction(data);
    console.log('✅ Résultat:', result);
    return { success: true, transaction: result };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};
