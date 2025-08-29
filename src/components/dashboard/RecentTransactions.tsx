import { ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Transaction, Category } from '../../types';

interface RecentTransactionsProps {
    transactions?: Transaction[];
    categories?: Category[];
    onView?: (transaction: Transaction) => void;
}

const RecentTransactions = ({ 
    transactions = [], 
    categories = [],
    onView 
}: RecentTransactionsProps) => {

    const formatCurrency = (amount: number | null | undefined): string => {
        // Contrôle pour éviter NaN
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

    // Fonction pour obtenir la catégorie d'une transaction
    const getCategoryForTransaction = (transaction: Transaction): Category | undefined => {
        return categories.find(cat => cat.id === transaction.categorie_id);
    };

    // Filtrer et sécuriser les transactions
    const safeTransactions = transactions
        .filter(transaction => transaction && transaction.id)
        .map(transaction => ({
            ...transaction,
            montant: transaction.montant && !isNaN(transaction.montant) ? transaction.montant : 0,
            description: transaction.description || 'Description manquante',
            type: transaction.type || 'depense'
        }));

    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Transactions Récentes</h3>
                <Link to="/transactions" className="text-sm font-medium text-primary hover:text-primary-hover">
                    Voir tout
                </Link>
            </div>
            {/* Version Desktop - Tableau */}
            <div className="hidden md:block overflow-x-auto max-w-full">
                {safeTransactions.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        Aucune transaction récente
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-text-secondary uppercase border-b border-border">
                                <th className="py-3 pr-3">Description</th>
                                <th className="py-3 px-3">Catégorie</th>
                                <th className="py-3 px-3">Date</th>
                                <th className="py-3 px-3 text-right">Montant</th>
                                {onView && (
                                    <th className="py-3 pl-3 text-center">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {safeTransactions.map((transaction) => {
                                const category = getCategoryForTransaction(transaction);
                                return (
                                <tr key={transaction.id} className="border-b border-border last:border-none">
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
                                    {onView && (
                                        <td className="py-4 pl-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => onView(transaction)}
                                                    className="p-1 text-text-secondary hover:text-primary transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
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

            {/* Version Mobile - Cartes */}
            <div className="md:hidden space-y-3">
                {safeTransactions.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        Aucune transaction récente
                    </div>
                ) : (
                    safeTransactions.map((transaction) => {
                        const category = getCategoryForTransaction(transaction);
                        return (
                            <div key={transaction.id} className="bg-background p-3 rounded-lg border border-border hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.type === 'revenu' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                                            {transaction.type === 'revenu' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-text-primary text-sm truncate">{transaction.description}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {category ? (
                                                    <>
                                                        <div
                                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: category.couleur }}
                                                        />
                                                        <span className="text-xs text-text-secondary">{category.nom}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-text-secondary">Catégorie inconnue</span>
                                                )}
                                                <span className="text-xs text-text-secondary">•</span>
                                                <span className="text-xs text-text-secondary">{formatDate(transaction.date_transaction)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-right flex-shrink-0 ${transaction.type === 'revenu' ? 'text-positive' : 'text-negative'}`}>
                                        <div className="font-semibold text-sm">
                                            {transaction.type === 'revenu' ? '+' : '-'} {formatCurrency(transaction.montant)}
                                        </div>
                                        {onView && (
                                            <button
                                                onClick={() => onView(transaction)}
                                                className="mt-1 p-1 text-text-secondary hover:text-blue-500 transition-colors"
                                                title="Voir les détails"
                                            >
                                                <MoreVertical size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;