import { getDb } from "@/lib/mongodb";
import { scrapeEbayProduct } from "../scripts/get_product_info_2"; // similar to getSellerInfo

export async function updateProduct(productUrl: string, competitorName: string) {
  const db = await getDb();
  const products = db.collection("products");

  // Scrape product data
  const data = await scrapeEbayProduct(productUrl);
  if (!data) throw new Error("Scrape failed");

  // Current snapshot
  const nowSnap = {
    currentPrice: data.currentPrice ?? 0,
    originalPrice: data.originalPrice ?? data.currentPrice ?? 0,
    currency: data.currency || "CAD",
    shippingCost: data.shipping_cost ?? 0,
    quantityAvailable: data.quantity_available ?? 0,
    totalSold: data.total_sold_listing ?? 0,
    stock: data.stock || "Unknown",
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,
    isDiscounted: data.isDiscounted ?? false,
    discountPercent: data.discountPercent ?? 0,
    last24Hours: data.last_24_hours || "",
    watchersCount: data.watchers_count ?? 0,
    images: data.images || [],
    timestamp: new Date(),
  };

  // Build main product info
  const updatePayload = {
    competitor: competitorName,
    name: data.name || "Unknown Product",
    title: data.title || "Unknown Product",
    ebayItemId: data.ebay_item_id || "",
    productUrl: data.product_url || productUrl,
    category: data.category || "Uncategorized",
    description: data.description || "",
    currentSnapshot: nowSnap,
    lastChecked: new Date(),
    updatedAt: new Date(),
  };

  // Check if product exists
  const existing = await products.findOne({ productUrl });

  let finalProduct;

  if (!existing) {
    // Insert new product with empty pastSnapshots
    const inserted = await products.insertOne({
      ...updatePayload,
      pastSnapshots: [],
      createdAt: new Date(),
    });
    finalProduct = {
      ...updatePayload,
      pastSnapshots: [],
      _id: inserted.insertedId,
    };
  } else {
    // Existing product — move old snapshot to pastSnapshots
    const pastSnapshots = existing.pastSnapshots || [];
    if (existing.currentSnapshot) pastSnapshots.unshift(existing.currentSnapshot);

    // Keep last 7 snapshots max
    const limitedSnapshots = pastSnapshots.slice(0, 7);

    await products.updateOne(
      { _id: existing._id },
      {
        $set: {
          ...updatePayload,
          currentSnapshot: nowSnap,
          pastSnapshots: limitedSnapshots,
        },
      }
    );

    finalProduct = {
      ...updatePayload,
      currentSnapshot: nowSnap,
      pastSnapshots: limitedSnapshots,
      _id: existing._id,
    };
  }

  return finalProduct;
}
