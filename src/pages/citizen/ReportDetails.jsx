import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StatusChip from '@/components/common/StatusChip';
import { MOCK_REPORTS, WASTE_CATEGORIES } from '@/data/mockData';
import { ArrowLeft, MapPin, Clock, User, Building2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ReportDetails() {
  const { id } = useParams();
  const report = MOCK_REPORTS.find(r => r.id === id) || MOCK_REPORTS[0];
  const cat = WASTE_CATEGORIES[report.category];

  const timeline = [
    { time: report.created_at, label: 'Report Filed', desc: `${report.citizen_name} reported ${cat?.label?.toLowerCase()}`, icon: CheckCircle, color: 'text-civic-500' },
    { time: report.created_at, label: 'AI Validated', desc: `Classified as ${cat?.label} with ${report.severity} severity`, icon: CheckCircle, color: 'text-civic-500' },
    ...(report.status !== 'pending' ? [{ time: report.created_at, label: 'Assigned', desc: 'Assigned to SWM Ward 14 team', icon: User, color: 'text-ocean-500' }] : []),
    ...(report.status === 'overdue' || report.status === 'escalated' ? [{ time: report.created_at, label: 'Escalated', desc: 'Auto-escalated due to 48h timeout', icon: AlertTriangle, color: 'text-danger-500' }] : []),
    ...(report.status === 'resolved' ? [{ time: report.resolved_at, label: 'Resolved', desc: 'Cleanup completed and verified', icon: CheckCircle, color: 'text-success-500' }] : []),
  ];

  return (
    <PageWrapper>
      <Link to="/citizen/reports" className="inline-flex items-center gap-1.5 text-sm text-civic-500 hover:text-civic-600 font-medium mb-6">
        <ArrowLeft size={16} /> Back to Reports
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-mono font-bold text-civic-600 dark:text-civic-400">{report.id}</span>
                  <StatusChip status={report.status} />
                </div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{report.description}</h1>
              </div>
              <span className="text-4xl">{cat?.icon}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Category', value: cat?.label, icon: '♻️' },
                { label: 'Severity', value: report.severity, icon: '⚡' },
                { label: 'Ward', value: report.ward_id, icon: '🏛️' },
                { label: 'Department', value: cat?.department, icon: '🏢' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">{item.label}</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Map placeholder */}
          <Card className="p-4 overflow-hidden">
            <div className="h-64 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-[var(--text-tertiary)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">Location: {report.gps_lat.toFixed(4)}, {report.gps_lng.toFixed(4)}</p>
                <p className="text-xs text-[var(--text-tertiary)]">Map view available in full deployment</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="p-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <event.icon size={16} className={event.color} />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-[var(--border-subtle)] mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{event.label}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{event.desc}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">{new Date(event.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Meta */}
          <Card className="p-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">Report Info</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Filed by</span><span className="font-medium">{report.citizen_name}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Filed on</span><span className="font-medium">{new Date(report.created_at).toLocaleDateString()}</span></div>
              {report.resolved_at && <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Resolved on</span><span className="font-medium text-success-500">{new Date(report.resolved_at).toLocaleDateString()}</span></div>}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
