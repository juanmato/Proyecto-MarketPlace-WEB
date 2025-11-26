import { ReactNode } from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';
import { EmptyState } from '../design-system/EmptyState';
import { Button } from '../design-system/Button';

interface EmptyStateWrapperProps {
  show: boolean;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}

export function EmptyStateWrapper({
  show,
  icon = AlertCircle,
  title,
  description,
  actionLabel,
  onAction,
  children
}: EmptyStateWrapperProps) {
  if (!show) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          actionLabel && onAction ? (
            <Button onClick={onAction}>{actionLabel}</Button>
          ) : undefined
        }
      />
    </div>
  );
}
