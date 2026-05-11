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
      include: { agentRuns: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      plan_id: plan.id,
      status: plan.status,
      agentLog: plan.agentLog,
      agentRuns: plan.agentRuns,
      wireframeUrl: plan.wireframeUrl,
      paidAt: plan.paidAt,
      createdAt: plan.createdAt,
    });
  } catch (error) {
    console.error("[PLAN_STATUS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
