import { cn } from '@/lib/utils';
import * as SwitchPrimitive from '@rn-primitives/switch';
import * as React from 'react';

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

type AppSwitchProps = SwitchProps & {
  size?: 'default' | 'sm';
};

function Switch({ className, checked, size = 'default', ...props }: AppSwitchProps) {
  const isSmall = size === 'sm';
  return (
    <SwitchPrimitive.Root
      className={cn(
        'rounded-full border-2 border-transparent',
        isSmall ? 'h-5 w-9' : 'h-6 w-11',
        checked ? 'bg-primary' : 'bg-input',
        className
      )}
      checked={checked}
      {...props}>
      <SwitchPrimitive.Thumb
        className={cn(
          'rounded-full bg-background shadow-sm',
          isSmall ? 'h-4 w-4' : 'h-5 w-5',
          checked ? (isSmall ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
