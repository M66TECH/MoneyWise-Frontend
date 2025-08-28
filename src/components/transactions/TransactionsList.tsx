import { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, ChevronUp, ChevronDown, Edit, Trash2, Eye } from 'lucide-react';
import type { Transaction, Category } from '../../types';

interface TransactionsListProps {
    transactions?: Transaction[];
    categories?: Category[];
    onView?: (transaction: Transaction) => void;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transactionId: number) => void;
}

type SortField = 'date' | 'montant' | 'description' | 'categorie';
type SortDirection = 'asc' | 'desc';

const TransactionsList = ({ 
    transactions = [], 
    categories = [],
    onView,
    onEdit,
    onDelete
}: TransactionsListProps) => {
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [filterType, setFilterType] = useState<'all' | 'revenu' | 'depense'>('all');
    const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');

    const formatCurrency = (amount: number | null | undefined): string => {
        const safeAmount = amount && !isNaN(amount) ? amount : 0;
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(safeAmount);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'Date inconnue';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Date invalide';
            
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return 'Date invalide';
        }
    };

    const getCategoryForTransaction = (transaction: Transaction): Category | undefined => {
        return categories.find(cat => cat.id === transaction.categorie_id);
    };

    // Filtrer et trier les transactions
    const processedTransactions = useMemo(() => {
        let filtered = transactions
            .filter(transaction => transaction && transaction.id)
            .map(transaction => ({
                ...transaction,
                montant: transaction.montant && !isNaN(transaction.montant) ? transaction.montant : 0,
                description: transaction.description || 'Description manquante',
                type: transaction.type || 'depense'
            }));

        // Filtrage par type
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        // Filtrage par catégorie
        if (filterCategory !== 'all') {
            filtered = filtered.filter(t => t.categorie_id === filterCategory);
        }

        // Tri
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortField) {
                case 'date':
                    aValue = new Date(a.date_transaction).getTime();
                    bValue = new Date(b.date_transaction).getTime();
                    break;
                case 'montant':
                    aValue = a.montant;
                    bValue = b.montant;
                    break;
                case 'description':
                    aValue = a.description.toLowerCase();
                    bValue = b.description.toLowerCase();
                    break;
                case 'categorie':
                    const catA = getCategoryForTransaction(a);
                    const catB = getCategoryForTransaction(b);
                    aValue = catA?.nom || '';
                    bValue = catB?.nom || '';
                    break;
                default:
                    return 0;
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [transactions, categories, sortField, sortDirection, filterType, filterCategory]);

    // Pagination
    const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = processedTransactions.slice(startIndex, endIndex);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            {/* En-tête avec filtres */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                        Toutes les Transactions ({processedTransactions.length})
                    </h3>
                </div>
                
                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value as 'all' | 'revenu' | 'depense');
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-text-primary"
                    >
                        <option value="all">Tous les types</option>
                        <option value="revenu">Revenus</option>
                        <option value="depense">Dépenses</option>
                    </select>

                    <select
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-text-primary"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.nom}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                {currentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        {processedTransactions.length === 0 ? 'Aucune transaction trouvée' : 'Aucune transaction sur cette page'}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-text-secondary uppercase border-b border-border">
                                <th 
                                    className="py-3 pr-3 cursor-pointer hover:text-text-primary transition-colors"
                                    onClick={() => handleSort('description')}
                                >
                                    <div className="flex items-center gap-1">
                                        Description
                                        {getSortIcon('description')}
                                    </div>
                                </th>
                                <th 
                                    className="py-3 px-3 cursor-pointer hover:text-text-primary transition-colors"
                                    onClick={() => handleSort('categorie')}
                                >
                                    <div className="flex items-center gap-1">
                                        Catégorie
                                        {getSortIcon('categorie')}
                                    </div>
                                </th>
                                <th 
                                    className="py-3 px-3 cursor-pointer hover:text-text-primary transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        {getSortIcon('date')}
                                    </div>
                                </th>
                                <th 
                                    className="py-3 px-3 text-right cursor-pointer hover:text-text-primary transition-colors"
                                    onClick={() => handleSort('montant')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Montant
                                        {getSortIcon('montant')}
                                    </div>
                                </th>
                                {(onView || onEdit || onDelete) && (
                                    <th className="py-3 pl-3 text-center">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction) => {
                                const category = getCategoryForTransaction(transaction);
                                return (
                                    <tr key={transaction.id} className="border-b border-border last:border-none hover:bg-background/50 transition-colors">
                                        <td className="py-4 pr-3 flex items-center gap-x-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'revenu' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                                                {transaction.type === 'revenu' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                            <span className="text-sm font-medium text-text-primary">{transaction.description}</span>
                                        </td>
                                        <td className="py-4 px-3">
                                            {category ? (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: category.couleur }}
                                                    />
                                                    <span className="text-sm text-text-primary">{category.nom}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-text-secondary">Catégorie inconnue</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-sm text-text-secondary">{formatDate(transaction.date_transaction)}</td>
                                        <td className={`py-4 px-3 text-sm font-semibold text-right ${transaction.type === 'revenu' ? 'text-positive' : 'text-negative'}`}>
                                            {transaction.type === 'revenu' ? '+' : '-'} {formatCurrency(transaction.montant)}
                                        </td>
                                        {(onView || onEdit || onDelete) && (
                                            <td className="py-4 pl-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {onView && (
                                                        <button
                                                            onClick={() => onView(transaction)}
                                                            className="p-1 text-text-secondary hover:text-blue-500 transition-colors"
                                                            title="Voir les détails"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(transaction)}
                                                            className="p-1 text-text-secondary hover:text-yellow-500 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(transaction.id)}
                                                            className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <div className="text-sm text-text-secondary">
                        Affichage {startIndex + 1}-{Math.min(endIndex, processedTransactions.length)} sur {processedTransactions.length} transactions
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition-colors"
                        >
                            Précédent
                        </button>
                        <span className="px-3 py-1 text-sm text-text-secondary">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition-colors"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsList;
