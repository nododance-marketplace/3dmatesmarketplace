"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }
    router.push("/admin/admin-panel");
  }, [session, status, router]);

  return (
    <div className="py-20 text-center text-brand-muted">Checking access...</div>
  );
}
