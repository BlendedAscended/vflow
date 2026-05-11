import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const stageToPlanStatus: Record<string, string> = {
  architect: "drafting",
  designer: "designing",
  backend: "backend",
  validator: "validating",
  marketing: "marketing",
  delivery: "delivery",
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.VFLOW_HERMES_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan_id, stage, status, outputs, error } = body;

    if (!plan_id || !stage || !status) {
      return NextResponse.json(
        { error: "plan_id, stage, and status are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.growthPlan.findUnique({
      where: { id: plan_id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Update the AgentRun that matches planId + agent (stage name)
    await prisma.agentRun.updateMany({
      where: {
        planId: plan_id,
        agent: stage,
      },
      data: {
        status,
        finishedAt: new Date(),
        artifactPath: outputs?.[0]?.url ?? null,
        errorMessage: error ?? null,
      },
    });

    // Determine the new GrowthPlan status
    let newPlanStatus = plan.status;

    if (stage === "delivery" && status === "succeeded") {
      newPlanStatus = "wireframe_ready";
    } else if (stageToPlanStatus[stage]) {
      newPlanStatus = stageToPlanStatus[stage];
    }

    // Build the agentLog entry
    const currentLog = (plan.agentLog as unknown as unknown[]) ?? [];
    const logEntry = {
      stage,
      status,
      outputs: outputs ?? [],
      timestamp: new Date().toISOString(),
    };
    const updatedLog = [...currentLog, logEntry];

    // Update GrowthPlan status and agentLog
    const updatedPlan = await prisma.growthPlan.update({
      where: { id: plan_id },
      data: {
        status: newPlanStatus,
        agentLog: updatedLog,
        wireframeUrl: outputs?.find((o: any) => o.name === "wireframe_html")?.url ?? plan.wireframeUrl,
      },
    });

    // Send wireframe ready email when delivery succeeds
    if (stage === "delivery" && status === "succeeded" && updatedPlan.wireframeUrl) {
      try {
        const { sendWireframeReadyEmail } = await import("@/lib/email");
        await sendWireframeReadyEmail({
          to: updatedPlan.email,
          name: updatedPlan.name ?? "there",
          planId: plan_id,
          wireframeUrl: updatedPlan.wireframeUrl,
        });
      } catch (emailError) {
        console.error("[HERMES_CALLBACK] Email send failed:", emailError);
      }
    }

    return NextResponse.json({ acknowledged: true });
  } catch (error) {
    console.error("[HERMES_CALLBACK]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
