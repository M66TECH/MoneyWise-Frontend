import { Github, Linkedin, User } from 'lucide-react';

const TeamSection = () => {
    const team = [
        {
            avatar: "images/team/fatou-binetou-sarr.jpg", // Remplacer par "images/team/fatoumata-sarr.jpg"
            name: "Fatoumata Binetou SARR",
            title: "Project Manager",
            desc: "Pilote le projet avec une vision claire et une organisation sans faille pour mener l'équipe vers le succès.",
            linkedin: "#",
            github: "https://github.com/FatouBinetouSARR",
        },
        {
            avatar: "images/team/bano.jpg", // Remplacer par "images/team/mamadou-bano-barry.jpg"
            name: "Mamadou Bano Barry",
            title: "Développeur Frontend",
            desc: "Spécialiste de l'expérience utilisateur, il s'assure que chaque interaction soit intuitive et agréable.",
            linkedin: "https://www.linkedin.com/in/mamadoubanobarry/",
            github: "https://github.com/Bano-Barry",
        },
        {
            avatar: null, // Remplacer par "images/team/malick-ndiaye.jpg"
            name: "Malick Ndiaye",
            title: "Développeur Backend",
            desc: "Gardien de la logique métier, il s'assure que toutes les opérations en coulisses fonctionnent parfaitement.",
            linkedin: "#",
            github: "#",
        },
        {
            avatar: "images/team/khadi-bachir.jpg", // Remplacer par "images/team/ndeye-toure.jpg"
            name: "Ndeye Khadidiatou Touré",
            title: "Développeuse Frontend",
            desc: "Créative et méticuleuse, elle intègre les designs avec précision pour une interface utilisateur impeccable.",
            linkedin: "#",
            github: "https://github.com/KhadijaBachir",
        },
        {
            avatar: "images/team/amina-diane.jpg", // Remplacer par "images/team/aminata-diane.jpg"
            name: "Aminata DIANE",
            title: "Développeuse Backend",
            desc: "Experte en React et Tailwind, elle transforme les maquettes en interfaces utilisateur fluides et réactives.",
            linkedin: "https://www.linkedin.com/in/aminata-diane-57b4b8327/",
            github: "aminata-byte",
        },
        {
            avatar: null, // Remplacer par "images/team/moussa-sow.jpg"
            name: "Moussa Sow",
            title: "Développeur Fullstack",
            desc: "Polyvalent et rigoureux, il navigue avec aisance entre le backend et le frontend pour créer des fonctionnalités robustes.",
            linkedin: "#",
            github: "#",
        },
        {
            avatar: "images/team/faty-niass.jpeg", // Remplacer par "images/team/faty-niass.jpg"
            name: "Faty Niass",
            title: "Développeuse Frontend",
            desc: "Créative et méticuleuse, elle intègre les designs avec précision pour une interface utilisateur impeccable.",
            linkedin: "#",
            github: "https://github.com/faty20-web",
        },
        {
            avatar: null, // Remplacer par "images/team/mouhamadou-ba.jpg"
            name: "Mouhamadou Alpha Ba",
            title: "Développeur Backend",
            desc: "Maître du code de bout en bout, il contribue à toutes les facettes du développement avec une grande expertise.",
            linkedin: "https://www.linkedin.com/in/https://www.linkedin.com/in/mouhamadou-alpha-ba-934586285",
            github: "https://github.com/alphamouhamadou01",
        },
    ];

    return (
        <section id="team" className="py-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-3xl text-text-primary font-semibold sm:text-4xl">
                        L'équipe derrière MoneyWise
                    </h2>
                    <p className="mt-3 text-text-secondary">
                        Rencontrez le Groupe 3, la formidable équipe de développeurs et de gestionnaires qui a donné vie à ce projet.
                    </p>
                </div>
                <div className="mt-12">
                    <ul className="grid gap-8 lg:grid-cols-2">
                        {
                            team.map((item, idx) => (
                                <li key={idx} className="gap-8 sm:flex p-4 rounded-lg border border-transparent hover:border-border hover:bg-background-surface transition-all duration-300">
                                    <div className="w-full sm:w-48 h-60 sm:h-auto flex-shrink-0 bg-background-surface rounded-xl flex items-center justify-center">
                                        {item.avatar ? (
                                            <img
                                                src={item.avatar}
                                                className="w-48 h-48 object-cover object-center shadow-md rounded-xl"
                                                alt={`Avatar de ${item.name}`}
                                            />
                                        ) : (
                                            <User className="w-16 h-16 text-text-secondary" />
                                        )}
                                    </div>
                                    <div className="mt-4 sm:mt-0">
                                        <h3 className="text-lg text-text-primary font-semibold">{item.name}</h3>
                                        <p className="text-primary">{item.title}</p>
                                        <p className="text-text-secondary mt-2 text-sm">{item.desc}</p>
                                        <div className="mt-3 flex gap-4 text-text-secondary">
                                            <a href={item.linkedin} className="hover:text-primary transition-colors">
                                                <Linkedin size={20} />
                                            </a>
                                            <a href={item.github} className="hover:text-primary transition-colors">
                                                <Github size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default TeamSection;