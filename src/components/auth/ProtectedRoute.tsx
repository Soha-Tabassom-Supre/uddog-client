"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CivicLoader } from "@/components/ui/CivicLoader";
import { toast } from "sonner";

function ProtectedRouteContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this organizer page.");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <CivicLoader message="Authorizing organizer session..." />;
  }

  if (!user) {
    return <CivicLoader message="Redirecting to login portal..." />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<CivicLoader message="Loading organizer portal..." />}>
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </Suspense>
  );
}
