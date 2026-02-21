import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/saved/providers/me — get saved provider IDs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedProvider.findMany({
      where: { userId: session.user.id },
      include: {
        provider: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            headline: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json(saved);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
