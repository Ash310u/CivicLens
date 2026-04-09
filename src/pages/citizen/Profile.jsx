import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card, { MetricCard } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { MOCK_LEADERBOARD } from '@/data/mockData';
import { Trophy, Award, Target, TrendingUp, Star, Medal, Camera, Megaphone, CheckCircle, Edit } from 'lucide-react';

const badges = [
  { name: 'Welcome', desc: 'Filed your first report', icon: '🎉', earned: true },
  { name: 'Active Reporter', desc: '10+ reports filed', icon: '📝', earned: true },
  { name: 'Campaign Hero', desc: 'Joined 5+ campaigns', icon: '🦸', earned: false },
  { name: 'Green Champion', desc: 'Top 3 in ward leaderboard', icon: '🏆', earned: false },
  { name: 'Segregation Pro', desc: 'Completed training', icon: '♻️', earned: true },
  { name: 'Civic Star', desc: '2000+ impact points', icon: '⭐', earned: false },
];

export default function Profile() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-civic-500/10 via-teal-500/5 to-ocean-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user?.name || 'Citizen'}</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {user?.email}
                {user?.address ? ` · ${user.address}` : ''}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-civic-500/10 text-civic-600 dark:text-civic-400">🏆 Active Reporter</span>
                <span className="text-xs text-[var(--text-tertiary)]">#4 in Ward 14 Leaderboard</span>
              </div>
            </div>
            <Button variant="outline" size="sm" icon={Edit}>Edit Profile</Button>
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Impact Score" value="1,250" icon={Trophy} color="civic" change="+125" />
          <MetricCard label="Reports Filed" value="22" icon={Camera} color="ocean" />
          <MetricCard label="Campaigns Joined" value="4" icon={Megaphone} color="warm" />
          <MetricCard label="Reports Resolved" value="18" icon={CheckCircle} color="teal" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Badges */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Badges & Achievements</h2>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-xl border transition-colors ${badge.earned ? 'bg-[var(--bg-secondary)] border-civic-500/20' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] opacity-50'}`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{badge.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ward 14 Leaderboard</h2>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((entry, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${entry.name === user?.name ? 'bg-civic-500/10 border border-civic-500/20' : 'bg-[var(--bg-secondary)]'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-warning-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-warm-400 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                  }`}>
                    {entry.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{entry.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{entry.ward} · {entry.reports} reports</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-civic-600 dark:text-civic-400">{entry.impact_score.toLocaleString()}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
