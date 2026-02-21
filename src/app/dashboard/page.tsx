"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (session.user.role === "PROVIDER") {
      router.push("/provider/dashboard");
    } else {
      router.push("/account");
    }
  }, [session, status, router]);

  return (
    <div className="py-20 text-center text-brand-muted">Redirecting...</div>
  );
}
