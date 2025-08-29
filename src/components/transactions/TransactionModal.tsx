import { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import type { Category, Transaction, CreateTransactionData, UpdateTransactionData } from '../../types';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTransactionData | UpdateTransactionData) => void;
    category: Category;
    transaction?: Transaction | null;
    userId: number;
}

const TransactionModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    category, 
    transaction, 
    userId 
}: TransactionModalProps) => {
    const [formData, setFormData] = useState({
        montant: '',
        description: '',
        type: category.type === 'hybride' ? '' : category.type
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (transaction) {
            setFormData({
                montant: transaction.montant.toString(),
                description: transaction.description || '',
                type: transaction.type
            });
        } else {
            setFormData({
                montant: '',
                description: '',
                type: category.type === 'hybride' ? '' : category.type
            });
        }
        setErrors({});
    }, [transaction, category]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.montant) {
            newErrors.montant = 'Le montant est obligatoire';
        } else {
            const amount = parseFloat(formData.montant);
            if (isNaN(amount) || amount <= 0) {
                newErrors.montant = 'Le montant doit être supérieur à 0';
            }
        }

        // Validation du type pour les catégories hybrides
        if (category.type === 'hybride' && !formData.type) {
            newErrors.type = 'Veuillez sélectionner un type de transaction';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Validation pour s'assurer que le type correspond à la catégorie (sauf pour les hybrides)
        if (category.type !== 'hybride' && formData.type !== category.type) {
            return;
        }

        // Vérifier que l'utilisateur est valide pour la création
        if (!transaction && (!userId || userId === 0)) {
            return;
        }

        setLoading(true);
        try {
                    // En mode édition, on ne doit pas envoyer utilisateur_id
                    if (transaction) {
                // Mode édition - ne pas envoyer utilisateur_id
                const updateData = {
                    montant: parseFloat(formData.montant),
                    description: formData.description,
                    type: formData.type,
                    categorie_id: category.id
                };
                
                await onSubmit(updateData as UpdateTransactionData);
            } else {
                // Mode création - envoyer utilisateur_id
                const createData = {
                    montant: parseFloat(formData.montant),
                    description: formData.description,
                    type: formData.type,
                    utilisateur_id: userId,
                    categorie_id: category.id
                };
                
                await onSubmit(createData as CreateTransactionData);
            }
            onClose();
        } catch (error) {
            // Gestion silencieuse de l'erreur
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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
            <div className="relative bg-background-surface rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.couleur }}
                        />
                        <h2 className="text-xl font-semibold text-text-primary">
                            {transaction ? 'Modifier' : 'Ajouter'} une transaction
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
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Catégorie info */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-medium text-text-primary mb-2">Catégorie</h3>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.couleur }}
                            />
                            <span className="text-text-secondary">{category.nom}</span>
                        </div>
                    </div>

                    {/* Montant */}
                    <div>
                        <label className="block font-medium text-text-primary mb-2">
                            Montant <span className="text-negative">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                            <input
                                type="number"
                                name="montant"
                                value={formData.montant}
                                onChange={handleChange}
                                step="0.01"
                                min="0.01"
                                className={`w-full pl-10 pr-3 py-2 bg-transparent border rounded-lg focus:outline-none focus:border-primary ${
                                    errors.montant ? 'border-negative' : 'border-border'
                                }`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.montant && (
                            <p className="text-negative text-sm mt-1">{errors.montant}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium text-text-primary mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-transparent border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                            placeholder="Description de la transaction (optionnel)"
                        />
                    </div>



                     {/* Type - Affiché seulement pour les catégories hybrides */}
                     {category.type === 'hybride' && (
                    <div>
                        <label className="block font-medium text-text-primary mb-2">
                                 Type de transaction <span className="text-negative">*</span>
                        </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                 className={`w-full px-3 py-2 bg-transparent border rounded-lg focus:outline-none focus:border-primary ${
                                     errors.type ? 'border-negative' : 'border-border'
                                 }`}
                            >
                                 <option value="">Sélectionnez un type</option>
                                <option value="revenu">Revenu</option>
                                <option value="depense">Dépense</option>
                            </select>
                             {errors.type && (
                                 <p className="text-negative text-sm mt-1">{errors.type}</p>
                             )}
                            </div>
                        )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-text-primary font-medium bg-background border border-border rounded-lg hover:bg-border transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white font-medium bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-500"
                        >
                            {loading ? 'Enregistrement...' : (transaction ? 'Modifier' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;


