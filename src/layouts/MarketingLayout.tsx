import React from 'react';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light dark:bg-gray-900 text-neutral-dark dark:text-neutral-light transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MarketingLayout;