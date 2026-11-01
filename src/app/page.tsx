"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CauseExplorer } from "@/components/home/CauseExplorer";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CommunityVoices } from "@/components/home/CommunityVoices";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <HeroSection />
      <CauseExplorer
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => setSelectedCategory(category)}
      />
      <FeaturedEvents
        selectedCategory={selectedCategory}
        onClearCategory={() => setSelectedCategory("All")}
      />
      <HowItWorks />
      <CommunityVoices />
    </main>
  );
}
