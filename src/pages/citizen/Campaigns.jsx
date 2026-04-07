import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import StatusChip from '@/components/common/StatusChip';
import Button from '@/components/common/Button';
import { MOCK_CAMPAIGNS } from '@/data/mockData';
import { Megaphone, Calendar, MapPin, Users, Filter, Clock, CheckCircle } from 'lucide-react';

export default function Campaigns() {
  const [filter, setFilter] = useState('all');
  const filtered = MOCK_CAMPAIGNS.filter(c => filter === 'all' || c.status === filter);

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Cleanup Campaigns</h1>
            <p className="text-[var(--text-secondary)]">Join community drives and earn impact points</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'active', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-civic-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}>{s}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((campaign, i) => (
            <motion.div key={campaign.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warm-400 to-blush-500 flex items-center justify-center flex-shrink-0">
                    <Megaphone size={20} className="text-white" />
                  </div>
                  <StatusChip status={campaign.status === 'active' ? 'active' : 'closed'} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{campaign.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">{campaign.description}</p>
                <div className="space-y-2 text-xs text-[var(--text-tertiary)] mb-4">
                  <div className="flex items-center gap-2"><Calendar size={13} />{new Date(campaign.event_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
                  <div className="flex items-center gap-2"><MapPin size={13} />{campaign.location}</div>
                  <div className="flex items-center gap-2"><Users size={13} />{campaign.current_participants}/{campaign.max_participants} participants</div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-1">
                    <span>Spots filled</span>
                    <span>{Math.round((campaign.current_participants / campaign.max_participants) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-civic-500 to-teal-500 rounded-full transition-all" style={{ width: `${(campaign.current_participants / campaign.max_participants) * 100}%` }} />
                  </div>
                </div>
                <Button variant={campaign.status === 'active' ? 'primary' : 'ghost'} size="md" className="w-full" disabled={campaign.status !== 'active'}>
                  {campaign.status === 'active' ? 'Join Campaign' : 'Campaign Ended'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
