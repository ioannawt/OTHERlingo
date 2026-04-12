'use client';

import { useState, useRef, useCallback } from 'react';

interface GreekInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  large?: boolean;
  className?: string;
}

export function GreekInput({
  value,
  onChange,
  onSubmit,
  placeholder = '',
  autoFocus = false,
  disabled = false,
  error = false,
  success = false,
  large = false,
  className = '',
}: GreekInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  }, [onSubmit]);

  const borderColor = error
    ? 'border-red-400 ring-red-100'
    : success
    ? 'border-green-400 ring-green-100'
    : focused
    ? 'border-blue-400 ring-blue-100'
    : 'border-stone-300';

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        data-greek-input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`
          w-full border-2 ${borderColor} rounded-xl bg-white transition-all duration-200
          focus:outline-none focus:ring-4
          disabled:bg-stone-50 disabled:text-stone-400
          font-[Noto_Sans,Inter,system-ui,sans-serif]
          ${large ? 'px-5 py-4 text-xl' : 'px-4 py-3 text-lg'}
          ${error ? 'animate-shake' : ''}
        `}
      />
      {!focused && !value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
          ελληνικά
        </div>
      )}
    </div>
  );
}
