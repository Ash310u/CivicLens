import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Camera, Zap, TrendingUp, CheckCircle, Star, Users, Shield, Building2, Globe } from "lucide-react";
import WorldMap from "@/components/ui/world-map";

export function TimelineSection() {
  const data = [
    {
      title: "The Problem",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Cities Struggle with Waste Accountability
          </h3>
          <p className="mb-8 text-neutral-800 md:text-lg dark:text-neutral-200 leading-relaxed">
            Overflowing bins, illegal dumping, slow municipal response — citizens report, nothing happens. CivicLens changes that with AI-driven verification and transparent tracking.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-105">
              <span className="text-4xl font-extrabold text-danger-500 mb-2">62%</span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">of waste complaints go unresolved</span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-105">
              <span className="text-4xl font-extrabold text-warning-500 mb-2">3.5d</span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">average wait for cleanup response</span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-105">
              <span className="text-4xl font-extrabold text-neutral-500 dark:text-neutral-300 mb-2">0%</span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">of citizens can track complaint status</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Features",
      content: (
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--text-primary)]">
            Everything You Need for Civic Accountability
          </h3>
          <p className="mb-8 text-neutral-800 md:text-lg dark:text-neutral-200 leading-relaxed">
            A comprehensive platform that bridges the gap between citizen reporting and municipal action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: "Smart Reporting", desc: "Snap a photo, tag the location, and your report is filed instantly with AI validation." },
              { title: "AI Classification", desc: "Gemini-powered image analysis classifies waste into 9 categories automatically." },
              { title: "Verified Accountability", desc: "Before and after photos ensure transparent resolution tracking." },
              { title: "Live Heatmap", desc: "See your city's cleanliness in real-time. Red for dirty, green for clean." },
              { title: "Cleanup Campaigns", desc: "Join community drives, earn impact points, and climb the leaderboard." },
              { title: "Disposal Locator", desc: "Find the nearest e-waste bin, composting site, or recycling center." },
              { title: "Ward Analytics", desc: "Deep insights into complaint patterns, resolution rates, and hotspots." },
              { title: "Impact Score", desc: "Earn points for every report, campaign, and verified cleanup contribution." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-civic-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[var(--text-primary)]">{feature.title}: </strong>
                  <span className="text-[var(--text-secondary)]">{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-hidden">
        {/* Ambient Blur Effects blending with hero */}
        <div className="absolute inset-x-0 -top-40 h-[100vh] overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-civic-500/15 rounded-full blur-[120px]" />
        </div>
        
        {/* World Map Background (Sticky) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="sticky top-[20vh] w-full flex justify-center opacity-60 dark:opacity-40">
            <WorldMap
              dots={[
                { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 12.9716, lng: 77.5946 } }, // Delhi to Bangalore
                { start: { lat: 19.0760, lng: 72.8777 }, end: { lat: 28.6139, lng: 77.209 } }, // Mumbai to Delhi
                { start: { lat: 13.0827, lng: 80.2707 }, end: { lat: 12.9716, lng: 77.5946 } }, // Chennai to Bangalore
                { start: { lat: 22.5726, lng: 88.3639 }, end: { lat: 28.6139, lng: 77.209 } }, // Kolkata to Delhi
                { start: { lat: 17.3850, lng: 78.4867 }, end: { lat: 19.0760, lng: 72.8777 } }, // Hyderabad to Mumbai
              ]}
              lineColor="var(--color-civic-500)"
            />
          </div>
        </div>

      <div className="relative z-10 w-full overflow-clip">
        <Timeline data={data} />
      </div>
    </div>
  );
}
