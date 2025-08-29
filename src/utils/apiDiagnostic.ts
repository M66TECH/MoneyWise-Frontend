import api from '../services/api';

export const runApiDiagnostic = async () => {
  console.log('🔍 === DIAGNOSTIC DE L\'API ===');
  
  try {
    // 1. Test de connectivité de base
    console.log('\n🌐 1. Test de connectivité de base...');
    const baseResponse = await api.get('/health');
    console.log('✅ API accessible:', baseResponse.data);
    
    // 2. Test des endpoints disponibles
    console.log('\n📋 2. Test des endpoints disponibles...');
    
    const endpoints = [
      '/transactions',
      '/categories',
      '/dashboard',
      '/notifications/check-user',
      '/auth/profile'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Test de ${endpoint}...`);
        const response = await api.get(endpoint);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error: any) {
        console.log(`❌ ${endpoint} - Status: ${error.response?.status} - Message: ${error.response?.data?.message || error.message}`);
      }
    }
    
    // 3. Test de l'authentification
    console.log('\n🔐 3. Test de l\'authentification...');
    const token = localStorage.getItem('token');
    console.log('Token présent:', !!token);
    
    if (token) {
      try {
        const authResponse = await api.get('/auth/profile');
        console.log('✅ Authentification valide:', authResponse.data);
      } catch (error: any) {
        console.log('❌ Erreur d\'authentification:', error.response?.status, error.response?.data);
      }
    }
    
    // 4. Test de création de transaction avec endpoint alternatif
    console.log('\n📝 4. Test de création avec endpoint alternatif...');
    
    const testData = {
      amount: 1000,
      description: 'Test API diagnostic',
      type: 'depense',
      userId: 23,
      categoryId: 2,
      date: new Date().toISOString()
    };
    
    try {
      // Essayer différents endpoints possibles
      const endpoints = [
        '/transactions',
        '/transaction',
        '/api/transactions',
        '/api/transaction'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Test POST ${endpoint}...`);
          const response = await api.post(endpoint, testData);
          console.log(`✅ POST ${endpoint} réussi:`, response.data);
          break;
        } catch (error: any) {
          console.log(`❌ POST ${endpoint} échoué: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error: any) {
      console.log('❌ Tous les endpoints de création ont échoué');
    }
    
    console.log('\n🎉 === DIAGNOSTIC API TERMINÉ ===');
    return { success: true, message: 'Diagnostic API terminé' };
    
  } catch (error: any) {
    console.error('\n❌ === ERREUR DANS LE DIAGNOSTIC API ===');
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

export const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
  console.log(`🧪 Test ${method} ${endpoint}...`);
  
  try {
    let response;
    switch (method) {
      case 'GET':
        response = await api.get(endpoint);
        break;
      case 'POST':
        response = await api.post(endpoint, data);
        break;
      case 'PUT':
        response = await api.put(endpoint, data);
        break;
      case 'DELETE':
        response = await api.delete(endpoint);
        break;
    }
    
    console.log(`✅ ${method} ${endpoint} réussi:`, response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(`❌ ${method} ${endpoint} échoué: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};
