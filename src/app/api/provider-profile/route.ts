import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { geocodeAddress, generateSlug } from "@/lib/helpers";
import { z } from "zod";

const profileSchema = z.object({
  displayName: z.string().min(1).max(100),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  city: z.string().default("Charlotte"),
  address: z.string().max(500).optional(),
  serviceRadiusMiles: z.number().int().min(1).max(100).optional(),
  materials: z.array(z.string()).default([]),
  processes: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().max(500).optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Geocode if address provided
    let lat: number | null = null;
    let lng: number | null = null;
    if (data.address) {
      const coords = await geocodeAddress(data.address);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    // Check if profile already exists
    const existing = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      // Update existing profile
      const updated = await prisma.providerProfile.update({
        where: { userId: session.user.id },
        data: {
          displayName: data.displayName,
          headline: data.headline || null,
          bio: data.bio || null,
          city: data.city,
          address: data.address || null,
          lat: lat ?? existing.lat,
          lng: lng ?? existing.lng,
          serviceRadiusMiles: data.serviceRadiusMiles ?? existing.serviceRadiusMiles,
          materials: JSON.stringify(data.materials),
          processes: JSON.stringify(data.processes),
          capabilities: JSON.stringify(data.capabilities),
          websiteUrl: data.websiteUrl || null,
          instagramUrl: data.instagramUrl || null,
          contactEmail: data.contactEmail || null,
          phone: data.phone || null,
        },
      });
      return NextResponse.json(updated);
    }

    // Create new profile
    const slug = generateSlug(data.displayName);

    // Ensure user role is PROVIDER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "PROVIDER" },
    });

    const profile = await prisma.providerProfile.create({
      data: {
        userId: session.user.id,
        slug,
        displayName: data.displayName,
        headline: data.headline || null,
        bio: data.bio || null,
        city: data.city,
        address: data.address || null,
        lat,
        lng,
        serviceRadiusMiles: data.serviceRadiusMiles ?? 15,
        materials: JSON.stringify(data.materials),
        processes: JSON.stringify(data.processes),
        capabilities: JSON.stringify(data.capabilities),
        websiteUrl: data.websiteUrl || null,
        instagramUrl: data.instagramUrl || null,
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
