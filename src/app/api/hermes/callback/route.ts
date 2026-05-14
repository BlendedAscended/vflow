import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stageToPlanStatus: Record<string, string> = {
  architect: "drafting",
  designer: "designing",
  backend: "backend",
  validator: "validating",
  marketing: "marketing",
  delivery: "delivery",
};

const stageSuccessToPlanStatus: Record<string, string> = {
  marketing: "plan_ready",
  delivery: "wireframe_ready",
};

function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key === "placeholder") {
    return null;
  }
  return createClient(url, key);
}

interface ScreenData {
  screenshot?: { name?: string; downloadUrl?: string };
  htmlCode?: { name?: string; downloadUrl?: string; mimeType?: string };
  id?: string;
  name?: string;
}

async function handleDelivery(
  planId: string,
  screenData: ScreenData,
  planEmail: string,
  planName: string | null
): Promise<string | null> {
  const supabaseService = getSupabaseServiceClient();
  if (!supabaseService) {
    console.error("[DELIVERY_BRIDGE] Supabase service client not configured");
    return null;
  }

  // Prefer HTML export, fallback to screenshot PNG
  const assetUrl = screenData.htmlCode?.downloadUrl ?? screenData.screenshot?.downloadUrl;
  const isHtml = !!screenData.htmlCode?.downloadUrl;
  if (!assetUrl) {
    console.error("[DELIVERY_BRIDGE] No asset URL found in screen_data");
    return null;
  }

  // Fetch asset bytes
  const assetRes = await fetch(assetUrl);
  if (!assetRes.ok) {
    console.error("[DELIVERY_BRIDGE] Failed to fetch asset:", assetRes.status, await assetRes.text());
    return null;
  }
  const buffer = await assetRes.arrayBuffer();

  // Upload to Supabase Storage
  const storagePath = isHtml
    ? `wireframes/${planId}/index.html`
    : `wireframes/${planId}/wireframe.png`;

  const { error: uploadError } = await supabaseService.storage
    .from("wireframes")
    .upload(storagePath, Buffer.from(buffer), {
      upsert: true,
      contentType: isHtml ? "text/html" : "image/png",
    });

  if (uploadError) {
    console.error("[DELIVERY_BRIDGE] Upload failed:", uploadError);
    return null;
  }

  // Generate 90-day signed URL
  const { data: signedData, error: signedError } = await supabaseService.storage
    .from("wireframes")
    .createSignedUrl(storagePath, 60 * 60 * 24 * 90);

  if (signedError || !signedData?.signedUrl) {
    console.error("[DELIVERY_BRIDGE] Signed URL generation failed:", signedError);
    return null;
  }

  console.log("[DELIVERY_BRIDGE] Uploaded", storagePath, "signed URL expiry: 90 days");
  return signedData.signedUrl;
}

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
    const { plan_id, stage, status, outputs, error: stageError, screen_data } = body;

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
        errorMessage: stageError ?? null,
      },
    });

    // Determine the new GrowthPlan status
    let newPlanStatus = plan.status;

    if (status === "succeeded" && stageSuccessToPlanStatus[stage]) {
      newPlanStatus = stageSuccessToPlanStatus[stage];
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

    // Delivery bridge: Stitch screen → Supabase Storage → signed URL
    let wireframeUrl: string | null = null;
    if (stage === "delivery" && status === "succeeded" && screen_data) {
      wireframeUrl = await handleDelivery(plan_id, screen_data as ScreenData, plan.email, plan.name);
    }

    // Update GrowthPlan status and agentLog
    const updatedPlan = await prisma.growthPlan.update({
      where: { id: plan_id },
      data: {
        status: newPlanStatus,
        agentLog: updatedLog,
        wireframeUrl: wireframeUrl ?? plan.wireframeUrl,
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

    return NextResponse.json({ acknowledged: true, wireframeUrl: updatedPlan.wireframeUrl });
  } catch (error) {
    console.error("[HERMES_CALLBACK]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
