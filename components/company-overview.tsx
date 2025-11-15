import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users, TrendingUp } from 'lucide-react'

export function CompanyOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-2xl font-bold text-primary">AC</span>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Acme Corp</h3>
            <p className="text-sm text-muted-foreground">
              {'Premium lifestyle & electronics brand'}
            </p>
            <Badge variant="secondary" className="mt-1">
              Premium
            </Badge>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Avg. Price Range</span>
            <span className="font-mono text-sm font-medium text-foreground">
              $299 - $899
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Products</span>
            <span className="font-mono text-sm font-medium text-foreground">127</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="space-y-3 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">Market Presence</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Followers</span>
              <span className="ml-auto font-mono text-sm font-medium text-foreground">
                284K
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Promotion Freq.</span>
              <span className="ml-auto text-sm font-medium text-foreground">
                Weekly
              </span>
            </div>
          </div>
        </div>

        {/* Customer Experience */}
        <div className="space-y-3 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">Customer Experience</h4>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  4.6/5
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4
                        ? 'fill-chart-3 text-chart-3'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Return Policy</span>
                <span className="text-sm font-medium text-foreground">30 days</span>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Support Quality</span>
                <span className="text-sm font-medium text-chart-2">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
