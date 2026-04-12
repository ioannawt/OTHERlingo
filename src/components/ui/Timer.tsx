'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  totalSeconds: number;
  onComplete?: () => void;
  isPaused?: boolean;
  className?: string;
}

export function Timer({ totalSeconds, onComplete, isPaused = false, className = '' }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remaining, onComplete]);

  const progress = remaining / totalSeconds;
  const isLow = remaining <= 10;
  const circumference = 2 * Math.PI * 18;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#e7e5e4" strokeWidth="3" />
        <circle
          cx="20" cy="20" r="18" fill="none"
          stroke={isLow ? '#dc2626' : '#3b82f6'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className={`absolute text-sm font-bold ${isLow ? 'text-red-600' : 'text-stone-700'}`}>
        {formatTime(remaining)}
      </span>
    </div>
  );
}

// Simple countdown text timer
export function CountdownTimer({ totalSeconds, onComplete, isPaused }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (isPaused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remaining, handleComplete]);

  const isLow = remaining <= 10;

  return (
    <span className={`font-mono font-bold text-lg ${isLow ? 'text-red-600' : 'text-stone-700'}`}>
      {formatTime(remaining)}
    </span>
  );
}
