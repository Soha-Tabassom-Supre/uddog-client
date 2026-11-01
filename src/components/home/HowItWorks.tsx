
"use client";

import React from "react";
import { Compass, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Discover Opportunities",
    bengali: "উদ্যোগ খুঁজুন",
    description:
      "Explore community events and initiatives. Find opportunities by cause, location, and date.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Join an Event",
    bengali: "অংশগ্রহণ করুন",
    description:
      "Find an event that matches your interests and register to participate in your chosen community initiative.",
    icon: Users,
  },
  {
    step: "03",
    title: "Make an Impact",
    bengali: "ইতিবাচক পরিবর্তন আনুন",
    description:
      "Take part in community initiatives, connect with fellow volunteers, and contribute to positive social change.",
    icon: Award,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border-color)] bg-[var(--surface-tint)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
            How It Works
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            How Uddog brings communities together
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Discover community initiatives, connect with volunteers, and take
            meaningful steps toward positive social change.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] p-8 shadow-xs transition hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[var(--primary)]/40 font-mono">
                      {item.step}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-main)]">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-[var(--accent)] mt-0.5">
                    {item.bengali}
                  </p>

                  <p className="text-xs leading-relaxed text-[var(--text-muted)] mt-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[11px] font-bold text-[var(--primary)] flex items-center gap-1">
                  <span>Community Driven</span>
                </div>
              </div>
            );
          })}
        </div>

      
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[var(--primary-dark)] transition active:scale-95"
          >
            <span>Register as a Volunteer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

