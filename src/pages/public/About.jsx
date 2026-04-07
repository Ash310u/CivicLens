import React from "react";
import PageWrapper from '@/components/layout/PageWrapper';
import { TracingBeam } from "@/components/ui/tracing-beam";
import { HeroGlobe } from "@/components/landing/HeroGlobe";

const content = [
  {
    badge: "Our Mission",
    title: "Building Cleaner Cities Together",
    description: (
      <>
        <p className="mb-2">
          CivicLens is a crowdsourced smart waste reporting platform built to bridge the gap between citizen concerns and municipal action.
        </p>
        <p>
          By combining AI-driven image validation, verified status tracking, and strict accountability SLAs, we transform complaints into measurable, real-world impact.
        </p>
      </>
    )
  },
  {
    badge: "Transparency",
    title: "Radical Visibility",
    description: (
      <>
        <p className="mb-2">
          Every report filed on the platform enters a public log. Nothing gets hidden. Authorities must provide "after" photos to prove work is done.
        </p>
        <p>
          We believe transparency is the strongest catalyst for responsible civic administration.
        </p>
      </>
    )
  },
  {
    badge: "Scalability",
    title: "Enterprise Grade Systems",
    description: (
      <>
        <p>
          Designed for high-load municipal deployments, integrating secure Role-Based Access Control and geospatial analytics. Our robust backend handles real-time syncing and auto-escalation seamlessly. 
        </p>
      </>
    )
  }
];

export default function About() {
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
          <h1 className="text-4xl font-bold mb-4">About CivicLens</h1>
          <p className="text-lg text-[var(--text-secondary)]">Empowering citizens, enabling authorities.</p>
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
