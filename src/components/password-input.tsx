import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function ({ className, ...props }, ref) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={`pr-10 ${className ?? ''}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:cursor-pointer"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
