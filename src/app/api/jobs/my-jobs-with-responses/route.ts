import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/jobs/my-jobs-with-responses — customer's jobs with provider responses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.jobRequest.findMany({
      where: { customerId: session.user.id },
      include: {
        responses: {
          include: {
            provider: {
              select: {
                id: true,
                slug: true,
                displayName: true,
                headline: true,
                photoUrl: true,
                contactEmail: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      status: j.status,
      city: j.city,
      budgetMin: j.budgetMin,
      budgetMax: j.budgetMax,
      createdAt: j.createdAt,
      responses: j.responses.map((r) => ({
        id: r.id,
        message: r.message,
        estimatedPrice: r.estimatedPrice,
        turnaroundDays: r.turnaroundDays,
        status: r.status,
        createdAt: r.createdAt,
        provider: r.provider
          ? {
              slug: r.provider.slug,
              displayName: r.provider.displayName,
              headline: r.provider.headline,
              photoUrl: r.provider.photoUrl,
              contactEmail: r.provider.contactEmail,
              phone: r.provider.phone,
            }
          : null,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
