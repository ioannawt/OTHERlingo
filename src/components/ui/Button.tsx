'use client';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20',
  secondary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20',
  ghost: 'bg-transparent hover:bg-stone-100 text-stone-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20',
  accent: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, onClick, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        font-semibold transition-all duration-150 inline-flex items-center justify-center gap-2
        active:scale-[0.97] hover:scale-[1.02]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed !scale-100' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
