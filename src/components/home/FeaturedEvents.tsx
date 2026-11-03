"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CalendarDays } from "lucide-react";
import { EventCard, EventItem } from "@/components/events/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiEvent extends Omit<EventItem, "location"> {
  location:
    | string
    | {
        division?: string;
        area?: string;
        city?: string;
        address?: string;
      };
}

interface FeaturedEventsProps {
  selectedCategory?: string;
  onClearCategory?: () => void;
}

function normalizeEvent(event: ApiEvent): EventItem {
  let location: EventItem["location"];

  if (typeof event.location === "string") {
    const parts = event.location
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  location = {
    division: "",
    area: parts[0] || "Location to be announced",
    city: parts.length > 1 ? parts[parts.length - 1] : parts[0] || "Unknown",
    address: event.location,
  };
  } else {
    location = {
      division: event.location.division || "",
      area: event.location.area || "",
      city: event.location.city || "",
      address: event.location.address || "",
    };
  }

  return {
    ...event,
    location,
  };
}

export function FeaturedEvents({
  selectedCategory = "All",
  onClearCategory,
}: FeaturedEventsProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeaturedEvents() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/events/featured`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load featured events.");
        }

        const data = await response.json();

        if (!Array.isArray(data.events)) {
          throw new Error("Invalid featured events response from server.");
        }

        const normalizedEvents = (data.events as ApiEvent[]).map(
          normalizeEvent,
        );

        setEvents(normalizedEvents);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading events.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchFeaturedEvents();

    return () => controller.abort();
  }, []);

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <section className="border-b border-[var(--border-color)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Verified Civic Initiatives</span>
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
              Upcoming drives near you
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {selectedCategory === "All"
                ? "Active grassroots drives ready for community volunteers."
                : `Showing drives filed under "${selectedCategory}".`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedCategory !== "All" && onClearCategory && (
              <button
                type="button"
                onClick={onClearCategory}
                className="text-xs font-bold text-[var(--accent)] hover:underline"
              >
                Clear filter
              </button>
            )}

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text-main)] shadow-2xs transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <span>View All Events</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>


        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-[var(--surface-tint)]"
              />
            ))}
          </div>
        )}


        {!isLoading && error && (
          <div className="rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-[var(--text-muted)]" />
            <h3 className="mt-4 text-base font-bold text-[var(--text-main)]">
              Unable to load initiatives
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Try Again
            </button>
          </div>
        )}


        {!isLoading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

       
        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-[var(--text-muted)]" />

            <h3 className="mt-4 text-base font-bold text-[var(--text-main)]">
              {events.length === 0
                ? "No upcoming initiatives available"
                : "No initiatives in this category yet"}
            </h3>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Be the first to organize a social drive in this domain.
            </p>

            {onClearCategory && selectedCategory !== "All" && (
              <button
                type="button"
                onClick={onClearCategory}
                className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
              >
                Show All Categories
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedEvents;
