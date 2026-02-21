import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const acceptSchema = z.object({
  responseId: z.string().min(1),
});

// POST /api/jobs/[id]/accept — customer-only: accept a response
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.jobRequest.findUnique({
      where: { id: params.id },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the job owner can accept responses" },
        { status: 403 }
      );
    }
    if (job.status !== "OPEN") {
      return NextResponse.json(
        { error: "Job is not open for accepting responses" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = acceptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const { responseId } = parsed.data;

    // Verify the response belongs to this job
    const response = await prisma.jobResponse.findFirst({
      where: { id: responseId, jobId: params.id },
    });
    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    // Accept the response, decline others, update job status
    await prisma.$transaction([
      prisma.jobRequest.update({
        where: { id: params.id },
        data: {
          status: "IN_PROGRESS",
          acceptedResponseId: responseId,
        },
      }),
      prisma.jobResponse.update({
        where: { id: responseId },
        data: { status: "ACCEPTED" },
      }),
      prisma.jobResponse.updateMany({
        where: {
          jobId: params.id,
          id: { not: responseId },
        },
        data: { status: "DECLINED" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
