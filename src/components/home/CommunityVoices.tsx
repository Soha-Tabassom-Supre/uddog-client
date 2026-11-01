"use client";

import React from "react";
import { Compass, Users, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "Find Local Opportunities",
    description:
      "Explore community events and discover opportunities that match your interests, preferred causes, and location.",
    icon: Compass,
  },
  {
    title: "Connect Through Action",
    description:
      "Discover initiatives where people can come together to support their communities and work toward shared goals.",
    icon: Users,
  },
  {
    title: "Make Every Effort Count",
    description:
      "Take meaningful steps toward positive social change by participating in community-driven initiatives.",
    icon: HeartHandshake,
  },
];

export function CommunityVoices() {
  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
            Why Uddog?
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-main)] mt-4">
            Small actions can bring us together
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
            Discover opportunities, connect with your community, and find
            meaningful ways to contribute to social development.
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="flex flex-col rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-[var(--text-main)] mt-5">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] mt-3 flex-1">
                  {item.description}
                </p>

                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 mt-5 text-xs font-bold text-[var(--primary)] hover:gap-3 transition-all"
                >
                  Explore events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
