'use client'

import { useMemo } from 'react'
import { TrendingDown, TrendingUp, Bell, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Event } from '@/app/live-feed/page'

interface EventStatsProps {
  events: Event[]
  timeRange: string
}

export function EventStats({ events, timeRange }: EventStatsProps) {
  const stats = useMemo(() => {
    const priceDrops = events.filter((e) => e.type === 'price_drop').length
    const priceIncreases = events.filter((e) => e.type === 'price_increase').length
    const alerts = events.filter((e) => e.type === 'alert').length
    const stockChanges = events.filter((e) => e.type === 'stock_change').length

    return { priceDrops, priceIncreases, alerts, stockChanges }
  }, [events])

  // Calculate events per time bucket for chart
  const eventsOverTime = useMemo(() => {
    const buckets: Record<string, number> = {}
    const now = Date.now()
    const bucketSize = timeRange === '1h' ? 5 * 60 * 1000 : timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    const numBuckets = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : 7

    for (let i = 0; i < numBuckets; i++) {
      const bucketTime = now - (i * bucketSize)
      const label = timeRange === '1h' 
        ? `${i * 5}m` 
        : timeRange === '24h' 
        ? `${i}h`
        : `${i}d`
      buckets[label] = 0
    }

    events.forEach((event) => {
      const eventTime = event.timestamp.getTime()
      const bucketIndex = Math.floor((now - eventTime) / bucketSize)
      const label = timeRange === '1h'
        ? `${bucketIndex * 5}m`
        : timeRange === '24h'
        ? `${bucketIndex}h`
        : `${bucketIndex}d`
      
      if (buckets[label] !== undefined) {
        buckets[label]++
      }
    })

    return Object.entries(buckets)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .slice(0, 8)
  }, [events, timeRange])

  const maxEvents = Math.max(...eventsOverTime.map(([, count]) => count), 1)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price Drops</CardTitle>
          <TrendingDown className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.priceDrops}</div>
          <p className="text-xs text-muted-foreground">
            vs {stats.priceIncreases} increases
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price Increases</CardTitle>
          <TrendingUp className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.priceIncreases}</div>
          <p className="text-xs text-muted-foreground">
            {stats.priceDrops > stats.priceIncreases ? 'Favorable trend' : 'Watch closely'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts Triggered</CardTitle>
          <Bell className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.alerts}</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{events.length}</div>
          <div className="mt-3 flex items-end gap-1">
            {eventsOverTime.map(([label, count]) => (
              <div key={label} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${Math.max((count / maxEvents) * 32, 2)}px` }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
