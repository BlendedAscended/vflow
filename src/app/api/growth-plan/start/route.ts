import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const abandonment = await prisma.abandonment.create({
      data: {
        email,
        stepReached: 0,
        wizardData: { email },
      },
    });

    return NextResponse.json({ step: 0 });
  } catch (error) {
    console.error("[GROWTH_PLAN_START]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
