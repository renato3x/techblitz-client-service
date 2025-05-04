import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('w-full md:w-6xl mx-auto', className)} {...props}>
      {children}
    </div>
  );
}
