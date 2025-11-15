'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { EventType } from '@/app/live-feed/page'

interface EventFilterBarProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
  selectedEventTypes: EventType[]
  onEventTypesChange: (types: EventType[]) => void
  selectedCompetitor: string
  onCompetitorChange: (value: string) => void
  competitors: string[]
  searchQuery: string
  onSearchChange: (value: string) => void
  viewMode: 'feed' | 'condensed'
  onViewModeChange: (mode: 'feed' | 'condensed') => void
}

const eventTypeLabels: Record<EventType, string> = {
  price_drop: 'Price Drop',
  price_increase: 'Price Increase',
  stock_change: 'Stock Change',
  alert: 'Alert',
  new_product: 'New Product'
}

export function EventFilterBar({
  timeRange,
  onTimeRangeChange,
  selectedEventTypes,
  onEventTypesChange,
  selectedCompetitor,
  onCompetitorChange,
  competitors,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}: EventFilterBarProps) {
  const toggleEventType = (type: EventType) => {
    if (selectedEventTypes.includes(type)) {
      onEventTypesChange(selectedEventTypes.filter((t) => t !== type))
    } else {
      onEventTypesChange([...selectedEventTypes, type])
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      {/* Top row: Time range and view mode */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
        </div>
        
        <div className="flex gap-2">
          {(['1h', '24h', '7d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range === '1h' ? 'Last hour' : range === '24h' ? '24 hours' : '7 days'}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <Button
            variant={viewMode === 'feed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('feed')}
          >
            Feed
          </Button>
          <Button
            variant={viewMode === 'condensed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('condensed')}
          >
            Condensed
          </Button>
        </div>
      </div>

      {/* Second row: Event type filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Event types:</span>
        {(Object.keys(eventTypeLabels) as EventType[]).map((type) => (
          <Badge
            key={type}
            variant={selectedEventTypes.includes(type) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleEventType(type)}
          >
            {eventTypeLabels[type]}
          </Badge>
        ))}
      </div>

      {/* Third row: Competitor and search */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedCompetitor} onValueChange={onCompetitorChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All competitors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All competitors</SelectItem>
            {competitors.map((competitor) => (
              <SelectItem key={competitor} value={competitor}>
                {competitor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}
