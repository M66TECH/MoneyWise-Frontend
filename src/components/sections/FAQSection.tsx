import { useRef, useState } from "react";

interface FaqCardProps {
    faqsList: {
        q: string;
        a: string;
    };
    idx: number;
}

const FaqCard = ({ faqsList, idx }: FaqCardProps) => {
    const answerElRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState(false);
    const [answerH, setAnswerH] = useState('0px');

    const handleOpenAnswer = () => {
        const answerElH = answerElRef.current?.scrollHeight || 0;
        setState(!state);
        setAnswerH(`${answerElH}px`);
    };

    return (
        <div
            className="space-y-3 mt-5 overflow-hidden border-b border-border"
            key={idx}
            onClick={handleOpenAnswer}
        >
            <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-text-primary font-medium">
                {faqsList.q}
                {state ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </h4>
            <div
                ref={answerElRef}
                style={{ height: state ? answerH : '0px' }}
                className="duration-300"
            >
                <div>
                    <p className="text-text-secondary">
                        {faqsList.a}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const faqsList = [
        {
            q: "Est-ce que MoneyWise est gratuit ?",
            a: "Oui, MoneyWise est entièrement gratuit. Notre objectif est de fournir un outil accessible à tous pour aider à la gestion des finances personnelles."
        },
        {
            q: "Mes données financières sont-elles en sécurité ?",
            a: "La sécurité de vos données est notre priorité absolue. Nous utilisons des protocoles de chiffrement avancés et nous ne partageons jamais vos informations avec des tiers."
        },
        {
            q: "Puis-je utiliser l'application sur mon mobile ?",
            a: "Absolument. MoneyWise est conçu pour être entièrement responsive, ce qui signifie que vous pouvez l'utiliser aussi facilement sur votre téléphone ou votre tablette que sur votre ordinateur."
        },
        {
            q: "Est-il possible de personnaliser les catégories de dépenses ?",
            a: "Oui ! Vous pouvez créer, modifier et supprimer vos propres catégories pour qu'elles correspondent parfaitement à votre style de vie et à vos habitudes de dépenses."
        },
        {
            q: "Comment puis-je exporter mes données ?",
            a: "Vous pouvez exporter vos transactions à tout moment depuis votre tableau de bord. Nous proposons des exports aux formats PDF et CSV (compatible avec Excel)."
        }
    ];

    return (
        <section id="faq" className="py-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-3xl text-text-primary font-semibold sm:text-4xl">
                        Questions Fréquemment Posées
                    </h2>
                    <p className="mt-3 text-text-secondary">
                        Vous avez des questions ? Nous avons les réponses. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
                    </p>
                </div>
                <div className="mt-12 max-w-2xl mx-auto">
                    {faqsList.map((item, idx) => (
                        <FaqCard
                            key={idx}
                            idx={idx}
                            faqsList={item}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;