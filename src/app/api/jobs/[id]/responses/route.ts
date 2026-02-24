import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const responseSchema = z.object({
  message: z.string().min(1).max(2000),
  estimatedPrice: z.number().int().min(0).optional(),
  turnaroundDays: z.number().int().min(1).optional(),
});

// POST /api/jobs/[id]/responses — provider-only: create response
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "PROVIDER") {
      return NextResponse.json(
        { error: "Only providers can respond to jobs" },
        { status: 403 }
      );
    }

    const job = await prisma.jobRequest.findUnique({
      where: { id },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.status !== "OPEN") {
      return NextResponse.json(
        { error: "Job is no longer accepting responses" },
        { status: 400 }
      );
    }
    if (job.customerId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot respond to your own job" },
        { status: 400 }
      );
    }

    // Check for duplicate response
    const existing = await prisma.jobResponse.findFirst({
      where: {
        jobId: id,
        providerUserId: session.user.id,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already responded to this job" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = responseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
    });

    const response = await prisma.jobResponse.create({
      data: {
        jobId: id,
        providerUserId: session.user.id,
        providerId: providerProfile?.id || null,
        message: data.message,
        estimatedPrice: data.estimatedPrice ?? null,
        turnaroundDays: data.turnaroundDays ?? null,
        status: "SENT",
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
