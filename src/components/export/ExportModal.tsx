import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { exportService } from '../../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState<'transactions' | 'monthly' | 'yearly'>('transactions');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsLoading(true);
    try {
      if (exportType === 'transactions') {
        await exportService.exportTransactions(format);
      } else if (exportType === 'monthly') {
        await exportService.generateMonthlyReport({ month, year, format });
      } else if (exportType === 'yearly') {
        await exportService.generateYearlyReport({ year, format });
      }
      onClose();
    } catch (error) {
      // Gestion silencieuse de l'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Exporter les données
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Type d'export */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type d'export
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as any)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="transactions">Transactions</option>
            <option value="monthly">Rapport mensuel</option>
            <option value="yearly">Rapport annuel</option>
          </select>
        </div>

        {/* Format */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        {/* Paramètres spécifiques */}
        {exportType === 'monthly' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mois et année
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Année"
              />
            </div>
          </div>
        )}

        {exportType === 'yearly' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Année
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Année"
            />
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="flex-1 p-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
