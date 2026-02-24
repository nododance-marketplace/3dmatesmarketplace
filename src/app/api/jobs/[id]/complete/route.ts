import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/jobs/[id]/complete — customer-only: mark job completed
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

    const job = await prisma.jobRequest.findUnique({
      where: { id },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the job owner can complete the job" },
        { status: 403 }
      );
    }
    if (job.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Job must be in progress to complete" },
        { status: 400 }
      );
    }

    await prisma.jobRequest.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
