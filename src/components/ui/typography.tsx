// src/components/ui/Typography.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Heading Components
// ============================================
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn('text-4xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
H1.displayName = 'H1';

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-3xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
H2.displayName = 'H2';

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
H3.displayName = 'H3';

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
        {...props}
      >
        {children}
      </h4>
    );
  }
);
H4.displayName = 'H4';

// ============================================
// Text Components
// ============================================
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'small' | 'tiny' | 'lead';
  as?: keyof JSX.IntrinsicElements;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = 'body', children, ...props }, ref) => {
    const variants = {
      lead: 'text-xl text-muted-foreground',
      body: 'text-base text-foreground',
      small: 'text-sm text-muted-foreground',
      tiny: 'text-xs text-muted-foreground',
    };

    return (
      <p
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Text.displayName = 'Text';

// ============================================
// Specialized Text Components
// ============================================
export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-foreground', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';

export const MetricLabel = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
MetricLabel.displayName = 'MetricLabel';

export const MetricValue = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & { color?: string }>(
  ({ className, color = 'gray', children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-2xl font-bold', color ? `text-${color}` : 'text-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
MetricValue.displayName = 'MetricValue';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

export const ProductTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
ProductTitle.displayName = 'ProductTitle';

export const ProductDetail = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('text-sm text-foreground', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
ProductDetail.displayName = 'ProductDetail';

export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn('text-4xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
PageTitle.displayName = 'PageTitle';

export const PageSubtitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xl text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
PageSubtitle.displayName = 'PageSubtitle';

export const SectionTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-3xl font-bold text-foreground', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
SectionTitle.displayName = 'SectionTitle';

export const BlockchainDetail = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs text-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
BlockchainDetail.displayName = 'BlockchainDetail';

export const FormLabel = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-foreground mb-1', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const InfoText = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
InfoText.displayName = 'InfoText';

export const Strong = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <strong
        ref={ref}
        className={cn('font-semibold text-foreground', className)}
        {...props}
      >
        {children}
      </strong>
    );
  }
);
Strong.displayName = 'Strong';