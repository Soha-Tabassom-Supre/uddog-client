"use client";
import React from "react";
import { Trees, Shirt, Sparkles, BookOpen, HeartPulse } from "lucide-react";

const causes = [
  { id: "Plantation", title: "Tree Plantation", icon: Trees },
  { id: "Donation", title: "Winter Drive", icon: Shirt },
  { id: "Cleanup", title: "Neighborhood Cleanup", icon: Sparkles },
  { id: "Education", title: "Literacy", icon: BookOpen },
  { id: "Healthcare", title: "Health Camp", icon: HeartPulse },
];

export function CauseExplorer({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}) {
  return (
    <section className="py-12 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
            Find your <span className="text-[var(--primary)]">cause.</span>
          </h2>
          <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm text-center sm:text-right">
            Filter upcoming initiatives by category to find exactly where your
            help is needed.
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          {causes.map((cause) => {
            const Icon = cause.icon;
            const isSelected = selectedCategory === cause.id;
            return (
              <button
                key={cause.id}
                onClick={() => onSelectCategory(isSelected ? "All" : cause.id)}
                className={`group relative overflow-hidden flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-[var(--primary)] text-white shadow-[0_8px_20px_-6px_rgba(36,92,69,0.5)] -translate-y-1 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]"
                    : "bg-[var(--surface)] text-[var(--text-main)] shadow-sm border border-[var(--border-color)] hover:border-[var(--primary)]/50 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--primary)]"}`}
                />
                <span className="font-bold text-sm tracking-wide">
                  {cause.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
