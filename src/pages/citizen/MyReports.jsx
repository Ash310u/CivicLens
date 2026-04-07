import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StatusChip from '@/components/common/StatusChip';
import EmptyState from '@/components/common/EmptyState';
import { MOCK_REPORTS, WASTE_CATEGORIES } from '@/data/mockData';
import { Filter, Search, ArrowRight, Camera, Clock, MapPin } from 'lucide-react';

const statusFilters = ['all', 'pending', 'in-progress', 'resolved', 'overdue', 'escalated'];

export default function MyReports() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const myReports = MOCK_REPORTS.filter(r => r.citizen_id === '1' || filter === 'all');
  const filtered = myReports.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">My Reports</h1>
          <p className="text-[var(--text-secondary)]">{MOCK_REPORTS.length} total reports</p>
        </div>
        <Link to="/citizen/report">
          <Button variant="primary" size="md" icon={Camera}>New Report</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-civic-500 focus:ring-2 focus:ring-civic-500/20 transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
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
        <EmptyState title="No reports found" description="Try adjusting your filters or create a new report." actionLabel="Report Waste" onAction={() => {}} />
      ) : (
        <div className="space-y-3">
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={`/citizen/reports/${report.id}`}>
                <Card className="p-4 sm:p-5 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 text-2xl">
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
                    <ArrowRight size={16} className="text-[var(--text-tertiary)] flex-shrink-0 mt-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
