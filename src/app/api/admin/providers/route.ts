import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin, geocodeAddress } from "@/lib/helpers";
import { z } from "zod";

// GET /api/admin/providers — list pending providers
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const providers = await prisma.providerProfile.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(providers);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

const updateSchema = z.object({
  providerId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

// PUT /api/admin/providers — approve or reject
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
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const { providerId, status } = parsed.data;

    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
    });
    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // If approving and coords missing, try geocode again
    let lat = provider.lat;
    let lng = provider.lng;
    if (status === "APPROVED" && !lat && !lng && provider.address) {
      const coords = await geocodeAddress(provider.address);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    const updated = await prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        status,
        lat: lat ?? provider.lat,
        lng: lng ?? provider.lng,
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
