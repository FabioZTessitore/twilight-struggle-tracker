import { Text as RNText } from 'react-native';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '~/lib/cn';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      display: 'text-4xl',
      heading: 'text-2xl',
      body: 'text-base',
      label: 'text-sm',
    },
    weight: {
      light: 'font-light',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    color: {
      foreground: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
    },
  },
  defaultVariants: {
    variant: 'body',
    weight: 'medium',
    color: 'foreground',
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = React.ComponentPropsWithoutRef<typeof RNText> &
  VariantProps<typeof textVariants>;

function Text({ className, variant, weight, color, ...props }: TextProps) {
  const inherited = React.useContext(TextClassContext);

  return (
    <RNText
      className={cn(textVariants({ variant, weight, color }), inherited, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
