"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, MapPin, Mail } from "lucide-react";

export function Footer() {
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--text-main)]">
                Uddog • উদ্যোগ
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Small actions. Shared impact. Connecting citizens across
              Bangladesh to organize and join local community-service events.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://x.com"
                aria-label="Follow on X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="hover:text-[var(--primary)] transition"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  href="/create-event"
                  className="hover:text-[var(--primary)] transition"
                >
                  Create Event
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              Event Types
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Winter Clothes Donation</li>
              <li>Tree Plantation Drives</li>
              <li>Neighborhood Cleanup</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              Community Desk
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-[var(--accent)]" />
              <span>support@uddog.org.bd</span>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between border-t border-[var(--border-color)] pt-6 text-xs sm:flex-row">
          <p>© {year} Uddog (উদ্যোগ). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
