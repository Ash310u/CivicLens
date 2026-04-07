import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card, { MetricCard } from '@/components/common/Card';
import { MOCK_ANALYTICS } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, FileWarning, BarChart3, Clock, Shield, Activity, TrendingUp, Megaphone, Gauge, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Admin Dashboard</h1>
        <p className="text-[var(--text-secondary)]">System-wide overview · All cities</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Users" value="8,432" icon={Users} color="ocean" change="+342" />
        <MetricCard label="Report Volume" value="12.8K" icon={FileWarning} color="civic" change="+18%" />
        <MetricCard label="False Report Rate" value="3.2%" icon={Shield} color="danger" change="-0.5%" changeType="positive" />
        <MetricCard label="Avg Resolution Time" value="18.5h" icon={Clock} color="warm" change="-2.1h" changeType="positive" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Campaigns" value="24" icon={Megaphone} color="blush" />
        <MetricCard label="System Health" value="99.8%" icon={Activity} color="teal" />
        <MetricCard label="Escalation Rate" value="12%" icon={AlertTriangle} color="warm" change="-3%" changeType="positive" />
        <MetricCard label="Resolution Rate" value="79.5%" icon={TrendingUp} color="civic" change="+4.2%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Reports vs Resolved (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS.weeklyTrend}>
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Category Distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_ANALYTICS.categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {MOCK_ANALYTICS.categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {MOCK_ANALYTICS.categoryDistribution.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />{cat.name}: {cat.value.toLocaleString()}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Wards Table */}
      <Card className="p-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Top Performing Wards</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {['Ward', 'Total Reports', 'Resolved', 'Resolution Rate'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ANALYTICS.topWards.map((ward, i) => (
                <tr key={i} className="border-b border-[var(--border-subtle)]">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{ward.ward}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{ward.reports.toLocaleString()}</td>
                  <td className="px-4 py-3 text-civic-600 dark:text-civic-400 font-medium">{ward.resolved.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div className="h-full bg-civic-500 rounded-full" style={{ width: `${ward.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{ward.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
