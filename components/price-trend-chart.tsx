'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: 'Jan 1', TechElite: 899, ValueTech: 749, GamerPro: 899, SmartHomePlus: 849, BudgetBytes: 699 },
  { date: 'Jan 5', TechElite: 895, ValueTech: 745, GamerPro: 895, SmartHomePlus: 845, BudgetBytes: 695 },
  { date: 'Jan 10', TechElite: 889, ValueTech: 739, GamerPro: 889, SmartHomePlus: 839, BudgetBytes: 689 },
  { date: 'Jan 15', TechElite: 879, ValueTech: 729, GamerPro: 879, SmartHomePlus: 829, BudgetBytes: 679 },
  { date: 'Jan 20', TechElite: 869, ValueTech: 719, GamerPro: 869, SmartHomePlus: 819, BudgetBytes: 669 },
  { date: 'Jan 25', TechElite: 859, ValueTech: 709, GamerPro: 859, SmartHomePlus: 809, BudgetBytes: 659 },
  { date: 'Jan 30', TechElite: 849, ValueTech: 699, GamerPro: 849, SmartHomePlus: 799, BudgetBytes: 649 },
]

export function PriceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="date" 
          stroke="#888" 
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888" 
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
            borderRadius: '8px'
          }}
          formatter={(value) => `$${value}`}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Line type="monotone" dataKey="TechElite" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ValueTech" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="GamerPro" stroke="#10b981" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="SmartHomePlus" stroke="#f59e0b" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="BudgetBytes" stroke="#ef4444" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
