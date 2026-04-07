import clsx from 'clsx';

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-warning-500/15 text-warning-600 dark:text-warning-400', dot: 'bg-warning-500' },
  'in-progress': { label: 'In Progress', bg: 'bg-info-500/15 text-info-600 dark:text-info-400', dot: 'bg-info-500' },
  resolved: { label: 'Resolved', bg: 'bg-success-500/15 text-success-600 dark:text-success-400', dot: 'bg-success-500' },
  overdue: { label: 'Overdue', bg: 'bg-danger-500/15 text-danger-600 dark:text-danger-400', dot: 'bg-danger-500 animate-pulse' },
  escalated: { label: 'Escalated', bg: 'bg-danger-500/15 text-danger-600 dark:text-danger-400', dot: 'bg-danger-500' },
  critical: { label: 'Critical', bg: 'bg-danger-500/20 text-danger-600 dark:text-danger-400 font-semibold', dot: 'bg-danger-500 animate-pulse' },
  active: { label: 'Active', bg: 'bg-civic-500/15 text-civic-600 dark:text-civic-400', dot: 'bg-civic-500' },
  closed: { label: 'Closed', bg: 'bg-[var(--text-tertiary)]/15 text-[var(--text-tertiary)]', dot: 'bg-[var(--text-tertiary)]' },
  low: { label: 'Low', bg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400', dot: 'bg-teal-500' },
  medium: { label: 'Medium', bg: 'bg-warning-500/15 text-warning-600 dark:text-warning-400', dot: 'bg-warning-500' },
  high: { label: 'High', bg: 'bg-warm-500/15 text-warm-600 dark:text-warm-400', dot: 'bg-warm-500' },
};

export default function StatusChip({ status, label, size = 'md', className }) {
  const config = statusConfig[status] || statusConfig['pending'];
  const displayLabel = label || config.label;

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      config.bg,
      className
    )}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {displayLabel}
    </span>
  );
}
