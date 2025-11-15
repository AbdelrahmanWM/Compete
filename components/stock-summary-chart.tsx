'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'TechElite', inStock: 25, lowStock: 5, outOfStock: 2 },
  { name: 'ValueTech', inStock: 22, lowStock: 6, outOfStock: 2 },
  { name: 'GamerPro', inStock: 28, lowStock: 3, outOfStock: 1 },
  { name: 'SmartHome+', inStock: 24, lowStock: 6, outOfStock: 2 },
  { name: 'BudgetBytes', inStock: 20, lowStock: 8, outOfStock: 4 },
]

export function StockSummaryChart() {
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-500">119</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-orange-500">28</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-500">11</p>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="name" 
            stroke="#888" 
            style={{ fontSize: '11px' }}
          />
          <YAxis 
            stroke="#888" 
            style={{ fontSize: '11px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
          />
          <Bar dataKey="inStock" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="lowStock" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
          <Bar dataKey="outOfStock" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
