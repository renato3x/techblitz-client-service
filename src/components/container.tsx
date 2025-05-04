import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('w-full md:w-6xl px-3 md:px-0 mx-auto', className)} {...props}>
      {children}
    </div>
  );
}
