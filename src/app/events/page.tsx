"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { EventCard, EventItem } from "@/components/events/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


const districts = [
  "All",
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapai Nawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

interface ApiEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location:
    | string
    | {
        division?: string;
        area?: string;
        city?: string;
        address?: string;
      };
  eventDate: string;
  organizerName?: string;
  participantCount?: number;
}

interface EventsApiResponse {
  success: boolean;
  count: number;
  events: ApiEvent[];
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
      area: parts[0] || event.location,
      city: parts[1] || parts[0] || event.location,
      address: event.location,
    };
  } else {
    location = {
      division: event.location?.division || "",
      area: event.location?.area || "",
      city: event.location?.city || "",
      address: event.location?.address || "",
    };
  }

  return {
    _id: event._id,
    title: event.title,
    description: event.description,
    category: event.category as EventItem["category"],
    imageUrl: event.imageUrl,
    location,
    eventDate: event.eventDate,
    organizerName: event.organizerName,
    participantCount: event.participantCount,
  };
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  const categories = [
    "All",
    "Plantation",
    "Donation",
    "Cleanup",
    "Education",
    "Healthcare",
  ];

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/events`);

        if (!response.ok) {
          throw new Error(`Unable to load events (HTTP ${response.status}).`);
        }

        const data: EventsApiResponse = await response.json();

        if (!data.success || !Array.isArray(data.events)) {
          throw new Error("The server returned an invalid events response.");
        }

        const normalizedEvents = data.events.map(normalizeEvent);

        if (!cancelled) {
          setEvents(normalizedEvents);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch events:", err);

          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading events.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events
      .filter((event) => {
        const matchesCategory =
          selectedCategory === "All" || event.category === selectedCategory;

        const matchesDistrict =
          selectedDistrict === "All" ||
          event.location.city?.toLowerCase() === selectedDistrict.toLowerCase();

        const searchableText = [
          event.title,
          event.description,
          event.category,
          event.location.area,
          event.location.city,
          event.location.division,
          event.location.address,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchableText.includes(normalizedSearch);

        return matchesCategory && matchesDistrict && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
      );
  }, [events, searchTerm, selectedCategory, selectedDistrict]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedDistrict !== "All";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDistrict("All");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-8 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-8 shadow-xs sm:p-12">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-1 text-xs font-semibold text-[var(--primary)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Civic Directory • Active Initiatives</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-5xl">
              Upcoming{" "}
              <span className="text-[var(--primary)]">Community Drives</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm font-medium text-[var(--text-muted)] sm:text-base">
              Explore verified grassroots initiatives across Bangladesh. Join
              hands with local volunteers in your neighborhood.
            </p>
          </div>
        </div>

      
        <div className="sticky top-20 z-30 mb-8 space-y-3 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/90 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row">
          
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, districts, areas, or addresses..."
                aria-label="Search events by title or location"
                className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs font-semibold text-[var(--text-main)] transition placeholder:text-[var(--text-muted)]/60 focus:border-[var(--primary)] focus:outline-none sm:text-sm"
              />
            </div>


            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Filter by district"
              className="h-11 w-full shrink-0 rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-3 text-xs font-bold text-[var(--text-main)] transition focus:border-[var(--primary)] focus:outline-none sm:w-48 sm:text-sm"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district === "All" ? "All Districts" : district}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3.5 text-xs font-bold text-[var(--accent)] transition hover:bg-[var(--accent)]/20 active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>


          <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--border-color)] pt-2">
            <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <SlidersHorizontal className="h-3 w-3" />
              Cause:
            </span>

            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    isSelected
                      ? "bg-[var(--primary)] text-white shadow-2xs"
                      : "border border-[var(--border-color)] bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

    
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-[var(--text-muted)]">
          <span>
            {loading ? (
              "Loading initiatives..."
            ) : (
              <>
                Showing{" "}
                <strong className="text-[var(--text-main)]">
                  {filteredEvents.length}
                </strong>{" "}
                {filteredEvents.length === 1 ? "initiative" : "initiatives"}
              </>
            )}
          </span>

          <div className="flex flex-wrap gap-2">
            {selectedDistrict !== "All" && (
              <span className="rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--primary)]">
                District: {selectedDistrict}
              </span>
            )}

            {selectedCategory !== "All" && (
              <span className="rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--primary)]">
                Category: {selectedCategory}
              </span>
            )}
          </div>
        </div>


        {loading && (
          <div
            className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-12 text-center"
            role="status"
          >
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[var(--primary)]" />
            <p className="mt-4 text-sm font-semibold text-[var(--text-muted)]">
              Loading community initiatives...
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            className="mx-auto max-w-lg rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-12 text-center"
            role="alert"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--accent)]">
              <CalendarDays className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-[var(--text-main)]">
              Couldn't load initiatives
            </h3>

            <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </button>
          </div>
        )}

    
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}


        {!loading && !error && filteredEvents.length === 0 && (
          <div className="mx-auto max-w-lg rounded-[2.5rem] border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--text-muted)]">
              <CalendarDays className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-[var(--text-main)]">
              {events.length === 0
                ? "No upcoming initiatives yet"
                : "No matching initiatives found"}
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              {events.length === 0
                ? "New community initiatives will appear here when organizers create them."
                : "We couldn't find any drives matching your search query or selected filters."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
