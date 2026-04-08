import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { MOCK_REPORTS, WASTE_CATEGORIES } from '@/data/mockData';
import { Search, ArrowRight, Camera, Clock } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const statusFilters = ['all', 'pending', 'in-progress', 'resolved', 'overdue', 'escalated'];

export default function MyReports({ embedded = false }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const myReports = MOCK_REPORTS.filter(r => r.citizen_id === '1' || filter === 'all');
  const filtered = myReports.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inner = (
    <>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 ${embedded ? 'mb-3' : 'mb-6'}`}>
        <div>
          <h1 className={`font-bold text-[var(--text-primary)] ${embedded ? 'text-lg sm:text-xl mb-0' : 'text-2xl mb-1'}`}>
            My Reports
          </h1>
          <p className={`text-[var(--text-secondary)] ${embedded ? 'text-xs sm:text-sm' : ''}`}>
            {MOCK_REPORTS.length} total reports
          </p>
        </div>
        {!embedded && (
          <Link to={ROUTES.citizen.report}>
            <Button variant="primary" size="md" icon={Camera}>New Report</Button>
          </Link>
        )}
      </div>

      {/* Filters — embedded: always stack so search + focus ring never collide with chips in narrow column */}
      <div
        className={`flex gap-3 ${embedded ? 'mb-3 flex-col' : 'mb-6 flex-col md:flex-row md:items-start md:gap-4'}`}
      >
        <div className={`relative w-full min-w-0 ${embedded ? '' : 'md:flex-1 md:max-w-md'}`}>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--text-tertiary)]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`box-border w-full pl-9 pr-3 sm:pr-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors focus-visible:border-civic-500 focus-visible:ring-2 focus-visible:ring-civic-500/25 focus-visible:ring-inset ${embedded ? 'py-2 text-xs sm:text-sm' : 'py-2.5 text-sm'}`}
          />
        </div>
        <div className="flex w-full min-w-0 flex-wrap gap-1.5 sm:gap-2 md:flex-1 md:justify-start">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg font-medium capitalize transition-colors flex-shrink-0 ${
                embedded ? 'px-2 py-1 text-[10px] sm:text-xs' : 'px-3 py-1.5 text-xs'
              } ${
                filter === s
                  ? 'bg-civic-500 text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Report List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No reports found"
          description="Try adjusting your filters or create a new report."
          actionLabel="Report Waste"
          onAction={() => {
            document.getElementById('report-waste')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      ) : (
        <div className={`space-y-2 sm:space-y-3 ${embedded ? 'max-h-[min(55vh,520px)] overflow-y-auto pr-1 -mr-1 scrollbar-thin' : ''}`}>
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={ROUTES.citizen.reportDetails(report.id)}>
                <Card className={`cursor-pointer ${embedded ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}>
                  <div className={`flex items-start ${embedded ? 'gap-3' : 'gap-4'}`}>
                    <div className={`rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 ${embedded ? 'w-11 h-11 text-lg sm:w-14 sm:h-14 sm:text-xl' : 'w-16 h-16 text-2xl'}`}>
                      {WASTE_CATEGORIES[report.category]?.icon || '🗑️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-[var(--text-tertiary)]">{report.id}</span>
                        <StatusChip status={report.status} size="sm" />
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] capitalize">
                          {report.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 mb-1">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          {WASTE_CATEGORIES[report.category]?.label || report.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={embedded ? 14 : 16} className="text-[var(--text-tertiary)] flex-shrink-0 mt-2 sm:mt-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  return embedded ? inner : <PageWrapper>{inner}</PageWrapper>;
}
