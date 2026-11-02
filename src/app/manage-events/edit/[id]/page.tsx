"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Tag,
  Save,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { authClient } from "@/lib/auth-client";

type CategoryType =
  | "Plantation"
  | "Donation"
  | "Cleanup"
  | "Education"
  | "Healthcare";

type EventFormData = {
  title: string;
  category: CategoryType;
  description: string;
  imageUrl: string;
  eventDate: string;
  area: string;
  city: string;
  address: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories: CategoryType[] = [
  "Plantation",
  "Donation",
  "Cleanup",
  "Education",
  "Healthcare",
];

const cities = [
  "Dhaka",
  "Jashore",
  "Khulna",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
];


function formatDateForInput(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const offset = parsedDate.getTimezoneOffset() * 60000;

  return new Date(parsedDate.getTime() - offset).toISOString().slice(0, 16);
}

const initialFormData: EventFormData = {
  title: "",
  category: "Plantation",
  description: "",
  imageUrl: "",
  eventDate: "",
  area: "",
  city: "Dhaka",
  address: "",
};

export default function EditEventPage() {
  return (
    <ProtectedRoute>
      <EditEventForm />
    </ProtectedRoute>
  );
}

function EditEventForm() {
  const params = useParams();
  const router = useRouter();

  const eventId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    let cancelled = false;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        if (!eventId) {
          throw new Error("Invalid initiative ID.");
        }

        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load this initiative.");
        }


        const event =
          result.event ?? result.data?.event ?? result.data ?? result;

        if (!event || !event.title) {
          throw new Error("Initiative not found.");
        }

        const location =
          typeof event.location === "string"
            ? {
                area: event.location,
                city: "",
                address: "",
              }
            : event.location || {};

        const loadedFormData: EventFormData = {
          title: event.title || "",
          category: event.category || "Plantation",
          description: event.description || "",
          imageUrl: event.imageUrl || "",
          eventDate: event.eventDate ? formatDateForInput(event.eventDate) : "",
          area: location.area || "",
          city: location.city || "Dhaka",
          address: location.address || "",
        };

        if (!cancelled) {
          setFormData(loadedFormData);
        }
      } catch (err) {
        console.error("Fetch event error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load initiative.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim().length < 5) {
      toast.error("Event title must be at least 5 characters long.");
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error("Please provide a description of at least 20 characters.");
      return;
    }

    try {
      const imageUrl = new URL(formData.imageUrl);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        toast.error("Image URL must use HTTP or HTTPS.");
        return;
      }
    } catch {
      toast.error("Please provide a valid image URL.");
      return;
    }

    if (!formData.eventDate) {
      toast.error("Please specify a scheduled date.");
      return;
    }

    const selectedTimestamp = new Date(formData.eventDate).getTime();

    if (Number.isNaN(selectedTimestamp) || selectedTimestamp <= Date.now()) {
      toast.error("The event date must be in the future.");
      return;
    }

    if (!formData.area.trim()) {
      toast.error("Please specify the neighborhood area.");
      return;
    }

    setSaving(true);

    try {
     
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

    
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        eventDate: new Date(formData.eventDate).toISOString(),
        location: {
          area: formData.area.trim(),
          city: formData.city,
          address: formData.address.trim(),
        },
      };

    
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update initiative.");
      }

      toast.success("Initiative updated successfully!");

      router.push("/manage-events");
      router.refresh();
    } catch (err) {
      console.error("Update event error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the initiative.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)]" />
        <p className="mt-4 text-sm font-semibold text-[var(--text-muted)]">
          Loading initiative details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-black text-[var(--text-main)]">
          Unable to Load Initiative
        </h1>

        <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
          {error}
        </p>

        <Link
          href="/manage-events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Events
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/manage-events"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Console</span>
          </Link>

          <span className="max-w-[55%] truncate rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">
            Editing Ref: {eventId}
          </span>
        </div>


        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Sparkles className="h-3 w-3 text-[var(--accent)]" />
            <span>Update Initiative</span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-main)]">
            Edit Initiative Details
          </h1>

          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
            Update logistics, meeting points, or volunteer requirements for this
            published drive.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
       
          <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-sm sm:p-10 lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
           
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Initiative Title *
                </label>

                <input
                  type="text"
                  required
                  minLength={5}
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs font-semibold text-[var(--text-main)] transition-all focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Civic Category *
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange("category", cat)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                        formData.category === cat
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-xs"
                          : "border-[var(--border-color)] bg-[var(--background)] text-[var(--text-main)] hover:border-[var(--primary)]/40"
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

        
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Cover Photo Direct URL *
                </label>

                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs font-semibold text-[var(--text-main)] transition-all focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Scheduled Date & Time *
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs font-semibold text-[var(--text-main)] transition-all focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

           
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    District / City *
                  </label>

                  <select
                    required
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs font-bold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Area / Ward *
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs font-semibold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Landmark / Meeting Point
                </label>

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs font-semibold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                />
              </div>

           
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Detailed Scope & Instructions * (min 20 characters)
                </label>

                <textarea
                  required
                  minLength={20}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full resize-none rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 text-xs font-medium text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-xs font-bold text-white shadow-md transition-all hover:bg-[var(--primary-dark)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {saving ? "Saving Changes..." : "Save Modifications"}
                  </span>
                </button>

                <Link
                  href="/manage-events"
                  className="flex h-13 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-6 text-xs font-bold text-[var(--text-main)] transition-all hover:bg-[var(--surface)] sm:text-sm"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

       
          <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
            <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <Eye className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Live Modified Card</span>
            </div>

            <article className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] p-3 shadow-md">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[var(--background)]">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt={formData.title || "Initiative preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                    No cover image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[var(--primary)] shadow-xs dark:bg-black/85">
                  {formData.category} Drive
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white">
                  <MapPin className="h-3 w-3 text-[var(--accent)]" />
                  <span>
                    {formData.area || "Neighborhood"}
                    {formData.city ? `, ${formData.city}` : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--primary)]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formData.eventDate
                      ? new Date(formData.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "Date to be scheduled"}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-base font-bold text-[var(--text-main)]">
                  {formData.title || "Your Initiative Title"}
                </h3>

                <p className="line-clamp-2 text-xs text-[var(--text-muted)]">
                  {formData.description ||
                    "Your initiative description will appear here."}
                </p>
              </div>
            </article>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-4 text-xs text-[var(--text-muted)]">
              <p className="font-bold text-[var(--text-main)]">
                <Sparkles className="mr-1 inline h-4 w-4 text-[var(--primary)]" />
                Changes Preview
              </p>

              <p className="mt-2">
                Your changes will be saved to the database when you click Save
                Modifications. The public initiative will then show the updated
                information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
