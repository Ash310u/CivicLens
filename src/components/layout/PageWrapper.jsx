import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function PageWrapper({ children, className, noPadding = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={clsx('h-full overflow-y-auto', !noPadding && 'p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto', className)}
    >
      {children}
    </motion.div>
  );
}
