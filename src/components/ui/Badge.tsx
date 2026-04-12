'use client';

type BadgeVariant = 'default' | 'cefr' | 'combo' | 'achievement' | 'new' | 'informal' | 'formal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700',
  cefr: 'bg-teal-100 text-teal-800',
  combo: 'bg-amber-100 text-amber-800',
  achievement: 'bg-purple-100 text-purple-800',
  new: 'bg-blue-100 text-blue-800',
  informal: 'bg-orange-100 text-orange-700',
  formal: 'bg-slate-100 text-slate-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
