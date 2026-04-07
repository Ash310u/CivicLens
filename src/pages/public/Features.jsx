import React from "react";
import PageWrapper from '@/components/layout/PageWrapper';
import { TracingBeam } from "@/components/ui/tracing-beam";
import { HeroGlobe } from "@/components/landing/HeroGlobe";

const content = [
  {
    badge: "Reporting",
    title: "Smart Waste Reporting",
    description: (
      <>
        <p className="mb-2">
          Capture waste with your camera anywhere in the city. Our system auto-tags your GPS location and routes the complaint to the exact responsible ward officer — filing a verified report in less than 30 seconds.
        </p>
        <p>
          Each report is securely logged, creating an immutable civic record that administrators use for accountability and resource planning.
        </p>
      </>
    )
  },
  {
    badge: "AI Validated",
    title: "AI Image Verification",
    description: (
      <>
        <p className="mb-2">
          Powered by Gemini 1.5 Flash, every uploaded image is instantly analyzed to detect and classify waste. 
        </p>
        <p>
          The system categorizes issues across 9 parameters (from Construction Debris to Medical Waste), filters out false reports, and assesses the severity level from LOW to CRITICAL.
        </p>
      </>
    )
  },
  {
    badge: "Transparency",
    title: "Before & After Verification",
    description: (
      <>
        <p className="mb-2">
          Authorities are required to upload visual proof of resolution. Citizens receive both the original report image and the final cleanup confirmation.
        </p>
        <p>
          This closes the feedback loop and provides transparent proof of municipal action, establishing public trust.
        </p>
      </>
    )
  },
  {
    badge: "Analytics",
    title: "Ward-Level Analytics",
    description: (
      <>
        <p>
          A comprehensive dashboard tracking complaint volumes, resolution SLAs, and systemic metrics. Authorities can monitor average completion time and detect persistent hotspots automatically.
        </p>
      </>
    )
  }
];

export default function Features() {
  return (
    <PageWrapper>
      <div className="relative min-h-screen">
        {/* Globe Background */}
        <div className="fixed inset-0 z-0 flex justify-end items-center pointer-events-none opacity-30 dark:opacity-20 translate-x-1/4">
          <HeroGlobe />
        </div>

        {/* Ambient Blur Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-civic-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[24rem] h-[24rem] bg-teal-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[20rem] h-[20rem] bg-ocean-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 py-20 text-[var(--text-primary)]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
          <p className="text-lg text-[var(--text-secondary)]">Everything You Need for Civic Accountability</p>
        </div>
        <TracingBeam className="px-6">
          <div className="max-w-2xl mx-auto antialiased pt-4 relative">
            {content.map((item, index) => (
              <div key={`content-${index}`} className="mb-10">
                <h2 className="bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-semibold w-fit px-4 py-1.5 mb-4">
                  {item.badge}
                </h2>
                <p className="text-2xl font-bold mb-4">
                  {item.title}
                </p>
                <div className="text-base text-[var(--text-secondary)] leading-relaxed prose prose-sm dark:prose-invert">
                  {item?.image && (
                    <img
                      src={item.image}
                      alt="thumbnail"
                      height="1000"
                      width="1000"
                      className="rounded-lg mb-10 object-cover"
                    />
                  )}
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
        </div>
      </div>
    </PageWrapper>
  );
}
