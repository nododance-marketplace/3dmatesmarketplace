import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/helpers";
import { z } from "zod";

// GET /api/admin/seed — list all seed providers and jobs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [providers, jobs] = await Promise.all([
      prisma.providerProfile.findMany({
        where: { isSeed: true },
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobRequest.findMany({
        where: { isSeed: true },
        include: {
          customer: { select: { name: true, email: true } },
          _count: { select: { responses: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ providers, jobs });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/seed — update a seed provider or job
const updateProviderSchema = z.object({
  type: z.literal("provider"),
  id: z.string().min(1),
  data: z.object({
    displayName: z.string().min(1).optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    status: z.enum(["APPROVED", "PENDING", "REJECTED"]).optional(),
  }),
});

const updateJobSchema = z.object({
  type: z.literal("job"),
  id: z.string().min(1),
  data: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    budgetMin: z.number().nullable().optional(),
    budgetMax: z.number().nullable().optional(),
    status: z.enum(["OPEN", "CLOSED"]).optional(),
  }),
});

const updateSchema = z.union([updateProviderSchema, updateJobSchema]);

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, id, data } = parsed.data;

    if (type === "provider") {
      // Verify it's actually a seed record
      const provider = await prisma.providerProfile.findFirst({
        where: { id, isSeed: true },
      });
      if (!provider) {
        return NextResponse.json({ error: "Seed provider not found" }, { status: 404 });
      }

      const updated = await prisma.providerProfile.update({
        where: { id },
        data,
      });
      return NextResponse.json(updated);
    }

    if (type === "job") {
      const job = await prisma.jobRequest.findFirst({
        where: { id, isSeed: true },
      });
      if (!job) {
        return NextResponse.json({ error: "Seed job not found" }, { status: 404 });
      }

      const updated = await prisma.jobRequest.update({
        where: { id },
        data,
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/seed — delete a seed provider (with user) or seed job
const deleteSchema = z.object({
  type: z.enum(["provider", "job"]),
  id: z.string().min(1),
});

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { type, id } = parsed.data;

    if (type === "provider") {
      const provider = await prisma.providerProfile.findFirst({
        where: { id, isSeed: true },
      });
      if (!provider) {
        return NextResponse.json({ error: "Seed provider not found" }, { status: 404 });
      }

      // Delete the user (cascades to provider profile)
      await prisma.user.delete({ where: { id: provider.userId } });
      return NextResponse.json({ success: true });
    }

    if (type === "job") {
      const job = await prisma.jobRequest.findFirst({
        where: { id, isSeed: true },
      });
      if (!job) {
        return NextResponse.json({ error: "Seed job not found" }, { status: 404 });
      }

      await prisma.jobRequest.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/seed/purge — delete ALL seed data at once
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    if (body?.action !== "purge") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Delete all seed jobs
    const deletedJobs = await prisma.jobRequest.deleteMany({
      where: { isSeed: true },
    });

    // Delete seed provider users (cascades to profiles)
    const seedProviders = await prisma.providerProfile.findMany({
      where: { isSeed: true },
      select: { userId: true },
    });

    let deletedProviders = 0;
    for (const sp of seedProviders) {
      await prisma.user.delete({ where: { id: sp.userId } });
      deletedProviders++;
    }

    // Delete the seed customer user too
    const seedCustomer = await prisma.user.findUnique({
      where: { email: "seed-customer@3dmates.demo" },
    });
    if (seedCustomer) {
      await prisma.user.delete({ where: { id: seedCustomer.id } });
    }

    return NextResponse.json({
      success: true,
      deleted: {
        providers: deletedProviders,
        jobs: deletedJobs.count,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
