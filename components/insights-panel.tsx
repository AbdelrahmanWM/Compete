import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Package } from 'lucide-react'

export function InsightsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pricing Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground">Pricing</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="font-mono text-2xl font-semibold text-foreground">$549</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Highest</p>
                  <p className="font-mono text-sm font-medium text-foreground">$899</p>
                  <p className="text-xs text-muted-foreground">Premium Laptop</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lowest</p>
                  <p className="font-mono text-sm font-medium text-foreground">$199</p>
                  <p className="text-xs text-muted-foreground">Wireless Mouse</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock & Ratings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <Package className="h-4 w-4 text-chart-2" />
              </div>
              <h3 className="text-sm font-medium text-foreground">Stock & Quality</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="font-mono text-2xl font-semibold text-foreground">4.3/5</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Stock</span>
                  <span className="font-mono font-medium text-chart-2">98 products</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Low Stock</span>
                  <span className="font-mono font-medium text-chart-3">18 products</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sold Out</span>
                  <span className="font-mono font-medium text-destructive">11 products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Summary */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between rounded-lg bg-accent/5 p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium text-foreground">Discount Activity</span>
              </div>
              <span className="font-mono text-sm font-medium text-chart-3">
                32 of 127 products discounted
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
