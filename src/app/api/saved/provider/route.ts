import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const saveSchema = z.object({
  providerId: z.string().min(1),
});

// POST /api/saved/provider — toggle save
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const { providerId } = parsed.data;

    // Check if already saved
    const existing = await prisma.savedProvider.findUnique({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId,
        },
      },
    });

    if (existing) {
      // Unsave
      await prisma.savedProvider.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    }

    // Save
    await prisma.savedProvider.create({
      data: {
        userId: session.user.id,
        providerId,
      },
    });
    return NextResponse.json({ saved: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
