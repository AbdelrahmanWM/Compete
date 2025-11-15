import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
  icon?: ReactNode
}

export function KpiCard({ label, value, trend, icon }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold text-foreground">{value}</p>
          </div>
          {icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span
              className={
                trend.direction === 'up'
                  ? 'font-medium text-chart-2'
                  : 'font-medium text-destructive'
              }
            >
              {trend.direction === 'up' ? '+' : '-'}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
