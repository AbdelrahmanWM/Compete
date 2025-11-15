import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'not_connected'
  icon: string
}

interface IntegrationCardProps {
  integration: Integration
  onClick: () => void
}

export function IntegrationCard({ integration, onClick }: IntegrationCardProps) {
  return (
    <Card className="border-border bg-card p-4 transition-colors hover:bg-card/80">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="text-3xl">{integration.icon}</div>
          <Badge
            variant={integration.status === 'connected' ? 'default' : 'secondary'}
            className={
              integration.status === 'connected'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-muted text-muted-foreground'
            }
          >
            {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{integration.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{integration.description}</p>
        </div>
        <Button
          variant={integration.status === 'connected' ? 'outline' : 'default'}
          size="sm"
          onClick={onClick}
          className="w-full"
        >
          {integration.status === 'connected' ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </Card>
  )
}
