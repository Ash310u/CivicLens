import React from "react";
import PageWrapper from '@/components/layout/PageWrapper';
import { TracingBeam } from "@/components/ui/tracing-beam";
import { HeroGlobe } from "@/components/landing/HeroGlobe";

const content = [
  {
    badge: "Step 1",
    title: "Citizen Reports Waste",
    description: (
      <>
        <p className="mb-2">
          It starts with a simple action. Whether you are using the mobile app or web dashboard, take a live photo of dumped waste or uncollected garbage in public spaces.
        </p>
        <p>
          The platform automatically attaches precise geo-coordinates and timestamps, passing the initial claim to the AI engine for validation.
        </p>
      </>
    )
  },
  {
    badge: "Step 2",
    title: "AI Validates & Classifies",
    description: (
      <>
        <p className="mb-2">
          The AI engine analyzes the visual evidence to extract the waste category (like plastic waste or e-waste). It enforces strict moderation, rejecting images lacking clear evidence of waste.
        </p>
        <p>
          If validated, the AI assigns a preliminary severity rating to assist with triaging.
        </p>
      </>
    )
  },
  {
    badge: "Step 3",
    title: "Real-Time Triaging",
    description: (
      <>
        <p className="mb-2">
          Based on the geo-tagged precinct, the report immediately notifies the assigned municipal ward authority. They review the AI's classification and dispatch local cleanup teams.
        </p>
        <p>
          Simultaneously, a 48-hour SLA timer begins to ensure the report does not linger unresolved.
        </p>
      </>
    )
  },
  {
    badge: "Step 4",
    title: "Auto-Escalation Protocol",
    description: (
      <>
        <p className="mb-2">
          If local authorities fail to mark a report resolved within 48 hours, the system auto-escalates it to the Zonal Officer.
        </p>
        <p>
          Beyond 96 hours without resolution, it reaches the Municipal Commissioner tier, tagging the persistent area as an official administrative hotspot.
        </p>
      </>
    )
  }
];

export default function HowItWorks() {
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
          <h1 className="text-4xl font-bold mb-4">How CivicLens Works</h1>
          <p className="text-lg text-[var(--text-secondary)]">From Report to Resolution</p>
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
