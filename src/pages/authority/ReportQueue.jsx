import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import StatusChip from '@/components/common/StatusChip';
import Button from '@/components/common/Button';
import { MOCK_REPORTS, WASTE_CATEGORIES } from '@/data/mockData';
import { Search, Filter, Clock, MapPin, User, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function ReportQueue() {
  const [filter, setFilter] = useState('all');
  const reports = MOCK_REPORTS.filter(r => filter === 'all' || r.status === filter);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Report Queue</h1>
        <p className="text-[var(--text-secondary)]">{MOCK_REPORTS.filter(r => r.status !== 'resolved').length} unresolved reports</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'in-progress', 'overdue', 'escalated', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
            filter === s ? 'bg-civic-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          }`}>{s === 'all' ? `All (${MOCK_REPORTS.length})` : s.replace('-', ' ')}</button>
        ))}
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {['Report ID', 'Category', 'Severity', 'Status', 'Citizen', 'Ward', 'Filed', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-civic-600 dark:text-civic-400 font-semibold">{report.id}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span>{WASTE_CATEGORIES[report.category]?.icon}</span>
                      {WASTE_CATEGORIES[report.category]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${report.severity === 'CRITICAL' ? 'text-danger-500' : report.severity === 'HIGH' ? 'text-warm-500' : 'text-[var(--text-secondary)]'}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusChip status={report.status} size="sm" /></td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{report.citizen_name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{report.ward_id}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">{new Date(report.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="sm">Assign</Button>
                      {report.status !== 'resolved' && <Button variant="primary" size="sm">Resolve</Button>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
