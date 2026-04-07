import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import Card, { MetricCard } from '@/components/common/Card';
import StatusChip from '@/components/common/StatusChip';
import Button from '@/components/common/Button';
import { MOCK_REPORTS, MOCK_ANALYTICS, WASTE_CATEGORIES } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertTriangle, Clock, CheckCircle, MapPin, Users, ArrowRight, Zap, TrendingUp, ClipboardList, Shield } from 'lucide-react';

const urgentReports = MOCK_REPORTS.filter(r => ['overdue', 'escalated', 'pending'].includes(r.status) && ['HIGH', 'CRITICAL'].includes(r.severity));

export default function AuthorityDashboard() {
  const unresolvedCount = MOCK_REPORTS.filter(r => r.status !== 'resolved').length;

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Authority Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Ward 14 · Solid Waste Management</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Unresolved Cases" value={unresolvedCount} icon={AlertTriangle} color="danger" />
        <MetricCard label="Avg Resolution" value="18.5h" icon={Clock} color="warm" change="-2.1h" changeType="positive" />
        <MetricCard label="Resolved This Week" value="45" icon={CheckCircle} color="civic" change="+12" />
        <MetricCard label="Active Workers" value="8" icon={Users} color="ocean" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Trend */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Weekly Report Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS.weeklyTrend}>
                <defs>
                  <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="reports" stroke="#3b82f6" fill="url(#reportGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#resolvedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Waste Categories</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_ANALYTICS.categoryDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                  {MOCK_ANALYTICS.categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {MOCK_ANALYTICS.categoryDistribution.slice(0, 6).map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                {cat.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* High Priority Queue */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">High Priority Reports</h3>
            <Link to="/authority/queue"><Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button></Link>
          </div>
          <div className="space-y-3">
            {urgentReports.slice(0, 4).map((report, i) => (
              <div key={report.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                <span className="text-lg">{WASTE_CATEGORIES[report.category]?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">{report.id}</span>
                    <StatusChip status={report.status} size="sm" />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{report.description}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-danger-500/10 text-danger-500 font-semibold">{report.severity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Wards */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Ward Performance</h3>
          <div className="space-y-3">
            {MOCK_ANALYTICS.topWards.map((ward, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-primary)]">{ward.ward}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{ward.rate}% resolved</span>
                </div>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ward.rate}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${ward.rate > 88 ? 'bg-civic-500' : ward.rate > 84 ? 'bg-ocean-500' : 'bg-warning-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
