import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const materials = searchParams.get("materials") || "";
    const processes = searchParams.get("processes") || "";
    const capabilities = searchParams.get("capabilities") || "";
    const mapMode = searchParams.get("mapMode") === "1";

    // Always filter to APPROVED providers for public listing
    const providers = await prisma.providerProfile.findMany({
      where: {
        status: "APPROVED",
        ...(mapMode
          ? { lat: { not: null }, lng: { not: null } }
          : {}),
        ...(search
          ? {
              OR: [
                { displayName: { contains: search } },
                { headline: { contains: search } },
                { city: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        portfolio: {
          take: 1,
          orderBy: { sortOrder: "asc" },
        },
        receivedReviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter by materials/processes/capabilities (JSON string contains)
    let filtered = providers;

    if (materials) {
      const matFilter = materials.split(",");
      filtered = filtered.filter((p) => {
        const pMats = parseJsonArray(p.materials);
        return matFilter.some((m) => pMats.includes(m));
      });
    }

    if (processes) {
      const procFilter = processes.split(",");
      filtered = filtered.filter((p) => {
        const pProcs = parseJsonArray(p.processes);
        return procFilter.some((pr) => pProcs.includes(pr));
      });
    }

    if (capabilities) {
      const capFilter = capabilities.split(",");
      filtered = filtered.filter((p) => {
        const pCaps = parseJsonArray(p.capabilities);
        return capFilter.some((c) => pCaps.includes(c));
      });
    }

    // Map results: strip contact info if not logged in
    const result = filtered.map((p) => {
      const reviews = p.receivedReviews || [];
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        id: p.id,
        slug: p.slug,
        displayName: p.displayName,
        headline: p.headline,
        city: p.city,
        lat: p.lat,
        lng: p.lng,
        materials: parseJsonArray(p.materials),
        processes: parseJsonArray(p.processes),
        capabilities: parseJsonArray(p.capabilities),
        thumbnailUrl: p.portfolio[0]?.imageUrl || null,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        // Soft-gated contact info
        ...(session
          ? {
              contactEmail: p.contactEmail,
              phone: p.phone,
              websiteUrl: p.websiteUrl,
              instagramUrl: p.instagramUrl,
            }
          : {}),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
