"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Tag,
  ArrowRight,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type CategoryType =
  | "Plantation"
  | "Donation"
  | "Cleanup"
  | "Education"
  | "Healthcare";

const districtsByDivision: Record<string, string[]> = {
  Dhaka: [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  Chattogram: [
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Cumilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  Rajshahi: [
    "Bogura",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
  ],
  Khulna: [
    "Bagerhat",
    "Chuadanga",
    "Jashore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  Barishal: [
    "Barguna",
    "Barishal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
  ],
  Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  Rangpur: [
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
  ],
  Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
};

const divisions = Object.keys(districtsByDivision);

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <CreateEventForm />
    </ProtectedRoute>
  );
}

function CreateEventForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "Plantation" as CategoryType,
    description: "",
    imageUrl: "",
    eventDate: "",
    division: "",
    city: "",
    area: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const categories: CategoryType[] = [
    "Plantation",
    "Donation",
    "Cleanup",
    "Education",
    "Healthcare",
  ];

  const availableDistricts = formData.division
    ? districtsByDivision[formData.division] || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please sign in to organize an initiative.");
      return;
    }

    if (formData.title.trim().length < 5) {
      toast.error("Event title must be at least 5 characters long.");
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error("Please provide a description of at least 20 characters.");
      return;
    }

    if (!formData.imageUrl.trim()) {
      toast.error("Please provide an image URL.");
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
      toast.error("Please pick an event date and time.");
      return;
    }

    const selectedTimestamp = new Date(formData.eventDate).getTime();

    if (selectedTimestamp <= Date.now()) {
      toast.error("The event date must be in the future.");
      return;
    }

    if (!formData.division) {
      toast.error("Please select a division.");
      return;
    }

    if (!formData.city) {
      toast.error("Please select a district.");
      return;
    }

    if (!formData.area.trim()) {
      toast.error("Please specify the neighborhood area or upazila.");
      return;
    }

    setSubmitting(true);

    try {
      let authToken = "";

      try {
        const { data: tokenData } = await authClient.token();
        authToken = tokenData?.token || "";
      } catch {
        authToken = "";
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl.trim(),
        eventDate: new Date(formData.eventDate).toISOString(),
        location: {
          division: formData.division,
          city: formData.city,
          area: formData.area.trim(),
          address: formData.address.trim(),
        },
        organizerEmail: user.email,
        organizerName: user.name || "Community Organizer",
        organizerImage: user.image || "",
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create initiative.");
      }

      toast.success("Your initiative has been published successfully!");
      router.push("/manage-events");
      router.refresh();
    } catch (error) {
      console.error("Create event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the initiative.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Organizer Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-main)]">
            Organize a{" "}
            <span className="text-[var(--primary)]">Civic Drive</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Launch a verified neighborhood initiative. Your drive will be
            published to the public registry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Initiative Title *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Sapling Native Plantation along Bhairab River"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none transition-all"
                />
              </div>


              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Civic Category *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat })
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition-all ${
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Cover Photo Direct URL *
                </label>

                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />

                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none transition-all"
                  />
                </div>
              </div>

         
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Scheduled Date & Time *
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />

                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-all"
                  />
                </div>
              </div>

          
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Division *
                  </label>

                  <select
                    required
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        division: e.target.value,
                        city: "",
                      })
                    }
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs sm:text-sm font-bold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-all"
                  >
                    <option value="">Select division</option>

                    {divisions.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    District *
                  </label>

                  <select
                    required
                    value={formData.city}
                    disabled={!formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs sm:text-sm font-bold text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {formData.division
                        ? "Select district"
                        : "Select division first"}
                    </option>

                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Upazila / Area / Ward *
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />

                  <input
                    type="text"
                    required
                    placeholder="e.g. Jashore Sadar / Daratana Ghat"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-10 pr-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none transition-all"
                  />
                </div>
              </div>


              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Exact Meeting Landmark
                </label>

                <input
                  type="text"
                  placeholder="e.g. In front of Old Embankment Concourse"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none transition-all"
                />
              </div>

            
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Detailed Scope & Instructions * (min 20 characters)
                </label>

                <textarea
                  required
                  rows={4}
                  placeholder="Detail the goals, volunteer tasks, necessary clothing, and safety guidelines for participants..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 text-xs sm:text-sm font-medium text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none transition-all resize-none"
                />
              </div>

            
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-3.5">
                <img
                  src={
                    user?.image ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  }
                  alt={user?.name || "Organizer"}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--primary)]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--text-main)] truncate">
                    Publishing as {user?.name || "Organizer"}
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {user?.email}
                  </p>
                </div>

                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  Verified Organizer
                </span>
              </div>


              <button
                type="submit"
                disabled={submitting}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[var(--primary-dark)] active:scale-[0.99] transition-all disabled:opacity-60"
              >
                {submitting ? (
                  "Publishing to Registry..."
                ) : (
                  <>
                    <CalendarPlus className="h-4 w-4" />
                    <span>Publish Community Initiative</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

       
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
              <Eye className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Real-Time Directory Card Preview</span>
            </div>

            <article className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] p-3 shadow-md transition-all">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[var(--background)]">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[var(--text-muted)]">
                    Provide cover photo URL to view preview
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 rounded-full bg-white/95 dark:bg-black/85 px-3 py-1 text-[11px] font-bold text-[var(--primary)] shadow-xs">
                  {formData.category} Drive
                </div>

                <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[var(--accent)]" />
                  <span>
                    {formData.area || "Neighborhood"}
                    {formData.city ? `, ${formData.city}` : ""}
                    {formData.division ? `, ${formData.division}` : ""}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1">
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

                <h3 className="text-base font-bold text-[var(--text-main)] line-clamp-2">
                  {formData.title || "Your Initiative Title Will Appear Here"}
                </h3>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                  {formData.description ||
                    "The detailed scope and volunteer notice of your initiative will show in this summary preview."}
                </p>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[var(--text-muted)]">
                    By <strong>{user?.name || "You"}</strong>
                  </span>

                  <span className="text-[11px] font-bold text-[var(--accent)]">
                    0 Volunteers Registered
                  </span>
                </div>
              </div>
            </article>

          
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-4 text-xs text-[var(--text-muted)] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                <span>Publishing Guidelines</span>
              </div>

              <p>
                Once published, your initiative is immediately visible on the
                public `/events` directory for citizens to join.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
