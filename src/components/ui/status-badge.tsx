import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Certified' | 'In Transit' | 'Delivered';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles = {
    Certified: 'bg-success/10 text-success border-success/20',
    'In Transit': 'bg-warning/10 text-warning border-warning/20',
    Delivered: 'bg-primary/10 text-primary border-primary/20',
  };

  const statusIcons = {
    Certified: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    'In Transit': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    Delivered: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      {statusIcons[status]}
      {status}
    </div>
  );
}
