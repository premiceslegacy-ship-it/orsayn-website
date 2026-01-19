import React, { CSSProperties } from 'react';

// Simple utility to merge classes since we don't have clsx/tailwind-merge
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface ShimmerButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string; // Added to support link behavior
}

const ShimmerButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#D4B35D", // Default to bright Brass/Gold for Orsayn
      shimmerSize = "0.1em", // Slightly thicker for visibility
      shimmerDuration = "3s",
      borderRadius = "0px", // Force 0px for Orsayn brutalism
      background = "#1A1A1A", // Default to Ink
      className,
      children,
      href,
      ...props
    },
    ref
  ) => {
    
    const style = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
    } as CSSProperties;

    const commonClasses = cn(
      "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-paper/10 [background:var(--bg)] [border-radius:var(--radius)]",
      "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
      "px-10 py-5 min-w-[240px]", // Orsayn specific padding/sizing
      className
    );

    const innerContent = (
      <>
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "[container-type:size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        
        {/* Content - Transitions from Paper to Ink on Hover for contrast against Brass */}
        <span className="relative z-10 text-xs tracking-[0.25em] uppercase font-medium text-paper transition-colors duration-500 group-hover:text-ink">
           {children}
        </span>

        {/* Highlight - Subtle internal shadow/glow */}
        <div
          className={cn(
            "absolute inset-0 size-full",
            "px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff05]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff10]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff10]"
          )}
        />

        {/* Default Backdrop (Ink) */}
        <div
          className={cn(
            "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />

        {/* Hover Backdrop (Brass) - Fades in on hover, darkens on click */}
        <div
          className={cn(
            "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] bg-brass opacity-0 transition-all duration-500 group-hover:opacity-100 group-active:brightness-90"
          )}
        />
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          style={style}
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
        style={style}
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