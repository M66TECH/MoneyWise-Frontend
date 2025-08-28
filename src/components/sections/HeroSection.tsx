const HeroSection = () => {
    return (
        <section className="relative">
            <div
                className="absolute inset-0 blur-xl h-[580px]"
                style={{
                    background: `linear-gradient(143.6deg, rgba(34, 197, 94, 0.2) 15%, transparent 40%, rgba(239, 68, 68, 0.1) 85%)`
                }}></div>
            <div className="relative max-w-screen-xl mx-auto px-4 py-28 text-center text-text-primary md:px-8">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-4xl font-extrabold sm:text-6xl">
                        Reprenez le contrôle de vos finances
                    </h1>
                    <p className="mt-5 text-text-secondary">
                        MoneyWise est l'outil simple et intuitif pour suivre vos revenus, gérer vos dépenses et atteindre vos objectifs financiers sans effort.
                    </p>
                </div>
                <div className="mt-8 flex justify-center gap-x-3">
                    <a
                        href="/register"
                        className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150"
                    >
                        Commencer gratuitement
                    </a>
                    <a
                        href="#features"
                        className="px-4 py-2 text-text-primary font-medium bg-background-surface hover:bg-primary-hover hover:text-white rounded-lg duration-150"
                    >
                        En savoir plus
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;