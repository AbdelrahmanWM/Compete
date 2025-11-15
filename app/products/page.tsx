'use client'

import { useState } from 'react'
import { Search, Grid3x3, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductCard from '@/components/product-card'
import ProductRow from '@/components/product-row'
import ProductModal from '@/components/product-modal'
import ProductFilterSidebar from '@/components/product-filter-sidebar'
import PillFilters from '@/components/pill-filters'
import SortDropdown from '@/components/sort-dropdown'

export type Product = {
  id: string
  name: string
  competitor: string
  currentPrice: number
  originalPrice?: number
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock'
  rating: number
  reviewCount: number
  isDiscounted: boolean
  discountPercent?: number
  image: string
  priceHistory: number[]
  category: string
  lastUpdated: string
  description: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Gaming Mouse Pro',
    competitor: 'TechElite',
    currentPrice: 79.99,
    originalPrice: 99.99,
    stock: 'In Stock',
    rating: 4.8,
    reviewCount: 1247,
    isDiscounted: true,
    discountPercent: 20,
    image: '/wireless-gaming-mouse.png',
    priceHistory: [99.99, 95.99, 89.99, 85.99, 82.99, 79.99],
    category: 'Gaming',
    lastUpdated: '2 hours ago',
    description: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.'
  },
  {
    id: '2',
    name: 'Mechanical Keyboard RGB',
    competitor: 'ValueTech',
    currentPrice: 129.99,
    stock: 'In Stock',
    rating: 4.6,
    reviewCount: 892,
    isDiscounted: false,
    image: '/mechanical-keyboard-rgb.jpg',
    priceHistory: [129.99, 129.99, 132.99, 129.99, 129.99, 129.99],
    category: 'Gaming',
    lastUpdated: '5 hours ago',
    description: 'Premium mechanical keyboard with hot-swappable switches and per-key RGB lighting.'
  },
  {
    id: '3',
    name: '4K Gaming Monitor 27"',
    competitor: 'GamerPro',
    currentPrice: 399.99,
    originalPrice: 499.99,
    stock: 'Low Stock',
    rating: 4.9,
    reviewCount: 2134,
    isDiscounted: true,
    discountPercent: 20,
    image: '/4k-gaming-monitor.jpg',
    priceHistory: [499.99, 479.99, 459.99, 439.99, 419.99, 399.99],
    category: 'Monitors',
    lastUpdated: '1 hour ago',
    description: 'Ultra-high resolution 4K monitor with 144Hz refresh rate and HDR support.'
  },
  {
    id: '4',
    name: 'USB-C Docking Station',
    competitor: 'SmartHome Plus',
    currentPrice: 159.99,
    stock: 'In Stock',
    rating: 4.5,
    reviewCount: 678,
    isDiscounted: false,
    image: '/usb-c-docking-station.jpg',
    priceHistory: [159.99, 164.99, 159.99, 159.99, 162.99, 159.99],
    category: 'Accessories',
    lastUpdated: '3 hours ago',
    description: 'Multi-port USB-C hub with dual 4K display support and power delivery.'
  },
  {
    id: '5',
    name: 'Wireless Earbuds Pro',
    competitor: 'TechElite',
    currentPrice: 149.99,
    originalPrice: 199.99,
    stock: 'In Stock',
    rating: 4.7,
    reviewCount: 3421,
    isDiscounted: true,
    discountPercent: 25,
    image: '/wireless-earbuds.png',
    priceHistory: [199.99, 189.99, 179.99, 169.99, 159.99, 149.99],
    category: 'Audio',
    lastUpdated: '30 minutes ago',
    description: 'Premium wireless earbuds with active noise cancellation and 8-hour battery life.'
  },
  {
    id: '6',
    name: 'Portable SSD 2TB',
    competitor: 'BudgetBytes',
    currentPrice: 189.99,
    stock: 'Out of Stock',
    rating: 4.4,
    reviewCount: 456,
    isDiscounted: false,
    image: '/portable-ssd.jpg',
    priceHistory: [189.99, 194.99, 189.99, 189.99, 199.99, 189.99],
    category: 'Storage',
    lastUpdated: '6 hours ago',
    description: 'High-speed portable SSD with USB 3.2 Gen 2 interface for fast data transfers.'
  },
  {
    id: '7',
    name: 'Smart Watch Series X',
    competitor: 'GamerPro',
    currentPrice: 299.99,
    originalPrice: 349.99,
    stock: 'In Stock',
    rating: 4.6,
    reviewCount: 1876,
    isDiscounted: true,
    discountPercent: 14,
    image: '/smartwatch-lifestyle.png',
    priceHistory: [349.99, 339.99, 329.99, 319.99, 309.99, 299.99],
    category: 'Wearables',
    lastUpdated: '4 hours ago',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.'
  },
  {
    id: '8',
    name: 'Laptop Stand Aluminum',
    competitor: 'ValueTech',
    currentPrice: 49.99,
    stock: 'In Stock',
    rating: 4.3,
    reviewCount: 234,
    isDiscounted: false,
    image: '/laptop-stand-aluminum.jpg',
    priceHistory: [49.99, 52.99, 49.99, 49.99, 54.99, 49.99],
    category: 'Accessories',
    lastUpdated: '8 hours ago',
    description: 'Ergonomic aluminum laptop stand with adjustable height and angle.'
  }
]

type ViewMode = 'grid' | 'list'
type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'recent'

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  
  // Filters
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [stockFilter, setStockFilter] = useState<string[]>([])
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false)

  // Quick filters
  const [quickFilters, setQuickFilters] = useState({
    inStock: false,
    discounted: false,
    rating4Plus: false
  })

  // Filter and sort products
  const filteredProducts = mockProducts.filter(product => {
    // Search
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.competitor.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Competitors
    if (selectedCompetitors.length > 0 && !selectedCompetitors.includes(product.competitor)) {
      return false
    }
    
    // Price range
    if (product.currentPrice < priceRange[0] || product.currentPrice > priceRange[1]) {
      return false
    }
    
    // Rating
    if (product.rating < minRating) {
      return false
    }
    
    // Stock
    if (stockFilter.length > 0 && !stockFilter.includes(product.stock)) {
      return false
    }
    
    // Discount
    if (showDiscountedOnly && !product.isDiscounted) {
      return false
    }
    
    // Quick filters
    if (quickFilters.inStock && product.stock !== 'In Stock') {
      return false
    }
    if (quickFilters.discounted && !product.isDiscounted) {
      return false
    }
    if (quickFilters.rating4Plus && product.rating < 4) {
      return false
    }
    
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.currentPrice - b.currentPrice
      case 'price-desc':
        return b.currentPrice - a.currentPrice
      case 'rating':
        return b.rating - a.rating
      case 'recent':
      default:
        return 0
    }
  })

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filter Sidebar */}
      <ProductFilterSidebar
        open={filterSidebarOpen}
        selectedCompetitors={selectedCompetitors}
        onCompetitorsChange={setSelectedCompetitors}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        showDiscountedOnly={showDiscountedOnly}
        onShowDiscountedOnlyChange={setShowDiscountedOnly}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {sortedProducts.length} products found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Quick Pill Filters */}
          <PillFilters
            filters={quickFilters}
            onFiltersChange={setQuickFilters}
          />
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}

          {sortedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
