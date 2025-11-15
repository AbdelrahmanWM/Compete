import { KpiCard } from '@/components/kpi-card'
import { CompanyOverview } from '@/components/company-overview'
import { InsightsPanel } from '@/components/insights-panel'
import { PriceChart } from '@/components/price-chart'
import { RatingsChart } from '@/components/ratings-chart'
import { ActivityFeed } from '@/components/activity-feed'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Market Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time competitor intelligence</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Last updated: 2 min ago</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* Top KPI Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Competitors Tracked"
            value="47"
            trend={{ value: 8, direction: 'up', label: 'vs last week' }}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Products Tracked"
            value="1,284"
            trend={{ value: 12, direction: 'up', label: 'vs last week' }}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Active Alerts"
            value="23"
            trend={{ value: 3, direction: 'down', label: 'vs yesterday' }}
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <KpiCard
            label="Products on Discount"
            value="156"
            trend={{ value: 15, direction: 'up', label: 'vs last week' }}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Company Overview */}
          <div className="lg:col-span-1">
            <CompanyOverview />
          </div>

          {/* Right Column - Insights & Charts */}
          <div className="space-y-6 lg:col-span-2">
            <InsightsPanel />

            <div className="grid gap-6 md:grid-cols-2">
              <PriceChart />
              <RatingsChart />
            </div>

            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
