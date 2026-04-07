import { motion } from 'framer-motion';
import clsx from 'clsx';

const cardVariants = {
  default: 'glass-card',
  metric: 'glass-card p-6',
  feature: 'glass-card p-6 text-center',
  report: 'glass-card p-5',
  flat: 'bg-[var(--bg-secondary)] rounded-[var(--radius-card)] border border-[var(--border-subtle)]',
};

export default function Card({ 
  variant = 'default', 
  children, 
  className, 
  hover = true,
  onClick,
  padding = true,
  ...props 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={clsx(
        cardVariants[variant],
        padding && variant === 'default' && 'p-5',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MetricCard({ label, value, change, changeType = 'positive', icon: Icon, color = 'civic', className }) {
  const colors = {
    civic: 'from-civic-500/20 to-civic-600/5 text-civic-600 dark:text-civic-400',
    ocean: 'from-ocean-500/20 to-ocean-600/5 text-ocean-600 dark:text-ocean-400',
    warm: 'from-warm-500/20 to-warm-600/5 text-warm-600 dark:text-warm-400',
    danger: 'from-danger-500/20 to-danger-600/5 text-danger-600 dark:text-danger-400',
    teal: 'from-teal-500/20 to-teal-600/5 text-teal-600 dark:text-teal-400',
    blush: 'from-blush-500/20 to-blush-600/5 text-blush-600 dark:text-blush-400',
  };

  return (
    <Card variant="metric" className={className}>
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('p-2.5 rounded-xl bg-gradient-to-br', colors[color])}>
          {Icon && <Icon size={20} />}
        </div>
        {change !== undefined && (
          <span className={clsx(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            changeType === 'positive' ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400'
          )}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</p>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </Card>
  );
}
