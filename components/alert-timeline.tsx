'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Camera } from 'lucide-react'

interface Trigger {
  id: string
  alertId: string
  productName: string
  competitor: string
  condition: string
  previousValue: string
  newValue: string
  triggeredAt: string
  screenshot: boolean
}

interface AlertTimelineProps {
  triggers: Trigger[]
}

export function AlertTimeline({ triggers }: AlertTimelineProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Triggers</h2>
      <div className="space-y-6">
        {triggers.map((trigger, index) => (
          <div key={trigger.id} className="relative">
            {/* Timeline line */}
            {index < triggers.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
            )}

            {/* Trigger Item */}
            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 mt-1 h-10 w-10 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-purple-500" />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {trigger.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {trigger.competitor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{trigger.condition}</Badge>
                    {trigger.screenshot && (
                      <Camera className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-muted-foreground line-through">
                    {trigger.previousValue}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-semibold text-purple-500">
                    {trigger.newValue}
                  </span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {trigger.triggeredAt}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
