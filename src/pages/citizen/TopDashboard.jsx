import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import PageWrapper from '@/components/layout/PageWrapper';
import ReportWaste from '@/pages/citizen/ReportWaste';
import MyReports from '@/pages/citizen/MyReports';
import { Trophy, TrendingUp } from 'lucide-react';

function scrollToHash() {
  const id = window.location.hash.replace(/^#/, '');
  if (!id) return;
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export default function TopDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const impactScore = user?.impact_score ?? 1250;

  useEffect(() => {
    scrollToHash();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <PageWrapper className="min-h-0">
      <div className="mb-4 sm:mb-5">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Impact, report, and track — all in one place
          </p>
        </motion.div>
      </div>

      {/* Impact score — full width, compact */}
      <motion.section
        id="impact"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 bg-gradient-to-r from-civic-500/10 via-teal-500/5 to-ocean-500/10 dark:from-civic-500/5 dark:via-teal-500/3 dark:to-ocean-500/5 border border-[var(--border-subtle)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center shadow-glow-green flex-shrink-0">
              <Trophy size={22} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase tracking-wide font-semibold">
                Impact score
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
                {Number(impactScore).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp size={12} className="text-success-500 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-success-600 dark:text-success-400 font-medium">
                  +125 this month
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-civic-500/10 text-civic-600 dark:text-civic-400 border border-civic-500/20">
              Active reporter
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--text-tertiary)]">#4 in Ward 14</span>
          </div>
        </div>
      </motion.section>

      {/* Main: left = report flow, right = my reports (stacked on mobile) */}
      <div className="flex flex-col xl:grid xl:grid-cols-12 xl:gap-6 xl:items-start">
        <div className="xl:col-span-7 space-y-0 min-w-0">
          <motion.section
            id="report-waste"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 p-3 sm:p-4 lg:p-5 scroll-mt-20"
          >
            <ReportWaste embedded />
          </motion.section>
        </div>

        <aside className="xl:col-span-5 mt-5 xl:mt-0 min-w-0 xl:sticky xl:top-20 xl:self-start">
          <motion.section
            id="my-reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 p-3 sm:p-4 lg:p-5 scroll-mt-20 max-h-[none] xl:max-h-[calc(100vh-6rem)] xl:flex xl:flex-col"
          >
            <div className="xl:min-h-0 xl:flex-1 xl:overflow-hidden flex flex-col">
              <MyReports embedded />
            </div>
          </motion.section>
        </aside>
      </div>
    </PageWrapper>
  );
}
