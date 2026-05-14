import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const plan = await prisma.growthPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Allow access if paid or wireframe_ready
    const allowedStatuses = ["wireframe_ready", "paid", "moved_forward"];
    if (!allowedStatuses.includes(plan.status)) {
      return NextResponse.json(
        { error: "Wireframe not available for this plan status" },
        { status: 403 }
      );
    }

    if (!plan.wireframeUrl) {
      return NextResponse.json(
        { error: "Wireframe URL not generated yet" },
        { status: 404 }
      );
    }

    // Redirect to the signed Supabase URL
    return NextResponse.redirect(plan.wireframeUrl);
  } catch (err: any) {
    console.error("[WIREFRAME_PROXY]", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
