import React, { useState } from 'react';
import { AlertTriangle, X, Bell } from 'lucide-react';
import type { Alerte } from '../../services/alertService';

interface AlertNotificationProps {
  alertes: Alerte[];
  isVisible: boolean;
  onClose: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  alertes,
  isVisible,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Supprimer l'auto-hide pour que l'utilisateur ferme manuellement
  // useEffect(() => {
  //   if (isVisible && autoHide) {
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, autoHideDelay);

  //     return () => clearTimeout(timer);
  //   }
  // }, [isVisible, autoHide, autoHideDelay, onClose]);

  if (!isVisible || alertes.length === 0) {
    return null;
  }

  const alertesCritiques = alertes.filter(a => a.severite === 'critical');
  const alertesImportantes = alertes.filter(a => a.severite === 'high');
  const alertesNormales = alertes.filter(a => a.severite === 'medium' || a.severite === 'low');

  const getSeverityColor = (severite: Alerte['severite']) => {
    switch (severite) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severite: Alerte['severite']) => {
    switch (severite) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Bell className="w-5 h-5" />;
      case 'low':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Alertes Financières</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Résumé */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {alertes.length} alerte(s) détectée(s)
              </span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isExpanded ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {alertesCritiques.length > 0 && (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                  {alertesCritiques.length} Critique(s)
                </div>
              )}
              {alertesImportantes.length > 0 && (
                <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                  {alertesImportantes.length} Importante(s)
                </div>
              )}
              {alertesNormales.length > 0 && (
                <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {alertesNormales.length} Normale(s)
                </div>
              )}
            </div>
          </div>

          {/* Détails des alertes */}
          {isExpanded && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alertes.map((alerte, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alerte.severite)}`}
                >
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(alerte.severite)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alerte.message}</p>
                      {alerte.code && (
                        <p className="text-xs opacity-75 mt-1 font-mono">
                          Code: {alerte.code}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message d'action */}
          {alertesCritiques.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ Action immédiate requise pour les alertes critiques !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;
