'use client'

import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Trash2, Edit, Bell, BellOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface AlertCardProps {
  alert: Alert
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-purple-500/50">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={alert.productImage || "/placeholder.svg"}
            alt={alert.productName}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header with Actions */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground leading-tight">
                {alert.productName}
              </h3>
              <p className="text-sm text-muted-foreground">{alert.competitor}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Alert
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(alert.id)}
                  className="text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Alert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Condition & Threshold */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                {alert.condition}
              </Badge>
              {alert.status === 'active' ? (
                <Bell className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Threshold: </span>
              <span className="font-mono text-foreground">{alert.threshold}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Current: </span>
              <span className="font-mono font-semibold text-purple-500">
                {alert.currentValue}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="text-xs text-muted-foreground">
              Last triggered: {alert.lastTriggered}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {alert.status === 'active' ? 'Active' : 'Paused'}
              </span>
              <Switch
                checked={alert.status === 'active'}
                onCheckedChange={() => onToggle(alert.id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
