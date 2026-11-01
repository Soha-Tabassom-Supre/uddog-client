"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] pt-12 pb-24 lg:pt-20 lg:pb-32">
    
      <div className="absolute top-0 right-1/4 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[var(--primary)]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8 items-center">
        
          <div className="lg:col-span-7 space-y-8 relative z-10">
           
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="h-10 w-10 rounded-full border-2 border-[var(--background)] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-[var(--background)] object-cover"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-[var(--background)] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--accent)] text-xs font-bold text-white">
                  +3k
                </div>
              </div>
              <p className="text-sm font-semibold text-[var(--text-muted)]">
                Neighbors already joined
              </p>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-[var(--text-main)] sm:text-7xl lg:text-[5.5rem] leading-[1.05]">
              Small actions. <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--primary)]">
                  Shared impact.
                </span>
               
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[var(--accent)]"
                  viewBox="0 0 300 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 15.5C40 5.5 140 -5.5 298 15.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="max-w-xl text-lg font-medium leading-relaxed text-[var(--text-muted)]">
              Discover, organize, and join citizen-led initiatives across
              Bangladesh. From winter clothing drives in Mirpur to riverbank
              tree plantations in Jashore.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-6">
              <Link
                href="/events"
                className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[var(--text-main)] px-8 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-black hover:shadow-2xl dark:bg-[var(--primary)] dark:hover:bg-[var(--primary-dark)]"
              >
                Explore Events
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link
                href="/create-event"
                className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 border-[var(--border-color)] bg-[var(--surface)] px-8 text-sm font-bold text-[var(--text-main)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] transition-transform group-hover:scale-110">
                  <Play className="h-3 w-3 ml-0.5" />
                </div>
                Start an Initiative
              </Link>
            </div>
          </div>

         
          <div className="lg:col-span-5 relative h-[500px] w-full hidden sm:block">
          
            <div className="absolute top-0 right-0 z-20 h-64 w-48 overflow-hidden rounded-[3rem] rounded-tr-md border-4 border-[var(--background)] shadow-2xl transition-transform duration-700 hover:-translate-y-4 hover:rotate-2">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80"
                alt="Plantation"
                className="h-full w-full object-cover"
              />
            </div>


            <div className="absolute top-20 left-4 z-10 h-80 w-64 overflow-hidden rounded-t-[10rem] rounded-b-3xl border-4 border-[var(--background)] shadow-xl transition-transform duration-700 hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
                alt="Winter Drive"
                className="h-full w-full object-cover"
              />
            </div>


            <div className="absolute bottom-4 right-12 z-30 h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--background)] shadow-2xl transition-transform duration-700 hover:scale-110">
              <img
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80"
                alt="Education"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
