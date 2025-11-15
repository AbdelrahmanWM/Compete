'use client'

import { Card } from '@/components/ui/card'
import { PriceTrendChart } from '@/components/price-trend-chart'
import { DiscountTrendChart } from '@/components/discount-trend-chart'
import { RatingsTrendChart } from '@/components/ratings-trend-chart'
import { StockSummaryChart } from '@/components/stock-summary-chart'
import { TrendInsights } from '@/components/trend-insights'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function TrendsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trends Reports</h1>
        <p className="text-muted-foreground">
          Analyze market trends, pricing patterns, and competitor behavior over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Price Trend</p>
              <p className="text-2xl font-bold">$847.50</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+5.2% vs last week</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Discounts</p>
              <p className="text-2xl font-bold">18 Products</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-500">2 new this week</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
              <p className="text-2xl font-bold">4.3</p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">Stable</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Price Trends */}
        <Card className="p-6 border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Price Trends</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Average product prices over the last 30 days
          </p>
          <PriceTrendChart />
        </Card>

        {/* Discount Trends */}
        <Card className="p-6 border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Discount Trends</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Number of discounted products by competitor
          </p>
          <DiscountTrendChart />
        </Card>

        {/* Ratings Trends */}
        <Card className="p-6 border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Ratings & Review Trends</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Average rating and review volume over time
          </p>
          <RatingsTrendChart />
        </Card>

        {/* Stock Summary */}
        <Card className="p-6 border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Stock Availability Summary</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Product availability across all competitors
          </p>
          <StockSummaryChart />
        </Card>
      </div>

      {/* Insights Section */}
      <TrendInsights />
    </div>
  )
}
