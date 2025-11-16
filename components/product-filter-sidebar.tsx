import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type ProductFilterSidebarProps = {
  open: boolean;
  competitors?: string[];
  selectedCompetitors: string[];
  onCompetitorsChange: (competitors: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  stockFilter: string[];
  onStockFilterChange: (stock: string[]) => void;
  showDiscountedOnly: boolean;
  onShowDiscountedOnlyChange: (show: boolean) => void;
};
const fallbackCompetitors = [
  "TechElite",
  "ValueTech",
  "GamerPro",
  "SmartHome Plus",
  "BudgetBytes",
];
const stockOptions = ["In Stock", "Low Stock", "Out of Stock"];

export default function ProductFilterSidebar({
  open,
  competitors,
  selectedCompetitors,
  onCompetitorsChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  stockFilter,
  onStockFilterChange,
  showDiscountedOnly,
  onShowDiscountedOnlyChange,
}: ProductFilterSidebarProps) {
  if (!open) return null;

  const toggleCompetitor = (competitor: string) => {
    if (selectedCompetitors.includes(competitor)) {
      onCompetitorsChange(selectedCompetitors.filter((c) => c !== competitor));
    } else {
      onCompetitorsChange([...selectedCompetitors, competitor]);
    }
  };

  const toggleStock = (stock: string) => {
    if (stockFilter.includes(stock)) {
      onStockFilterChange(stockFilter.filter((s) => s !== stock));
    } else {
      onStockFilterChange([...stockFilter, stock]);
    }
  };

  const clearAllFilters = () => {
    onCompetitorsChange([]);
    onPriceRangeChange([0, 500]);
    onMinRatingChange(0);
    onStockFilterChange([]);
    onShowDiscountedOnlyChange(false);
  };

  return (
    <div className="w-80 border-r border-border bg-background overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg text-foreground">Filters</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>

        {/* Competitors */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Competitors
          </Label>
          <div className="space-y-2">
            {(competitors && competitors.length > 0
              ? competitors
              : fallbackCompetitors
            ).map((competitor) => (
              <div key={competitor} className="flex items-center space-x-2">
                <Checkbox
                  id={`competitor-${competitor}`}
                  checked={selectedCompetitors.includes(competitor)}
                  onCheckedChange={() => toggleCompetitor(competitor)}
                />
                <label
                  htmlFor={`competitor-${competitor}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {competitor}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) =>
              onPriceRangeChange(value as [number, number])
            }
            max={500}
            step={10}
            className="mt-2"
          />
        </div>

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Minimum Rating: {minRating === 0 ? "Any" : `${minRating}+`}
          </Label>
          <Slider
            value={[minRating]}
            onValueChange={(value) => onMinRatingChange(value[0])}
            max={5}
            step={0.5}
            className="mt-2"
          />
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Stock Status
          </Label>
          <div className="space-y-2">
            {stockOptions.map((stock) => (
              <div key={stock} className="flex items-center space-x-2">
                <Checkbox
                  id={`stock-${stock}`}
                  checked={stockFilter.includes(stock)}
                  onCheckedChange={() => toggleStock(stock)}
                />
                <label
                  htmlFor={`stock-${stock}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {stock}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Status */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Discount
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="discounted-only"
              checked={showDiscountedOnly}
              onCheckedChange={(checked) =>
                onShowDiscountedOnlyChange(!!checked)
              }
            />
            <label
              htmlFor="discounted-only"
              className="text-sm text-foreground cursor-pointer"
            >
              Show discounted only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
