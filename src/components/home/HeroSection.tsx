"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { HeroSpotlight } from "@/components/home/HeroSpotlight";

export function HeroSection() {
  return (
    <HeroSpotlight>
      <section className="relative overflow-hidden bg-transparent pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
       
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-1/4 h-[36rem] w-[36rem] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--primary)]/12 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-10 h-[28rem] w-[28rem] rounded-full bg-[var(--accent)]/10 blur-[110px]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
         
            <div className="relative z-10 space-y-7 lg:col-span-7">
          
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--surface)] px-3.5 py-1 text-xs font-semibold text-[var(--primary)] shadow-sm backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                  <span>উদ্যোগ • Grassroots Social Action</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)]/80 py-1 pl-1.5 pr-3 shadow-sm backdrop-blur-md">
                  <div className="flex -space-x-2">
                    <img
                      className="h-7 w-7 rounded-full border-2 border-[var(--surface)] object-cover ring-1 ring-black/5"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Volunteer"
                    />
                    <img
                      className="h-7 w-7 rounded-full border-2 border-[var(--surface)] object-cover ring-1 ring-black/5"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                      alt="Volunteer"
                    />
                    <img
                      className="h-7 w-7 rounded-full border-2 border-[var(--surface)] object-cover ring-1 ring-black/5"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="Volunteer"
                    />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] text-[10px] font-bold text-white shadow-sm">
                      +3k
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    Active Citizens
                  </span>
                </div>
              </div>


              <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-[var(--text-main)] sm:text-6xl lg:text-[5.25rem]">
                Small actions.
                <br />
                <span className="relative mt-1 inline-block">
                  <span className="relative z-10 text-[var(--primary)]">
                    Shared impact.
                  </span>

                  <svg
                    className="absolute -bottom-2 left-0 w-full overflow-visible text-[var(--accent)] sm:-bottom-3"
                    viewBox="0 0 300 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 14.5C45 4.5 140 -3.5 297 14.5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>


              <p className="max-w-xl text-base font-medium leading-relaxed text-[var(--text-muted)] sm:text-lg">
                Discover, organize, and join neighbor-led social drives across
                Bangladesh. From winter warmth distributions in Mirpur to
                riverbank tree plantations in Jashore.
              </p>


              <div className="flex flex-col items-stretch gap-3.5 pt-2 sm:flex-row sm:items-center">
                <Link
                  href="/events"
                  className="group flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-[var(--primary)] px-7 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--primary-dark)] hover:shadow-xl active:scale-[0.98] sm:h-14"
                >
                  <span>Explore Events</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/create-event"
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] px-6 text-sm font-bold text-[var(--text-main)] shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-[0.98] sm:h-14"
                >
                  <Plus className="h-4 w-4 text-[var(--accent)]" />
                  <span>Start an Initiative</span>
                </Link>
              </div>

             
              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--border-color)] pt-6">
                <div>
                  <p className="text-2xl font-black text-[var(--text-main)] sm:text-3xl">
                    120+
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Verified Drives
                  </p>
                </div>

                <div className="border-l border-[var(--border-color)] pl-4">
                  <p className="text-2xl font-black text-[var(--primary)] sm:text-3xl">
                    3,400+
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Volunteers
                  </p>
                </div>

                <div className="border-l border-[var(--border-color)] pl-4">
                  <p className="text-2xl font-black text-[var(--accent)] sm:text-3xl">
                    18
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Districts
                  </p>
                </div>
              </div>
            </div>


            <div className="relative h-[380px] w-full lg:col-span-5 sm:h-[480px] lg:h-[520px]">
             
              <div className="absolute right-2 top-0 z-20 h-52 w-38 overflow-hidden rounded-[2.5rem] rounded-tr-lg border-4 border-[var(--background)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:h-64 sm:w-48">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80"
                  alt="Tree plantation drive in Jashore"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  <span>Jashore</span>
                </div>
              </div>


              <div className="absolute left-2 top-10 z-10 h-72 w-56 overflow-hidden rounded-b-3xl rounded-t-[8rem] border-4 border-[var(--background)] shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:left-4 sm:top-14 sm:h-88 sm:w-68 sm:rounded-t-[10rem]">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
                  alt="Winter clothes donation drive in Mirpur"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="mb-1 inline-block rounded-md bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Donation Drive
                  </span>
                  <p className="text-sm font-bold leading-tight">
                    Mirpur 10 Winter Relief
                  </p>
                </div>
              </div>

             
              <div className="absolute bottom-2 right-6 z-20 h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--background)] shadow-2xl transition-all duration-500 hover:scale-110 sm:right-10 sm:h-40 sm:w-40">
                <img
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80"
                  alt="Community literacy initiative in Khulna"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>


              <div className="absolute bottom-8 left-0 z-30 hidden items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/90 p-3 shadow-xl backdrop-blur-md sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    100% Community Led
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Verified neighborhood drives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeroSpotlight>
  );
}
