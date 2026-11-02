"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Clock,
  CalendarCheck,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";

export default function ImpactPassportPage() {
  return (
    <ProtectedRoute>
      <PassportContent />
    </ProtectedRoute>
  );
}

function PassportContent() {
  const { user } = useAuth();

  const [eventsJoined, setEventsJoined] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Authentication token unavailable.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/joined`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your registered events.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load your participation records.",
          );
        }

        if (isMounted) {
          setEventsJoined(data.count ?? data.events?.length ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch passport statistics:", err);

        if (isMounted) {
          setError("Could not load your participation statistics.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJoinedEvents();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const stats = [
    {
      label: "Events Registered",
      value: loading ? "..." : eventsJoined,
      icon: CalendarCheck,
    },
    {
      label: "Hours Contributed",
      value: 0,
      icon: Clock,
    },
    {
      label: "Achievements",
      value: 0,
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Community Contributions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-main)]">
            Citizen{" "}
            <span className="text-[var(--primary)]">Impact Passport</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Explore your community participation and track your contributions as
            Uddog develops its participation-record features.
          </p>
        </div>

      
        <section className="relative mb-12 overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-12 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User profile"}
                  className="h-24 w-24 rounded-3xl object-cover ring-4 ring-[var(--primary)]/20 shadow-md"
                />
              ) : (
                <div
                  aria-label="User avatar"
                  className="h-24 w-24 rounded-3xl ring-4 ring-[var(--primary)]/20 shadow-md bg-[var(--primary)]/10 flex items-center justify-center text-3xl font-black text-[var(--primary)]"
                >
                  {(user?.name?.trim().charAt(0) || "U").toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-black text-[var(--text-main)]">
                    {user?.name || "Volunteer"}
                  </h2>

                  <ShieldCheck
                    className="h-5 w-5 text-[var(--text-muted)]"
                    aria-label="Participation not yet verified"
                  />
                </div>

                <p className="text-xs text-[var(--text-muted)] font-mono break-all">
                  USER REF: {user?.id || "Unavailable"}
                </p>

                <span className="inline-block rounded-md bg-[var(--surface-tint)] px-2 py-1 text-[10px] font-bold text-[var(--text-muted)] mt-1">
                  Participation record in development
                </span>
              </div>
            </div>

           
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-6 md:pt-0 md:pl-8 text-center w-full md:w-auto">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="min-w-0">
                    <Icon className="h-5 w-5 mx-auto mb-2 text-[var(--primary)]" />

                    <p className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                      {stat.value}
                    </p>

                    <p className="text-[9px] sm:text-[10px] font-bold uppercase text-[var(--text-muted)] mt-1">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="mt-5 text-center text-xs text-red-500">{error}</p>
          )}
        </section>


        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-[var(--primary)]" />

            <h3 className="text-base font-bold text-[var(--text-main)]">
              Community Achievements
            </h3>
          </div>

          <div className="rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface)] p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <HeartHandshake className="h-7 w-7" />
            </div>

            <h4 className="text-lg font-bold text-[var(--text-main)] mt-5">
              Your journey starts here
            </h4>

            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] max-w-md mx-auto mt-3">
              Your verified achievements will appear here when participation
              tracking and verification are implemented. Explore community
              events to discover opportunities to get involved.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[var(--primary-dark)] transition active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
