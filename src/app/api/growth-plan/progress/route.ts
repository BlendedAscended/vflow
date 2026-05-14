import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, step, data } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (step === undefined || step === null || typeof step !== "number" || step < 1 || step > 6) {
      return NextResponse.json(
        { error: "Step must be a number between 1 and 6" },
        { status: 400 }
      );
    }

    const abandonment = await prisma.abandonment.findFirst({
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

    if (!abandonment) {
      return NextResponse.json(
        { error: "No growth plan session found for this email" },
        { status: 404 }
      );
    }

    const updated = await prisma.abandonment.update({
      where: { id: abandonment.id },
      data: {
        stepReached: step,
        wizardData: {
          ...abandonment.wizardData,
          ...data,
        },
      },
    });

    return NextResponse.json({
      email,
      stepReached: updated.stepReached,
    });
  } catch (error) {
    console.error("[GROWTH_PLAN_PROGRESS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
