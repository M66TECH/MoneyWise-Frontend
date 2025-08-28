import { Linkedin, Facebook, Github } from 'lucide-react';

const Footer = () => {

    const footerNavs = [
        { name: 'À propos', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'L\'équipe', href: '#' },
        { name: 'FAQ', href: '#' },
    ];

    const socialLinks = [
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-6 h-6" /> },
        { name: 'Facebook', href: '#', icon: <Facebook className="w-6 h-6" /> },
        { name: 'Github', href: '#', icon: <Github className="w-6 h-6" /> },
    ];

    return (
        <footer className="w-full text-text-secondary bg-background border-t border-border">
            <div className="max-w-screen-xl mx-auto px-4 py-8 md:px-8">
                <div className="max-w-lg sm:mx-auto sm:text-center">
                    <h2 className="text-2xl font-bold text-text-primary">MoneyWise</h2>
                    <p className="leading-relaxed mt-2 text-[15px]">
                        Gérez vos finances personnelles simplement.
                    </p>
                </div>
                <ul className="items-center justify-center mt-8 space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
                    {footerNavs.map((item, idx) => (
                        <li key={idx} className="hover:text-primary">
                            <a href={item.href}>{item.name}</a>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 items-center justify-between sm:flex">
                    <div className="mt-4 sm:mt-0">
                        &copy; 2024 MoneyWise - Jeemacoder Groupe 3. Tous droits réservés.
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <ul className="flex items-center space-x-4">
                            {socialLinks.map((link, idx) => (
                                 <li key={idx} className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
                                    <a href={link.href} aria-label={link.name}>
                                        {link.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;