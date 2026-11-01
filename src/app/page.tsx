"use client";
import React, { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CauseExplorer } from "@/components/home/CauseExplorer";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CauseExplorer
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FeaturedEvents selectedCategory={selectedCategory} />
    </main>
  );
}
