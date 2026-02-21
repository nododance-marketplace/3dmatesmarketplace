import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/helpers";
import HomeHero from "@/components/marketing/HomeHero";
import SocialProof from "@/components/marketing/SocialProof";
import HowItWorks from "@/components/marketing/HowItWorks";
import TwoSidedValue from "@/components/marketing/TwoSidedValue";
import TrustSafety from "@/components/marketing/TrustSafety";
import FeaturedPreviews from "@/components/marketing/FeaturedPreviews";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";

export const dynamic = "force-dynamic";

async function getFeaturedProviders() {
  try {
    const providers = await prisma.providerProfile.findMany({
      where: { status: "APPROVED" },
      include: {
        portfolio: { take: 1, orderBy: { sortOrder: "asc" } },
        receivedReviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return providers.map((p) => {
      const ratings = p.receivedReviews.map((r) => r.rating);
      const avg =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
            ) / 10
          : 0;
      return {
        slug: p.slug,
        displayName: p.displayName,
        headline: p.headline,
        city: p.city,
        processes: parseJsonArray(p.processes),
        thumbnail: p.portfolio[0]?.imageUrl || null,
        avgRating: avg,
        reviewCount: ratings.length,
      };
    });
  } catch {
    return [];
  }
}

async function getLatestJobs() {
  try {
    const jobs = await prisma.jobRequest.findMany({
      where: { status: "OPEN" },
      include: { _count: { select: { responses: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      budgetMin: j.budgetMin,
      budgetMax: j.budgetMax,
      city: j.city,
      responseCount: j._count.responses,
      createdAt: j.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [providers, jobs] = await Promise.all([
    getFeaturedProviders(),
    getLatestJobs(),
  ]);

  return (
    <>
      <HomeHero />
      <SocialProof />
      <HowItWorks />
      <TwoSidedValue />
      <TrustSafety />
      <FeaturedPreviews providers={providers} jobs={jobs} />
      <FinalCTA />
      <Footer />
    </>
  );
}
