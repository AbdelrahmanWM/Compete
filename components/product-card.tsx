import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, Package } from 'lucide-react'
import type { Product } from '@/app/products/page'
import PriceSparkline from './price-sparkline'
import Image from 'next/image'

type ProductCardProps = {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const stockColor = {
    'In Stock': 'bg-green-500/10 text-green-500',
    'Low Stock': 'bg-yellow-500/10 text-yellow-500',
    'Out of Stock': 'bg-red-500/10 text-red-500'
  }

  return (
    <Card
      className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-square relative bg-muted overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isDiscounted && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            -{product.discountPercent}%
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.competitor}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${product.currentPrice}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Badge variant="secondary" className={`mt-1 ${stockColor[product.stock]}`}>
              <Package className="h-3 w-3 mr-1" />
              {product.stock}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Price Trend</p>
          <PriceSparkline data={product.priceHistory} />
        </div>

        <Button className="w-full" variant="outline" onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}>
          View Product
        </Button>
      </div>
    </Card>
  )
}
