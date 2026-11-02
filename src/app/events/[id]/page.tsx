"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  HeartHandshake,
  Share2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { EventItem } from "@/components/events/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiEvent = Omit<EventItem, "location"> & {
  location:
    | string
    | {
        division?: string;
        area?: string;
        city?: string;
        address?: string;
      };
};

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
      city: parts.length > 1 ? parts[parts.length - 1] : "",
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
    ...event,
    location,
  };
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Loading initiative details...
          </p>
        </main>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}

function EventDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchEvent() {
      setIsLoading(true);
      setError("");
      setEvent(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/events/${encodeURIComponent(eventId)}`,
          { signal: controller.signal },
        );

        if (response.status === 404) {
          setEvent(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load this event.");
        }

        const data = await response.json();
        const apiEvent = (data.event ?? data) as ApiEvent;

        if (!apiEvent || !apiEvent._id) {
          throw new Error("The server returned invalid event data.");
        }

        setEvent(normalizeEvent(apiEvent));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the event.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvent();

    return () => controller.abort();
  }, [eventId]);

  const handleJoin = async () => {
    if (!event || isJoining) return;

    setIsJoining(true);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error(
          "Your session could not be verified. Please sign in again.",
        );
      }

     
      const response = await fetch(
        `${API_BASE_URL}/api/events/${encodeURIComponent(event._id)}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
        
          setHasJoined(true);

          throw new Error(
            data.message || "You have already registered for this event.",
          );
        }

        if (response.status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        throw new Error(
          data.message || `Registration failed (HTTP ${response.status}).`,
        );
      }

      
      setHasJoined(true);

      toast.success(data.message || `You are registered for "${event.title}"!`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not register for this event.",
      );
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event URL copied to clipboard.");
    } catch {
      toast.error("Could not copy the link. Please copy it from your browser.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)]" />
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Loading initiative details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-[var(--text-main)]">
          Unable to Load Event
        </h1>

        <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Try Again
        </button>

        <Link
          href="/events"
          className="mt-4 text-sm font-semibold text-[var(--primary)]"
        >
          Return to Upcoming Events
        </Link>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-[var(--text-main)]">
          Initiative Not Found
        </h1>

        <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
          This event may no longer be available, or its ID may be invalid.
        </p>

        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Upcoming Events</span>
        </Link>
      </main>
    );
  }

  const dateObj = new Date(event.eventDate);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24">
      <div className="relative h-72 w-full overflow-hidden bg-[var(--surface-tint)] sm:h-96">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            No event image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/40 to-black/30" />

        <div className="absolute left-4 top-6 z-10 sm:left-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition hover:bg-white/40 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:-mt-28 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="space-y-6 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-sm sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                  {event.category} Drive
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Community Initiative
                </span>
              </div>

              <h1 className="text-2xl font-black leading-tight tracking-tight text-[var(--text-main)] sm:text-4xl">
                {event.title}
              </h1>

              <div className="flex items-center gap-3.5 border-y border-[var(--border-color)] py-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-base font-bold text-white shadow-xs">
                  {event.organizerName?.[0] ?? "U"}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Initiative Organizer
                  </p>

                  <p className="text-sm font-bold text-[var(--text-main)]">
                    {event.organizerName || "Community Member"}
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    Community Organizer · {event.location.city} Chapter
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-base font-bold text-[var(--text-main)]">
                  About this initiative
                </h2>

                <p className="whitespace-pre-line text-sm font-normal leading-relaxed text-[var(--text-muted)] sm:text-base">
                  {event.description}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Volunteer Notice &amp; Preparation
                </h3>

                <ul className="list-inside list-disc space-y-1.5 text-xs text-[var(--text-muted)]">
                  <li>
                    Please arrive 15 minutes before the scheduled time for
                    briefing.
                  </li>
                  <li>
                    Confirm any required equipment with the organizers before
                    attending.
                  </li>
                  <li>
                    Carry a reusable water bottle to reduce single-use plastic
                    waste.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
              <h3 className="border-b border-[var(--border-color)] pb-3 text-base font-black text-[var(--text-main)]">
                Event Logistics
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Calendar className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="font-bold text-[var(--text-main)]">
                      {formattedDate}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Clock className="h-3 w-3" />
                      {formattedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="font-bold text-[var(--text-main)]">
                      {event.location.area}
                    </p>

                    <p className="text-xs text-[var(--text-muted)]">
                      {event.location.address
                        ? `${event.location.address}, `
                        : ""}
                      {event.location.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 border-t border-[var(--border-color)] pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Users className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="font-bold text-[var(--text-main)]">
                      {(event.participantCount || 0) + (hasJoined ? 1 : 0)}{" "}
                      Citizens
                    </p>

                    <p className="text-xs text-[var(--text-muted)]">
                      Confirmed participants
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-[var(--border-color)] pt-4">
                {hasJoined ? (
                  <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>You are registered</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-xs font-bold text-white shadow-sm transition hover:bg-[var(--primary-dark)] active:scale-95 disabled:opacity-60 sm:text-sm"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>
                      {isJoining ? "Registering..." : "Join This Initiative"}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-transparent text-xs font-semibold text-[var(--text-main)] transition hover:border-[var(--primary)] active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Event Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
