import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp, Tag, Package } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'price_decrease',
    product: 'Wireless Keyboard',
    competitor: 'Acme Corp',
    description: 'Price decreased from $349 to $299',
    timestamp: '5 min ago',
    icon: ArrowDown,
    iconColor: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    id: 2,
    type: 'new_discount',
    product: 'Gaming Mouse',
    competitor: 'TechGear',
    description: 'New 20% discount applied',
    timestamp: '12 min ago',
    icon: Tag,
    iconColor: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
  {
    id: 3,
    type: 'stock_change',
    product: 'USB-C Hub',
    competitor: 'ConnectPro',
    description: 'Stock level: Low (5 units)',
    timestamp: '18 min ago',
    icon: Package,
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    id: 4,
    type: 'price_increase',
    product: '4K Monitor',
    competitor: 'DisplayTech',
    description: 'Price increased from $599 to $649',
    timestamp: '25 min ago',
    icon: ArrowUp,
    iconColor: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    id: 5,
    type: 'new_discount',
    product: 'Wireless Earbuds',
    competitor: 'AudioMax',
    description: 'New 15% discount applied',
    timestamp: '32 min ago',
    icon: Tag,
    iconColor: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/5"
            >
              <div className={`rounded-lg ${activity.bgColor} p-2`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.product}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.competitor}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
