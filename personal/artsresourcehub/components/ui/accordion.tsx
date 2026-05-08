import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as AccordionPrimitive from '@rn-primitives/accordion';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-border', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  const triggerChildren = typeof children === 'function' ? null : children;
  return (
    <AccordionPrimitive.Header>
      <TextClassContext.Provider value="font-tc-medium text-sm text-foreground">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn('flex-row items-center justify-between py-4', className)}
          {...props}>
          {triggerChildren}
          {isExpanded ? <ChevronUpIcon size={16} color="#71717a" /> : <ChevronDownIcon size={16} color="#71717a" />}
        </AccordionPrimitive.Trigger>
      </TextClassContext.Provider>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className={cn('overflow-visible', className)} {...props}>
    <View className="pb-4 pt-0">{children}</View>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
