import React, { useState, useEffect } from 'react';
import { Download, Settings, CheckCircle, AlertCircle, FileText, BarChart3, TrendingUp } from 'lucide-react';
import exportService from '../../services/exportService';

interface AutoReportConfig {
  enabled: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  format: 'pdf' | 'csv' | 'json';
  emailNotification: boolean;
  lastGenerated?: string;
  nextGeneration?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  sections: string[];
}

const AutoReportGenerator: React.FC = () => {
  const [config, setConfig] = useState<AutoReportConfig>({
    enabled: false,
    frequency: 'monthly',
    format: 'pdf',
    emailNotification: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('financial');
  const [lastReports, setLastReports] = useState<Array<{
    id: string;
    type: string;
    period: string;
    generatedAt: string;
    status: 'success' | 'error';
    template: string;
  }>>([]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'financial',
      name: 'Rapport Financier Complet',
      description: 'Analyse détaillée de vos finances avec graphiques et recommandations',
      icon: BarChart3,
      color: '#3B82F6',
      sections: [
        'Résumé exécutif',
        'Analyse des revenus et dépenses',
        'Évolution des tendances',
        'Répartition par catégories',
        'Recommandations personnalisées',
        'Projections financières'
      ]
    },
    {
      id: 'budget',
      name: 'Rapport de Budget',
      description: 'Suivi de votre budget avec analyse des écarts et ajustements',
      icon: TrendingUp,
      color: '#10B981',
      sections: [
        'État du budget mensuel',
        'Analyse des écarts',
        'Catégories prioritaires',
        'Suggestions d\'optimisation',
        'Objectifs financiers',
        'Plan d\'action'
      ]
    },
    {
      id: 'tax',
      name: 'Rapport Fiscal',
      description: 'Préparation pour la déclaration fiscale avec déductions',
      icon: FileText,
      color: '#F59E0B',
      sections: [
        'Récapitulatif des revenus',
        'Dépenses déductibles',
        'Calcul des impôts',
        'Optimisations fiscales',
        'Documents justificatifs',
        'Échéances importantes'
      ]
    },
    {
      id: 'investment',
      name: 'Rapport d\'Investissement',
      description: 'Analyse de vos investissements et opportunités',
      icon: TrendingUp,
      color: '#8B5CF6',
      sections: [
        'Portfolio d\'investissement',
        'Performance des placements',
        'Analyse des risques',
        'Opportunités d\'investissement',
        'Stratégie de diversification',
        'Recommandations'
      ]
    }
  ];

  useEffect(() => {
    // Charger la configuration depuis le localStorage
    const savedConfig = localStorage.getItem('autoReportConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Charger l'historique des rapports
    const savedReports = localStorage.getItem('lastReports');
    if (savedReports) {
      setLastReports(JSON.parse(savedReports));
    }
  }, []);

  const saveConfig = (newConfig: AutoReportConfig) => {
    setConfig(newConfig);
    localStorage.setItem('autoReportConfig', JSON.stringify(newConfig));
  };

  const generateReportNow = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const template = reportTemplates.find(t => t.id === selectedTemplate);

      if (!template) {
        throw new Error('Template de rapport non trouvé');
      }

      // Générer un rapport documenté et argumenté
      const reportData = {
        template: template.id,
        period: config.frequency === 'monthly' ? `${month}/${year}` : 
                config.frequency === 'quarterly' ? `Q${Math.ceil(month / 3)}/${year}` : 
                year.toString(),
        sections: template.sections,
        metadata: {
          generatedAt: new Date().toISOString(),
          frequency: config.frequency,
          format: config.format
        }
      };

      // Utiliser le service d'export pour générer le rapport
      if (config.frequency === 'monthly') {
        await exportService.generateMonthlyReport({ 
          year, 
          month, 
          format: config.format
        });
      } else if (config.frequency === 'quarterly') {
        const quarter = Math.ceil(month / 3);
        await exportService.generateMonthlyReport({ 
          year, 
          month: quarter * 3, 
          format: config.format
        });
      } else {
        await exportService.generateYearlyReport({ 
          year, 
          format: config.format
        });
      }

      // Le fichier est déjà téléchargé par le service d'export
      

      // Ajouter à l'historique
      const newReport = {
        id: Date.now().toString(),
        type: config.frequency,
        period: reportData.period,
        generatedAt: new Date().toISOString(),
        status: 'success' as const,
        template: template.name
      };

      const updatedReports = [newReport, ...lastReports.slice(0, 9)]; // Garder les 10 derniers
      setLastReports(updatedReports);
      localStorage.setItem('lastReports', JSON.stringify(updatedReports));

      // Mettre à jour la configuration
      const updatedConfig = {
        ...config,
        lastGenerated: new Date().toISOString(),
        nextGeneration: calculateNextGeneration(config.frequency)
      };
      saveConfig(updatedConfig);

    } catch (error) {
      // Ajouter l'erreur à l'historique
      const errorReport = {
        id: Date.now().toString(),
        type: config.frequency,
        period: 'Erreur',
        generatedAt: new Date().toISOString(),
        status: 'error' as const,
        template: 'Erreur'
      };

      const updatedReports = [errorReport, ...lastReports.slice(0, 9)];
      setLastReports(updatedReports);
      localStorage.setItem('lastReports', JSON.stringify(updatedReports));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextGeneration = (frequency: string): string => {
    const now = new Date();
    let nextDate = new Date(now);

    switch (frequency) {
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(now.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(now.getFullYear() + 1);
        break;
    }

    return nextDate.toISOString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Génération Automatique de Rapports
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configurez et générez des rapports documentés et argumentés
          </p>
        </div>
      </div>

      {/* Sélection du template de rapport */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Choisissez un type de rapport
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: template.color }}
                >
                  <template.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                {template.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    {section}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence
            </label>
            <select
              value={config.frequency}
              onChange={(e) => saveConfig({ ...config, frequency: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={config.format}
              onChange={(e) => saveConfig({ ...config, format: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.emailNotification}
                onChange={(e) => saveConfig({ ...config, emailNotification: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Notification par email
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Bouton de génération */}
      <div className="mb-6">
        <button
          onClick={generateReportNow}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Génération en cours...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Générer le rapport maintenant
            </>
          )}
        </button>
      </div>

      {/* Historique des rapports */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Historique des rapports générés
        </h3>
        <div className="space-y-3">
          {lastReports.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Aucun rapport généré pour le moment
            </p>
          ) : (
            lastReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {report.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {report.template}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.period} • {formatDate(report.generatedAt)}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {report.status === 'success' ? 'Succès' : 'Erreur'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoReportGenerator;
