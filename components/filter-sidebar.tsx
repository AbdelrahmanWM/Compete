import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  brandPositioningFilters: string[]
  setBrandPositioningFilters: (filters: string[]) => void
  minRating: number
  setMinRating: (rating: number) => void
  promotionFrequencyFilters: string[]
  setPromotionFrequencyFilters: (filters: string[]) => void
}

export function FilterSidebar({
  showFilters,
  setShowFilters,
  brandPositioningFilters,
  setBrandPositioningFilters,
  minRating,
  setMinRating,
  promotionFrequencyFilters,
  setPromotionFrequencyFilters
}: FilterSidebarProps) {
  const toggleBrandPositioning = (value: string) => {
    setBrandPositioningFilters(
      brandPositioningFilters.includes(value)
        ? brandPositioningFilters.filter((f) => f !== value)
        : [...brandPositioningFilters, value]
    )
  }

  const togglePromotionFrequency = (value: string) => {
    setPromotionFrequencyFilters(
      promotionFrequencyFilters.includes(value)
        ? promotionFrequencyFilters.filter((f) => f !== value)
        : [...promotionFrequencyFilters, value]
    )
  }

  const clearAllFilters = () => {
    setBrandPositioningFilters([])
    setMinRating(0)
    setPromotionFrequencyFilters([])
  }

  const hasActiveFilters = 
    brandPositioningFilters.length > 0 || 
    minRating > 0 || 
    promotionFrequencyFilters.length > 0

  return (
    <>
      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          w-80 bg-card border-r border-border
          transition-transform duration-300 lg:transition-none
          ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Brand Positioning */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Brand Positioning</h3>
              <div className="space-y-3">
                {["premium", "budget", "niche"].map((position) => (
                  <label key={position} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={brandPositioningFilters.includes(position)}
                      onCheckedChange={() => toggleBrandPositioning(position)}
                    />
                    <span className="text-sm text-foreground capitalize">{position}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Minimum Rating</h3>
                <span className="text-sm text-muted-foreground">
                  {minRating > 0 ? `${minRating}+` : "All"}
                </span>
              </div>
              <Slider
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Promotion Frequency */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Promotion Frequency</h3>
              <div className="space-y-3">
                {["high", "medium", "low"].map((freq) => (
                  <label key={freq} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={promotionFrequencyFilters.includes(freq)}
                      onCheckedChange={() => togglePromotionFrequency(freq)}
                    />
                    <span className="text-sm text-foreground capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          {hasActiveFilters && (
            <div className="p-6 border-t border-border">
              <Button variant="outline" className="w-full" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
