"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EventCard, EventItem } from "@/components/events/EventCard";

export const SAMPLE_UPCOMING_EVENTS: EventItem[] = [
  {
    _id: "evt-101",
    title: "Mirpur 10 Winter Warmth & Blanket Drive",
    description: "Collecting gently used jackets.",
    category: "Donation",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    location: { area: "Mirpur 10", city: "Dhaka" },
    eventDate: "2026-11-12T09:30:00.000Z",
    organizerName: "Farhana Rahman",
    participantCount: 64,
  },
  {
    _id: "evt-102",
    title: "Bhairab Riverbank 1,000 Sapling Plantation",
    description: "Join youth volunteers in Jashore.",
    category: "Plantation",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    location: { area: "Daratana", city: "Jashore" },
    eventDate: "2026-11-15T08:00:00.000Z",
    organizerName: "Tanvir Hasan",
    participantCount: 84,
  },
  {
    _id: "evt-103",
    title: "Mohammadpur Canal Plastic Cleanup",
    description: "Gloves provided!",
    category: "Cleanup",
    imageUrl:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80",
    location: { area: "Mohammadpur", city: "Dhaka" },
    eventDate: "2026-11-19T07:30:00.000Z",
    organizerName: "Rafiul Islam",
    participantCount: 49,
  },
];

export function FeaturedEvents({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const filteredEvents =
    selectedCategory === "All"
      ? SAMPLE_UPCOMING_EVENTS
      : SAMPLE_UPCOMING_EVENTS.filter((e) => e.category === selectedCategory);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              <Sparkles className="h-3.5 w-3.5" /> Next 6 Initiatives
            </div>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-[var(--text-main)]">
              Upcoming drives near you
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[var(--primary)] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
