'use client'

import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff } from 'lucide-react'

interface Alert {
  id: string
  productName: string
  productImage: string
  competitor: string
  condition: string
  threshold: string
  currentValue: string
  status: 'active' | 'paused'
  lastTriggered: string
  createdAt: string
}

interface AlertFeedProps {
  alerts: Alert[]
  onToggle: (id: string) => void
}

export function AlertFeed({ alerts, onToggle }: AlertFeedProps) {
  return (
    <div className="rounded-lg border border-border bg-card divide-y divide-border">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
        >
          {/* Thumbnail */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
            <Image
              src={alert.productImage || "/placeholder.svg"}
              alt={alert.productName}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-foreground text-sm truncate">
                {alert.productName}
              </h4>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {alert.competitor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {alert.condition}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Last triggered: {alert.lastTriggered}
              </span>
            </div>
          </div>

          {/* Status & Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {alert.status === 'active' ? (
              <Bell className="h-4 w-4 text-green-500" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={alert.status === 'active'}
              onCheckedChange={() => onToggle(alert.id)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
