import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
    const [state, setState] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);



    const navigation = [
        { title: "Fonctionnalités", path: "#features" },
        { title: "L'équipe", path: "#team" },
        { title: "FAQ", path: "#faq" },
        { title: "Contact", path: "#contact" },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    }

    return (
        <nav className="bg-background/95 backdrop-blur-sm w-full top-0 z-20 sticky border-b border-border/50 shadow-sm">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="group">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                                MoneyWise
                            </h1>
                            <Sparkles className="w-5 h-5 text-primary opacity-60" />
                        </div>
                    </Link>
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <button
                            className="text-text-primary outline-none p-2 rounded-lg hover:bg-primary/10 transition-colors duration-150"
                            onClick={() => setState(!state)}
                        >
                            {state ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden md:block'}`}>
                    {/* Liens de navigation principaux */}
                    <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                        {navigation.map((item, idx) => (
                            <li key={idx}>
                                <a 
                                    href={item.path} 
                                    onClick={() => setState(false)}
                                    className="text-text-secondary hover:text-primary transition-colors duration-150 font-medium"
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Menu utilisateur pour mobile */}
                    {isAuthenticated && (
                        <div className="md:hidden mt-6 pt-6 border-t border-border/50">
                            <ul className="space-y-3">
                                <li>
                                    <Link 
                                        to="/dashboard" 
                                        onClick={() => setState(false)} 
                                        className="flex items-center gap-x-3 w-full p-3 text-text-secondary rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10">
                                        <LayoutDashboard size={18} />
                                        </div>
                                        <span className="font-medium">Mon espace</span>
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => {handleLogout(); setState(false);}} 
                                        className="w-full text-left flex items-center gap-x-3 p-3 text-negative rounded-lg hover:bg-negative/10 transition-colors duration-150"
                                    >
                                        <div className="p-2 rounded-lg bg-negative/10">
                                        <LogOut size={18} />
                                        </div>
                                        <span className="font-medium">Se déconnecter</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                    {!isAuthenticated ? (
                        <>
                            <Link 
                                to="/login" 
                                className="py-2.5 px-6 text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors duration-150 font-medium"
                            >
                                Se connecter
                            </Link>
                            <Link 
                                to="/register" 
                                className="py-2.5 px-6 text-text-primary bg-background-surface hover:bg-primary hover:text-white rounded-lg shadow-sm transition-colors duration-150 font-medium border border-border hover:border-primary"
                            >
                                S'inscrire
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button 
                                onClick={() => setDropdownOpen(!isDropdownOpen)} 
                                className="flex items-center gap-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors duration-150"
                            >
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-text-primary font-semibold">
                                    {user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
                                </span>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-background-surface rounded-lg shadow-lg py-2 ring-1 ring-border/50 border border-border/20">
                                    <Link 
                                        to="/dashboard" 
                                        onClick={() => setDropdownOpen(false)} 
                                        className="flex items-center gap-x-3 px-4 py-3 text-sm text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                                    >
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                        <LayoutDashboard size={16} />
                                        </div>
                                        <span className="font-medium">Mon espace</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left flex items-center gap-x-3 px-4 py-3 text-sm text-negative hover:bg-negative/10 transition-colors duration-150"
                                    >
                                        <div className="p-1.5 rounded-lg bg-negative/10">
                                        <LogOut size={16} />
                                        </div>
                                        <span className="font-medium">Se déconnecter</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;