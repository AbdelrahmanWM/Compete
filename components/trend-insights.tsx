'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Percent, Star } from 'lucide-react'

export function TrendInsights() {
  const insights = [
    {
      icon: TrendingUp,
      iconColor: 'text-green-500',
      label: 'Price Movement',
      value: 'Average price increased by 5% vs last week',
      detail: '$847.50 avg price across all products',
    },
    {
      icon: Percent,
      iconColor: 'text-orange-500',
      label: 'Discount Activity',
      value: '2 products recently discounted',
      detail: '18 total active discounts across competitors',
    },
    {
      icon: Star,
      iconColor: 'text-blue-500',
      label: 'Rating Trends',
      value: '4.3 average rating (stable)',
      detail: '356 new reviews added this week',
    },
    {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      label: 'Stock Alerts',
      value: '11 products out of stock',
      detail: '28 products in low stock status',
    },
    {
      icon: TrendingDown,
      iconColor: 'text-purple-500',
      label: 'Lowest Price',
      value: 'Wireless Gaming Mouse',
      detail: '$89.99 at BudgetBytes (15% discount)',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-purple-500',
      label: 'Highest Price',
      value: '4K Gaming Monitor',
      detail: '$1,299.99 at TechElite (premium tier)',
    },
  ]

  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-lg font-semibold mb-4">Market Insights</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Key trends and metrics across all tracked products
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={index}
              className="flex gap-3 p-4 rounded-lg border border-border bg-background/50"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${insight.iconColor}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{insight.label}</p>
                <p className="text-sm font-semibold mb-1">{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
