// src/components/ui/badge.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { statusColors } from "@/lib/colors"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof statusColors
  size?: 'sm' | 'md' | 'lg'
}

function Badge({
  className,
  variant = 'info',
  size = 'md',
  ...props
}: BadgeProps) {
  const colors = statusColors[variant] || statusColors.info
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        colors.bg,
        colors.border,
        colors.text,
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Badge }