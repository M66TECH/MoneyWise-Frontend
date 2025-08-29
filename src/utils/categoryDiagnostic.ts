import api from '../services/api';

export const runCategoryDiagnostic = async () => {
  console.log('🔍 === DIAGNOSTIC DES CATÉGORIES ===');
  
  try {
    // 1. Récupérer toutes les catégories
    console.log('\n📋 1. Récupération des catégories...');
    const response = await api.get('/categories');
    console.log('✅ Réponse brute:', response.data);
    
    const categories = response.data.categories || response.data || [];
    console.log(`📊 ${categories.length} catégories trouvées:`);
    
    categories.forEach((cat: any, index: number) => {
      console.log(`  ${index + 1}. ID: ${cat.id}, Nom: ${cat.nom}, Type: ${cat.type}, Couleur: ${cat.couleur}`);
    });
    
    // 2. Tester la création avec une catégorie valide
    if (categories.length > 0) {
      console.log('\n📝 2. Test de création avec catégorie valide...');
      const validCategory = categories[0];
      
      const testData = {
        amount: 1000,
        description: 'Test avec catégorie valide',
        type: validCategory.type === 'hybride' ? 'depense' : validCategory.type,
        userId: 23,
        categoryId: validCategory.id,
        date: new Date().toISOString()
      };
      
      console.log('📤 Données de test:', testData);
      
      try {
        const createResponse = await api.post('/transactions', testData);
        console.log('✅ Création réussie:', createResponse.data);
        
        // Supprimer la transaction de test
        if (createResponse.data.id) {
          console.log('🗑️ Suppression de la transaction de test...');
          await api.delete(`/transactions/${createResponse.data.id}`);
          console.log('✅ Transaction de test supprimée');
        }
      } catch (error: any) {
        console.log('❌ Création échouée:', error.response?.status, error.response?.data);
      }
    }
    
    // 3. Vérifier la structure des données
    console.log('\n🔍 3. Structure des données...');
    if (categories.length > 0) {
      const sampleCategory = categories[0];
      console.log('📊 Exemple de catégorie:', {
        id: sampleCategory.id,
        nom: sampleCategory.nom,
        type: sampleCategory.type,
        couleur: sampleCategory.couleur,
        utilisateur_id: sampleCategory.utilisateur_id,
        date_creation: sampleCategory.date_creation
      });
    }
    
    console.log('\n🎉 === DIAGNOSTIC DES CATÉGORIES TERMINÉ ===');
    return { 
      success: true, 
      categories: categories,
      count: categories.length
    };
    
  } catch (error: any) {
    console.error('\n❌ === ERREUR DANS LE DIAGNOSTIC DES CATÉGORIES ===');
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
