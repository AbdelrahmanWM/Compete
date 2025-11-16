import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export const runtime = "nodejs";

/* -------------------------- 📌 GET — User Competitors -------------------------- */
export async function GET(request: NextRequest) {
  console.log("Authorization header:", request.headers.get("authorization"));
  try {
    const userId = await getUserFromRequest(request);
    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    const db = await getDb();
    const collection = db.collection("competitors");

    // Only get competitors for this user 🔥
    const competitors = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = competitors.map((comp) => ({
      id: comp._id.toString(),
      name: comp.name,
      logo: comp.logo,
      tagline: comp.tagline,
      brandPositioning: comp.brandPositioning,
      avgPriceRange: comp.avgPriceRange,
      promotionFrequency: comp.promotionFrequency,
      avgRating: comp.avgRating,
      trackedProducts: comp.trackedProducts,
      description: comp.description,
      followers: comp.followers,
      storeUrl: comp.storeUrl,
      feedback: comp.feedback,
      firstTenItems: comp.firstTenItems,
      lastChecked: comp.lastChecked,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch competitors",
      },
      { status: 500 }
    );
  }
}
