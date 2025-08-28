import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import type { Category, NewCategory } from '../types';

const CategoriesPage = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<NewCategory>({
        nom: '',
        couleur: '#FF6B6B',
        type: 'depense'
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.nom.trim()) {
            toast.error("Le nom de la catégorie est requis.");
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
                toast.success("Catégorie mise à jour avec succès !");
            } else {
                await createCategory(formData);
                toast.success("Catégorie créée avec succès !");
            }
            
            fetchCategories();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                (editingCategory ? "Erreur lors de la mise à jour." : "Erreur lors de la création.");
            toast.error(errorMessage);

        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            nom: category.nom,
            couleur: category.couleur,
            type: category.type
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (categoryId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            return;
        }

        try {
            await deleteCategory(categoryId);
            toast.success("Catégorie supprimée avec succès !");
            fetchCategories();
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            couleur: '#FF6B6B',
            type: 'depense'
        });
        setEditingCategory(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const categoriesDepenses = categories.filter(cat => cat.type === 'depense');
    const categoriesRevenus = categories.filter(cat => cat.type === 'revenu');
    const categoriesHybrides = categories.filter(cat => cat.type === 'hybride');

    return (
        <AppLayout title="Gestion des Catégories">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Catégories</h2>
                        <p className="text-text-secondary mt-1">
                            Gérez vos catégories pour organiser vos transactions
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        <Plus size={20} />
                        Nouvelle catégorie
                    </button>
                </div>

                {/* Contenu principal */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-text-secondary mt-2">Chargement des catégories...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Catégories de dépenses */}
                        <div className="bg-background-surface p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-x-2 mb-4">
                                <Tag size={20} className="text-negative" />
                                <h3 className="text-lg font-semibold text-text-primary">Dépenses</h3>
                                <span className="bg-negative/10 text-negative px-2 py-1 rounded-full text-sm">
                                    {categoriesDepenses.length}
                                </span>
                            </div>
                            
                            {categoriesDepenses.length > 0 ? (
                                <div className="space-y-3">
                                    {categoriesDepenses.map((category) => (
                                        <div key={category.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                                            <div className="flex items-center gap-x-3">
                                                <span 
                                                    className="w-4 h-4 rounded-full" 
                                                    style={{ backgroundColor: category.couleur }}
                                                ></span>
                                                <span className="text-text-primary font-medium">{category.nom}</span>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-text-secondary hover:text-primary p-1"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-text-secondary hover:text-negative p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-secondary text-center py-4">
                                    Aucune catégorie de dépense créée
                                </p>
                            )}
                        </div>

                        {/* Catégories de revenus */}
                        <div className="bg-background-surface p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-x-2 mb-4">
                                <Tag size={20} className="text-positive" />
                                <h3 className="text-lg font-semibold text-text-primary">Revenus</h3>
                                <span className="bg-positive/10 text-positive px-2 py-1 rounded-full text-sm">
                                    {categoriesRevenus.length}
                                </span>
                            </div>
                            
                            {categoriesRevenus.length > 0 ? (
                                <div className="space-y-3">
                                    {categoriesRevenus.map((category) => (
                                        <div key={category.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                                            <div className="flex items-center gap-x-3">
                                                <span 
                                                    className="w-4 h-4 rounded-full" 
                                                    style={{ backgroundColor: category.couleur }}
                                                ></span>
                                                <span className="text-text-primary font-medium">{category.nom}</span>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-text-secondary hover:text-primary p-1"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-text-secondary hover:text-negative p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-secondary text-center py-4">
                                    Aucune catégorie de revenu créée
                                </p>
                            )}
                        </div>

                        {/* Catégories hybrides */}
                        <div className="bg-background-surface p-6 rounded-lg border border-border">
                            <div className="flex items-center gap-x-2 mb-4">
                                <Tag size={20} className="text-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">Hybrides</h3>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                    {categoriesHybrides.length}
                                </span>
                            </div>
                            
                            {categoriesHybrides.length > 0 ? (
                                <div className="space-y-3">
                                    {categoriesHybrides.map((category) => (
                                        <div key={category.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                                            <div className="flex items-center gap-x-3">
                                                <span 
                                                    className="w-4 h-4 rounded-full" 
                                                    style={{ backgroundColor: category.couleur }}
                                                ></span>
                                                <span className="text-text-primary font-medium">{category.nom}</span>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-text-secondary hover:text-primary p-1"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-text-secondary hover:text-negative p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-secondary text-center py-4">
                                    Aucune catégorie hybride créée
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal pour créer/modifier une catégorie */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                title={editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium text-text-primary">Nom de la catégorie</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="Ex: Restaurant, Salaire, Transport..."
                        />
                    </div>
                    
                    <div>
                        <label className="font-medium text-text-primary">Couleur</label>
                        <input
                            type="color"
                            value={formData.couleur}
                            onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                            className="w-full mt-2 h-10 px-1 py-1 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        />
                    </div>
                    
                    <div>
                        <label className="font-medium text-text-primary">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'revenu' | 'depense' | 'hybride' })}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        >
                            <option value="depense">Dépense</option>
                            <option value="revenu">Revenu</option>
                            <option value="hybride">Hybride</option>
                        </select>
                    </div>
                    
                    <div className="pt-2 flex justify-end gap-x-4">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="px-4 py-2 text-text-primary font-medium bg-background-surface border border-border hover:bg-border rounded-lg duration-150"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150"
                        >
                            {editingCategory ? "Modifier" : "Créer"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default CategoriesPage;
