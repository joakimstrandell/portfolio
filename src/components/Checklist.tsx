import { Check } from 'lucide-react';
import { cn } from '@josui/core-web';

interface ChecklistProps {
  items: string[];
  className?: string;
}

export function Checklist({ items, className }: ChecklistProps) {
  return (
    <ul className={cn('space-y-2 text-sm md:text-base', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex items-baseline gap-2">
          <Check className="size-3.5 shrink-0 translate-y-0.5 text-gray-400" />
          {item}
        </li>
      ))}
    </ul>
  );
}
