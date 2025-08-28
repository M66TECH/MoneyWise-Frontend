import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  mois: string;
  revenus: number;
  depenses: number;
  solde: number;
}

interface MonthlyAnalyticsChartProps {
  data: MonthlyData[];
}

const MonthlyAnalyticsChart = ({ data }: MonthlyAnalyticsChartProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

  

    if (!mounted) {
        return <div className="bg-background-surface p-6 rounded-lg border border-border h-[400px]"></div>; // Placeholder
    }

    // Transformer les données pour le graphique avec contrôles
    const chartData = data
        .filter(item => item && item.mois) // Filtrer les données invalides
        .map(item => ({
            name: item.mois || 'Mois inconnu',
            revenus: item.revenus && !isNaN(item.revenus) ? item.revenus : 0,
            depenses: item.depenses && !isNaN(item.depenses) ? item.depenses : 0
        }))
        .filter(item => item.revenus > 0 || item.depenses > 0); // Ne garder que les mois avec des données

  

    // Si pas de données, afficher un message
    if (chartData.length === 0) {
        return (
            <div className="bg-background-surface p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Évolution Mensuelle
                </h3>
                <div className="flex items-center justify-center h-80 text-text-secondary">
                    Aucune donnée disponible
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
                Évolution Mensuelle
            </h3>
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
                        <XAxis dataKey="name" stroke="rgba(var(--color-text-secondary))" />
                        <YAxis stroke="rgba(var(--color-text-secondary))" />
                        <Tooltip
                            cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                            contentStyle={{ backgroundColor: 'rgba(var(--color-background-surface))', border: '1px solid rgba(var(--color-border))' }}
                            formatter={(value: number) => [
                                `${!isNaN(value) ? value.toLocaleString('fr-FR') : '0'} FCFA`
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="revenus" fill="rgba(var(--color-positive))" name="Revenus" />
                        <Bar dataKey="depenses" fill="rgba(var(--color-negative))" name="Dépenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyAnalyticsChart;