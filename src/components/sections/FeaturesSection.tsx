import { BarChart3, Tags, Coins } from 'lucide-react';

const FeaturesSection = () => {

    const features = [
        {
            icon: <Coins className="w-12 h-12 text-primary" />,
            title: "Suivi Simplifié",
            desc: "Ajoutez facilement vos revenus et dépenses en quelques clics. Gardez une trace claire de chaque transaction."
        },
        {
            icon: <Tags className="w-12 h-12 text-primary" />,
            title: "Catégorisation Intelligente",
            desc: "Organisez vos transactions avec des catégories personnalisables pour savoir exactement où va votre argent."
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-primary" />,
            title: "Visualisation Claire",
            desc: "Analysez votre situation financière grâce à des graphiques et des rapports intuitifs. Prenez des décisions éclairées."
        }
    ];

    return (
        <section id="features" className="py-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 text-text-primary md:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl">
                        Tout ce dont vous avez besoin pour gérer votre budget
                    </h2>
                    <p className="mt-3 text-text-secondary">
                        MoneyWise vous donne les outils pour comprendre vos habitudes financières et prendre le contrôle.
                    </p>
                </div>
                <div className="mt-12">
                    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            features.map((item, idx) => (
                                <li key={idx} className="bg-background-surface p-6 rounded-lg border border-border hover:shadow-lg hover:border-primary transition-all duration-300">
                                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-text-secondary">
                                        {item.desc}
                                    </p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;