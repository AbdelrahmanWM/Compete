'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'TechElite', discounted: 8, regular: 24 },
  { name: 'ValueTech', discounted: 12, regular: 18 },
  { name: 'GamerPro', discounted: 6, regular: 26 },
  { name: 'SmartHome+', discounted: 10, regular: 22 },
  { name: 'BudgetBytes', discounted: 15, regular: 17 },
]

export function DiscountTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="name" 
          stroke="#888" 
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888" 
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
            borderRadius: '8px'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Bar dataKey="discounted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="regular" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
