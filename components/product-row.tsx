import { Badge } from '@/components/ui/badge'
import { Star, Package } from 'lucide-react'
import type { Product } from '@/app/products/page'
import PriceSparkline from './price-sparkline'
import Image from 'next/image'

type ProductRowProps = {
  product: Product
  onClick: () => void
}

export default function ProductRow({ product, onClick }: ProductRowProps) {
  const stockColor = {
    'In Stock': 'bg-green-500/10 text-green-500',
    'Low Stock': 'bg-yellow-500/10 text-yellow-500',
    'Out of Stock': 'bg-red-500/10 text-red-500'
  }

  return (
    <div
      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">{product.competitor}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              ${product.currentPrice}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.isDiscounted && (
            <Badge className="mt-1 bg-red-500 text-white text-xs">
              -{product.discountPercent}%
            </Badge>
          )}
        </div>
      </div>

      <Badge variant="secondary" className={`${stockColor[product.stock]} whitespace-nowrap`}>
        <Package className="h-3 w-3 mr-1" />
        {product.stock}
      </Badge>

      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        <span className="font-medium text-foreground">{product.rating}</span>
        <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
      </div>

      <div className="w-24">
        <PriceSparkline data={product.priceHistory} compact />
      </div>
    </div>
  )
}
