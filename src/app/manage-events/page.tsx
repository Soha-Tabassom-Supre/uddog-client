"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CalendarPlus,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EventItem } from "@/components/events/EventCard";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <ManageEventsDashboard />
    </ProtectedRoute>
  );
}

function ManageEventsDashboard() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  
  useEffect(() => {
    let cancelled = false;

    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication failed. Please log in again.");
        }

        const response = await fetch(`${API_BASE_URL}/api/events/my-events`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load your initiatives.");
        }

       
        const eventList =
          result.events ??
          result.data?.events ??
          (Array.isArray(result.data) ? result.data : null);

        if (!Array.isArray(eventList)) {
          throw new Error("Unexpected response received from the server.");
        }

        const normalizedEvents: EventItem[] = eventList.map((event) => ({
          ...event,
          location:
            typeof event.location === "string"
              ? {
                  area: event.location,
                  city: "",
                }
              : event.location,
        }));

        if (!cancelled) {
          setEvents(normalizedEvents);
        }
      } catch (err) {
        console.error("Fetch my events error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your initiatives.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMyEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalVolunteers = events.reduce(
    (total, event) => total + (event.participantCount || 0),
    0,
  );

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete the initiative.");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== id),
      );

      toast.success(`"${title}" has been deleted successfully.`);
    } catch (err) {
      console.error("Delete event error:", err);

      toast.error(
        err instanceof Error ? err.message : "Unable to delete the initiative.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              <span>Organizer Console</span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
              Manage Your{" "}
              <span className="text-[var(--primary)]">Initiatives</span>
            </h1>

            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              Review, edit, or track community participation for drives you have
              organized.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--primary-dark)] active:scale-95"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Create New Drive</span>
          </Link>
        </div>

    
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Created Drives
            </span>

            <p className="mt-1 text-3xl font-black text-[var(--text-main)]">
              {loading ? "—" : events.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Total Volunteers Mobilized
            </span>

            <p className="mt-1 text-3xl font-black text-[var(--primary)]">
              {loading ? "—" : totalVolunteers}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Organizer Standing
            </span>

            <p className="mt-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
              Active Chapter Lead
            </p>
          </div>
        </div>


        {loading ? (
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)]" />

            <p className="mt-4 text-sm font-semibold text-[var(--text-muted)]">
              Loading your initiatives...
            </p>
          </div>
        ) : error ? (
        
          <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <h3 className="text-lg font-black text-red-700 dark:text-red-400">
              Unable to load initiatives
            </h3>

            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Try Again
            </button>
          </div>
        ) : events.length > 0 ? (
      
          <div className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-[var(--border-color)] bg-[var(--surface-tint)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Initiative
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Category
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Scheduled Date
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Location
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Volunteers
                    </th>

                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border-color)] font-medium text-[var(--text-main)]">
                  {events.map((event) => {
                    const dateObj = new Date(event.eventDate);

                    const formatted = dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr
                        key={event._id}
                        className="transition hover:bg-[var(--background)]/60"
                      >

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="h-10 w-10 shrink-0 rounded-xl object-cover"
                            />

                            <div className="min-w-0 max-w-xs">
                              <p className="truncate font-bold text-[var(--text-main)]">
                                {event.title}
                              </p>

                              <p className="truncate text-[11px] text-[var(--text-muted)]">
                                ID: {event._id}
                              </p>
                            </div>
                          </div>
                        </td>

                     
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
                            {event.category}
                          </span>
                        </td>

                    
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" />
                            <span>{formatted}</span>
                          </div>
                        </td>

                      
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />

                            <span>
                              {event.location?.area || "Unknown area"}
                              {event.location?.city
                                ? `, ${event.location.city}`
                                : ""}
                            </span>
                          </div>
                        </td>

                   
                        <td className="px-6 py-4 text-xs font-bold text-[var(--text-main)]">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{event.participantCount || 0}</span>
                          </div>
                        </td>

                   
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/events/${event._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                              title="View Event"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <Link
                              href={`/manage-events/edit/${event._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                              title="Edit Event"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              disabled={deletingId === event._id}
                              onClick={() =>
                                handleDelete(event._id, event.title)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:bg-red-950/20"
                              title="Delete Event"
                            >
                              {deletingId === event._id ? (
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
        
          <div className="mx-auto max-w-md rounded-[2.5rem] border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--text-muted)]">
              <FolderKanban className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-[var(--text-main)]">
              No organized events yet
            </h3>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              You haven't published any community initiatives under this
              profile.
            </p>

            <Link
              href="/create-event"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--primary-dark)]"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Publish First Initiative</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
