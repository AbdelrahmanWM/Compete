'use client'

import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Trash2, Edit } from 'lucide-react'
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

interface AlertTableProps {
  alerts: Alert[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertTable({ alerts, onToggle, onDelete }: AlertTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Competitor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Condition
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Threshold
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Last Triggered
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Toggle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={alert.productImage || "/placeholder.svg"}
                        alt={alert.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {alert.productName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {alert.competitor}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{alert.condition}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-foreground">
                    {alert.threshold}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                    {alert.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {alert.lastTriggered}
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={alert.status === 'active'}
                    onCheckedChange={() => onToggle(alert.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(alert.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
