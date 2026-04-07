import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import { BookOpen, Leaf } from 'lucide-react';

const bins = [
  { name: 'Wet Waste', color: 'bg-civic-500', emoji: '🟢', items: ['Food waste', 'Vegetable & fruit peels', 'Cooked food leftovers', 'Coconut shells', 'Flowers & garden waste', 'Soiled tissue', 'Hair & nails'], tip: 'Always drain excess liquid before placing in green bin.' },
  { name: 'Dry Waste', color: 'bg-ocean-500', emoji: '🔵', items: ['Clean paper & cardboard', 'Rinsed plastic bottles', 'Glass bottles', 'Metal cans', 'Aluminum foil', 'Clean plastic bags', 'Tetra packs (rinsed)'], tip: 'Rinse all containers before disposal. Remove labels when possible.' },
  { name: 'Hazardous Waste', color: 'bg-danger-500', emoji: '🔴', items: ['Batteries', 'Paint & chemicals', 'Pesticide containers', 'Fluorescent bulbs', 'Motor oil containers', 'Aerosol cans'], tip: 'NEVER mix with regular waste. Take to authorized collection points.' },
  { name: 'E-Waste', color: 'bg-ocean-600', emoji: '💻', items: ['Phones & laptops', 'Chargers & cables', 'Circuit boards', 'Printers & TVs', 'Small appliances'], tip: 'Take to authorized e-waste recyclers only. Never burn or dismantle.' },
  { name: 'Biomedical', color: 'bg-blush-500', emoji: '⚠️', items: ['Syringes & needles', 'Blood-contaminated items', 'Expired medicines', 'Diagnostic kits', 'Used bandages'], tip: 'Handle with extreme care. Contact biomedical waste handlers immediately.' },
  { name: 'Sanitary', color: 'bg-warm-500', emoji: '🟠', items: ['Diapers', 'Sanitary napkins', 'Soiled cotton', 'Used bandages'], tip: 'Wrap in newspaper, place in sealed bag. Not recyclable.' },
];

export default function SegregationGuide() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Waste Segregation Guide</h1>
            <p className="text-[var(--text-secondary)]">Learn how to sort your waste correctly</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bins.map((bin, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{bin.emoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">{bin.name}</h3>
                    <div className={`w-10 h-1 rounded-full ${bin.color} mt-1`} />
                  </div>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {bin.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className={`w-1.5 h-1.5 rounded-full ${bin.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] italic">
                  💡 {bin.tip}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
