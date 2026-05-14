import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      industry,
      stage,
      challenges,
      goals,
      teamSize,
      budget,
      timeline,
      subNiches,
      currentStack,
      legacyPain,
      gbpPlaceId,
      gbpName,
      gbpAddress,
      gbpCategories,
      gbpData,
    } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!industry || typeof industry !== "string") {
      return NextResponse.json(
        { error: "Industry is required" },
        { status: 400 }
      );
    }

    if (!stage || typeof stage !== "string") {
      return NextResponse.json(
        { error: "Stage is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(challenges)) {
      return NextResponse.json(
        { error: "Challenges must be an array" },
        { status: 400 }
      );
    }

    if (!Array.isArray(goals)) {
      return NextResponse.json(
        { error: "Goals must be an array" },
        { status: 400 }
      );
    }

    const wizardData = {
      email,
      name: name ?? null,
      industry,
      stage,
      challenges,
      goals,
      teamSize: teamSize ?? null,
      budget: budget ?? null,
      timeline: timeline ?? null,
      subNiches: subNiches ?? [],
      currentStack: currentStack ?? [],
      legacyPain: legacyPain ?? null,
      gbpPlaceId: gbpPlaceId ?? null,
      gbpName: gbpName ?? null,
      gbpAddress: gbpAddress ?? null,
      gbpCategories: gbpCategories ?? [],
      gbpData: gbpData ?? null,
    };

    // Create GrowthPlan
    const growthPlan = await prisma.growthPlan.create({
      data: {
        email,
        status: "queued",
        wizardData,
        gbpPlaceId: gbpPlaceId ?? null,
        gbpName: gbpName ?? null,
        gbpAddress: gbpAddress ?? null,
        gbpCategories: gbpCategories ?? [],
        gbpData: gbpData ?? null,
      },
    });

    // Update/create Abandonment
    const existingAbandonment = await prisma.abandonment.findFirst({
      where: {
        wizardData: {
          path: ["email"],
          equals: email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingAbandonment) {
      await prisma.abandonment.update({
        where: { id: existingAbandonment.id },
        data: {
          stepReached: 6,
          wizardData,
        },
      });
    } else {
      await prisma.abandonment.create({
        data: {
          email,
          stepReached: 6,
          wizardData,
        },
      });
    }

    // Create AgentRun
    const agentRun = await prisma.agentRun.create({
      data: {
        planId: growthPlan.id,
        agent: "architect",
        status: "pending",
        model: "gemini-2-5-pro",
      },
    });

    // Trigger Hermes webhook
    const webhookUrl = process.env.HERMES_WEBHOOK_URL;
    const hermesToken = process.env.VFLOW_HERMES_TOKEN;

    if (webhookUrl && hermesToken) {
      try {
        const payload = JSON.stringify({
          plan_id: growthPlan.id,
          pipeline: "cybergrowth-wireframe",
          input: wizardData,
          gbp_data: gbpData ?? null,
        });
        
        // Compute HMAC-SHA256 signature
        const encoder = new TextEncoder();
        const keyData = encoder.encode(hermesToken);
        const payloadData = encoder.encode(payload);
        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, payloadData);
        const signature = Array.from(new Uint8Array(signatureBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
          },
          body: payload,
        });
      } catch (webhookError) {
        console.error("[GROWTH_PLAN_WEBHOOK]", webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({
      plan_id: growthPlan.id,
      status: "queued",
    });
  } catch (error) {
    console.error("[GROWTH_PLAN_SUBMIT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
