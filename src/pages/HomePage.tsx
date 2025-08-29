import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Target, Bell, Mail, ArrowRight, Shield, PieChart, Users, TrendingUp, List, Tag, Zap, Globe, Clock } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaWhatsapp } from "react-icons/fa";

// Images d'illustration
const heroImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1611&q=80";
const feature1Image = "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg";
const feature2Image = "https://images.pexels.com/photos/5750230/pexels-photo-5750230.jpeg";
const feature3Image = "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg";
const feature4Image = "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg";
const feature5Image = "https://images.pexels.com/photos/3833052/pexels-photo-3833052.jpeg";
const feature6Image = "https://images.pexels.com/photos/7947707/pexels-photo-7947707.jpeg";
const team1Image = "images/team/fatou-binetou-sarr.jpg";
const team2Image = "images/team/bano.jpg";
const team3Image = "images/team/malick-ndiaye.jpg";
const team4Image = "images/team/khadi-bachir.jpg";
const team5Image = "images/team/amina-diane.jpg";
const team6Image = "images/team/moussa-sow.jpeg";
const team7Image = "images/team/faty-niass.jpeg";
const team8Image = "images/team/mouhamadou-ba.jpg";
const team9Image = "images/team/touty.jpg";

// Composant Navbar
const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
   useEffect(() => {
    AOS.init({
    duration: 1000,
    once: true,
     });
  }, []);
  
   return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
           <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
               <TrendingUp className="h-8 w-8 text-green-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MoneyWise</h1>
              </div>
           </div>
           <div className="hidden md:flex items-center space-x-8">
           <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Fonctionnalités</a>
              <a href="#stats" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Avantages</a>
              <a href="#team" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Équipe</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>

            </div>
  
        <div className="flex items-center space-x-4">
        <ThemeToggle /> {/* Ajoutez ici le composant pour basculer le thème */}
        <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
        Connexion
        </Link>
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-green-600 focus:outline-none transition-colors">

                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               )}
             </svg>
            </button>
           </div>
         </div>
      </div>
  
       {/* Menu mobile */}
        {isMenuOpen && (
         <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-1 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Fonctionnalités</a>
              <a href="#stats" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Avantages</a>
              <a href="#team" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Équipe</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact</a>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
             <Link to="/login" className="block px-6 py-3 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors text-center">
            Connexion
           </Link>
          </div>
         </div>
       </div>
      )}
   </nav>
   );
  };

// Composant HeroSection
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden pt-20 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left" data-aos="fade-right">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Maîtrisez votre avenir</span>
                <span className="block text-green-600">financier</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0">
                L'application ultime pour gérer vos budgets, suivre vos dépenses et atteindre vos objectifs financiers avec confiance. Rejoignez la révolution de la gestion financière personnelle.
              </p>
              <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="rounded-md shadow-lg">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors transform hover:-translate-y-0.5 hover:shadow-xl md:text-lg md:px-12"
                  >
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 text-green-500 mr-1" />
                <span>Sécurisé et confidentiel • Aucune carte de crédit requise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={heroImage}
          alt="Personne gérant ses finances"
          data-aos="fade-left"
        />
      </div>
    </section>
  );
};

