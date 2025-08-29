import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moneywise-backend-187q.onrender.com/api';

// Types pour les alertes
export interface Alerte {
  type: 'danger' | 'warning' | 'info' | 'success';
  message: string;
  severite: 'low' | 'medium' | 'high' | 'critical';
  code?: string;
}

export interface CustomAlert {
  type: 'danger' | 'warning' | 'info' | 'success';
  message: string;
  severite: 'low' | 'medium' | 'high' | 'critical';
  code?: string;
}

export interface AlertResponse {
  alertes: Alerte[];
  emailSent: boolean;
  message: string;
  success?: boolean;
  utilisateur?: {
    id: number;
    email: string;
    prenom: string;
  };
}

export interface AlertStatus {
  isRunning: boolean;
  lastCheck: string;
}

export interface FinancialStats {
  solde: number;
  total_revenus: number;
  total_depenses: number;
  depenses_mensuelles: number; // Dépenses du mois en cours
  revenus_mensuels: number; // Revenus du mois en cours
  nombre_transactions: number;
  derniere_transaction?: Date;
}

class AlertService {
  private token: string | null = null;
  private autoCheckInterval: number | null = null;
  private alertesChangeCallbacks: ((alertes: Alerte[]) => void)[] = [];
  private statusCallbacks: ((status: AlertStatus) => void)[] = [];
  private currentAlertes: Alerte[] = [];

  // Initialiser le service avec le token d'authentification
  init(token: string): void {
    this.token = token;
  }

