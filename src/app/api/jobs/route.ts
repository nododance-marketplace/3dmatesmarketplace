import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().optional(),
  materials: z.array(z.string()).default([]),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  deadline: z.string().optional(),
  city: z.string().default("Charlotte"),
  imageUrls: z.array(z.string().url()).max(5).default([]),
});

// GET /api/jobs — public browse
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "OPEN";

    const jobs = await prisma.jobRequest.findMany({
      where: {
        status: status === "ALL" ? undefined : status,
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {}),
        ...(category ? { category } : {}),
      },
      include: {
        customer: {
          select: { name: true, image: true },
        },
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const result = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      description:
        j.description.length > 200
          ? j.description.slice(0, 200) + "..."
          : j.description,
      category: j.category,
      materials: j.materials,
      budgetMin: j.budgetMin,
      budgetMax: j.budgetMax,
      deadline: j.deadline,
      city: j.city,
      status: j.status,
      responseCount: j._count.responses,
      customerName: j.customer.name || "Anonymous",
      customerImage: j.customer.image,
      createdAt: j.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/jobs — customer-only: create job request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const job = await prisma.jobRequest.create({
      data: {
        customerId: session.user.id,
        title: data.title,
        description: data.description,
        category: data.category || null,
        materials: JSON.stringify(data.materials),
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        city: data.city,
        status: "OPEN",
      },
    });

    // Create reference image records if any
    if (data.imageUrls.length > 0) {
      await prisma.jobRequestImage.createMany({
        data: data.imageUrls.map((url, i) => ({
          jobId: job.id,
          imageUrl: url,
          sortOrder: i,
        })),
      });
    }

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
