import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut, Wallet, Menu, Settings, Tag, Download, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import UserAvatar from '../components/UserAvatar';

import { useAuth } from '../contexts/AuthContext';

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
}

const NavLink = ({ to, icon, children, onClick }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                onClick={onClick}
                className={`w-full flex items-center gap-x-3 px-4 py-3 text-text-secondary rounded-lg transition-colors duration-150 ${
                    isActive 
                        ? 'bg-primary/20 text-primary font-semibold' 
                        : 'hover:bg-primary/10 hover:text-primary'
                }`}
            >
                <div className={`p-2 rounded-lg ${
                    isActive 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-primary/10 text-text-secondary'
                }`}>
                    {icon}
                </div>
                <span className="font-medium">{children}</span>
                {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
            </Link>
        </li>
    );
};

interface SidebarContentProps {
    onLinkClick?: () => void;
}

const SidebarContent = ({ onLinkClick }: SidebarContentProps) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full bg-background-surface">
            {/* Header avec logo */}
            <div className="p-6 border-b border-border/50">
                <Link to="/" className="group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                                MoneyWise
                            </h1>
                            <p className="text-xs text-text-secondary">Gestion financière</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 px-2">
                        Navigation
                    </h2>
                    <ul className="space-y-2">
                        <NavLink to="/dashboard" icon={<Home size={20} />} onClick={onLinkClick}>
                            Tableau de bord
                        </NavLink>
                        <NavLink to="/transactions" icon={<Wallet size={20} />} onClick={onLinkClick}>
                            Transactions
                        </NavLink>
                        <NavLink to="/categories" icon={<Tag size={20} />} onClick={onLinkClick}>
                            Catégories
                        </NavLink>
                      {/*   <NavLink to="/reports" icon={<LineChart size={20} />} onClick={onLinkClick}>
                            Rapports
                        </NavLink> */}
                        <NavLink to="/export" icon={<Download size={20} />} onClick={onLinkClick}>
                            Export
                        </NavLink>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 px-2">
                        Paramètres
                    </h2>
                    <ul className="space-y-2">
                        <NavLink to="/profile" icon={<Settings size={20} />} onClick={onLinkClick}>
                            Paramètres
                        </NavLink>
                    </ul>
                </div>
            </nav>

            {/* Footer avec utilisateur et déconnexion */}
            <div className="p-4 border-t border-border/50">
                {user && (
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">
                                    {user.prenom} {user.nom}
                                </p>
                                <p className="text-xs text-text-secondary truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-x-3 p-3 text-text-secondary hover:text-negative rounded-lg hover:bg-negative/10 transition-colors duration-150"
                >
                    <div className="p-2 rounded-lg bg-negative/10">
                        <LogOut size={20} />
                    </div>
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    )
};

const Sidebar = () => (
    <aside className="hidden md:flex w-72 bg-background-surface border-r border-border/50 flex-shrink-0 shadow-sm">
        <SidebarContent />
    </aside>
);

interface MobileSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const MobileSidebar = ({ isOpen, setIsOpen }: MobileSidebarProps) => (
    <>
        <div 
            className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`} 
            onClick={() => setIsOpen(false)}
        ></div>
        <div 
            className={`fixed z-40 inset-y-0 left-0 w-72 bg-background-surface transition-transform duration-200 ease-in-out md:hidden shadow-lg ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <SidebarContent onLinkClick={() => setIsOpen(false)} />
        </div>
    </>
);

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-x-3">
                <button 
                    onClick={onMenuClick} 
                    className="md:hidden p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-150"
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-x-3">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                        {title}
                    </h1>
                </div>
            </div>
            
            <div className="flex items-center gap-x-4">
                <ThemeToggle />
                
                {user && (
                    <div className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-150">
                        <UserAvatar user={user} size="md" />
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-text-primary">
                                {user.prenom} {user.nom?.charAt(0)}.
                            </p>
                            <p className="text-xs text-text-secondary">
                                Connecté
                            </p>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={handleLogout} 
                    className="hidden sm:flex items-center gap-x-2 p-2 text-text-secondary hover:text-negative hover:bg-negative/10 rounded-lg transition-colors duration-150"
                >
                    <div className="p-1.5 rounded-lg bg-negative/10">
                        <LogOut size={18} />
                    </div>
                    <span className="text-sm font-medium">Déconnexion</span>
                </button>
            </div>
        </header>
    );
}

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            <Sidebar />
            <MobileSidebar isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title={title} onMenuClick={() => setIsMobileNavOpen(true)} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;