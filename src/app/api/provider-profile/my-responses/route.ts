import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/provider-profile/my-responses — provider's job responses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responses = await prisma.jobResponse.findMany({
      where: { providerUserId: session.user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            city: true,
            budgetMin: true,
            budgetMax: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = responses.map((r) => ({
      id: r.id,
      status: r.status,
      message: r.message,
      estimatedPrice: r.estimatedPrice,
      turnaroundDays: r.turnaroundDays,
      createdAt: r.createdAt,
      job: r.job,
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
