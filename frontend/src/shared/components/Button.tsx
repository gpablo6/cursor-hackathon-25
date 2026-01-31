import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'minimal';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-app disabled:cursor-not-allowed ' +
    'active:translate-y-0.5 disabled:translate-y-0 disabled:shadow-none';

  const variantClasses = {
    primary:
      'bg-brand-orange text-white shadow-[0_4px_0_0_#D9641F] hover:bg-brand-orange-hover active:shadow-[0_2px_0_0_#D9641F] disabled:bg-neutral-disabled-bg disabled:text-neutral-disabled-text',
    secondary:
      'border border-neutral-border bg-surface text-primary shadow-[0_4px_0_0_#D4CBC0] hover:bg-app hover:border-neutral-disabled-text active:shadow-[0_2px_0_0_#D4CBC0] focus-visible:outline-brand-focus-ring disabled:shadow-none',
    success:
      'bg-action-green text-white shadow-[0_4px_0_0_#2d7550] hover:bg-action-green-hover active:shadow-[0_2px_0_0_#2d7550] disabled:bg-neutral-disabled-bg disabled:text-neutral-disabled-text',
    minimal:
      'bg-white border border-neutral-border text-primary shadow-[0_4px_0_0_#D4CBC0] hover:bg-neutral-disabled-bg hover:border-[#D4CBC0] active:shadow-[0_2px_0_0_#D4CBC0] disabled:bg-neutral-disabled-bg disabled:text-neutral-disabled-text',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}