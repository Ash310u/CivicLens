import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import PageWrapper from '@/components/layout/PageWrapper';
import Card, { MetricCard } from '@/components/common/Card';
import StatusChip from '@/components/common/StatusChip';
import Button from '@/components/common/Button';
import { MOCK_REPORTS, MOCK_CAMPAIGNS } from '@/data/mockData';
import {
  Camera, ClipboardList, MapPin, Megaphone, Trophy, Bell,
  TrendingUp, ArrowRight, Recycle, Truck, Bot, Leaf
} from 'lucide-react';

const quickActions = [
  { label: 'Report Waste', icon: Camera, href: '/citizen/report', color: 'from-civic-500 to-teal-500' },
  { label: 'Find Facility', icon: Recycle, href: '/citizen/disposal', color: 'from-ocean-500 to-civic-500' },
  { label: 'Join Campaign', icon: Megaphone, href: '/campaigns', color: 'from-warm-500 to-blush-500' },
  { label: 'Bulk Pickup', icon: Truck, href: '/citizen/bulk-pickup', color: 'from-teal-500 to-ocean-500' },
  { label: 'AI Assistant', icon: Bot, href: '/citizen/assistant', color: 'from-ocean-500 to-ocean-600' },
  { label: 'My Impact', icon: Trophy, href: '/citizen/profile', color: 'from-blush-500 to-warm-500' },
];

const notifications = [
  { id: 1, text: 'Report #CLR-2024-002 is now in progress', time: '2 hours ago', type: 'info' },
  { id: 2, text: 'Your report #CLR-2024-006 has been resolved!', time: '1 day ago', type: 'success' },
  { id: 3, text: 'New cleanup campaign near your area', time: '2 days ago', type: 'info' },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const myReports = MOCK_REPORTS.filter(r => r.citizen_id === '1');
  const pendingReports = myReports.filter(r => ['pending', 'in-progress'].includes(r.status));
  const resolvedReports = myReports.filter(r => r.status === 'resolved');

  return (
    <PageWrapper>
      {/* Welcome */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Citizen'} 👋
          </h1>
          <p className="text-[var(--text-secondary)]">Here's your civic impact overview</p>
        </motion.div>
      </div>

      {/* Impact Score Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8 bg-gradient-to-r from-civic-500/10 via-teal-500/5 to-ocean-500/10 dark:from-civic-500/5 dark:via-teal-500/3 dark:to-ocean-500/5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-civic-500 to-teal-500 flex items-center justify-center shadow-glow-green">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Your Impact Score</p>
              <p className="text-3xl font-extrabold text-[var(--text-primary)]">
                {(user?.impact_score || 1250).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={14} className="text-success-500" />
                <span className="text-xs text-success-600 dark:text-success-400 font-medium">+125 this month</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-civic-500/10 text-civic-600 dark:text-civic-400 border border-civic-500/20">
              🏆 Active Reporter
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">#4 in Ward 14</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Reports" value={myReports.length} icon={ClipboardList} color="ocean" change="+3" />
        <MetricCard label="Pending" value={pendingReports.length} icon={Bell} color="warm" />
        <MetricCard label="Resolved" value={resolvedReports.length} icon={Leaf} color="civic" />
        <MetricCard label="Impact Points" value="1,250" icon={Trophy} color="blush" change="+125" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link to={action.href}>
                <Card className="p-4 text-center group cursor-pointer h-full">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon size={20} className="text-white" />
                  </div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {action.label}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Reports</h2>
            <Link to="/citizen/reports">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {myReports.slice(0, 4).map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link to={`/citizen/reports/${report.id}`}>
                  <Card className="p-4 cursor-pointer">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-[var(--text-tertiary)]">{report.id}</span>
                          <StatusChip status={report.status} size="sm" />
                        </div>
                        <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{report.description}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          {new Date(report.created_at).toLocaleDateString()} · {report.category.replace('_', ' ')}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--text-tertiary)] flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.map(n => (
                <Card key={n.id} className="p-3.5" hover={false}>
                  <p className="text-sm text-[var(--text-primary)] mb-1">{n.text}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{n.time}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Nearby Campaigns</h3>
            {MOCK_CAMPAIGNS.filter(c => c.status === 'active').slice(0, 2).map(campaign => (
              <Card key={campaign.id} className="p-4 mb-3">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{campaign.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-2">{campaign.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {campaign.current_participants}/{campaign.max_participants} joined
                  </span>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
