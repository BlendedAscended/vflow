import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { customization } = body;

    const plan = await prisma.growthPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.growthPlan.update({
      where: { id },
      data: {
        movedForward: true,
        customization: customization ?? null,
        status: "moved_forward",
      },
    });

    return NextResponse.json({
      success: true,
      calendly_url: "https://calendly.com/verbaflow",
    });
  } catch (error) {
    console.error("[PLAN_MOVE_FORWARD]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
