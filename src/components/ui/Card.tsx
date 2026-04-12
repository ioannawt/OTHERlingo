'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function Card({ children, className = '', onClick, animate = false, padding = 'md' }: CardProps) {
  const base = `bg-white rounded-2xl border border-gray-100 shadow-sm ${paddingStyles[padding]} ${
    onClick ? 'cursor-pointer hover:shadow-md hover:border-stone-300 transition-all' : ''
  } ${className}`;

  if (animate) {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  );
}
