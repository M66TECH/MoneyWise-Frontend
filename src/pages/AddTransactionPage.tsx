import AppLayout from '../layouts/AppLayout';
import { useState } from 'react';

const AddTransactionPage = () => {
    // État pour gérer le type de transaction sélectionné
    const [transactionType, setTransactionType] = useState('depense');

    return (
        <AppLayout title="Ajouter une Transaction">
            <div className="max-w-2xl mx-auto">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-6 bg-background-surface p-8 rounded-lg border border-border"
                >
                    {/* Sélecteur de Type */}
                    <div className="grid grid-cols-2 gap-x-4">
                        <button
                            type="button"
                            onClick={() => setTransactionType('depense')}
                            className={`py-3 px-4 rounded-lg text-center font-semibold transition-all ${
                                transactionType === 'depense'
                                    ? 'bg-negative text-white'
                                    : 'bg-background hover:bg-border'
                            }`}
                        >
                            Dépense
                        </button>
                        <button
                            type="button"
                            onClick={() => setTransactionType('revenu')}
                            className={`py-3 px-4 rounded-lg text-center font-semibold transition-all ${
                                transactionType === 'revenu'
                                    ? 'bg-positive text-white'
                                    : 'bg-background hover:bg-border'
                            }`}
                        >
                            Revenu
                        </button>
                    </div>

                    {/* Champ Montant */}
                    <div>
                        <label className="font-medium text-text-primary">Montant</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Champ Description */}
                    <div>
                        <label className="font-medium text-text-primary">Description</label>
                        <input
                            type="text"
                            required
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="Ex: Courses, Salaire..."
                        />
                    </div>

                     {/* Champ Catégorie */}
                     <div>
                        <label className="font-medium text-text-primary">Catégorie</label>
                        <input
                            type="text"
                            required
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="Ex: Alimentation, Travail..."
                        />
                    </div>
                    
                     {/* Champ Date */}
                     <div>
                        <label className="font-medium text-text-primary">Date</label>
                        <input
                            type="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-white font-medium bg-primary hover:bg-primary-hover active:bg-primary rounded-lg duration-150"
                    >
                        Enregistrer la transaction
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default AddTransactionPage;