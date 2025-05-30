import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'not-reviewed' | 'viewed' | 'interviewing' | 'rejected' | 'offered' | 'hired' | 'active' | 'paused' | 'closed' | 'pending' | 'in-escrow' | 'released';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'not-reviewed':
      case 'pending':
        return {
          label: status === 'not-reviewed' ? 'Not Reviewed' : 'Pending',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        };
      case 'viewed':
      case 'active':
        return {
          label: status === 'viewed' ? 'Viewed' : 'Active',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
      case 'interviewing':
      case 'in-escrow':
        return {
          label: status === 'interviewing' ? 'Interviewing' : 'In Escrow',
          variant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
      case 'hired':
      case 'offered':
      case 'released':
        return {
          label: status === 'hired' ? 'Hired' : status === 'offered' ? 'Offered' : 'Released',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
      case 'rejected':
      case 'closed':
        return {
          label: status === 'rejected' ? 'Rejected' : 'Closed',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
      case 'paused':
        return {
          label: 'Paused',
          variant: 'outline' as const,
          className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
      default:
        return {
          label: status,
          variant: 'secondary' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}