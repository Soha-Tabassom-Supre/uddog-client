"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Heart,
  MapPin,
  ShieldCheck,
  Mail,
  ArrowUpRight,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--surface)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
        
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm transition group-hover:bg-[var(--primary-dark)]">
                <Sprout className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[var(--text-main)]">
                    Uddog
                  </span>
                  <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                    উদ্যোগ
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  Small actions. Shared impact.
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-[var(--text-muted)]">
              Bangladesh's curated community participation registry.
              Facilitating verified grassroots initiatives—from canal plastic
              clearance in Dhaka to riverbank reforestation in Jashore.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--text-main)]">
              <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
              <span className="font-semibold">
                Independent Grassroots Infrastructure
              </span>
            </div>
          </div>


          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-3">
              Civic Domains
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <Link
                  href="/events?category=Plantation"
                  className="hover:text-[var(--primary)] transition"
                >
                  Tree Reforestation
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=Donation"
                  className="hover:text-[var(--primary)] transition"
                >
                  Winter Warmth Relief
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=Cleanup"
                  className="hover:text-[var(--primary)] transition"
                >
                  Canal & Ward Cleanup
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=Education"
                  className="hover:text-[var(--primary)] transition"
                >
                  Street Book Banks
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=Healthcare"
                  className="hover:text-[var(--primary)] transition"
                >
                  Blood Grouping Camps
                </Link>
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-3">
              Regional Wards
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Dhaka (Mirpur, Mohammadpur)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Jashore (Bhairab Basin)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Khulna (Boyra Park Area)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Chattogram (Agrabad Ward)</span>
              </li>
            </ul>
          </div>

        
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-3">
              Civic Helplines
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
                <span>
                  National Emergency: <strong>999</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
                <span>
                  Govt Services: <strong>333</strong>
                </span>
              </li>
              <li className="pt-2">
                <Link
                  href="/create-event"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  <span>Propose an Initiative</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

       
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-color)] pt-8 sm:flex-row text-xs text-[var(--text-muted)]">
          <p>
            © 2026 Uddog Civic Network. Open for community initiatives across
            Bangladesh.
          </p>
          <div className="flex items-center gap-1">
            <span>Built with care for public good</span>
            <Heart className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
