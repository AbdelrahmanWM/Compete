'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

const ratingData = [
  { date: 'Week 1', TechElite: 4.5, ValueTech: 4.2, GamerPro: 4.6, SmartHomePlus: 4.3, BudgetBytes: 4.0 },
  { date: 'Week 2', TechElite: 4.5, ValueTech: 4.3, GamerPro: 4.6, SmartHomePlus: 4.3, BudgetBytes: 4.1 },
  { date: 'Week 3', TechElite: 4.4, ValueTech: 4.3, GamerPro: 4.7, SmartHomePlus: 4.4, BudgetBytes: 4.1 },
  { date: 'Week 4', TechElite: 4.5, ValueTech: 4.4, GamerPro: 4.7, SmartHomePlus: 4.4, BudgetBytes: 4.2 },
]

const reviewVolumeData = [
  { date: 'Week 1', reviews: 245 },
  { date: 'Week 2', reviews: 312 },
  { date: 'Week 3', reviews: 289 },
  { date: 'Week 4', reviews: 356 },
]

export function RatingsTrendChart() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-3">Average Rating by Competitor</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#888" 
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#888" 
              style={{ fontSize: '11px' }}
              domain={[3.5, 5]}
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
            <Line type="monotone" dataKey="TechElite" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="ValueTech" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="GamerPro" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="SmartHomePlus" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="BudgetBytes" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-3">Review Volume Over Time</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={reviewVolumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
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
            <Area type="monotone" dataKey="reviews" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
