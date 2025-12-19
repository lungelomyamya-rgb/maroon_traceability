// src/components/dashboard/metricsCard.tsx
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statusColors } from "@/lib/colors"
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  label?: string
  colorClass?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  variant?: keyof typeof statusColors;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  description,
  label,
  icon: Icon,
  trend,
  colorClass,
  variant = 'info',
  className,
  ...props
}: MetricsCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const colors = statusColors[variant] || statusColors.info

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title || label}  {/* Use label as fallback for title */}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-full", colorClass ? `bg-${colorClass}-100 text-${colorClass}-600` : 'bg-muted')}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={cn(
            "mt-2 text-xs font-medium",
            trend.positive ? 'text-green-500' : 'text-red-500'
          )}>
            {trend.positive ? '↑' : '↓'} {trend.value}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  )
}