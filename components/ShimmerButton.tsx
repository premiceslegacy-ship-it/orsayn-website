'use client';

import React, { CSSProperties } from 'react';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface ShimmerButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#D4B35D",
      shimmerDuration = "3.5s",
      borderRadius = "0px",
      background = "#1A1A1A",
      className,
      children,
      href,
      ...props
    },
    ref
  ) => {

    const commonClasses = cn(
      "shimmer-button group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-paper/10",
      "transform-gpu transition-all duration-300 ease-out active:translate-y-px",
      "px-10 py-5 min-w-[240px]",
      className
    );

    const innerContent = (
      <>
        {/* Shimmer effect - optimized gradient sweep */}
        <div
          className="shimmer-effect absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              ${shimmerColor}30 20%,
              ${shimmerColor}60 50%,
              ${shimmerColor}30 80%,
              transparent 100%
            )`,
            borderRadius: borderRadius
          }}
        />

        {/* Background */}
        <div
          className="absolute inset-0 -z-20 transition-all duration-500"
          style={{
            background: background,
            borderRadius: borderRadius
          }}
        />

        {/* Hover background (brass) */}
        <div
          className="absolute inset-0 -z-20 bg-brass opacity-0 transition-all duration-500 group-hover:opacity-100"
          style={{ borderRadius: borderRadius }}
        />

        {/* Text content */}
        <span className="relative z-10 text-xs tracking-[0.25em] uppercase font-medium text-paper transition-colors duration-500 group-hover:text-ink">
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          className={commonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {innerContent}
        </a>
      );
    }

    return (
      <button
        className={commonClasses}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;