"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddProductModal({
  open,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [filter, setFilter] = useState("");
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(
    null
  );
  const [productUrl, setProductUrl] = useState("");
  const [topItems, setTopItems] = useState<{ title: string; link: string }[]>(
    []
  );
  const [selectedTopItem, setSelectedTopItem] = useState<string>("manual");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);

  const { user, token, loading: authLoading } = useCurrentUser();

  useEffect(() => {
    if (authLoading || !user || !token) return; // wait until user & token are ready

    const fetchCompetitors = async () => {
      setIsLoadingCompetitors(true);
      try {
        const res = await fetch("/api/competitors", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch competitors:", res.status);
          return;
        }

        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          // store competitors as strings
          const names = json.data.map((c: any) => c.name).filter(Boolean);
          setCompetitors(names);
        }
      } catch (err) {
        console.error("Error fetching competitors:", err);
      } finally {
        setIsLoadingCompetitors(false);
      }
    };

    fetchCompetitors();
  }, [authLoading, user, token, open]);

  const reset = () => {
    setStep(1);
    setFilter("");
    setSelectedCompetitor(null);
    setProductUrl("");
    setError(null);
    setIsSubmitting(false);
    setTopItems([]);
    setSelectedTopItem("manual");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  if (!open) return null;

  // ✅ fix here: competitors are strings now
  const filtered = competitors.filter((comp) =>
    comp.toLowerCase().includes(filter.toLowerCase())
  );

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSelectCompetitor = (compName: string) => {
    setSelectedCompetitor(compName);
    setStep(2);
    setError(null);
    setTopItems([]); // clear top items for now
    setSelectedTopItem("manual");
    setProductUrl("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!selectedCompetitor) {
      setError("Please select a competitor");
      return;
    }

    if (!productUrl.trim()) {
      setError("Please enter a product URL");
      return;
    }

    if (!validateUrl(productUrl.trim())) {
      setError("Please enter a valid URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const saveRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          competitor: selectedCompetitor,
          productUrl: productUrl.trim(),
        }),
      });

      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => null);
        throw new Error((data && data.error) || "Failed to save product");
      }

      const result = await saveRes.json();
      console.log("✅ Product saved:", result);

      onSuccess?.();
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("AddProductModal error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Add Product</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="competitor-filter"
                  className="text-sm font-medium"
                >
                  Select Competitor
                </Label>
                <Input
                  id="competitor-filter"
                  placeholder="Filter competitors..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mt-2"
                  disabled={isLoadingCompetitors}
                />
              </div>

              {isLoadingCompetitors ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading competitors...
                  </span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {competitors.length === 0
                      ? "No competitors found. Please add competitors first."
                      : "No matches found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {filtered.map((comp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCompetitor(comp)}
                      className="text-left rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="font-medium text-foreground">{comp}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Competitor</Label>
                <div className="mt-2">
                  <div className="rounded-lg border border-border bg-muted/10 p-3">
                    {selectedCompetitor}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="product-url">Product URL</Label>
                <Input
                  id="product-url"
                  placeholder="https://www.ebay.ca/itm/..."
                  value={productUrl}
                  onChange={(e) => {
                    setProductUrl(e.target.value);
                    setSelectedTopItem("manual");
                  }}
                  disabled={isSubmitting}
                  className="mt-3"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Paste the product URL
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !productUrl.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
