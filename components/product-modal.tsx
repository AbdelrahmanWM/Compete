import { useState } from "react";
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
  Truck,
  Tag,
  ShoppingCart,
  Users,
  Trash2,
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
  onDelete?: () => void;
};

function mapCurrency(code?: string) {
  switch (code) {
    case "USD":
      return "$";
    case "CAD":
      return "C$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return code ? code + " " : "$";
  }
}

export default function ProductModal({
  product,
  onClose,
  onDelete,
}: ProductModalProps) {
  const [displayImage, setDisplayImage] = useState<string>(
    product.image || (product.images && product.images[0]) || "/placeholder.svg"
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.();
        onClose();
      } else {
        alert("Failed to delete product");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const stockColor = {
    "In Stock": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Low Stock": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Out of Stock": "bg-red-500/10 text-red-600 border-red-500/20",
  } as Record<string, string>;

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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold tracking-tight mb-2">
                  {product.name}
                </DialogTitle>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">Sold by</span>
                  <span className="font-semibold text-foreground">
                    {product.competitor}
                  </span>
                  {product.rating > 0 ? (
                    <div className="flex items-center gap-1.5 ml-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">
                        {product.watchers_count ?? 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid lg:grid-cols-[1fr,1.1fr] gap-8 mb-8">
            {/* Left: Hero image */}
            <div className="relative bg-muted/30 rounded-xl overflow-hidden border border-border/50">
              <div className="aspect-square w-full relative p-8">
                <Image
                  src={displayImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              {product.isDiscounted && (
                <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 shadow-lg font-semibold">
                  -{product.discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <h2 className="text-5xl font-bold tracking-tight text-foreground">
                    {mapCurrency(product.currency)}
                    {product.currentPrice}
                  </h2>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through mb-1">
                      {mapCurrency(product.currency)}
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {product.isDiscounted && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Save {mapCurrency(product.currency)}
                      {(product.originalPrice! - product.currentPrice).toFixed(
                        2
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 h-12 text-base font-semibold"
                  asChild
                >
                  <a
                    href={product.product_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Store
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Track Price
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-12 text-base font-semibold"
                  onClick={handleDeleteClick}
                  disabled={isDeleting || showDeleteConfirm}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="flex gap-2 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                  <span className="flex-1 text-sm font-semibold text-foreground py-2">
                    Delete this product?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "..." : "Yes"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Stock
                    </span>
                  </div>
                  <p
                    className={`text-sm font-semibold inline-flex items-center px-2 py-1 rounded-md ${
                      stockColor[product.stock] || "text-foreground"
                    }`}
                  >
                    {product.stock}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Condition
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {product.condition || "Unknown"}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Available
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {product.quantity_available ?? "—"} units
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Truck className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Shipping
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {product.shipping_cost != null
                      ? `${mapCurrency(product.currency)}${
                          product.shipping_cost
                        }`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg border border-border bg-muted/20">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Sold
                  </p>
                  <p className="text-lg font-bold">
                    {product.total_sold_listing ?? product.reviewCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated {new Date(product.lastUpdated).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-border">
            <h3 className="text-xl font-bold text-foreground">
              Price History & Analytics
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20">
                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Average Price
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {mapCurrency(product.currency)}
                  {averagePrice}
                </p>
              </div>
              <div className="p-6 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
                <p className="text-sm font-medium text-emerald-600 mb-2 uppercase tracking-wide">
                  Lowest Price
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {mapCurrency(product.currency)}
                  {lowestPrice}
                </p>
              </div>
            </div>

            <div className="h-64 rounded-xl border border-border bg-card p-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceChartData}>
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--background))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--background))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${mapCurrency(product.currency)}${value}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [
                      `${mapCurrency(product.currency)}${value.toFixed(2)}`,
                      "Price",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--foreground))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {product.isDiscounted && (
              <div className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <TrendingDown className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 mb-1">
                      🎉 Discount Active: {product.discountPercent}% off
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This product is currently on sale. Price may change
                      without notice.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
