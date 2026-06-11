'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline" | "secondary" | "ghost" | "destructive";
  showArrow?: boolean;
  className?: string;
}

const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      href,
      variant = "primary",
      showArrow = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 text-sm cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none py-3 px-6";

    const variants = {
      primary:
        "bg-white text-dark hover:bg-off-white shadow-lg shadow-white/5 hover:shadow-white/15 hover:-translate-y-[1px] active:translate-y-[1px]",
      outline:
        "border border-dark-border text-white bg-transparent hover:bg-white/5 hover:border-white/20 hover:-translate-y-[1px] active:translate-y-[1px]",
      secondary:
        "bg-dark-light border border-dark-border text-white hover:bg-dark-lighter hover:-translate-y-[1px] active:translate-y-[1px]",
      ghost:
        "bg-transparent text-gray-light hover:text-white hover:bg-white/5",
      destructive:
        "bg-red/10 border border-red/20 text-red hover:bg-red/20 hover:-translate-y-[1px] active:translate-y-[1px]",
    };

    const isLink = !!href;

    const content = (
      <>
        {children}
        {showArrow && (
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300 shrink-0"
          />
        )}
      </>
    );

    const mergedClassName = cn(
      "group",
      baseStyles,
      variants[variant],
      className
    );

    if (isLink) {
      return (
        <Link href={href} className={mergedClassName} {...(props as any)}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={mergedClassName} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
