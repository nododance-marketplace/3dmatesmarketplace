import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/jobs/[id] — public job detail
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const job = await prisma.jobRequest.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: { id: true, name: true, image: true },
        },
        responses: {
          include: {
            providerUser: {
              select: {
                id: true,
                name: true,
                image: true,
                providerProfile: {
                  select: {
                    slug: true,
                    displayName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        reviews: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only show full response details to the job owner
    const isOwner = session?.user?.id === job.customerId;
    const isProvider = session?.user?.role === "PROVIDER";

    return NextResponse.json({
      ...job,
      materials: job.materials,
      isOwner,
      canRespond: isProvider && !isOwner && session?.user?.id,
      responses: isOwner
        ? job.responses
        : job.responses.map((r) => ({
            id: r.id,
            providerUser: r.providerUser,
            createdAt: r.createdAt,
            status: r.status,
            // Hide message/price from non-owners
            ...(session?.user?.id === r.providerUserId
              ? {
                  message: r.message,
                  estimatedPrice: r.estimatedPrice,
                  turnaroundDays: r.turnaroundDays,
                }
              : {}),
          })),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
