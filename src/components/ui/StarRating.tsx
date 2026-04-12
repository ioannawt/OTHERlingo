'use client';

import { motion } from 'framer-motion';

interface StarRatingProps {
  stars: number; // 0-5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const sizeMap = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

export function StarRating({ stars, maxStars = 5, size = 'md', animate = false, className = '' }: StarRatingProps) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < stars;
        const star = (
          <span
            key={i}
            className={`${sizeMap[size]} ${filled ? 'text-amber-400' : 'text-stone-300'}`}
          >
            {filled ? '\u2605' : '\u2606'}
          </span>
        );

        if (animate && filled) {
          return (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`${sizeMap[size]} text-amber-400`}
            >
              {'\u2605'}
            </motion.span>
          );
        }
        return star;
      })}
    </div>
  );
}
