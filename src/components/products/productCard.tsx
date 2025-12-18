// src/components/products/productCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { statusColors } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { Eye, FileText, MapPin, Calendar, Package } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  category: string
  status: 'pending' | 'verified' | 'rejected'
  location: string
  date: string
  onView: (id: string) => void
  onVerify?: (id: string) => void
  className?: string
}

export function ProductCard({
  id,
  name,
  category,
  status,
  location,
  date,
  onView,
  onVerify,
  className,
}: ProductCardProps) {
  const statusConfig = {
    pending: { label: 'In Transit', variant: 'warning' as const, bg: 'bg-yellow-100', text: 'text-yellow-800' },
    verified: { label: 'Certified', variant: 'success' as const, bg: 'bg-green-100', text: 'text-green-800' },
    rejected: { label: 'Rejected', variant: 'error' as const, bg: 'bg-red-100', text: 'text-red-800' },
  }

  const statusInfo = statusConfig[status] || statusConfig.pending

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900" title={name}>
              {name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-sm font-medium", statusInfo.bg, statusInfo.text)}>
          {statusInfo.label}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-green-300 text-green-700 hover:bg-green-50"
            onClick={() => onView(id)}
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </div>
  )
}