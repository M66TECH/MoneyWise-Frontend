import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface ExpenseData {
  nom_categorie: string;
  couleur_categorie: string;
  montant_total: string;
  nombre_transactions: number;
}

interface ExpensePieChartProps {
  data: ExpenseData[];
}

const Label = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const RAD = Math.PI / 180
  const r   = innerRadius + (outerRadius - innerRadius) * 0.7
  const x   = cx + r * Math.cos(-midAngle * RAD)
  const y   = cy + r * Math.sin(-midAngle * RAD)
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
          className="text-[11px] font-bold fill-white pointer-events-none">
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  /*  ⬇  empêchera tout rendu côté SSR / double rendu strict-mode */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  

  
  if (!mounted) return null

  // Transformer les données pour le graphique avec contrôles
  const chartData = data
    .filter(item => item && item.nom_categorie && item.montant_total) // Filtrer les données invalides
    .map(item => {
      const value = parseFloat(item.montant_total);
      return {
        name: item.nom_categorie || 'Catégorie inconnue',
        value: !isNaN(value) && value > 0 ? value : 0,
        color: item.couleur_categorie || '#6B7280' // Couleur par défaut si manquante
      };
    })
    .filter(item => item.value > 0); // Ne garder que les valeurs positives



  // Si pas de données, afficher un message
  if (chartData.length === 0) {
    return (
      <div className="bg-background-surface p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Répartition des dépenses
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
        Répartition des dépenses
      </h3>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData}
                 dataKey="value"
                 cx="50%" cy="50%"
                 outerRadius={140}
                 labelLine={false}
                 label={Label}>
              {chartData.map((e, i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip 
              formatter={(v: number, n: string) => [
                `${!isNaN(v) ? v.toLocaleString('fr-FR') : '0'} FCFA`, 
                n
              ]} 
            />
            {/* <Legend />   */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}