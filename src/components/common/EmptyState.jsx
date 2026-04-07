import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import Button from './Button';
import clsx from 'clsx';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'There\'s nothing here right now. Check back later!',
  actionLabel,
  onAction,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
