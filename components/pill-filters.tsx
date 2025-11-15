import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type PillFiltersProps = {
  filters: {
    inStock: boolean
    discounted: boolean
    rating4Plus: boolean
  }
  onFiltersChange: (filters: {
    inStock: boolean
    discounted: boolean
    rating4Plus: boolean
  }) => void
}

export default function PillFilters({ filters, onFiltersChange }: PillFiltersProps) {
  const toggleFilter = (key: keyof typeof filters) => {
    onFiltersChange({
      ...filters,
      [key]: !filters[key],
    })
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-muted-foreground">Quick filters:</span>
      
      <Badge
        variant={filters.inStock ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-primary/80"
        onClick={() => toggleFilter('inStock')}
      >
        In Stock
        {filters.inStock && <X className="h-3 w-3 ml-1" />}
      </Badge>

      <Badge
        variant={filters.discounted ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-primary/80"
        onClick={() => toggleFilter('discounted')}
      >
        Discounted
        {filters.discounted && <X className="h-3 w-3 ml-1" />}
      </Badge>

      <Badge
        variant={filters.rating4Plus ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-primary/80"
        onClick={() => toggleFilter('rating4Plus')}
      >
        Rating 4+
        {filters.rating4Plus && <X className="h-3 w-3 ml-1" />}
      </Badge>
    </div>
  )
}
