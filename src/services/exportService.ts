import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moneywise-backend-187q.onrender.com/api';

interface ReportParams {
  year: number;
  month?: number;
  format?: 'pdf' | 'csv' | 'json';
}

class ExportService {
  private getToken(): string | null {
    // Récupérer le token depuis localStorage ou cookies
    return localStorage.getItem('token') || 
           document.cookie.split('; ').find(row => row.startsWith('moneywise_token='))?.split('=')[1] ||
           null;
  }

  private getAuthHeaders() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Télécharger un fichier depuis une URL
  private async downloadFileFromUrl(url: string, filename: string): Promise<void> {
    try {
      const headers = this.getAuthHeaders();


      const response = await axios.get(url, {
        headers,
        responseType: 'blob',
        timeout: 30000
      });


      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error('❌ Erreur téléchargement:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Erreur d\'authentification. Veuillez vous reconnecter.');
      } else if (error.response?.status === 404) {
        throw new Error('Service d\'export non disponible.');
      } else {
        throw new Error(`Erreur lors du téléchargement: ${error.message}`);
      }
    }
  }

  // Exporter les transactions
  async exportTransactions(
    format: 'pdf' | 'csv' | 'json' = 'pdf',
    startDate?: string,
    endDate?: string,
    type?: 'revenu' | 'depense' | 'hybride'
  ): Promise<void> {
    try {
      let url: string;
      let filename: string;

      // Construire l'URL avec les paramètres optionnels
      const params = new URLSearchParams();
      
      if (format !== 'pdf') {
        params.append('format', format);
      }
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      if (type) {
        params.append('type', type);
      }

      if (format === 'pdf') {
        url = `${API_BASE_URL}/export/transactions/pdf`;
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        filename = `transactions_${startDate || 'all'}_${endDate || 'all'}.pdf`;
      } else {
        url = `${API_BASE_URL}/export/transactions?${params.toString()}`;
        filename = `transactions_${startDate || 'all'}_${endDate || 'all'}.${format}`;
      }


      await this.downloadFileFromUrl(url, filename);
    } catch (error) {
      console.error('Erreur export transactions:', error);
      throw error;
    }
  }

  // Générer un rapport mensuel
  async generateMonthlyReport(params: ReportParams): Promise<void> {
    const { year, month, format = 'pdf' } = params;

    if (!month) {
      throw new Error('Le mois est requis pour un rapport mensuel');
    }

    let url: string;
    let filename: string;

    if (format === 'pdf') {
      url = `${API_BASE_URL}/export/report/monthly/${year}/${month}/pdf`;
      filename = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.pdf`;
    } else {
      url = `${API_BASE_URL}/export/report/monthly/${year}/${month}?format=${format}`;
      filename = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.${format}`;
    }

    
    
    await this.downloadFileFromUrl(url, filename);
  }

  // Générer un rapport annuel
  async generateYearlyReport(params: ReportParams): Promise<void> {
    const { year, format = 'pdf' } = params;

    let url: string;
    let filename: string;

    if (format === 'pdf') {
      url = `${API_BASE_URL}/export/report/yearly/${year}/pdf`;
      filename = `rapport_annuel_${year}.pdf`;
    } else {
      url = `${API_BASE_URL}/export/report/yearly/${year}?format=${format}`;
      filename = `rapport_annuel_${year}.${format}`;
    }

    
    
    await this.downloadFileFromUrl(url, filename);
  }

  // Méthodes utilitaires pour la compatibilité
  generateFilename(type: string, startDate: string, endDate: string, format: string): string {
    return `${type}_${startDate}_${endDate}.${format}`;
  }

  generateReportFilename(type: 'monthly' | 'yearly', year: number, format: string, month?: number): string {
    if (type === 'monthly' && month) {
      return `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.${format}`;
    }
    return `rapport_annuel_${year}.${format}`;
  }

  // Tester la connexion au backend
  async testConnection(): Promise<boolean> {
    try {
  
      
      await axios.get(`${API_BASE_URL}/transactions`, {
        headers: this.getAuthHeaders(),
        timeout: 5000
      });
      
      
      return true;
    } catch (error: any) {
      console.error('❌ Erreur de connexion au backend:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else if (error.response?.status === 401) {
        throw new Error('Token d\'authentification manquant ou expiré');
      } else if (error.response?.status === 500) {
        throw new Error('Erreur serveur interne');
      } else if (error.response?.status === 404) {
        throw new Error('Service d\'export non disponible');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        throw new Error(`Erreur de connexion: ${error.message}`);
      }
    }
  }
}

export const exportService = new ExportService();
export default exportService;
