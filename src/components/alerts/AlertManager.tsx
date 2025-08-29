import React, { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, Mail, RefreshCw, Settings, X } from 'lucide-react';
import alertService, { type Alerte, type AlertResponse, type AlertStatus, type FinancialStats } from '../../services/alertService';
import { useAuth } from '../../contexts/AuthContext';

interface AlertManagerProps {
  apiUrl?: string;
  autoCheck?: boolean;
  checkInterval?: number;
  className?: string;
  statistiques?: FinancialStats; // Nouvelles statistiques financières
}

const AlertManager: React.FC<AlertManagerProps> = ({
  autoCheck = true,
  checkInterval = 30,
  className = '',
  statistiques
}) => {
  const { token } = useAuth();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [status, setStatus] = useState<AlertStatus>({
    isRunning: false,
    lastCheck: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

      // Première vérification si on a des statistiques
      if (statistiques) {
        checkAlerts(statistiques, true);
      }
    }

    return () => {
      alertService.destroy();
    };
  }, [token, autoCheckEnabled, checkInterval, statistiques]);

  // Vérifier les alertes avec les nouvelles statistiques
  const checkAlerts = useCallback(async (stats?: FinancialStats, envoyerEmail: boolean = false) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Utiliser les statistiques passées en props ou créer des statistiques par défaut
      const statistiquesUtilisees = stats || statistiques || {
        solde: 0,
        total_revenus: 0,
        total_depenses: 0,
        depenses_mensuelles: 0,
        revenus_mensuels: 0,
        nombre_transactions: 0
      };

      const result: AlertResponse = await alertService.checkAlerts(statistiquesUtilisees, envoyerEmail);
      setAlertes(result.alertes || []);
      
      if (envoyerEmail && result.emailSent) {
        // Email envoyé avec succès
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, statistiques]);

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

  // Obtenir l'icône selon le type d'alerte
  const getAlertIcon = (type: Alerte['type']) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Obtenir la couleur selon la sévérité
  const getSeverityColor = (severite: Alerte['severite']) => {
    switch (severite) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'high':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-blue-500 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  // Obtenir le badge de sévérité
  const getSeverityBadge = (severite: Alerte['severite']) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severite]}`}>
        {severite.toUpperCase()}
      </span>
    );
  };

  // Calculer le nombre d'alertes par sévérité
  const alertesCritiques = alertes.filter(a => a.severite === 'critical').length;
  const alertesImportantes = alertes.filter(a => a.severite === 'high').length;
  const alertesNormales = alertes.filter(a => a.severite === 'medium' || a.severite === 'low').length;

  return (
    <div className={`alert-manager ${className}`}>
      {/* Header avec bouton de toggle */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {alertes.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertes.length}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Alertes Financières</h3>
            <p className="text-sm text-gray-500">
              {alertes.length > 0 
                ? `${alertes.length} alerte(s) détectée(s)` 
                : 'Aucune alerte active'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton de vérification manuelle */}
          <button
            onClick={() => checkAlerts(statistiques, false)}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 disabled:opacity-50"
            title="Vérifier les alertes"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Bouton de toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            title={isExpanded ? 'Masquer les détails' : 'Afficher les détails'}
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Contenu détaillé */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Statistiques des alertes */}
          {alertes.length > 0 && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{alertesCritiques}</div>
                <div className="text-sm text-gray-600">Critiques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{alertesImportantes}</div>
                <div className="text-sm text-gray-600">Importantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{alertesNormales}</div>
                <div className="text-sm text-gray-600">Normales</div>
              </div>
            </div>
          )}

          {/* Liste des alertes */}
          {alertes.length > 0 ? (
            <div className="space-y-3">
              {alertes.map((alerte, index) => (
                <div
                  key={index}
                  className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(alerte.severite)}`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alerte.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSeverityBadge(alerte.severite)}
                        {alerte.code && (
                          <span className="text-xs text-gray-500 font-mono">
                            {alerte.code}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{alerte.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="text-lg font-medium">Aucune alerte active</p>
              <p className="text-sm">Vos finances sont en bon état !</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={() => checkAlerts(statistiques, true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Vérifier les Alertes + Email
            </button>

            <button
              onClick={() => checkAlerts(statistiques, true)}
              disabled={isLoading || alertes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              Vérifier + Email
            </button>

            <button
              onClick={() => sendAlertEmail(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-150 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              Email Forcé
            </button>

            <button
              onClick={toggleAutoCheck}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-150 ${
                autoCheckEnabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              {autoCheckEnabled ? 'Arrêter Auto' : 'Démarrer Auto'}
            </button>

            {/* Bouton de test pour simuler des alertes */}
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  // Méthode de test supprimée
                } catch (error) {
                  // Gestion silencieuse de l'erreur
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Test Alertes
            </button>
          </div>

          {/* Statut du service */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Statut du Service</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Vérification automatique :</span>
                <span className={`ml-2 font-medium ${autoCheckEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {autoCheckEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Dernière vérification :</span>
                <span className="ml-2 font-medium text-blue-900">
                  {new Date(status.lastCheck).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-800">Erreur</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertManager;
