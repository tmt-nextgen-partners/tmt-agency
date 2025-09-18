import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-elevation-md hover:shadow-elevation-lg",
        primary: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 transform",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-elevation-sm hover:shadow-elevation-md",
        success: "bg-gradient-success text-success-foreground hover:shadow-glow hover:scale-105 transform",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        ghost: "text-foreground hover:bg-muted",
        cta: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-elevation-lg hover:shadow-glow hover:scale-105 transform font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };