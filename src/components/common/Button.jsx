import { forwardRef } from 'react';
import clsx from 'clsx';

// Uiverse mi-series style mapped to Tailwind classes
const buttonBase = "relative inline-flex items-center justify-center border-none p-0 bg-transparent transform origin-center cursor-pointer pb-[3px] rounded-[5px] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] focus:outline-none active:translate-y-[5px] active:pb-0";

const spanBase = "block rounded-[5px] border-2 border-solid text-center flex items-center justify-center gap-2 w-full h-full tracking-wide";

const variants = {
  primary: { btn: "bg-[#5cdb95] shadow-[0_2px_0_#494a4b]", span: "bg-[#f1f5f8] text-[#494a4b] border-[#494a4b]" },
  secondary: { btn: "bg-[#494a4b] shadow-[0_2px_0_#1a1b1d]", span: "bg-[#f1f5f8] text-[#494a4b] border-[#494a4b]" },
  outline: { btn: "bg-[#494a4b] shadow-[0_2px_0_#1a1b1d]", span: "bg-[var(--bg-primary)] text-[#494a4b] dark:text-[#f1f5f8] border-[#494a4b]" },
  ghost: { btn: "bg-transparent", span: "bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[#494a4b] hover:border-[#494a4b] hover:bg-[var(--bg-tertiary)]" },
  danger: { btn: "bg-[#e3342f] shadow-[0_2px_0_#494a4b]", span: "bg-[#fee2e2] text-[#494a4b] border-[#494a4b]" },
  teal: { btn: "bg-teal-500 shadow-[0_2px_0_#494a4b]", span: "bg-[#f1f5f8] text-[#494a4b] border-[#494a4b]" },
  warm: { btn: "bg-warm-500 shadow-[0_2px_0_#494a4b]", span: "bg-[#f1f5f8] text-[#494a4b] border-[#494a4b]" },
};

const sizes = {
  sm: "px-3 py-1.5 text-[15px]",
  md: "px-[1rem] py-[0.5rem] text-[18px]",
  lg: "px-[1.5rem] py-[0.75rem] text-[20px]",
  xl: "px-[2rem] py-[1rem] text-[24px]",
};

const Button = forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  loading, 
  disabled, 
  icon: Icon,
  iconRight: IconRight,
  ...props 
}, ref) => {
  const isGhost = variant === 'ghost';
  
  return (
    <button
      ref={ref}
      style={{ fontFamily: '"Gochi Hand", cursive' }}
      className={clsx(
        buttonBase,
        !isGhost && variants[variant].btn,
        disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:-rotate-[1deg] rotate-[2deg]',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className={clsx(
        spanBase,
        sizes[size],
        variants[variant].span
      )}>
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
        {children}
        {IconRight && <IconRight size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      </span>
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
