import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="w-full max-w-6xl px-4 mx-auto">
      {children}
    </div>
  );
}
