import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.growthPlan.findUnique({
      where: { id },
      select: { wireframeUrl: true, status: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    if (plan.wireframeUrl) {
      return NextResponse.json({
        url: plan.wireframeUrl,
        status: "ready",
      });
    }

    return NextResponse.json({ status: "not_ready" });
  } catch (error) {
    console.error("[PLAN_PREVIEW]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
