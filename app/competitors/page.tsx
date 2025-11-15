"use client"

import { useState, useMemo } from "react"
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompetitorCard } from "@/components/competitor-card"
import { CompetitorTable } from "@/components/competitor-table"
import { CompetitorModal } from "@/components/competitor-modal"
import { FilterSidebar } from "@/components/filter-sidebar"

export type Competitor = {
  id: string
  name: string
  logo: string
  tagline: string
  brandPositioning: "premium" | "budget" | "niche"
  avgPriceRange: string
  promotionFrequency: "high" | "medium" | "low"
  avgRating: number
  trackedProducts: number
  description: string
}

const mockCompetitors: Competitor[] = [
  {
    id: "1",
    name: "TechElite",
    logo: "/techelite-logo.jpg",
    tagline: "Premium technology for professionals",
    brandPositioning: "premium",
    avgPriceRange: "$800-$1,500",
    promotionFrequency: "low",
    avgRating: 4.7,
    trackedProducts: 24,
    description: "TechElite positions itself as a premium technology brand targeting high-end professionals and enterprise customers. Known for exceptional build quality and customer service, they maintain premium pricing with minimal promotional activity."
  },
  {
    id: "2",
    name: "ValueTech",
    logo: "/valuetech-logo.jpg",
    tagline: "Quality tech at affordable prices",
    brandPositioning: "budget",
    avgPriceRange: "$200-$400",
    promotionFrequency: "high",
    avgRating: 4.2,
    trackedProducts: 38,
    description: "ValueTech focuses on delivering affordable technology solutions to price-conscious consumers. They frequently run promotions and maintain competitive pricing while offering a wide product range across multiple categories."
  },
  {
    id: "3",
    name: "GamerPro",
    logo: "/gamerpro-logo.jpg",
    tagline: "Built for serious gamers",
    brandPositioning: "niche",
    avgPriceRange: "$600-$1,200",
    promotionFrequency: "medium",
    avgRating: 4.6,
    trackedProducts: 16,
    description: "GamerPro specializes exclusively in gaming peripherals and accessories, targeting hardcore gaming enthusiasts. Their niche focus allows them to deliver highly specialized products with strong community engagement and moderate promotional activity."
  },
  {
    id: "4",
    name: "SmartHome Plus",
    logo: "/smarthome-plus-logo.jpg",
    tagline: "Making homes smarter, together",
    brandPositioning: "premium",
    avgPriceRange: "$300-$800",
    promotionFrequency: "low",
    avgRating: 4.5,
    trackedProducts: 28,
    description: "SmartHome Plus offers premium smart home solutions with seamless integration and excellent customer support. They focus on quality over quantity, maintaining a curated product selection with strong emphasis on ecosystem compatibility."
  },
  {
    id: "5",
    name: "BudgetBytes",
    logo: "/budgetbytes-logo.jpg",
    tagline: "Tech for everyone",
    brandPositioning: "budget",
    avgPriceRange: "$150-$350",
    promotionFrequency: "high",
    avgRating: 3.9,
    trackedProducts: 45,
    description: "BudgetBytes aims to democratize technology access with ultra-competitive pricing and frequent sales events. They offer the widest product selection in the budget segment, prioritizing affordability and availability over premium features."
  },
  {
    id: "6",
    name: "AudioPhile",
    logo: "/audiophile-logo.jpg",
    tagline: "Pure sound perfection",
    brandPositioning: "niche",
    avgPriceRange: "$400-$900",
    promotionFrequency: "low",
    avgRating: 4.8,
    trackedProducts: 12,
    description: "AudioPhile caters exclusively to audio enthusiasts seeking premium sound quality. Their niche positioning in high-fidelity audio equipment allows them to maintain premium pricing with minimal discounting, focusing on craftsmanship and acoustic excellence."
  },
  {
    id: "7",
    name: "EcoTech Solutions",
    logo: "/ecotech-solutions-logo.jpg",
    tagline: "Sustainable technology for a better tomorrow",
    brandPositioning: "premium",
    avgPriceRange: "$500-$1,000",
    promotionFrequency: "medium",
    avgRating: 4.4,
    trackedProducts: 19,
    description: "EcoTech Solutions differentiates through sustainability and environmental consciousness, offering premium eco-friendly technology products. They appeal to environmentally aware consumers willing to pay a premium for sustainable alternatives."
  },
  {
    id: "8",
    name: "QuickShop Electronics",
    logo: "/quickshop-electronics-logo.jpg",
    tagline: "Fast delivery, great deals",
    brandPositioning: "budget",
    avgPriceRange: "$180-$380",
    promotionFrequency: "high",
    avgRating: 4.0,
    trackedProducts: 52,
    description: "QuickShop Electronics competes on speed and value, offering rapid delivery and constant promotional deals. Their extensive inventory and aggressive pricing strategy target convenience-focused shoppers looking for quick, affordable purchases."
  }
]

