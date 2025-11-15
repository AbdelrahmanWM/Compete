import { Star, Package, TrendingUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import type { Competitor } from "@/app/competitors/page"

interface CompetitorTableProps {
  competitors: Competitor[]
  onRowClick: (competitor: Competitor) => void
}

export function CompetitorTable({ competitors, onRowClick }: CompetitorTableProps) {
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
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Competitor</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand Positioning</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price Range</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rating</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Promotion Freq</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Products</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((competitor) => (
              <tr
                key={competitor.id}
                className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onRowClick(competitor)}
              >
                {/* Competitor Info */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={competitor.logo || "/placeholder.svg"}
                      alt={`${competitor.name} logo`}
                      className="w-10 h-10 rounded-lg bg-muted object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{competitor.name}</div>
                      <div className="text-sm text-muted-foreground">{competitor.tagline}</div>
                    </div>
                  </div>
                </td>

                {/* Brand Positioning */}
                <td className="p-4">
                  <Badge variant="outline" className={positioningColors[competitor.brandPositioning]}>
                    {competitor.brandPositioning}
                  </Badge>
                </td>

                {/* Price Range */}
                <td className="p-4">
                  <span className="text-sm text-foreground">{competitor.avgPriceRange}</span>
                </td>

                {/* Rating */}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{competitor.avgRating}</span>
                  </div>
                </td>

                {/* Promotion Frequency */}
                <td className="p-4">
                  <Badge variant="outline" className={promoColors[competitor.promotionFrequency]}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {competitor.promotionFrequency}
                  </Badge>
                </td>

                {/* Tracked Products */}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{competitor.trackedProducts}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
