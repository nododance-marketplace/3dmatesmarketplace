import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/helpers";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function assertCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }
  return null;
}

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET /api/admin/provider-images?providerId=xxx — get portfolio for a provider
export async function GET(req: NextRequest) {
  const forbidden = await assertAdmin();
  if (forbidden) return forbidden;

  const providerId = req.nextUrl.searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json({ error: "providerId required" }, { status: 400 });
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { photoUrl: true },
  });

  const images = await prisma.portfolioImage.findMany({
    where: { providerId },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    photoUrl: provider?.photoUrl || null,
    portfolio: images,
  });
}

// POST /api/admin/provider-images — upload profile photo or portfolio image
export async function POST(req: NextRequest) {
  const forbidden = await assertAdmin();
  if (forbidden) return forbidden;

  const cloudErr = assertCloudinary();
  if (cloudErr) return cloudErr;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const providerId = formData.get("providerId") as string;
    const uploadType = formData.get("type") as string; // "profile" or "portfolio"
    const caption = (formData.get("caption") as string) || "";

    if (!file || !providerId || !uploadType) {
      return NextResponse.json(
        { error: "file, providerId, and type are required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (uploadType === "profile") {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "3dmates/profile-photos",
              resource_type: "image",
              transformation: [
                { width: 500, height: 500, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      await prisma.providerProfile.update({
        where: { id: providerId },
        data: { photoUrl: result.secure_url },
      });

      return NextResponse.json({ photoUrl: result.secure_url });
    }

    if (uploadType === "portfolio") {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "3dmates/portfolio",
              resource_type: "image",
              transformation: [
                { width: 1200, height: 1200, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      const maxSort = await prisma.portfolioImage.aggregate({
        where: { providerId },
        _max: { sortOrder: true },
      });

      const image = await prisma.portfolioImage.create({
        data: {
          providerId,
          imageUrl: result.secure_url,
          caption: caption || null,
          sortOrder: (maxSort._max.sortOrder || 0) + 1,
        },
      });

      return NextResponse.json(image, { status: 201 });
    }

    return NextResponse.json({ error: "type must be 'profile' or 'portfolio'" }, { status: 400 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// PUT /api/admin/provider-images — reorder or remove profile photo
const putSchema = z.union([
  z.object({
    action: z.literal("reorder"),
    imageId: z.string().min(1),
    direction: z.enum(["up", "down"]),
  }),
  z.object({
    action: z.literal("removePhoto"),
    providerId: z.string().min(1),
  }),
]);

export async function PUT(req: NextRequest) {
  const forbidden = await assertAdmin();
  if (forbidden) return forbidden;

  try {
    const body = await req.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const data = parsed.data;

    if (data.action === "removePhoto") {
      await prisma.providerProfile.update({
        where: { id: data.providerId },
        data: { photoUrl: null },
      });
      return NextResponse.json({ success: true });
    }

    if (data.action === "reorder") {
      const image = await prisma.portfolioImage.findUnique({
        where: { id: data.imageId },
      });
      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }

      const siblings = await prisma.portfolioImage.findMany({
        where: { providerId: image.providerId },
        orderBy: { sortOrder: "asc" },
      });

      const idx = siblings.findIndex((s) => s.id === image.id);
      const swapIdx = data.direction === "up" ? idx - 1 : idx + 1;

      if (swapIdx < 0 || swapIdx >= siblings.length) {
        return NextResponse.json({ success: true }); // already at boundary
      }

      // Swap sortOrders
      const swapTarget = siblings[swapIdx];
      await prisma.$transaction([
        prisma.portfolioImage.update({
          where: { id: image.id },
          data: { sortOrder: swapTarget.sortOrder },
        }),
        prisma.portfolioImage.update({
          where: { id: swapTarget.id },
          data: { sortOrder: image.sortOrder },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/provider-images — delete a portfolio image
const deleteSchema = z.object({
  imageId: z.string().min(1),
});

export async function DELETE(req: NextRequest) {
  const forbidden = await assertAdmin();
  if (forbidden) return forbidden;

  try {
    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    await prisma.portfolioImage.delete({
      where: { id: parsed.data.imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
