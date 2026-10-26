import React from 'react';

interface LayerOSLogoProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export function LayerOSLogo({
  className = '',
  size = 36,
  showText = false,
  variant = 'auto',
}: LayerOSLogoProps) {
  const pixelSize = typeof size === 'number' ? size : size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Engineered Agricultural Vector Emblem */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Rounded Container */}
        <rect
          width="48"
          height="48"
          rx="14"
          fill="var(--color-forest, #194B38)"
          stroke="var(--color-sage, #87A96B)"
          strokeWidth="1.5"
        />
        {/* Tiered Layer Rings */}
        <path
          d="M14 31C14 26 19 23 24 23C29 23 34 26 34 31"
          stroke="var(--color-sage-pale, #E8EFE2)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M18 36C18 33 21 31 24 31C27 31 30 33 30 36"
          stroke="var(--color-sage, #87A96B)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Central Golden Egg Symbol */}
        <ellipse
          cx="24"
          cy="19"
          rx="6"
          ry="8"
          fill="var(--color-amber, #D5811F)"
        />
        {/* Specular Highlight */}
        <ellipse
          cx="22"
          cy="16.5"
          rx="2"
          ry="3.5"
          fill="var(--color-amber-soft, #F6E5C9)"
          transform="rotate(-15 22 16.5)"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none select-none">
          <div className="text-xl font-black tracking-tight text-[var(--color-text-main)] dark:text-white flex items-center">
            Layer<span className="text-[var(--color-amber)] ml-0.5">OS</span>
          </div>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] dark:text-[var(--color-sage)] uppercase tracking-wider mt-0.5">
            Poultry ERP
          </span>
        </div>
      )}
    </div>
  );
}
export default LayerOSLogo;