  // Obtenir les headers d'authentification
  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Envoyer une alerte personnalisée unique
  async sendCustomAlert(
    utilisateur_id: number,
    alerte: CustomAlert,
    envoyerEmail: boolean = true
  ): Promise<AlertResponse> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-custom-alert`,
        {
          utilisateur_id,
          type: alerte.type,
          severite: alerte.severite,
          message: alerte.message,
          code: alerte.code,
          envoyerEmail
        },
        {
          headers: this.getAuthHeaders(),
          timeout: 10000
        }
      );

      const result: AlertResponse = response.data;
      
      if (result.success) {
        // Ajouter l'alerte à la liste courante
        this.currentAlertes.push(alerte);
        this.notifyAlertesChange(this.currentAlertes);
      }
      
      return result;
    } catch (error: any) {
      throw new Error('Erreur lors de l\'envoi d\'alerte personnalisée');
    }
  }

  // Envoyer plusieurs alertes personnalisées
  async sendMultipleAlerts(
    utilisateur_id: number,
    alertes: CustomAlert[],
    envoyerEmail: boolean = true
  ): Promise<AlertResponse> {
    console.log('📤 Début de sendMultipleAlerts');
    console.log('👤 ID utilisateur:', utilisateur_id);
    console.log('📋 Alertes à envoyer:', alertes);
    console.log('📧 Envoyer email:', envoyerEmail);
    
    try {
      if (!this.token) {
        console.error('❌ Token d\'authentification manquant');
        throw new Error('Token d\'authentification manquant');
      }

      console.log('🌐 Envoi de la requête à:', `${API_BASE_URL}/notifications/send-multiple-alerts`);
      
      const requestData = {
        utilisateur_id,
        alertes,
        envoyerEmail
      };
      
      console.log('📤 Données de la requête:', requestData);

      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-multiple-alerts`,
        requestData,
        {
          headers: this.getAuthHeaders(),
          timeout: 15000
        }
      );

      console.log('📥 Réponse reçue:', response.data);
      const result: AlertResponse = response.data;
      
      if (result.success) {
        console.log('✅ Alertes envoyées avec succès');
        // Ajouter les alertes à la liste courante
        this.currentAlertes = [...this.currentAlertes, ...alertes];
        this.notifyAlertesChange(this.currentAlertes);
      } else {
        console.log('⚠️ Alertes envoyées mais avec des avertissements:', result.message);
      }
      
      return result;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi d\'alertes multiples:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Retourner un résultat d'erreur au lieu de lancer une exception
      return {
        alertes: alertes,
        emailSent: false,
        message: `Erreur lors de l'envoi des alertes: ${error.message}`,
        success: false
      };
    }
  }

  // Déterminer les alertes basées sur les statistiques financières
  determinerAlertes(statistiques: FinancialStats): CustomAlert[] {
    const alertes: CustomAlert[] = [];

    // Utiliser les valeurs d'alertes si elles existent, sinon les valeurs normales
    const revenusMensuels = (statistiques as any).revenus_mensuels_alertes || statistiques.revenus_mensuels;
    const depensesMensuelles = (statistiques as any).depenses_mensuelles_alertes || statistiques.depenses_mensuelles;

    // 1. Vérifier le solde négatif (CRITIQUE)
    if (statistiques.solde < 0) {
      const deficit = Math.abs(statistiques.solde);
      alertes.push({
        type: 'danger',
        severite: 'critical',
        message: `🚨 URGENCE FINANCIÈRE : Votre compte présente un déficit de ${deficit.toLocaleString('fr-FR')} FCFA. 
        
 Actions recommandées :
• Réduire immédiatement vos dépenses non essentielles
• Identifier les sources de revenus supplémentaires
• Considérer un prêt temporaire si nécessaire
• Contacter votre conseiller financier

 Ce déficit peut entraîner des frais bancaires supplémentaires.`,
        code: 'SOLDE_NEGATIF'
      });
    }

    // 2. Vérifier les dépenses élevées (>80% des revenus mensuels)
    if (revenusMensuels > 0) {
      const ratioDepenses = (depensesMensuelles / revenusMensuels) * 100;
      if (ratioDepenses > 80) {
        const economieRecommandee = revenusMensuels * 0.2; // 20% d'épargne recommandée
        alertes.push({
          type: 'warning',
          severite: 'high',
          message: `⚠️ DÉPENSES EXCESSIVES : Vos dépenses (${depensesMensuelles.toLocaleString('fr-FR')} FCFA) consomment ${ratioDepenses.toFixed(1)}% de vos revenus (${revenusMensuels.toLocaleString('fr-FR')} FCFA).

 Analyse :
• Seuil critique : 80% (dépassé de ${(ratioDepenses - 80).toFixed(1)}%)
• Épargne recommandée : ${economieRecommandee.toLocaleString('fr-FR')} FCFA/mois
• Marge de sécurité : ${(revenusMensuels - depensesMensuelles).toLocaleString('fr-FR')} FCFA

Conseils :
• Réviser vos dépenses non essentielles
• Établir un budget strict pour le mois prochain
• Considérer la règle 50/30/20 (besoins/plaisirs/épargne)`,
          code: 'DEPENSES_ELEVEES'
        });
      }
    }

    // 3. Vérifier le solde faible (<15% des dépenses mensuelles) - SEUIL CRITIQUE
    if (depensesMensuelles > 0) {
      const ratioSolde = (statistiques.solde / depensesMensuelles) * 100;
      
      if (ratioSolde < 15) {
        const soldeRecommandee = depensesMensuelles * 0.3; // 30% recommandé
        const deficit = soldeRecommandee - statistiques.solde;
        alertes.push({
          type: 'danger',
          severite: 'critical',
          message: `🚨 SEUIL CRITIQUE ATTEINT : Votre solde (${statistiques.solde.toLocaleString('fr-FR')} FCFA) ne couvre que ${ratioSolde.toFixed(1)}% de vos dépenses mensuelles (${depensesMensuelles.toLocaleString('fr-FR')} FCFA).

Situation critique :
• Seuil minimum : 15% (actuellement ${ratioSolde.toFixed(1)}%)
• Solde recommandé : ${soldeRecommandee.toLocaleString('fr-FR')} FCFA
• Déficit de sécurité : ${deficit.toLocaleString('fr-FR')} FCFA

Actions immédiates :
• Réduire drastiquement vos dépenses
• Identifier les sources de revenus d'urgence
• Considérer un report de paiements non essentiels
• Contacter vos créanciers pour des arrangements

Risque de découvert bancaire imminent !`,
          code: 'SOLDE_CRITIQUE_DEPENSES'
        });
      }
    }

    // 3.5. Vérifier le solde qui se rapproche du seuil critique (<20% des dépenses mensuelles) - ALERTE PRÉVENTIVE
    if (depensesMensuelles > 0) {
      const ratioSolde = (statistiques.solde / depensesMensuelles) * 100;
      
      if (ratioSolde >= 15 && ratioSolde < 20) {
        const margeSecurite = ratioSolde - 15;
        const economieNecessaire = depensesMensuelles * 0.05; // 5% pour atteindre 20%
        alertes.push({
          type: 'warning',
          severite: 'high',
          message: `⚠️ ALERTE PRÉVENTIVE : Votre solde (${statistiques.solde.toLocaleString('fr-FR')} FCFA) représente ${ratioSolde.toFixed(1)}% de vos dépenses mensuelles (${depensesMensuelles.toLocaleString('fr-FR')} FCFA).

Analyse préventive :
• Marge avant seuil critique : ${margeSecurite.toFixed(1)}%
• Économie nécessaire : ${economieNecessaire.toLocaleString('fr-FR')} FCFA pour atteindre 20%
• Seuil critique : 15% (${(depensesMensuelles * 0.15).toLocaleString('fr-FR')} FCFA)

Actions recommandées :
• Réduire vos dépenses de ${economieNecessaire.toLocaleString('fr-FR')} FCFA ce mois
• Éviter les achats non essentiels
• Augmenter vos revenus si possible
• Établir un plan d'épargne d'urgence

Surveillez attentivement vos finances cette semaine !`,
          code: 'SOLDE_RAPPROCHE_CRITIQUE'
        });
      }
    }

    // 4. Vérifier l'inactivité (>7 jours sans transaction)
    if (statistiques.derniere_transaction) {
      const joursInactivite = Math.floor((Date.now() - statistiques.derniere_transaction.getTime()) / (1000 * 60 * 60 * 24));
      if (joursInactivite > 7) {
        const derniereDate = statistiques.derniere_transaction.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        alertes.push({
          type: 'info',
          severite: 'low',
          message: `INACTIVITÉ DÉTECTÉE : Aucune transaction enregistrée depuis ${joursInactivite} jours.

Dernière activité :
• Date : ${derniereDate}
• Période d'inactivité : ${joursInactivite} jours

Recommandations :
• Mettre à jour vos transactions récentes
• Vérifier vos relevés bancaires
• Saisir les dépenses en attente
• Planifier vos prochaines transactions

Une mise à jour régulière améliore la précision de vos analyses !`,
          code: 'INACTIVITE'
        });
      }
    }

    // 5. Alerte de succès si le solde est positif et les dépenses sont sous contrôle
    if (statistiques.solde > 0 && revenusMensuels > 0) {
      const ratioDepenses = (depensesMensuelles / revenusMensuels) * 100;
      if (ratioDepenses < 60) {
        const epargne = revenusMensuels - depensesMensuelles;
        const tauxEpargne = ((revenusMensuels - depensesMensuelles) / revenusMensuels) * 100;
        alertes.push({
          type: 'success',
          severite: 'low',
          message: `✅ EXCELLENTE GESTION FINANCIÈRE ! Vos finances sont en excellente santé.

Performance exceptionnelle :
• Dépenses : ${ratioDepenses.toFixed(1)}% de vos revenus (objectif < 60%)
• Épargne mensuelle : ${epargne.toLocaleString('fr-FR')} FCFA
• Taux d'épargne : ${tauxEpargne.toFixed(1)}%
• Solde actuel : ${statistiques.solde.toLocaleString('fr-FR')} FCFA

Objectifs atteints :
• ✅ Respect de la règle 50/30/20
• ✅ Épargne significative
• ✅ Solde positif confortable

Conseils pour maintenir :
• Continuez vos bonnes habitudes
• Considérez investir votre épargne
• Planifiez vos objectifs financiers à long terme
• Partagez vos bonnes pratiques !

🌟 Vous êtes un exemple de gestion financière responsable !`,
          code: 'BONNE_GESTION'
        });
      }
    }

    // 6. Alerte pour solde positif mais faible (<30% des dépenses mensuelles)
    if (statistiques.solde > 0 && depensesMensuelles > 0) {
      const ratioSolde = (statistiques.solde / depensesMensuelles) * 100;
      if (ratioSolde >= 20 && ratioSolde < 30) {
        const soldeRecommandee = depensesMensuelles * 0.5; // 50% recommandé
        alertes.push({
          type: 'info',
          severite: 'medium',
          message: `📊 SOLDE POSITIF MAIS LIMITÉ : Votre solde (${statistiques.solde.toLocaleString('fr-FR')} FCFA) couvre ${ratioSolde.toFixed(1)}% de vos dépenses mensuelles.

Objectif d'amélioration :
• Solde recommandé : ${soldeRecommandee.toLocaleString('fr-FR')} FCFA (50% des dépenses)
• Économie nécessaire : ${(soldeRecommandee - statistiques.solde).toLocaleString('fr-FR')} FCFA

Stratégies d'amélioration :
• Augmenter progressivement votre épargne
• Réduire les dépenses non essentielles
• Chercher des sources de revenus supplémentaires
• Établir un fonds d'urgence

Vous êtes sur la bonne voie, continuez vos efforts !`,
          code: 'SOLDE_LIMITE'
        });
      }
    }

    // 7. Alerte pour revenus insuffisants par rapport aux dépenses
    if (revenusMensuels > 0 && depensesMensuelles > revenusMensuels) {
      const deficit = depensesMensuelles - revenusMensuels;
      alertes.push({
        type: 'warning',
        severite: 'high',
        message: `⚠️ REVENUS INSUFFISANTS : Vos dépenses (${depensesMensuelles.toLocaleString('fr-FR')} FCFA) dépassent vos revenus (${revenusMensuels.toLocaleString('fr-FR')} FCFA).

Analyse du déficit :
• Déficit mensuel : ${deficit.toLocaleString('fr-FR')} FCFA
• Taux de couverture : ${((revenusMensuels / depensesMensuelles) * 100).toFixed(1)}%

Actions prioritaires :
• Réduire immédiatement vos dépenses de ${deficit.toLocaleString('fr-FR')} FCFA
• Identifier et éliminer les dépenses non essentielles
• Chercher des sources de revenus supplémentaires
• Considérer un second emploi ou des activités freelance

Cette situation n'est pas durable à long terme !`,
        code: 'REVENUS_INSUFFISANTS'
      });
    }

    return alertes;
  }

  // Vérifier les alertes avec détermination automatique
  async checkAlerts(statistiques: FinancialStats, envoyerEmail: boolean = true): Promise<AlertResponse> {
    // Déclarer alertes en dehors du try pour qu'elle soit accessible dans le catch
    let alertes: CustomAlert[] = [];
    
    try {
      // Déterminer les alertes basées sur les statistiques
      alertes = this.determinerAlertes(statistiques);
      
      if (alertes.length === 0) {
        this.currentAlertes = [];
        this.notifyAlertesChange([]);
        return {
          alertes: alertes,
          emailSent: false,
          message: 'Aucune alerte détectée',
          success: true
        };
      }

      // Récupérer l'ID utilisateur depuis le token ou le stockage
      let utilisateur_id = this.getUserIdFromToken();
      
      if (!utilisateur_id) {
        utilisateur_id = this.getUserIdFromStorage();
      }
      
      if (!utilisateur_id) {
        throw new Error('Impossible de récupérer l\'ID utilisateur');
      }

      // Essayer d'abord l'endpoint check-user selon la documentation
      try {
        const checkResult = await this.checkUserAlerts(utilisateur_id, alertes, envoyerEmail);
        if (checkResult.success) {
          return checkResult;
        }
      } catch (checkError) {
        // Fallback vers l'ancien endpoint
      }

      // Fallback vers l'ancien endpointt
      const result = await this.sendMultipleAlerts(utilisateur_id, alertes, envoyerEmail);
      

      
      return result;
    } catch (error: any) {
      // Retourner un résultat d'erreur au lieu de lancer une exception
      return {
        alertes: alertes || [],
        emailSent: false,
        message: `Erreur lors de la vérification des alertes: ${error.message}`,
        success: false
      };
    }
  }

  // Méthode pour récupérer l'ID utilisateur depuis le token
  private getUserIdFromToken(): number | null {
    if (!this.token) {
      return null;
    }
    
    try {
      // Décoder le token JWT pour extraire l'ID utilisateur
      const parts = this.token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      // Gérer les caractères spéciaux dans le base64
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      
      // Essayer différentes clés possibles pour l'ID utilisateur
      const userId = payload.user_id || payload.id || payload.userId || payload.user?.id || payload.sub || payload.utilisateur_id;
      
      if (userId) {
        return typeof userId === 'string' ? parseInt(userId, 10) : userId;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Méthode alternative pour récupérer l'ID utilisateur depuis le localStorage
  private getUserIdFromStorage(): number | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.id) {
          return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        }
      }
      
      // Essayer aussi les cookies
      const userDataCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('userData='));
      
      if (userDataCookie) {
        const userDataValue = decodeURIComponent(userDataCookie.split('=')[1]);
        const user = JSON.parse(userDataValue);
        if (user && user.id) {
          return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  // Méthode pour vérifier les alertes utilisateur selon la documentation backend
  async checkUserAlerts(
    utilisateur_id: number,
    alertes: CustomAlert[],
    envoyerEmail: boolean = true
  ): Promise<AlertResponse> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const requestData = {
        utilisateur_id,
        alertes,
        envoyerEmail
      };

      const response = await axios.post(
        `${API_BASE_URL}/notifications/check-user`,
        requestData,
        {
          headers: this.getAuthHeaders(),
          timeout: 15000
        }
      );

      const result: AlertResponse = response.data;
      
      if (result.success) {
        // Ajouter les alertes à la liste courante
        this.currentAlertes = [...this.currentAlertes, ...alertes];
        this.notifyAlertesChange(this.currentAlertes);
      }
      
      return result;
    } catch (error: any) {
      throw error; // Relancer l'erreur pour le fallback
    }
  }



  // Envoyer un email d'alertes (méthode legacy pour compatibilité)
  async sendAlertEmail(forceSend: boolean = false): Promise<AlertResponse> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-email`,
        { forceSend },
        {
          headers: this.getAuthHeaders(),
          timeout: 15000
        }
      );

      const result: AlertResponse = response.data;
      
      return result;
    } catch (error: any) {
      let errorMessage = 'Erreur lors de l\'envoi d\'email';
      
      if (error.response?.status === 401) {
        errorMessage = 'Token d\'authentification expiré';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur interne';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout de la requête';
      }

      throw new Error(errorMessage);
    }
  }

  // Obtenir le statut du service
  async getStatus(): Promise<AlertStatus> {
    try {
      if (!this.token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await axios.get(
        `${API_BASE_URL}/notifications/status`,
        {
          headers: this.getAuthHeaders(),
          timeout: 5000
        }
      );

      const status: AlertStatus = response.data;
      
      // Notifier les callbacks de statut
      this.notifyStatusChange(status);
      
      return status;
    } catch (error: any) {
      // Retourner un statut par défaut en cas d'erreur
      return {
        isRunning: false,
        lastCheck: new Date().toISOString()
      };
    }
  }

  // Démarrer la vérification automatique
  startAutoCheck(intervalMinutes: number = 30): number {
    if (this.autoCheckInterval) {
      this.stopAutoCheck();
    }

    this.autoCheckInterval = window.setInterval(async () => {
      try {
        // Note: Pour l'auto-check, vous devrez passer les statistiques
        // Cette méthode devra être adaptée selon votre logique
    
      } catch (error) {
        // Gestion silencieuse de l'erreur
      }
    }, intervalMinutes * 60 * 1000);

    return this.autoCheckInterval;
  }

  // Arrêter la vérification automatique
  stopAutoCheck(): void {
    if (this.autoCheckInterval) {
      clearInterval(this.autoCheckInterval);
      this.autoCheckInterval = null;
  
    }
  }

  // S'abonner aux changements d'alertes
  onAlertesChange(callback: (alertes: Alerte[]) => void): void {
    this.alertesChangeCallbacks.push(callback);
  }

  // S'abonner aux changements de statut
  onStatusChange(callback: (status: AlertStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  // Notifier les changements d'alertes
  private notifyAlertesChange(alertes: Alerte[]): void {
    this.alertesChangeCallbacks.forEach(callback => {
      try {
        callback(alertes);
      } catch (error) {
        // Gestion silencieuse de l'erreur
      }
    });
  }

  // Notifier les changements de statut
  private notifyStatusChange(status: AlertStatus): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        // Gestion silencieuse de l'erreur
      }
    });
  }

  // Vérifier s'il y a des alertes critiques
  hasCriticalAlertes(): boolean {
    return this.currentAlertes.some(alerte => alerte.severite === 'critical');
  }

  // Vérifier s'il y a des alertes importantes
  hasImportantAlertes(): boolean {
    return this.currentAlertes.some(alerte => 
      alerte.severite === 'critical' || alerte.severite === 'high'
    );
  }

  // Obtenir les alertes courantes
  getCurrentAlertes(): Alerte[] {
    return [...this.currentAlertes];
  }

  // Obtenir les alertes par type
  getAlertesByType(type: Alerte['type']): Alerte[] {
    return this.currentAlertes.filter(alerte => alerte.type === type);
  }

  // Obtenir les alertes par sévérité
  getAlertesBySeverity(severite: Alerte['severite']): Alerte[] {
    return this.currentAlertes.filter(alerte => alerte.severite === severite);
  }

  // Nettoyer le service
  destroy(): void {
    this.stopAutoCheck();
    this.alertesChangeCallbacks = [];
    this.statusCallbacks = [];
    this.currentAlertes = [];
    this.token = null;

  }

  // Test de connexion au service
  async testConnection(): Promise<boolean> {
    try {
      await this.getStatus();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instance singleton
const alertService = new AlertService();
export default alertService;