type SortOption = "price-low" | "price-high" | "rating" | "promotion" | "products"

export default function CompetitorsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [brandPositioningFilters, setBrandPositioningFilters] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [promotionFrequencyFilters, setPromotionFrequencyFilters] = useState<string[]>([])

  const filteredAndSortedCompetitors = useMemo(() => {
    let result = [...mockCompetitors]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Brand positioning filter
    if (brandPositioningFilters.length > 0) {
      result = result.filter((c) => brandPositioningFilters.includes(c.brandPositioning))
    }

    // Min rating filter
    if (minRating > 0) {
      result = result.filter((c) => c.avgRating >= minRating)
    }

    // Promotion frequency filter
    if (promotionFrequencyFilters.length > 0) {
      result = result.filter((c) => promotionFrequencyFilters.includes(c.promotionFrequency))
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseInt(a.avgPriceRange.split("-")[0].replace(/\D/g, "")) - 
                 parseInt(b.avgPriceRange.split("-")[0].replace(/\D/g, ""))
        case "price-high":
          return parseInt(b.avgPriceRange.split("-")[1].replace(/\D/g, "")) - 
                 parseInt(a.avgPriceRange.split("-")[1].replace(/\D/g, ""))
        case "rating":
          return b.avgRating - a.avgRating
        case "promotion":
          const promoOrder = { high: 3, medium: 2, low: 1 }
          return promoOrder[b.promotionFrequency] - promoOrder[a.promotionFrequency]
        case "products":
          return b.trackedProducts - a.trackedProducts
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, sortBy, brandPositioningFilters, minRating, promotionFrequencyFilters])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filter Sidebar */}
      <FilterSidebar
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        brandPositioningFilters={brandPositioningFilters}
        setBrandPositioningFilters={setBrandPositioningFilters}
        minRating={minRating}
        setMinRating={setMinRating}
        promotionFrequencyFilters={promotionFrequencyFilters}
        setPromotionFrequencyFilters={setPromotionFrequencyFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Competitors</h1>
              <p className="text-muted-foreground mt-1">
                {filteredAndSortedCompetitors.length} competitors tracked
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price-low">Sort by Price (Low to High)</option>
              <option value="price-high">Sort by Price (High to Low)</option>
              <option value="promotion">Sort by Promotion Frequency</option>
              <option value="products">Sort by Tracked Products</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {filteredAndSortedCompetitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground text-lg">No competitors found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedCompetitors.map((competitor) => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onClick={() => setSelectedCompetitor(competitor)}
                />
              ))}
            </div>
          ) : (
            <CompetitorTable
              competitors={filteredAndSortedCompetitors}
              onRowClick={(competitor) => setSelectedCompetitor(competitor)}
            />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCompetitor && (
        <CompetitorModal
          competitor={selectedCompetitor}
          onClose={() => setSelectedCompetitor(null)}
        />
      )}
    </div>
  )
}
