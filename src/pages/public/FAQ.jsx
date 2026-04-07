import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { ChevronDown, Leaf } from 'lucide-react';

const faqs = [
  { category: 'General', items: [
    { q: 'What is CivicLens?', a: 'CivicLens is a smart waste reporting and civic accountability platform. It helps citizens report waste with photos and GPS, uses AI to validate and classify reports, and routes them to the right municipal authority for resolution — all visible on a public heatmap.' },
    { q: 'Is CivicLens free to use?', a: 'Yes! CivicLens is completely free for citizens. Organizations may have premium features for bulk waste compliance tracking.' },
    { q: 'Which cities is CivicLens available in?', a: 'We are currently live in Bangalore with plans to expand to other Indian cities. Contact us if you\'d like CivicLens in your city.' },
  ]},
  { category: 'Reporting', items: [
    { q: 'How do I report waste?', a: 'Open the app, tap "Report Waste", take a photo of the waste, and submit. Your GPS location is auto-tagged. AI will validate the image and classify the waste type automatically.' },
    { q: 'What if my report is rejected?', a: 'If the AI detects no waste in the image, the report will be rejected. Simply retake the photo with the waste clearly visible in good lighting and try again.' },
    { q: 'Can I report anonymously?', a: 'You need a registered account to file reports, but your personal information is not publicly visible. Only the report content and location are shown on the heatmap.' },
  ]},
  { category: 'Resolution', items: [
    { q: 'How long does resolution take?', a: 'Municipal authorities are expected to resolve reports within 48 hours. If not, reports are automatically escalated to higher authorities. Critical reports (biomedical, hazardous) are fast-tracked.' },
    { q: 'How do I know my report was resolved?', a: 'You\'ll receive a push notification with before and after photos when your report is marked resolved. You can also check the status on your dashboard or the heatmap.' },
  ]},
  { category: 'Impact Score', items: [
    { q: 'How is my impact score calculated?', a: 'Your score is based on: reports filed (+50 first, +25 subsequent), campaigns joined (+100 each), reports verified as resolved (+25), and segregation training completed (+50).' },
    { q: 'What is a Green Champion?', a: 'Citizens who reach the top of their ward leaderboard or maintain a consistently high impact score can be designated Green Champions — with extended dashboard access and community recognition.' },
  ]},
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-[var(--text-primary)] pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[var(--text-tertiary)] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-civic-500/10 text-civic-600 dark:text-civic-400 mb-4"><Leaf size={12} /> FAQ</span>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-[var(--text-secondary)]">Everything you need to know about CivicLens</p>
        </div>
        {faqs.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{section.category}</h2>
            <div className="glass-card rounded-xl px-5">
              {section.items.map((item, j) => <FAQItem key={j} {...item} />)}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
