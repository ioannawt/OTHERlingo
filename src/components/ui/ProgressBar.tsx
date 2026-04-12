'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 1
  variant?: 'default' | 'xp' | 'health' | 'cefr';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantGradients = {
  default: 'from-blue-500 to-blue-600',
  xp: 'from-amber-400 to-amber-500',
  health: 'from-green-400 to-green-500',
  cefr: 'from-teal-400 to-teal-600',
};

const sizeHeights = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export function ProgressBar({
  progress,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-medium text-stone-600">{label}</span>}
          {showLabel && <span className="text-xs font-bold text-stone-700">{Math.round(clampedProgress * 100)}%</span>}
        </div>
      )}
      <div className={`w-full bg-stone-200 rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${variantGradients[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
