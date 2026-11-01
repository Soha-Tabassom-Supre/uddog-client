"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
   
    console.error("Runtime exception captured by Uddog Error Boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[75vh] bg-[var(--background)] py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="rounded-[2.5rem] border border-red-200 dark:border-red-950/60 bg-[var(--surface)] p-8 sm:p-10 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-black text-[var(--text-main)]">
            Something went wrong
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            An unexpected error occurred while communicating with the civic
            network. You can attempt to refresh the current application state.
          </p>

          {error.digest && (
            <div className="mt-4 rounded-xl bg-[var(--background)] p-2.5 font-mono text-[10px] text-[var(--text-muted)] truncate">
              Reference Hash: {error.digest}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => reset()}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] active:scale-95 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Action</span>
            </button>

            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--primary)] transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return to Safety</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
