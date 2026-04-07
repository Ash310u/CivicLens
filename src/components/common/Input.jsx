import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helper,
  icon: Icon,
  className,
  containerClassName,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <div className={clsx(
        'relative flex items-center rounded-xl transition-all duration-200',
        'bg-[var(--bg-secondary)] border',
        focused ? 'border-civic-500 ring-2 ring-civic-500/20' : 'border-[var(--border-subtle)]',
        error && 'border-danger-500 ring-2 ring-danger-500/20',
      )}>
        {Icon && (
          <div className="pl-3.5 text-[var(--text-tertiary)]">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={clsx(
            'w-full bg-transparent px-3.5 py-3 text-sm text-[var(--text-primary)]',
            'placeholder:text-[var(--text-tertiary)] outline-none',
            Icon && 'pl-2',
            isPassword && 'pr-10',
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">{helper}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export function TextArea({ label, error, helper, className, containerClassName, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full bg-[var(--bg-secondary)] px-3.5 py-3 text-sm text-[var(--text-primary)]',
          'placeholder:text-[var(--text-tertiary)] outline-none rounded-xl transition-all duration-200',
          'border resize-none',
          focused ? 'border-civic-500 ring-2 ring-civic-500/20' : 'border-[var(--border-subtle)]',
          error && 'border-danger-500 ring-2 ring-danger-500/20',
          className
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">{helper}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], icon: Icon, className, containerClassName, ...props }) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            <Icon size={18} />
          </div>
        )}
        <select
          className={clsx(
            'w-full bg-[var(--bg-secondary)] px-3.5 py-3 text-sm text-[var(--text-primary)]',
            'outline-none rounded-xl border border-[var(--border-subtle)]',
            'focus:border-civic-500 focus:ring-2 focus:ring-civic-500/20 transition-all duration-200',
            'appearance-none cursor-pointer',
            Icon && 'pl-10',
            className
          )}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  );
}
