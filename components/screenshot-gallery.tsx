'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Download, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

interface ScreenshotGalleryProps {
  triggers: Trigger[]
}

export function ScreenshotGallery({ triggers }: ScreenshotGalleryProps) {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Alert Screenshots
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              onClick={() => setSelectedTrigger(trigger)}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted cursor-pointer hover:border-purple-500 transition-colors"
            >
              {/* Placeholder screenshot */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <div className="text-center p-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    {trigger.productName}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {trigger.condition}
                  </Badge>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-sm font-medium">View Screenshot</div>
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                {trigger.triggeredAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot Modal */}
      <Dialog open={!!selectedTrigger} onOpenChange={() => setSelectedTrigger(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selectedTrigger?.productName}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {selectedTrigger?.competitor} · {selectedTrigger?.triggeredAt}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Screenshot Display */}
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-center space-y-4">
                <Badge variant="default" className="text-sm">
                  {selectedTrigger?.condition}
                </Badge>
                <div className="text-lg font-semibold text-foreground">
                  {selectedTrigger?.previousValue} → {selectedTrigger?.newValue}
                </div>
                <div className="text-sm text-muted-foreground">
                  Screenshot placeholder
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
