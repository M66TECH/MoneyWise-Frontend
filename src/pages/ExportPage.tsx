import React, { useState } from 'react';
import { Download, FileText, BarChart3 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import exportService from '../services/exportService';

const ExportPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '' as 'revenu' | 'depense' | 'hybride' | ''
  });

  const handleExport = async (type: string, format: 'pdf' | 'csv' | 'json') => {
    setIsLoading(`${type}-${format}`);
    setError(null);
    
    try {
      if (type === 'transactions') {
        // Pour les transactions, on peut ajouter des paramètres de date
        // Par défaut, export de toutes les transactions
        await exportService.exportTransactions(
          format,
          filters.startDate || undefined,
          filters.endDate || undefined,
          filters.type || undefined
        );
      } else if (type === 'monthly') {
        const currentDate = new Date();
        await exportService.generateMonthlyReport({ 
          format,
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1
        });
      } else if (type === 'yearly') {
        const currentDate = new Date();
        await exportService.generateYearlyReport({ 
          format,
          year: currentDate.getFullYear()
        });
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'export');
    } finally {
      setIsLoading(null);
    }
  };

  const ExportCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color, 
    type 
  }: {
    title: string;
    description: string;
    icon: any;
    color: string;
    type: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleExport(type, 'pdf')}
          disabled={isLoading === `${type}-pdf`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-150 font-medium text-sm"
        >
          {isLoading === `${type}-pdf` ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FileText className="w-4 h-4" />
          )}
          PDF
        </button>
        
        <button
          onClick={() => handleExport(type, 'csv')}
          disabled={isLoading === `${type}-csv`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-150 font-medium text-sm"
        >
          {isLoading === `${type}-csv` ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <BarChart3 className="w-4 h-4" />
          )}
          CSV
        </button>


      </div>
    </div>
  );

  return (
    <AppLayout title="Exports et Rapports">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="bg-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Exports et Rapports</h1>
          </div>
          <p className="text-green-100">
            Exportez vos données financières et générez des rapports détaillés pour analyser vos finances
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-red-800 dark:text-red-200 font-medium">Erreur d'export</p>
            </div>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Filtres pour les transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filtres pour l'export des transactions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de transaction
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tous les types</option>
                <option value="revenu">Revenus</option>
                <option value="depense">Dépenses</option>
                <option value="hybride">Hybride</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options d'export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExportCard
            title="Export des Transactions"
            description="Exporter toutes vos transactions en PDF ou CSV"
            icon={FileText}
            color="#3B82F6"
            type="transactions"
          />
          
          <ExportCard
            title="Export des Rapports"
            description="Générer des rapports mensuels et annuels"
            icon={BarChart3}
            color="#8B5CF6"
            type="monthly"
          />
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Informations sur les exports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Format PDF</h4>
              <p>Rapports détaillés avec graphiques et analyses visuelles</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Format CSV</h4>
              <p>Données brutes pour analyse dans Excel ou autres outils</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExportPage;
