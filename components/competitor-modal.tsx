import { X, Star, Package, TrendingUp, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Competitor } from "@/app/competitors/page"

interface CompetitorModalProps {
  competitor: Competitor
  onClose: () => void
}

export function CompetitorModal({ competitor, onClose }: CompetitorModalProps) {
  const positioningColors = {
    premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    budget: "bg-green-500/10 text-green-400 border-green-500/20",
    niche: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  }

  const promoColors = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    low: "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <img
              src={competitor.logo || "/placeholder.svg"}
              alt={`${competitor.name} logo`}
              className="w-20 h-20 rounded-lg bg-muted object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{competitor.name}</h2>
              <p className="text-muted-foreground mt-1">{competitor.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className={positioningColors[competitor.brandPositioning]}>
                  {competitor.brandPositioning}
                </Badge>
                <Badge variant="outline" className={promoColors[competitor.promotionFrequency]}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {competitor.promotionFrequency} promo
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {competitor.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Average Price Range</div>
              <div className="text-xl font-semibold text-foreground">{competitor.avgPriceRange}</div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Average Rating</div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-semibold text-foreground">{competitor.avgRating}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Tracked Products</div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-xl font-semibold text-foreground">{competitor.trackedProducts}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Promotion Activity</div>
              <div className="text-xl font-semibold text-foreground capitalize">
                {competitor.promotionFrequency}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <Button className="flex-1" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View in Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
