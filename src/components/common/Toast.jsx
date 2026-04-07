import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-success-500/30 bg-success-50/90 dark:bg-success-500/10 text-success-600 dark:text-success-400',
  error: 'border-danger-500/30 bg-danger-50/90 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400',
  warning: 'border-warning-500/30 bg-warning-50/90 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400',
  info: 'border-info-500/30 bg-info-50/90 dark:bg-info-500/10 text-info-600 dark:text-info-400',
};

function Toast({ id, type = 'info', message, title, duration = 4000, onDismiss }) {
  const [progress, setProgress] = useState(100);
  const Icon = icons[type];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={clsx(
        'relative w-80 rounded-xl border backdrop-blur-sm shadow-lg overflow-hidden',
        styles[type]
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button onClick={() => onDismiss(id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
      <div className="h-0.5 bg-current/10">
        <motion.div
          className="h-full bg-current/30"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (message, title) => addToast({ type: 'success', message, title }),
    error: (message, title) => addToast({ type: 'error', message, title }),
    warning: (message, title) => addToast({ type: 'warning', message, title }),
    info: (message, title) => addToast({ type: 'info', message, title }),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence mode="sync">
          {toasts.map(t => (
            <Toast key={t.id} {...t} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
