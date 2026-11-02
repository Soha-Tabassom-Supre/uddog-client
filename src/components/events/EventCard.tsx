"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, CalendarDays, Users } from "lucide-react";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  category: "Plantation" | "Donation" | "Cleanup" | "Education" | "Healthcare";
  imageUrl: string;
  location: {
    division: string;
    city: string; 
    area: string;
  };
  eventDate: string;
  organizerName?: string;
  participantCount?: number;
}

const categoryTheme = {
  Plantation:
    "from-emerald-400 to-emerald-600 shadow-emerald-500/20 text-emerald-700",
  Donation: "from-amber-400 to-amber-600 shadow-amber-500/20 text-amber-700",
  Cleanup: "from-sky-400 to-sky-600 shadow-sky-500/20 text-sky-700",
  Education:
    "from-purple-400 to-purple-600 shadow-purple-500/20 text-purple-700",
  Healthcare: "from-rose-400 to-rose-600 shadow-rose-500/20 text-rose-700",
};

export function EventCard({ event }: { event: EventItem }) {
  const theme = categoryTheme[event.category] || categoryTheme.Plantation;

  const dateObj = new Date(event.eventDate);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative flex h-[460px] w-full flex-col overflow-hidden rounded-[2.5rem] rounded-br-2xl bg-[var(--surface)] p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border dark:border-[var(--border-color)]">
      <div className="relative h-[55%] w-full overflow-hidden rounded-[2rem]">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

        <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-gray-900 shadow-sm backdrop-blur-md">
          {event.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)]">
            <span className="flex items-center gap-1 text-[var(--primary)]">
              <CalendarDays className="h-4 w-4" />
              {formattedDate}
            </span>

            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="truncate">
                {event.location.area}, {event.location.city},{" "}
                {event.location.division} Division
              </span>
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-tight text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
            {event.title}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Volunteers
            </span>

            <div className="flex items-center gap-1.5 pt-1 text-sm font-black text-[var(--text-main)]">
              <Users className="h-4 w-4 text-[var(--accent)]" />
              {event.participantCount ?? 0} Joined
            </div>
          </div>

          <Link
            href={`/events/${event._id}`}
            aria-label={`View ${event.title}`}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme} text-white transition-transform duration-300 hover:scale-110 hover:-rotate-12`}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="h-[460px] w-full rounded-[2.5rem] rounded-br-2xl border border-[var(--border-color)] bg-[var(--surface)] p-3 shadow-sm">
      <div className="h-[55%] w-full animate-pulse rounded-[2rem] bg-[var(--border-color)]/50" />

      <div className="space-y-4 px-4 pt-5 pb-3">
        <div className="flex gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--border-color)]" />
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--border-color)]" />
        </div>

        <div className="h-6 w-full animate-pulse rounded bg-[var(--border-color)]" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-[var(--border-color)]" />
      </div>
    </div>
  );
}
