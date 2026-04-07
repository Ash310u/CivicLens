import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import TerminalLoader from '@/components/landing/TerminalLoader';
import AnimatedCounter from '@/components/landing/AnimatedCounter';
import {
  Camera, Shield, MapPin, BarChart3, Users, Recycle, Bot, Megaphone,
  ArrowRight, CheckCircle, Zap, Globe, Award, TrendingUp,
  Building2, Truck, BookOpen, ChevronRight, Star, Leaf
} from 'lucide-react';
import { HeroGlobe } from '@/components/landing/HeroGlobe';
import { TimelineSection } from '@/components/landing/TimelineSection';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function SectionHeading({ tag, title, description }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto mb-12"
    >
      {tag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-civic-500/10 text-civic-600 dark:text-civic-400 mb-4">
          <Leaf size={12} /> {tag}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{title}</h2>
      {description && <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{description}</p>}
    </motion.div>
  );
}

const features = [
  { icon: Camera, title: 'Smart Reporting', desc: 'Snap a photo, tag the location, and your report is filed instantly with AI validation.', color: 'from-civic-500 to-teal-500' },
  { icon: Bot, title: 'AI Classification', desc: 'Gemini-powered image analysis classifies waste into 9 categories automatically.', color: 'from-ocean-500 to-civic-500' },
  { icon: Shield, title: 'Verified Accountability', desc: 'Before and after photos ensure transparent resolution tracking.', color: 'from-teal-500 to-ocean-500' },
  { icon: MapPin, title: 'Live Heatmap', desc: 'See your city\'s cleanliness in real-time. Red for dirty, green for clean.', color: 'from-danger-500 to-warm-500' },
  { icon: Megaphone, title: 'Cleanup Campaigns', desc: 'Join community drives, earn impact points, and climb the leaderboard.', color: 'from-warm-500 to-blush-500' },
  { icon: Recycle, title: 'Disposal Locator', desc: 'Find the nearest e-waste bin, composting site, or recycling center.', color: 'from-civic-500 to-civic-600' },
  { icon: BarChart3, title: 'Ward Analytics', desc: 'Deep insights into complaint patterns, resolution rates, and hotspots.', color: 'from-ocean-500 to-ocean-600' },
  { icon: Award, title: 'Impact Score', desc: 'Earn points for every report, campaign, and verified cleanup contribution.', color: 'from-blush-500 to-warm-500' },
];

const howItWorks = [
  { step: '01', title: 'Report', desc: 'Take a photo of waste and submit with location', icon: Camera },
  { step: '02', title: 'Validate', desc: 'AI analyzes the image and classifies waste type', icon: Zap },
  { step: '03', title: 'Route', desc: 'Report sent to the right authority and department', icon: TrendingUp },
  { step: '04', title: 'Resolve', desc: 'Cleanup team dispatched, verified with after photo', icon: CheckCircle },
];

const stakeholders = [
  { icon: Users, title: 'Citizens', desc: 'Report waste, join campaigns, track cleanup progress.', color: 'civic' },
  { icon: Shield, title: 'Municipal Authorities', desc: 'Manage reports, assign workers, track SLA performance.', color: 'ocean' },
  { icon: Building2, title: 'Organizations', desc: 'Bulk waste compliance, segregation tracking, pickup scheduling.', color: 'teal' },
  { icon: Globe, title: 'NGOs & Government', desc: 'Run cleanup campaigns, publish guides, monitor impact.', color: 'warm' },
];

const stats = [
  { value: 12847, suffix: '+', label: 'Reports Filed' },
  { value: 79, suffix: '%', label: 'Resolution Rate' },
  { value: 8432, suffix: '+', label: 'Active Citizens' },
  { value: 24, suffix: '', label: 'Active Campaigns' },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <PageWrapper>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Globe Background */}
        <div className="absolute inset-0 z-0 flex justify-end items-center pointer-events-auto opacity-80 dark:opacity-40 translate-x-1/4 overflow-hidden">
          <HeroGlobe />
        </div>

        {/* Ambient Blur Effects */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-civic-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-ocean-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full pointer-events-none">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pointer-events-auto">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-[1.1] mb-6">
                Smart Waste Reporting for{' '}
                <span className="text-gradient">Cleaner Cities</span>
              </h1>

              <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-lg">
                Report waste in seconds. AI validates and classifies it. Authorities are notified instantly. 
                Track resolution on a live heatmap. Turn citizen complaints into transparent civic action.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/citizen/report">
                  <Button variant="primary" size="lg" icon={Camera} iconRight={ArrowRight}>
                    Report Waste
                  </Button>
                </Link>
                <Link to="/citizen">
                  <Button variant="outline" size="lg" icon={BarChart3}>
                    Explore Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['P', 'A', 'M', 'R', 'S'].map((letter, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-civic-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold border-2 border-[var(--bg-primary)]">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-warning-400 text-warning-400" />)}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">Trusted by 8,000+ citizens</p>
                </div>
              </div>
            </motion.div>

            {/* Terminal Loader */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <TerminalLoader />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <TimelineSection />
      {/* ===== BOTTOM CTA ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Ready to Make Your City Cleaner?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Join thousands of citizens already making a difference. Report waste, track progress, and hold authorities accountable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button variant="primary" size="xl" icon={Leaf} iconRight={ArrowRight}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
