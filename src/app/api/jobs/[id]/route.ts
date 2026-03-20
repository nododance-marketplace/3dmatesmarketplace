import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const jobUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  category: z.string().nullable().optional(),
  budgetMin: z.number().int().min(0).nullable().optional(),
  budgetMax: z.number().int().min(0).nullable().optional(),
  deadline: z.string().nullable().optional(),
  contactName: z.string().max(100).nullable().optional(),
  contactEmail: z.string().email().or(z.literal("")).nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  preferredContactMethod: z.enum(["EMAIL", "PHONE", "PLATFORM_RESPONSE"]).nullable().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  needsModeling: z.boolean().optional(),
  intendedUse: z.string().max(100).nullable().optional(),
  dimensions: z.string().max(200).nullable().optional(),
  quantity: z.number().int().min(1).nullable().optional(),
});

// GET /api/jobs/[id] — public job detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const job = await prisma.jobRequest.findUnique({
      where: { id },
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

    // Show contact info to owner and logged-in providers
    const showContact = isOwner || isProvider;

    return NextResponse.json({
      ...job,
      materials: job.materials,
      isOwner,
      canRespond: isProvider && !isOwner && session?.user?.id,
      contactName: showContact ? job.contactName : null,
      contactEmail: showContact ? job.contactEmail : null,
      contactPhone: showContact ? job.contactPhone : null,
      preferredContactMethod: showContact ? job.preferredContactMethod : null,
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

// PATCH /api/jobs/[id] — owner-only: update job
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.jobRequest.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.customerId !== session.user.id) {
      return NextResponse.json({ error: "Not your job" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = jobUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updated = await prisma.jobRequest.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category || null }),
        ...(data.budgetMin !== undefined && { budgetMin: data.budgetMin }),
        ...(data.budgetMax !== undefined && { budgetMax: data.budgetMax }),
        ...(data.deadline !== undefined && {
          deadline: data.deadline ? new Date(data.deadline) : null,
        }),
        ...(data.contactName !== undefined && { contactName: data.contactName || null }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail || null }),
        ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone || null }),
        ...(data.preferredContactMethod !== undefined && {
          preferredContactMethod: data.preferredContactMethod || null,
        }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
