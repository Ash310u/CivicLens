import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import { MOCK_FACILITIES, WASTE_CATEGORIES } from '@/data/mockData';
import { MapPin, Clock, Search, Recycle, Navigation } from 'lucide-react';
import { useState } from 'react';

const typeLabels = { garbage_center: '🗑️ Collection Center', ewaste_bin: '💻 E-Waste Drop-off', composting_site: '🌱 Composting Site', recycling_center: '♻️ Recycling Center', biomedical_handler: '⚠️ Biomedical Handler', scrap_shop: '📦 Scrap Dealer', drug_return_kiosk: '💊 Drug Return' };

export default function DisposalLocator() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const filtered = MOCK_FACILITIES.filter(f => {
    if (typeFilter !== 'all' && f.type !== typeFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Disposal Locator</h1>
          <p className="text-[var(--text-secondary)]">Find nearest waste collection and recycling facilities</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input type="text" placeholder="Search facilities..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-civic-500 focus:ring-2 focus:ring-civic-500/20 transition-all" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-civic-500 cursor-pointer appearance-none">
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {/* Map placeholder */}
        <Card className="p-4 mb-6 overflow-hidden">
          <div className="h-56 rounded-xl bg-gradient-to-br from-civic-500/5 to-teal-500/5 dark:from-navy-700 dark:to-charcoal-700 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-civic-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)] font-medium">Interactive Map</p>
              <p className="text-xs text-[var(--text-tertiary)]">Facility locations displayed on Leaflet map in full deployment</p>
            </div>
          </div>
        </Card>

        {/* Facility Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((facility, i) => (
            <motion.div key={facility.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 h-full">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{typeLabels[facility.type]?.split(' ')[0]}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{facility.name}</h3>
                    <p className="text-xs text-[var(--text-tertiary)]">{typeLabels[facility.type]?.split(' ').slice(1).join(' ')}</p>
                  </div>
                  <span className="text-xs font-semibold text-civic-600 dark:text-civic-400 bg-civic-500/10 px-2 py-1 rounded-lg">
                    {facility.distance} km
                  </span>
                </div>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2"><MapPin size={12} />{facility.address}</div>
                  <div className="flex items-center gap-2"><Clock size={12} />{facility.hours}</div>
                  <div className="flex items-center gap-2"><Recycle size={12} />
                    {facility.accepted_waste.map(w => WASTE_CATEGORIES[w]?.label || w).join(', ')}
                  </div>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-civic-500 hover:text-civic-600 transition-colors">
                  <Navigation size={12} /> Get Directions
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
