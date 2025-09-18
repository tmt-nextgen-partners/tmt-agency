import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn("text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground", className)}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn("text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground", className)}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className }) => (
  <h3 className={cn("text-2xl md:text-3xl font-semibold leading-tight text-foreground", className)}>
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className }) => (
  <h4 className={cn("text-xl md:text-2xl font-semibold leading-tight text-foreground", className)}>
    {children}
  </h4>
);

export const H5: React.FC<TypographyProps> = ({ children, className }) => (
  <h5 className={cn("text-lg md:text-xl font-medium leading-tight text-foreground", className)}>
    {children}
  </h5>
);

export const H6: React.FC<TypographyProps> = ({ children, className }) => (
  <h6 className={cn("text-base md:text-lg font-medium leading-tight text-foreground", className)}>
    {children}
  </h6>
);

export const BodyLarge: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn("text-lg md:text-xl leading-relaxed text-muted-foreground", className)}>
    {children}
  </p>
);

export const Body: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn("text-base md:text-lg leading-relaxed text-muted-foreground", className)}>
    {children}
  </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className }) => (
  <span className={cn("text-sm leading-normal text-muted-foreground", className)}>
    {children}
  </span>
);

export const Caption: React.FC<TypographyProps> = ({ children, className }) => (
  <span className={cn("text-xs leading-normal text-muted-foreground uppercase tracking-wide", className)}>
    {children}
  </span>
);