// Composant BenefitsSection
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Disponible partout",
      description: "Accédez à vos finances depuis n'importe quel appareil, à tout moment, même hors connexion."
    },
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Vos données sont protégées avec un chiffrement de pointe et un système d'authentification fiable."
    },
    {
      icon: BarChart3,
      title: "Suivi intelligent des dépenses",
      description: "Visualisez facilement vos revenus, dépenses et tendances grâce à des graphiques clairs et interactifs."
    },
    {
      icon: Bell,
      title: "Alertes personnalisées",
      description: "Recevez des notifications automatiques pour vos limites de dépenses ou objectifs financiers."
    },
    {
      icon: Target,
      title: "Planification et objectifs financiers",
      description: "Fixez vos objectifs d'épargne, de remboursement ou d'investissement et suivez vos progrès en temps réel."
    },
    {
      icon: List,
      title: "Rapports détaillés et exportables",
      description: "Génération instantanée de rapports précis que vous pouvez télécharger ou partager en quelques clics."
    }
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Avantages exclusifs</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Pourquoi choisir MoneyWise ?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Utilisez MoneyWise et transformez votre gestion financière
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-700 transition-colors duration-300">
                  <benefit.icon className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prenez le contrôle de vos finances dès aujourd'hui</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Découvrez comment gérer vos dépenses et atteindre vos objectifs financiers plus facilement.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors transform hover:-translate-y-0.5"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Section Pourquoi nous choisir : 4 points essentiels */}
        <div className="mt-20">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Pourquoi utiliser MoneyWise
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              data-aos="fade-up" data-aos-delay="100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-4">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Simplicité et ergonomie</h3>
                <p className="text-gray-600 dark:text-gray-400">Une interface intuitive qui rend la gestion de vos finances rapide et agréable.</p>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              data-aos="fade-up" data-aos-delay="200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fiabilité et précision</h3>
                <p className="text-gray-600 dark:text-gray-400">Des outils de suivi et de calcul fiables pour prendre des décisions financières éclairées.</p>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              data-aos="fade-up" data-aos-delay="300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Support et assistance</h3>
                <p className="text-gray-600 dark:text-gray-400">Une équipe réactive disponible pour répondre à vos questions et vous accompagner.</p>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              data-aos="fade-up" data-aos-delay="400">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Innovation continue</h3>
                <p className="text-gray-600 dark:text-gray-400">Des fonctionnalités régulièrement mises à jour pour rester à la pointe de la gestion financière personnelle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// Composant FeaturesSection
const FeaturesSection = () => {
  const features = [
    {
      title: "Vue d'Ensemble Financière",
      description: "Résumé complet de votre situation financière avec solde, revenus, dépenses et différence en temps réel. Visualisez l'évolution de votre patrimoine sur des graphiques interactifs.",
      icon: PieChart,
      image: feature1Image,
      colorClass: "bg-green-100 text-green-600"
    },
    {
      title: "Gestion des Transactions",
      description: "Lister, filtrer et gérer toutes vos transactions avec des outils de recherche avancés. Catégorisez automatiquement vos dépenses et recevez des insights personnalisés.",
      icon: List,
      image: feature2Image,
      colorClass: "bg-red-100 text-red-600"
    },
    {
      title: "Gestion des Catégories",
      description: "Personnalisez vos catégories, modifiez ou supprimez les existantes et ajoutez de nouvelles. Créez des règles automatiques pour un classement intelligent de vos transactions.",
      icon: Tag,
      image: feature3Image,
      colorClass: "bg-blue-100 text-blue-600"
    },
    {
      title: "Budgets Intelligents",
      description: "Créez des budgets personnalisés avec alertes en temps réel et analyses prédictives. Comparez vos dépenses mensuelles et recevez des recommandations pour optimiser votre budget.",
      icon: BarChart3,
      image: feature4Image,
      colorClass: "bg-gray-100 text-gray-600"
    },
    {
      title: "Objectifs d'Épargne",
      description: "Planifiez et suivez vos objectifs avec projections précises et conseils personnalisés. Visualisez votre progression et ajustez votre stratégie pour atteindre vos buts plus rapidement.",
      icon: Target,
      image: feature5Image,
      colorClass: "bg-purple-100 text-purple-600"
    },
    {
      title: "Surveillance 360°",
      description: "Contrôlez de manière intelligente l'état de vos finances. Détectez les augmentations de prix et recevez des suggestions pour des alternatives économiques.",
      icon: Bell,
      image: feature6Image,
      colorClass: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Fonctionnalités complètes</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Tout pour maîtriser vos finances
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Découvrez des outils conçus pour transformer votre gestion financière et vous aider à prendre le contrôle de votre argent
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 overflow-hidden group cursor-pointer relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative h-40 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={feature.image} alt={feature.title} />
                <div className="absolute top-4 left-4">
                  <div className={`h-12 w-12 rounded-lg ${feature.colorClass.split(' ')[0]} dark:bg-green-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10`}>
                    <feature.icon className={`h-6 w-6 ${feature.colorClass.split(' ')[1]} dark:text-green-300`} />
                  </div>
                </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${feature.colorClass} dark:bg-green-800 dark:text-green-300 group-hover:opacity-90 transition-colors duration-300`}>
                    Découvrir
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant TeamSection
const TeamSection = () => {
  const team = [
    {
      name: "Fatoumata Binetou SARR",
      role: "Project Manager",
      image: team1Image,
      bio: "Pilote le projet avec une vision claire et une organisation sans faille pour mener l'équipe vers le succès."
    },
    {
      name: "Mamadou Bano Barry",
      role: "Développeur Frontend",
      image: team2Image,
      bio: "Spécialiste de l'expérience utilisateur, il s'assure que chaque interaction soit intuitive et agréable."
    },
    {
      name: "Malick Ndiaye",
      role: "Développeur Backend",
      image: team3Image,
      bio: "Gardien de la logique métier, il s'assure que toutes les opérations en coulisses fonctionnent parfaitement."
    },
    {
      name: "Ndeye Khadidiatou Touré",
      role: "Développeuse Frontend",
      image: team4Image,
      bio: "Créative et méticuleuse, elle intègre les designs avec précision pour une interface utilisateur impeccable."
    },
    {
      name: "DAminata DIANE",
      role: "Développeuse Backend",
      image: team5Image,
      bio: "Experte en base de données et Api."
    },
    {
      name: "Moussa Sow",
      role: "Développeur Frontend",
      image: team6Image,
      bio: "Polyvalent et rigoureux, il crée avec aisance des fonctionnalités robustes.."
    },
    {
      name: "Faty Niass",
      role: "Développeuse Frontend",
      image: team7Image,
      bio: "Créative et méticuleuse, elle intègre les designs avec précision pour une interface utilisateur impeccable."
    },
    {
      name: "Mouhamadou Alpha Ba",
      role: "Développeuse Backend",
      image: team8Image,
      bio: "A contribuer sans faille à la partie backend de l'application"
    },
    {
      name: "Touty Diop",
      role: "Project Manager",
      image: team9Image,
      bio: "A contribuer à la réalisation de l'application"
    }
  ];

  return (
    <section id="team" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Notre équipe</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Les experts derrière MoneyWise
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Une équipe passionnée et expérimentée dédiée à votre réussite financière
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="200">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 group cursor-pointer relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <img 
                    className="w-full h-full rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300" 
                    src={member.image} 
                    alt={member.name} 
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{member.name}</h3>
                <p className="text-green-600 font-medium">
                  {member.role}
                </p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// Composant FAQSection
const FAQSection = () => {
  const faqs = [
    {
      question: "MoneyWise est-il vraiment gratuit ?",
      answer: "Oui, notre plan de base offre toutes les fonctionnalités essentielles gratuitement. Nous proposons un plan premium avec des analyses avancées, des rapports détaillés et un support prioritaire pour ceux qui veulent aller plus loin."
    },
    {
      question: "Comment protégez-vous mes données ?",
      answer: "Nous utilisons un chiffrement de niveau bancaire (AES-256) et suivons les normes de sécurité les plus strictes. Vos données ne sont jamais vendues ou partagées avec des tiers. Toutes les connexions sont sécurisées via SSL/TLS."
    },
    {
      question: "Puis-je utiliser l'application sur tous mes appareils ?",
      answer: "Absolument ! MoneyWise est disponible sur web, iOS et Android avec une synchronisation en temps réel sur tous vos appareils. Vous pouvez même accédez à vos données en mode hors ligne."
    },
    {
      question: "Comment MoneyWise m'aide-t-il à économiser de l'argent ?",
      answer: "Notre application identifie vos habitudes de dépenses, détecte les frais cachés et les abonnements inutilisés, et vous propose des alternatives économiques. Nos utilisateurs économisent en moyenne 15% sur leurs dépenses mensuelles."
    },
    {
      question: "Puis-je exporter mes données ?",
      answer: "Oui, vous pouvez exporter toutes vos données à tout moment dans plusieurs formats (CSV, PDF, Excel). Nous croyons en la transparence et votre droit à la portabilité de vos données."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Questions fréquentes
          </p>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Tout ce que vous devez savoir sur MoneyWise
          </p>
        </div>

        <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// Composant ContactSection
const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Contact</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Prêt à transformer vos finances ?
                    </p>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                        Notre équipe est là pour vous accompagner à chaque étape de votre voyage financier
                    </p>
                 </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-right">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informations de contact</h3>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email</h4>
                                    <a
                                        href="mailto:tourek014@gmail.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                    >
                                        monneywise@gmail.com
                                    </a>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">Réponse sous 24 heures</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Support</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Lundi - Vendredi: 9h - 18h</p>
                                    <p className="text-gray-600 dark:text-gray-400">Samedi: 10h - 16h</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Réseaux sociaux</h4>
                                    <div className="flex space-x-4 mt-2">
                                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                        </a>
                                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </a>
                                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-left" data-aos-delay="200">
                        <Mail className="mx-auto h-12 w-12 mb-6" />
                        <h3 className="text-2xl font-bold mb-4 text-center">Commencez votre voyage financier</h3>
                        <p className="text-green-100 mb-8 text-lg text-center">
                            Rejoignez des milliers d'utilisateurs satisfaits qui ont pris le contrôle de leurs finances
                        </p>
                        <div className="space-y-4">
                            <Link
                                to="/register"
                                className="block w-full text-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Créer un compte gratuit
                                <ArrowRight className="ml-2 h-5 w-5 inline" />
                            </Link>
                            <div className="mt-12 text-center">
                                <p className="text-green-100 mb-4">
                                    Vous avez d'autres questions ?
                                </p>
                                <a
                                    href="https://wa.me/221773959608?text=Bonjour,%20j'ai%20une%20question%20à%20vous%20poser"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors transform hover:-translate-y-0.5"
                                >
                                    <FaWhatsapp className="mr-2 h-5 w-5" />
                                    Contactez-nous
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
// Composant Footer
const Footer = () => {
  return (
      <footer className="bg-gray-900 dark:bg-black text-white dark:text-gray-200 transition-colors">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                      <div className="flex items-center mb-4">
                          {/* Logo */}
                          <div className="flex items-center px-6 py-4 border-b border-gray-800 dark:border-gray-700">
                              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <span className=" text-xl font-bold">MoneyWise</span>
                      </div>
                      <p className="text-gray-400">Votre partenaire pour une liberté financière totale. Rejoignez la révolution de la gestion d'argent.</p>
                  </div>

                  <div>
                      <h3 className="font-semibold mb-4">Produit</h3>
                      <ul className="space-y-2 text-gray-400">
                          <li><a href="#features" className="hover:text-green-400 transition-colors">Fonctionnalités</a></li>
                          <li><a href="#stats" className="hover:text-green-400 transition-colors">Avantages</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Transactions</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Témoignages</a></li>
                      </ul>
                  </div>

                  <div>
                      <h3 className="font-semibold mb-4">Support</h3>
                      <ul className="space-y-2 text-gray-400">
                          <li><a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a></li>
                          <li><a href="#contact" className="hover:text-green-400 transition-colors">Contact</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Centre d'aide</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                      </ul>
                  </div>

                  <div>
                      <h3 className="font-semibold mb-4">Légal</h3>
                      <ul className="space-y-2 text-gray-400">
                          <li><a href="#" className="hover:text-green-400 transition-colors">Confidentialité</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Conditions</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Mentions légales</a></li>
                          <li><a href="#" className="hover:text-green-400 transition-colors">Cookies</a></li>
                      </ul>
                  </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400">© 2025 MoneyWise. Tous droits réservés.</p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                          </svg>
                      </a>
                  </div>
              </div>
          </div>
      </footer>
  );
};
// Page d'accueil principale
const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <TeamSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;