import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell } from 'lucide-react';
import type { Alerte } from '../../services/alertService';

interface AlertCardProps {
  alert: Alerte;
  onClose?: () => void;
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onClose, className = '' }) => {
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

  return (
    <div className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(alert.severite)} ${className}`}>
      <div className="flex items-start gap-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getSeverityBadge(alert.severite)}
            {alert.code && (
              <span className="text-xs text-gray-500 font-mono">
                {alert.code}
              </span>
            )}
          </div>
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            title="Fermer l'alerte"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;

