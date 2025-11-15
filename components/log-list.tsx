import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Log {
  id: number
  timestamp: string
  description: string
  status: 'success' | 'error' | 'warning'
}

interface LogListProps {
  logs: Log[]
}

export function LogList({ logs }: LogListProps) {
  const getStatusIcon = (status: Log['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <ScrollArea className="h-[300px] rounded-lg border border-border bg-background/50">
      <div className="space-y-2 p-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm"
          >
            <div className="mt-0.5">{getStatusIcon(log.status)}</div>
            <div className="flex-1 space-y-1">
              <div className="font-medium text-foreground">{log.description}</div>
              <div className="text-xs text-muted-foreground">{log.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
