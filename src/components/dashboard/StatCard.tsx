import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border flex items-center gap-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-text-secondary font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;