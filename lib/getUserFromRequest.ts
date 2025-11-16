import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
/* ---------------------- 🔐 Extract user from request ---------------------- */
export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null);

  return decoded ? decoded.uid : null;
}