"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Calendar, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-[var(--background)] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
     
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-[100px]"
      />

      <div className="w-full max-w-lg text-center">
        <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-8 sm:p-12 shadow-xl backdrop-blur-xl">
        
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Registry Notice • Error 404</span>
          </div>

          
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--accent)] mb-6 shadow-xs">
            <Compass className="h-10 w-10 animate-spin-slow" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Initiative Uncharted
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
            The civic route, initiative pass, or volunteer resource you
            requested cannot be located in the current registry.
          </p>

         
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/events"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] active:scale-95 transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Browse Active Drives</span>
            </Link>

            <Link
              href="/"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-6 text-xs font-semibold text-[var(--text-main)] hover:border-[var(--primary)] active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
