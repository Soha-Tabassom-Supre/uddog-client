import React from "react";
import { Sprout } from "lucide-react";

export function CivicLoader({
  message = "Validating civic credentials...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/15 animate-ping opacity-75" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md">
          <Sprout className="h-7 w-7 animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-sm font-bold text-[var(--text-main)]">
        {message}
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Uddog • Bangladesh Civic Network
      </p>
    </div>
  );
}
