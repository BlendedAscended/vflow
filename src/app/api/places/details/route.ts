import { NextRequest, NextResponse } from "next/server";
import { getPlaceDetails } from "@/lib/places-client";

const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 1000;
  const maxRequests = 10;

  const timestamps = rateLimit.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId")?.trim();

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId is required" },
        { status: 400 }
      );
    }

    const details = await getPlaceDetails(placeId);
    return NextResponse.json({ details });
  } catch (err: any) {
    console.error("[PLACES_DETAILS]", err);
    return NextResponse.json(
      { error: err.message || "Details fetch failed" },
      { status: 500 }
    );
  }
}
