import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type AlertBadgeProps = {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  className?: string;
};

export function AlertBadge({ severity, className }: AlertBadgeProps) {
  const variants = {
    Critical: {
      className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      icon: AlertCircle,
    },
    High: {
      className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      icon: AlertCircle,
    },
    Medium: {
      className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      icon: AlertTriangle,
    },
    Low: {
      className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      icon: Info,
    },
  };

  const { className: variantClass, icon: Icon } = variants[severity];

  return (
    <Badge
      variant="outline"
      className={cn(variantClass, 'gap-1', className)}
    >
      <Icon className="h-3 w-3" />
      {severity}
    </Badge>
  );
}

type StatusBadgeProps = {
  status: 'Open' | 'Acknowledged' | 'Resolved' | 'Dismissed';
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    Open: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    Acknowledged: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    Resolved: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    Dismissed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  };

  return (
    <Badge
      variant="outline"
      className={cn(variants[status], className)}
    >
      {status}
    </Badge>
  );
}

