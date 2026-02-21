import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  jobId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional(),
});

// POST /api/reviews — create review (only after job completion)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify job is COMPLETED
    const job = await prisma.jobRequest.findUnique({
      where: { id: data.jobId },
      include: {
        responses: {
          where: { status: "ACCEPTED" },
          take: 1,
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only review after job completion" },
        { status: 400 }
      );
    }

    // Verify reviewer is a participant
    const acceptedResponse = job.responses[0];
    const isCustomer = job.customerId === session.user.id;
    const isAcceptedProvider =
      acceptedResponse?.providerUserId === session.user.id;

    if (!isCustomer && !isAcceptedProvider) {
      return NextResponse.json(
        { error: "Only job participants can leave reviews" },
        { status: 403 }
      );
    }

    // Get provider profile for the link
    const providerUserId = isCustomer
      ? acceptedResponse?.providerUserId
      : null;
    const providerProfile = providerUserId
      ? await prisma.providerProfile.findUnique({
          where: { userId: providerUserId },
        })
      : null;

    const review = await prisma.review.create({
      data: {
        jobId: data.jobId,
        reviewerId: session.user.id,
        revieweeId: data.revieweeId,
        providerId: providerProfile?.id || null,
        reviewerRole: isCustomer ? "CUSTOMER" : "PROVIDER",
        rating: data.rating,
        text: data.text || null,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "You have already reviewed this job" },
        { status: 400 }
      );
    }
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/reviews?userId=... or providerSlug=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const providerSlug = searchParams.get("providerSlug");

    let where: any = {};

    if (providerSlug) {
      const provider = await prisma.providerProfile.findUnique({
        where: { slug: providerSlug },
      });
      if (!provider) {
        return NextResponse.json(
          { avgRating: 0, count: 0, reviews: [] },
        );
      }
      where = { providerId: provider.id };
    } else if (userId) {
      where = { revieweeId: userId };
    } else {
      return NextResponse.json(
        { error: "userId or providerSlug required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: {
          select: { name: true, image: true },
        },
        job: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const ratings = reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
          ) / 10
        : 0;

    return NextResponse.json({
      avgRating,
      count: ratings.length,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        text: r.text,
        reviewerRole: r.reviewerRole,
        reviewerName: r.reviewer.name || "Anonymous",
        reviewerImage: r.reviewer.image,
        jobTitle: r.job.title,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { avgRating: 0, count: 0, reviews: [] },
      { status: 500 }
    );
  }
}
