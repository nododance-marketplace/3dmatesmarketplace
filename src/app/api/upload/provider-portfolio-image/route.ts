import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload/provider-portfolio-image
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "PROVIDER") {
      return NextResponse.json(
        { error: "Only providers can upload portfolio images" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caption = (formData.get("caption") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Image uploads are not configured. Please add Cloudinary credentials." },
        { status: 500 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
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

    // If provider profile exists, create the DB record immediately
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (provider) {
      const maxSort = await prisma.portfolioImage.aggregate({
        where: { providerId: provider.id },
        _max: { sortOrder: true },
      });

      const image = await prisma.portfolioImage.create({
        data: {
          providerId: provider.id,
          imageUrl: result.secure_url,
          caption: caption || null,
          sortOrder: (maxSort._max.sortOrder || 0) + 1,
        },
      });

      return NextResponse.json(image, { status: 201 });
    }

    // No profile yet — return the Cloudinary URL so the frontend can
    // include it when the profile is saved for the first time.
    return NextResponse.json(
      { imageUrl: result.secure_url, caption: caption || null, pending: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Portfolio image upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
