import { X, Edit, Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { Category, Transaction } from '../../types';

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    category?: Category | null;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transactionId: number) => void;
}

const TransactionDetailsModal = ({
    isOpen,
    onClose,
    transaction,
    category,
    onEdit,
    onDelete
}: TransactionDetailsModalProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(amount);
    };

    const handleEdit = () => {
        onEdit(transaction);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
            onDelete(transaction.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-background-surface rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        {transaction.type === 'revenu' ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <h2 className="text-xl font-semibold text-text-primary">
                            Détails de la transaction
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Montant */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary mb-2">
                            {transaction.type === 'revenu' ? '+' : '-'} {formatCurrency(transaction.montant)}
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.type === 'revenu' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {transaction.type === 'revenu' ? 'Revenu' : 'Dépense'}
                        </div>
                    </div>

                    {/* Description */}
                    {transaction.description && (
                        <div>
                            <h3 className="font-medium text-text-primary mb-2">Description</h3>
                            <p className="text-text-secondary bg-background p-3 rounded-lg">
                                {transaction.description}
                            </p>
                        </div>
                    )}

                    {/* Catégorie */}
                    {category && (
                        <div>
                            <h3 className="font-medium text-text-primary mb-2">Catégorie</h3>
                            <div className="flex items-center gap-3 bg-background p-3 rounded-lg">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: category.couleur }}
                                />
                                <span className="text-text-secondary">{category.nom}</span>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <h3 className="font-medium text-text-primary mb-2">Date de transaction</h3>
                        <div className="flex items-center gap-3 bg-background p-3 rounded-lg">
                            <Calendar className="w-4 h-4 text-text-secondary" />
                            <span className="text-text-secondary">
                                {formatDate(transaction.date_creation)}
                            </span>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-text-primary mb-2">ID Transaction</h3>
                            <div className="bg-background p-3 rounded-lg">
                                <span className="text-text-secondary text-sm">#{transaction.id}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-text-primary mb-2">Statut</h3>
                            <div className="bg-background p-3 rounded-lg">
                                <span className="text-green-600 text-sm font-medium">✓ Confirmée</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            onClick={handleEdit}
                            className="flex-1 px-4 py-2 text-text-primary font-medium bg-background border border-border rounded-lg hover:bg-border transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit size={16} />
                            Modifier
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-2 text-white font-medium bg-negative rounded-lg hover:bg-negative-hover transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
