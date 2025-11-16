import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Package,
  TrendingDown,
  Clock,
  ExternalLink,
  Eye,
} from "lucide-react";
import type { Product } from "@/app/products/page";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const stockColor = {
    "In Stock": "bg-green-500/10 text-green-500",
    "Low Stock": "bg-yellow-500/10 text-yellow-500",
    "Out of Stock": "bg-red-500/10 text-red-500",
  };

  const priceChartData = product.priceHistory.map((price, index) => ({
    day: `Day ${index + 1}`,
    price,
  }));

  const averagePrice = (
    product.priceHistory.reduce((a, b) => a + b, 0) /
    product.priceHistory.length
  ).toFixed(2);
  const lowestPrice = Math.min(...product.priceHistory).toFixed(2);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isDiscounted && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-3 py-1">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Sold by</p>
              <p className="text-lg font-semibold text-foreground">
                {product.competitor}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">
                  ${product.currentPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.isDiscounted && (
                <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  You save $
                  {(product.originalPrice! - product.currentPrice).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className={`${stockColor[product.stock]}`}
              >
                <Package className="h-4 w-4 mr-2" />
                {product.stock}
              </Badge>

              {/* ⭐ or 👁 conditional */}
              {product.rating > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-foreground text-lg">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-5 w-5" />
                  <span>{product.watchers_count || 0} watching</span>
                </div>
              )}
            </div>

            {/* 🕒 Last 24 hours */}
            {product.last_24_hours && (
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-700">
                {product.last_24_hours}
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated {product.lastUpdated}</span>
            </div>
            <Button asChild className="flex items-center gap-2">
              <a
                href={product.product_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open Product Page
              </a>
            </Button>
          </div>
        </div>

        {/* Price Chart Block */}
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Price History
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${averagePrice}
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Lowest Price</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  ${lowestPrice}
                </p>
              </div>
            </div>

            <div className="h-64 border border-border rounded-lg p-4 bg-muted/20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceChartData}>
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    formatter={(value: number) => [
                      `$${value.toFixed(2)}`,
                      "Price",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {product.isDiscounted && (
            <div className="p-4 border border-green-500/20 bg-green-500/10 rounded-lg">
              <p className="text-sm font-semibold text-green-500">
                Discount Active: {product.discountPercent}% off
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This product is currently on sale. Price may change without
                notice.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
