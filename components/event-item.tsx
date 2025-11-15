'use client'

import { TrendingDown, TrendingUp, Package, Bell, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Event, EventType } from '@/app/live-feed/page'

interface EventItemProps {
  event: Event
  viewMode: 'feed' | 'condensed'
}

const eventTypeConfig: Record<
  EventType,
  { icon: typeof TrendingDown; color: string; bgColor: string }
> = {
  price_drop: {
    icon: TrendingDown,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  price_increase: {
    icon: TrendingUp,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  stock_change: {
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  alert: {
    icon: Bell,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  new_product: {
    icon: Plus,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
}

function formatTimestamp(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  
  const minutes = Math.floor(diff / (60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function EventItem({ event, viewMode }: EventItemProps) {
  const config = eventTypeConfig[event.type]
  const Icon = config.icon

  if (viewMode === 'condensed') {
    return (
      <div className="flex items-center gap-3 px-6 py-3 hover:bg-accent/50 transition-colors">
        <div className={`flex h-7 w-7 items-center justify-center rounded ${config.bgColor}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">
            <span className="font-medium">{event.productName}</span>
            {' · '}
            {event.description}
          </p>
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          {event.competitorName}
        </Badge>
        <span className="text-xs text-muted-foreground shrink-0">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex gap-4 px-6 py-4 hover:bg-accent/50 transition-colors">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
        <Icon className={`h-5 w-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">
              {event.productName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTimestamp(event.timestamp)}
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {event.competitorName}
        </Badge>
      </div>
    </div>
  )
}
