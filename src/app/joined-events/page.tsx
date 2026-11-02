"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Eye,
  LogOut,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  LoaderCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EventItem } from "@/components/events/EventCard";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <JoinedEventsView />
    </ProtectedRoute>
  );
}

function JoinedEventsView() {
  const [joinedList, setJoinedList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getAuthToken = useCallback(async (): Promise<string> => {
    const result = await authClient.token();
    const token = result.data?.token;

    if (result.error || !token) {
      throw new Error(
        "Your session could not be verified. Please sign in again.",
      );
    }

    return token;
  }, []);

  const fetchJoinedEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/events/joined`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        if (response.status === 404) {
          throw new Error(
            "The joined-events endpoint was not found. Please check your backend routes.",
          );
        }

        throw new Error(
          `Could not load your registered events (HTTP ${response.status}).`,
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.events)) {
        throw new Error("The server returned an unexpected events response.");
      }

      setJoinedList(data.events);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your events.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    void fetchJoinedEvents();
  }, [fetchJoinedEvents]);

  const handleCancelParticipation = async (id: string, title: string) => {
    if (cancellingId) return;

    setCancellingId(id);

    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/events/${id}/register`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Could not cancel your registration (HTTP ${response.status}).`,
        );
      }

      setJoinedList((previous) => previous.filter((event) => event._id !== id));

      toast.success(`Registration cancelled for "${title}".`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not cancel your registration.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              <span>Your Participation</span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
              Joined <span className="text-[var(--primary)]">Initiatives</span>
            </h1>

            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              View and manage your event registrations.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--primary-dark)] active:scale-95"
          >
            <span>Browse Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Registered Events
            </span>

            <p className="mt-1 text-3xl font-black text-[var(--text-main)]">
              {loading ? "—" : joinedList.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Account Status
            </span>

            <p className="mt-2 flex items-center gap-1.5 text-base font-bold text-[var(--primary)]">
              <ShieldCheck className="h-4 w-4" />
              Authenticated
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Participation Record
            </span>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Your registered events are listed below.
            </p>
          </div>
        </div>

        {loading && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            role="status"
          >
            <LoaderCircle className="h-8 w-8 animate-spin text-[var(--primary)]" />

            <p className="mt-4 text-sm font-medium text-[var(--text-muted)]">
              Loading your registrations...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Could not load your events
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>

            <button
              type="button"
              onClick={() => void fetchJoinedEvents()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && joinedList.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {joinedList.map((event) => {
              const dateObj = new Date(event.eventDate);
              const validDate = !Number.isNaN(dateObj.getTime());

              const formattedDate = validDate
                ? dateObj.toLocaleDateString("en-BD", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date unavailable";

              const formattedTime = validDate
                ? dateObj.toLocaleTimeString("en-BD", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "";

              return (
                <article
                  key={event._id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-xs transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                      <span className="rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
                        {event.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Registered
                      </span>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <img
                        src={event.imageUrl || "/placeholder-event.jpg"}
                        alt={event.title}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 text-base font-bold leading-snug text-[var(--text-main)]">
                          {event.title}
                        </h2>

                        <div className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
                            <span>
                              {formattedDate}
                              {formattedTime && ` • ${formattedTime}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                            <span className="truncate">
                              {event.location?.area}, {event.location?.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Event</span>
                    </Link>

                    <button
                      type="button"
                      disabled={cancellingId !== null}
                      onClick={() =>
                        void handleCancelParticipation(event._id, event.title)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:bg-red-950/20"
                    >
                      {cancellingId === event._id ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <LogOut className="h-3.5 w-3.5" />
                      )}

                      <span>
                        {cancellingId === event._id
                          ? "Cancelling..."
                          : "Cancel Registration"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && joinedList.length === 0 && (
          <div className="mx-auto max-w-md rounded-[2.5rem] border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--text-muted)]">
              <HeartHandshake className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-[var(--text-main)]">
              No registered events yet
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              When you register for an event, it will appear here.
            </p>

            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--primary-dark)]"
            >
              <span>Explore Events</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
