import { useState, useEffect, useCallback } from 'react';
import alertService, { type Alerte, type AlertResponse, type AlertStatus, type FinancialStats } from '../services/alertService';
import { useAuth } from '../contexts/AuthContext';

interface UseAlertsOptions {
  autoCheck?: boolean;
  checkInterval?: number;
}

export const useAlerts = (options: UseAlertsOptions = {}) => {
  const { token } = useAuth();
  const { autoCheck = true, checkInterval = 30 } = options;
  
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [status, setStatus] = useState<AlertStatus>({
    isRunning: false,
    lastCheck: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(autoCheck);

  // Initialiser le service d'alertes
  useEffect(() => {
    if (token) {
      alertService.init(token);
      
      // S'abonner aux changements d'alertes
      alertService.onAlertesChange((nouvellesAlertes) => {
        setAlertes(nouvellesAlertes);
        setError(null);
      });

      // S'abonner aux changements de statut
      alertService.onStatusChange((nouveauStatus) => {
        setStatus(nouveauStatus);
      });

      // Démarrer la vérification automatique si activée
      if (autoCheckEnabled) {
        alertService.startAutoCheck(checkInterval);
      }
    }

    return () => {
      alertService.destroy();
    };
  }, [token, autoCheckEnabled, checkInterval]);

  // Vérifier les alertes
  const checkAlerts = useCallback(async (statistiques?: FinancialStats, envoyerEmail: boolean = false) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: AlertResponse = await alertService.checkAlerts(statistiques || {
        solde: 0,
        total_revenus: 0,
        total_depenses: 0,
        depenses_mensuelles: 0,
        revenus_mensuels: 0,
        nombre_transactions: 0
      }, envoyerEmail);
      setAlertes(result.alertes || []);
      
      if (envoyerEmail && result.emailSent) {
        // Email envoyé avec succès
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Envoyer un email d'alertes
  const sendAlertEmail = useCallback(async (forceSend: boolean = false) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: AlertResponse = await alertService.sendAlertEmail(forceSend);
      
      if (result.emailSent) {
        // Email envoyé avec succès
      } else {
        // Aucun email envoyé
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Basculer la vérification automatique
  const toggleAutoCheck = useCallback(() => {
    if (autoCheckEnabled) {
      alertService.stopAutoCheck();
      setAutoCheckEnabled(false);
    } else {
      alertService.startAutoCheck(checkInterval);
      setAutoCheckEnabled(true);
    }
  }, [autoCheckEnabled, checkInterval]);

  // Obtenir les alertes par type
  const getAlertesByType = useCallback((type: Alerte['type']) => {
    return alertes.filter(alerte => alerte.type === type);
  }, [alertes]);

  // Obtenir les alertes par sévérité
  const getAlertesBySeverity = useCallback((severite: Alerte['severite']) => {
    return alertes.filter(alerte => alerte.severite === severite);
  }, [alertes]);

  // Vérifier s'il y a des alertes critiques
  const hasCriticalAlertes = useCallback(() => {
    return alertes.some(alerte => alerte.severite === 'critical');
  }, [alertes]);

  // Vérifier s'il y a des alertes importantes
  const hasImportantAlertes = useCallback(() => {
    return alertes.some(alerte => 
      alerte.severite === 'critical' || alerte.severite === 'high'
    );
  }, [alertes]);

  // Calculer les statistiques des alertes
  const alertStats = useCallback(() => {
    return {
      total: alertes.length,
      critical: alertes.filter(a => a.severite === 'critical').length,
      high: alertes.filter(a => a.severite === 'high').length,
      medium: alertes.filter(a => a.severite === 'medium').length,
      low: alertes.filter(a => a.severite === 'low').length
    };
  }, [alertes]);

  return {
    // État
    alertes,
    status,
    isLoading,
    error,
    autoCheckEnabled,
    
    // Actions
    checkAlerts,
    sendAlertEmail,
    toggleAutoCheck,
    
    // Utilitaires
    getAlertesByType,
    getAlertesBySeverity,
    hasCriticalAlertes,
    hasImportantAlertes,
    alertStats,
    
    // Service direct (pour les cas avancés)
    alertService
  };
};
